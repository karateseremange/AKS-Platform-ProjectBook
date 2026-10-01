"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const api = require("./check-logread-webapp.cjs");
const b0 = require("./prepare-d4b.cjs");
const c1 = require("./check-d4c.cjs");
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const put = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
const file = (name, value) => ({name, bytes: Buffer.from(value)});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aks-webapp-readonly-test-"));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const packageDir = path.join(root, "package-test");
  const previousDir = path.join(root, "previous-test");
  const clasp = path.join(root, "clasp"), version8Session = path.join(root, "version8-test");
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
  const lists = b0.validateLists(Array.from({length: 8}, (_, index) => ({versionNumber: index + 1})), [
    {deploymentId: "historic-OMcZ9gl", versionNumber: 8, description: "Web App"},
    {deploymentId: "other-deployment", versionNumber: 1, description: "Other"}
  ]);
  const postV4Lists = b0.validateLists([...lists.versions,
    {versionNumber: 9, description: "ADMIN-006 D4-C LOG_READ temporary browser candidate 1645734f3b81"}],
  lists.deployments);
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
    historicalArchive: historicalBundle, historicalLists: hash(JSON.stringify(lists)),
    historicalManifest: hash(oldManifest.bytes),
    version8Session: "version8-test", version8GeneratedAt: "fixture-v5-time",
    version8Source: b0.sourceDigest(candidate), version8Manifest: hash(newManifest.bytes),
    v4RestoredResult: "fixture-v4-result", readSession: "read-test",
    technicalSession: "technical-test", priorSession: "prior-test", v2Session: "v2-test",
    v3Session: "v3-test", v4Session: "v4-test"};
  pin.backendSource = b0.sourceDigest(historical); pin.backendManifest = hash(oldManifest.bytes);
  pin.backendLists = hash(JSON.stringify(lists)); pin.backendFiles = historical.length;
  const report = {...api.expectedReport(pin), campaign: packageDir, previousPackageCampaign: previousDir};
  put(path.join(packageDir, "report.json"), report);
  fs.writeFileSync(path.join(clasp, "bin.cjs"), "");
  put(path.join(clasp, "package.json"), {name: "@google/clasp", version: "3.3.0", bin: "bin.cjs"});
  const evidenceDirs = Object.fromEntries([pin.readSession, pin.technicalSession, pin.priorSession,
    pin.v2Session, pin.v3Session, pin.v4Session].map(name => [name, path.join(root, name)]));
  for (const dir of Object.values(evidenceDirs)) fs.mkdirSync(dir);
  fs.mkdirSync(version8Session);
  const headDir = path.join(version8Session, "head-fixture");
  const immutableDir = path.join(version8Session, "version8-fixture");
  for (const [dir, source] of [[headDir, historical], [immutableDir, candidate]]) {
    fs.mkdirSync(dir); b0.materialize(path.join(dir, "src"), source);
    put(path.join(dir, ".clasp.json"), {scriptId: b0.TARGET, rootDir: "src",
      scriptExtensions: [".gs", ".js"], htmlExtensions: [".html"], jsonExtensions: [".json"],
      skipSubdirectories: false});
    put(path.join(dir, "inventory.json"), b0.inventory(source));
    put(path.join(dir, "lists.json"), postV4Lists);
  }
  put(path.join(version8Session, "session.json"), {binding: {revision: "LOGREAD-version8-readonly-r1",
    candidate: pin.previousCandidate, packageSha256: pin.previousPackage, packageRun: previousDir,
    readSession: evidenceDirs[pin.readSession], technicalSession: evidenceDirs[pin.technicalSession],
    priorSession: evidenceDirs[pin.priorSession], v2Session: evidenceDirs[pin.v2Session],
    v3Session: evidenceDirs[pin.v3Session], v4Session: evidenceDirs[pin.v4Session],
    v4RestoredResultSha256: pin.v4RestoredResult, baselineListsSha256: hash(JSON.stringify(lists)),
    versionNumber: 8}, createdAt: "fixture"});
  put(path.join(version8Session, "report.json"), {revision: "LOGREAD-version8-readonly-r1",
    candidate: pin.previousCandidate, packageSha256: pin.previousPackage, target: b0.TARGET,
    v4Session: evidenceDirs[pin.v4Session], v4RestoredResultSha256: pin.v4RestoredResult,
    versionNumber: 8, googleReadAttempted: true, googleWriteAttempted: false,
    readOnlyAuthorized: true, status: "VERSION8_MANIFEST_COLLECTED_REVIEW_REQUIRED",
    session: version8Session, headFiles: 2, headSourceSha256: pin.historicalSource,
    version8Files: 2, version8SourceSha256: pin.version8Source, sourcesExact: false,
    headManifestSha256: hash(oldManifest.bytes), version8ManifestSha256: pin.version8Manifest,
    manifestsExact: false, headWebapp: {present: false, access: null, executeAs: null},
    version8Webapp: {present: true, access: "ANYONE", executeAs: "USER_ACCESSING"},
    inventoriesUnchanged: true, generatedAt: pin.version8GeneratedAt});
  const options = {mode: "LocalCheck", "package-run": packageDir, "version8-session": version8Session,
    "clasp-package": clasp, output: path.join(root, "output")};
  const load = () => api.loadLocal(packageDir, pin);
  return {root, packageDir, previousDir, clasp, candidate, historical, lists, postV4Lists,
    version8Session, headDir, immutableDir, pin, report, options, load,
    loadV5: () => api.loadVersion8Session(version8Session, load(), pin)};
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
test("V5 post-V4 evidence proves version 9 retained and Web App restored to version 8", t => {
  const f = fixture(t), baseline = f.loadV5();
  assert.equal(baseline.lists.versions.length, 9);
  assert.equal(baseline.lists.deployments.length, 2);
});
test("obsolete C1 inventory cannot replace the post-V4 V5 baseline", t => {
  const f = fixture(t);
  put(path.join(f.headDir, "lists.json"), f.lists);
  assert.throws(f.loadV5, /VERSION8_POST_V4_INVENTORY_MISMATCH/);
});
test("tampering with V5 report, sources or immutable manifest is refused", t => {
  const f = fixture(t);
  const reportFile = path.join(f.version8Session, "report.json"), report = JSON.parse(fs.readFileSync(reportFile));
  put(reportFile, {...report, version8SourceSha256: "tampered"});
  assert.throws(f.loadV5, /VERSION8_REPORT_MISMATCH/);
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
  const result = api.main(f.options, {loadLocal: f.load, loadVersion8Session: f.loadV5,
    makeTransport: () => { called = true; throw new Error("unexpected"); }});
  assert.equal(called, false); assert.equal(fs.existsSync(f.options.output), false);
  assert.equal(result.status, "LOGREAD_WEBAPP_READONLY_LOCAL_CHECK_ONLY");
  assert.equal(result.googleReadAttempted, false); assert.equal(result.googleWriteAttempted, false);
  assert.equal(result.readOnlyAuthorized, false); assert.equal(result.executionAuthorized, false);
});
test("unreviewed clasp version is refused without a subprocess", t => {
  const f = fixture(t); put(path.join(f.clasp, "package.json"),
    {name: "@google/clasp", version: "9.0.0", bin: "bin.cjs"});
  assert.throws(() => api.main(f.options, {loadLocal: f.load, loadVersion8Session: f.loadV5}));
});
test("protocol contains reads only and denies every mutation class", () => {
  const protocol = api.protocol();
  assert.deepEqual(protocol.readOnlyCommands, ["list-versions", "list-deployments", "pull"]);
  assert.deepEqual(protocol.googleWriteCommands, []);
  for (const key of ["pushAuthorized", "versionAuthorized", "deploymentAuthorized",
    "propertiesAuthorized", "accessAuditAuthorized", "browserAuthorized", "mergeAuthorized",
    "d5Authorized"]) assert.equal(protocol[key], false, key);
});
function simulated(f, mutate = () => {}) {
  const calls = [];
  return {calls, snapshot(role, ordinal) {
    calls.push([role, ordinal]);
    const portal = role === "portal";
    const row = {files: f.historical.map(item => ({...item, bytes: Buffer.from(item.bytes)})),
      lists: structuredClone(portal ? f.postV4Lists : f.lists),
      summary: {role, target: c1.TARGETS.find(target => target.role === role).scriptId, ordinal}};
    mutate(row); return row;
  }};
}
test("collection uses the exact V5 post-V4 portal inventory and reads both targets twice", t => {
  const f = fixture(t), io = simulated(f), records = [];
  const result = api.collect(f.load(), f.loadV5(), io, row => records.push(row), f.pin);
  assert.deepEqual(io.calls, [["portal", 1], ["backend", 1], ["portal", 2], ["backend", 2]]);
  assert.equal(records.length, 4); assert.equal(result.retainedVersion9Exact, true);
  assert.equal(result.webAppDeploymentRestoredToVersion8, true);
});
test("portal inventory rollback to obsolete C1 baseline is refused", t => {
  const f = fixture(t), io = simulated(f, row => {
    if (row.summary.role === "portal") row.lists = structuredClone(f.lists);
  });
  assert.throws(() => api.collect(f.load(), f.loadV5(), io, () => {}, f.pin),
    /REMOTE_PORTAL_INVENTORY_CHANGED_SINCE_V5/);
});
test("backend inventory drift remains refused against its C1 reference", t => {
  const f = fixture(t), io = simulated(f, row => {
    if (row.summary.role === "backend") row.lists.versions.push({versionNumber: 99});
  });
  assert.throws(() => api.collect(f.load(), f.loadV5(), io, () => {}, f.pin),
    /REMOTE_BACKEND_INVENTORY_CHANGED_SINCE_C1/);
});
test("authorized ReadOnly produces a protected report while retaining no write authority", t => {
  const f = fixture(t);
  const collected = {remoteSourceAndInventoriesRevalidated: true, independentReadsExact: true,
    inventoriesUnchanged: true, portalHistoricalRestorationExact: true, backendMatchesHistoricalC1: true,
    retainedVersion9Exact: true, webAppDeploymentRestoredToVersion8: true};
  const result = api.main({...f.options, mode: "ReadOnly", authorization: api.AUTHORIZATION},
    {loadLocal: f.load, loadVersion8Session: f.loadV5, makeTransport: () => ({fixture: true}),
      collect: (_local, _baseline, _io, record) => {
      record({role: "portal", ordinal: 1}); return collected;
    }});
  assert.equal(result.status, "LOGREAD_WEBAPP_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED");
  assert.equal(result.googleReadAttempted, true); assert.equal(result.googleWriteAttempted, false);
  assert.equal(result.executionAuthorized, false); assert.equal(result.reads.length, 1);
});
test("ReadOnly transport failure is redacted and preserves the local report", t => {
  const f = fixture(t);
  const result = api.main({...f.options, mode: "ReadOnly", authorization: api.AUTHORIZATION},
    {loadLocal: f.load, loadVersion8Session: f.loadV5,
      makeTransport: () => { throw new Error("secret-token-and-url"); }});
  assert.equal(result.status, "STOPPED"); assert.equal(result.failure, "LOGREAD_WEBAPP_READONLY_STOPPED");
  assert.equal(result.googleWriteAttempted, false);
  assert.ok(fs.existsSync(path.join(result.session, "report.json")));
});
test("arbitrary failures never expose their message", () => {
  assert.equal(api.safeError(new Error("private-url")), "LOGREAD_WEBAPP_READONLY_STOPPED");
});
