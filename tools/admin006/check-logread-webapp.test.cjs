"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const api = require("./check-logread-webapp.cjs");
const b0 = require("./prepare-d4b.cjs");
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const put = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
const file = (name, value) => ({name, bytes: Buffer.from(value)});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aks-webapp-readonly-test-"));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const packageDir = path.join(root, "package-test");
  const previousDir = path.join(root, "previous-test");
  const clasp = path.join(root, "clasp");
  fs.mkdirSync(packageDir); fs.mkdirSync(previousDir); fs.mkdirSync(clasp);
  const oldManifest = file("appsscript.json", JSON.stringify({timeZone: "Europe/Paris", dependencies: {},
    exceptionLogging: "STACKDRIVER", runtimeVersion: "V8"}));
  const newManifest = file("appsscript.json", JSON.stringify({timeZone: "Europe/Paris", dependencies: {},
    exceptionLogging: "STACKDRIVER", runtimeVersion: "V8",
    webapp: {access: "ANYONE", executeAs: "USER_ACCESSING"}}));
  const historical = [oldManifest, file("main.gs", "old")];
  const candidate = [newManifest, file("main.gs", "old")];
  b0.materialize(path.join(packageDir, "candidate", "src"), candidate);
  b0.materialize(path.join(packageDir, "historical-rollback", "src"), historical);
  const archive = b0.archive(path.join(packageDir, "candidate-bundle.json"), candidate);
  const historicalBundle = b0.archive(path.join(packageDir, "historical-c1-bundle.json"), historical);
  const lists = b0.validateLists([{versionNumber: 8}], [{deploymentId: "fixture", versionNumber: 8}]);
  const inventory = b0.inventory(candidate), historicalInventory = b0.inventory(historical);
  const diff = b0.compare(historicalInventory, inventory);
  for (const [name, value] of Object.entries({"historical-lists.json": lists,
    "candidate-inventory.json": inventory, "historical-inventory.json": historicalInventory,
    "diff.json": diff, "restoration-residuals.json": diff.filter(x => x.change === "ADD"),
    "delta-previous-package.json": [{name: "appsscript", change: "MODIFY"}],
    "test-restoration-plan.json": {fixture: true}})) put(path.join(packageDir, name), value);
  const pin = {...api.PIN, campaign: "package-test", source: b0.sourceDigest(candidate), sourceFiles: 2,
    archive, manifest: hash(newManifest.bytes), plan: hash(fs.readFileSync(path.join(packageDir,
      "test-restoration-plan.json"))), generatedAt: "fixture-time", previousCampaign: "previous-test",
    historicalSource: b0.sourceDigest(historical), historicalFiles: 2,
    historicalArchive: historicalBundle, historicalLists: hash(JSON.stringify(lists))};
  const report = {...api.expectedReport(pin), campaign: packageDir, previousPackageCampaign: previousDir};
  put(path.join(packageDir, "report.json"), report);
  fs.writeFileSync(path.join(clasp, "bin.cjs"), "");
  put(path.join(clasp, "package.json"), {name: "@google/clasp", version: "3.3.0", bin: "bin.cjs"});
  const options = {mode: "LocalCheck", "package-run": packageDir,
    "clasp-package": clasp, output: path.join(root, "output")};
  return {root, packageDir, previousDir, clasp, candidate, historical, pin, report, options,
    load: () => api.loadLocal(packageDir, pin)};
}
test("CLI exposes only LocalCheck and separately authorized ReadOnly", t => {
  const f = fixture(t);
  const args = Object.entries(f.options).flatMap(([key, value]) => ["--" + key, value]);
  assert.equal(api.parseArgs(args).mode, "LocalCheck");
  for (const mode of ["Execute", "Push", "Restore", "Deploy"])
    assert.throws(() => api.validateOptions({...f.options, mode}));
  assert.throws(() => api.parseArgs([...args, "--target", "other"]));
});
test("ReadOnly authorization is exact and checked before evidence access", t => {
  const f = fixture(t); let touched = false;
  for (const authorization of [undefined, "yes", "LOGREAD-WEBAPP-READONLY-wrong"])
    assert.throws(() => api.main({...f.options, mode: "ReadOnly", authorization},
      {loadLocal: () => { touched = true; }}));
  assert.equal(touched, false); assert.equal(fs.existsSync(f.options.output), false);
});
test("package report, candidate, manifest, rollback and lists are linked", t => {
  const f = fixture(t), loaded = f.load();
  assert.equal(loaded.candidate.length, 2); assert.equal(loaded.historical.length, 2);
});
test("every pinned report field is mandatory", t => {
  const f = fixture(t);
  for (const key of Object.keys(api.expectedReport(f.pin))) {
    put(path.join(f.packageDir, "report.json"), {...f.report, [key]: "tampered"});
    assert.throws(f.load, /PACKAGE_REPORT_MISMATCH/);
  }
});
test("wrong campaign or previous package binding is refused", t => {
  const f = fixture(t);
  assert.throws(() => api.loadLocal(f.packageDir, {...f.pin, campaign: "wrong"}));
  put(path.join(f.packageDir, "report.json"), {...f.report, previousPackageCampaign: f.root});
  assert.throws(f.load, /PACKAGE_REPORT_MISMATCH/);
});
for (const name of ["candidate-bundle.json", "historical-c1-bundle.json", "historical-lists.json",
  "candidate-inventory.json", "historical-inventory.json", "diff.json", "restoration-residuals.json",
  "delta-previous-package.json", "test-restoration-plan.json"]) {
  test("tampering is refused: " + name, t => {
    const f = fixture(t); put(path.join(f.packageDir, name), {tampered: true}); assert.throws(f.load);
  });
}
test("materialized candidate and rollback drift are refused", t => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.packageDir, "candidate", "src", "main.gs"), "drift");
  assert.throws(f.load, /PACKAGE_INVENTORY_MISMATCH/);
});
test("manifest without the exact Web App entry point is refused", t => {
  const f = fixture(t);
  const changed = JSON.parse(f.candidate[0].bytes); changed.webapp.access = "ANYONE_ANONYMOUS";
  fs.writeFileSync(path.join(f.packageDir, "candidate", "src", "appsscript.json"), JSON.stringify(changed));
  assert.throws(f.load);
});
test("LocalCheck launches no transport and creates no output", t => {
  const f = fixture(t); let called = false;
  const result = api.main(f.options, {loadLocal: f.load,
    makeTransport: () => { called = true; throw new Error("unexpected"); }});
  assert.equal(called, false); assert.equal(fs.existsSync(f.options.output), false);
  assert.equal(result.status, "LOGREAD_WEBAPP_READONLY_LOCAL_CHECK_ONLY");
  assert.equal(result.googleReadAttempted, false); assert.equal(result.googleWriteAttempted, false);
  assert.equal(result.readOnlyAuthorized, false); assert.equal(result.executionAuthorized, false);
});
test("unreviewed clasp version is refused without a subprocess", t => {
  const f = fixture(t); put(path.join(f.clasp, "package.json"),
    {name: "@google/clasp", version: "9.0.0", bin: "bin.cjs"});
  assert.throws(() => api.main(f.options, {loadLocal: f.load}));
});
test("protocol contains reads only and denies every mutation class", () => {
  const protocol = api.protocol();
  assert.deepEqual(protocol.readOnlyCommands, ["list-versions", "list-deployments", "pull"]);
  assert.deepEqual(protocol.googleWriteCommands, []);
  for (const key of ["pushAuthorized", "versionAuthorized", "deploymentAuthorized",
    "propertiesAuthorized", "accessAuditAuthorized", "browserAuthorized", "mergeAuthorized",
    "d5Authorized"]) assert.equal(protocol[key], false, key);
});
test("authorized ReadOnly produces a protected report while retaining no write authority", t => {
  const f = fixture(t);
  const collected = {remoteSourceAndInventoriesRevalidated: true, independentReadsExact: true,
    inventoriesUnchanged: true, portalHistoricalRestorationExact: true, backendMatchesHistoricalC1: true};
  const result = api.main({...f.options, mode: "ReadOnly", authorization: api.AUTHORIZATION},
    {loadLocal: f.load, makeTransport: () => ({fixture: true}), collect: (_local, _io, record) => {
      record({role: "portal", ordinal: 1}); return collected;
    }});
  assert.equal(result.status, "LOGREAD_WEBAPP_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED");
  assert.equal(result.googleReadAttempted, true); assert.equal(result.googleWriteAttempted, false);
  assert.equal(result.executionAuthorized, false); assert.equal(result.reads.length, 1);
});
test("ReadOnly transport failure is redacted and preserves the local report", t => {
  const f = fixture(t);
  const result = api.main({...f.options, mode: "ReadOnly", authorization: api.AUTHORIZATION},
    {loadLocal: f.load, makeTransport: () => { throw new Error("secret-token-and-url"); }});
  assert.equal(result.status, "STOPPED"); assert.equal(result.failure, "LOGREAD_WEBAPP_READONLY_STOPPED");
  assert.equal(result.googleWriteAttempted, false);
  assert.ok(fs.existsSync(path.join(result.session, "report.json")));
});
test("arbitrary failures never expose their message", () => {
  assert.equal(api.safeError(new Error("private-url")), "LOGREAD_WEBAPP_READONLY_STOPPED");
});
