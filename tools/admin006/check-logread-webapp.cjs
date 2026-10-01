#!/usr/bin/env node
"use strict";
// LocalCheck performs no subprocess or Google operation. ReadOnly requires a separate exact authorization.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const check = (ok, code) => { if (!ok) throw new Error(code); };
for (const [name, digest] of Object.entries({
  "prepare-logread-webapp.cjs": "0ccd83a53d2e6eaa3b333f7efd0aa393a949b747e84872c32f850d42ae96255d",
  "check-logread.cjs": "dd125729bc6b896edd9d9d548dfee9de7eab9b830bed838c6b3d75118c204c5d"
})) check(hash(fs.readFileSync(path.join(__dirname, name))) === digest, "HELPER_INTEGRITY_MISMATCH");
const web = require("./prepare-logread-webapp.cjs");
const previous = require("./check-logread.cjs");
const c1 = require("./check-d4c.cjs");
const b0 = require("./prepare-d4b.cjs");
const b1 = require("./validate-d4b.cjs");
const v4 = require("./validate-logread-browser-v4.cjs");
const PIN = Object.freeze({
  campaign: "logread-webapp-package-arjzvs",
  candidate: "6a7d86300d90c3f9a629e89a113dc7b0dd7e5f73",
  previousCandidate: "1645734f3b81219bfd80569da21edc5d054ff223",
  source: "3931cc5b455b40fa7eb3dd76f8c7cb41d5acae3b5ad7674b5a67be7f286a465f",
  sourceFiles: 279,
  archive: "19f0755b6a33aeff303f7c0c01e15e0ff1e7f467752e5a046e7288cb1d4a5594",
  manifest: "40ebf6b32fb6cba6f0b44ada9ce85fd023fee18f0599833b08e18f26336b0b38",
  plan: "66dff06ae70c2f3a830f0490132d8356557d25f18af5fdd5ba20bf09b6a81209",
  generatedAt: "2026-09-08T16:54:13.172Z",
  previousCampaign: "logread-package-gF5KXy",
  previousPackage: "cd635f54e1c8c6cc5d7a43053a4a1bd37c866d728abb3a89dd04c0e91620689b",
  previousReport: "6d0d8d403f4a82fd46c1ba5964b64b35099dce92a16ef30c945b92669b198787",
  historicalSource: "4ae80c6792c16f7efa006926ffafd4c202e3cb983b05b81ce63ea846c20110f3",
  historicalFiles: 261,
  historicalManifest: "f9a8681074723b58dca5d4e55a3c35e76165aa1675909f498d5e2c0e907f9ddf",
  historicalArchive: "c07efd3d245f6d4ba1009104c7f5fc1ea822c135eefa6658b188166b8daf6901",
  historicalLists: "e008b6eebe885702135fc986e74e5ada01bcc6ccd317d5e336a768c7bf1f78e0",
  version8Session: "logread-version8-6Y0HL6",
  version8GeneratedAt: "2026-09-07T17:55:13.442Z",
  version8Source: "906c3e5f7eb22dad0717ea3fd30db02b6102efd69f3f948c5c6377f37a81a749",
  version8Manifest: "d74f9a01741a757cfd722c8ddc7f6cc40bc90905fd2094dd382327aae763027c",
  v4RestoredResult: "133fb57e8d812fe8ee5c9f9602d4b4d8be2fd2bece740678067100a72d6f8933",
  readSession: "logread-readonly-WW5Uwa", technicalSession: "logread-executor-WunNuE",
  priorSession: "logread-browser-WAcbCg", v2Session: "logread-browser-v2-aMpxLr",
  v3Session: "logread-browser-v3-ljp2HB", v4Session: "logread-browser-v4-mjwLOI",
  backendSource: previous.PIN.backendSource, backendManifest: previous.PIN.backendManifest,
  backendLists: previous.PIN.backendLists, backendFiles: previous.PIN.backendFiles
});
const AUTHORIZATION = "LOGREAD-WEBAPP-READONLY-" + PIN.source;
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function bytes(file) { check(fs.lstatSync(file).isFile(), "REGULAR_FILE_REQUIRED"); return fs.readFileSync(file); }
const json = file => JSON.parse(bytes(file).toString("utf8").replace(/^\uFEFF/, ""));
function directory(value) { check(fs.lstatSync(value).isDirectory(), "DIRECTORY_REQUIRED"); return fs.realpathSync(value); }
function writeNew(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", {flag: "wx", mode: 0o600});
}
function expectedReport(pin = PIN) {
  return {
    revision: "LOGREAD-webapp-package-r1",
    status: "LOCAL_WEBAPP_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED",
    target: b0.TARGET,
    candidate: pin.candidate,
    previousCandidate: pin.previousCandidate,
    sourceSha256: pin.source,
    sourceFiles: pin.sourceFiles,
    packageFiles: pin.sourceFiles,
    packageSha256: pin.source,
    packageArchiveSha256: pin.archive,
    manifestSha256: pin.manifest,
    manifestWebapp: {access: "ANYONE", executeAs: "USER_ACCESSING"},
    manifestMatchesVersion8Semantics: true,
    manifestByteEqualityWithVersion8Claimed: false,
    nonWebappExactWithPreviousPackage: true,
    previousPackageSha256: pin.previousPackage,
    previousPackageReportSha256: pin.previousReport,
    historicalBackupFiles: pin.historicalFiles,
    historicalBackupSha256: pin.historicalSource,
    googleReadAttempted: false,
    googleWriteAttempted: false,
    executionAuthorized: false,
    changedFromPreviousPackage: [{name: "appsscript", change: "MODIFY"}],
    planSha256: pin.plan,
    generatedAt: pin.generatedAt
  };
}
function loadLocal(packagePath, pin = PIN) {
  const packageDir = directory(packagePath);
  check(path.basename(packageDir) === pin.campaign, "WRONG_PACKAGE_CAMPAIGN");
  const reportFile = path.join(packageDir, "report.json");
  const report = json(reportFile);
  check(Object.entries(expectedReport(pin)).every(([key, value]) => equal(report[key], value)) &&
    directory(report.campaign) === packageDir &&
    path.basename(directory(report.previousPackageCampaign)) === pin.previousCampaign,
    "PACKAGE_REPORT_MISMATCH");
  const candidate = b1.archiveFiles(path.join(packageDir, "candidate-bundle.json"), pin.archive);
  check(candidate.length === pin.sourceFiles && b0.sourceDigest(candidate) === pin.source,
    "PACKAGE_CONTENT_MISMATCH");
  web.manifest(candidate, {...web.PIN, manifest: pin.manifest});
  const materialized = b0.scan(directory(path.join(packageDir, "candidate", "src")));
  const historical = b0.scan(directory(path.join(packageDir, "historical-rollback", "src")));
  check(equal(b0.inventory(materialized), b0.inventory(candidate)) &&
    b0.sourceDigest(materialized) === pin.source, "PACKAGE_INVENTORY_MISMATCH");
  check(historical.length === pin.historicalFiles && b0.sourceDigest(historical) === pin.historicalSource,
    "HISTORICAL_ROLLBACK_MISMATCH");
  check(hash(bytes(path.join(packageDir, "historical-c1-bundle.json"))) === pin.historicalArchive,
    "HISTORICAL_ARCHIVE_MISMATCH");
  const lists = json(path.join(packageDir, "historical-lists.json"));
  b0.validateLists(lists.versions, lists.deployments);
  check(hash(JSON.stringify(lists)) === pin.historicalLists, "HISTORICAL_LISTS_MISMATCH");
  const candidateInventory = json(path.join(packageDir, "candidate-inventory.json"));
  const historicalInventory = json(path.join(packageDir, "historical-inventory.json"));
  const diff = b0.compare(b0.inventory(historical), b0.inventory(candidate));
  const delta = json(path.join(packageDir, "delta-previous-package.json"));
  check(equal(candidateInventory, b0.inventory(candidate)) &&
    equal(historicalInventory, b0.inventory(historical)) &&
    equal(json(path.join(packageDir, "diff.json")), diff) &&
    equal(json(path.join(packageDir, "restoration-residuals.json")), diff.filter(x => x.change === "ADD")) &&
    equal(delta, [{name: "appsscript", change: "MODIFY"}]), "PACKAGE_METADATA_MISMATCH");
  check(hash(bytes(path.join(packageDir, "test-restoration-plan.json"))) === pin.plan,
    "PACKAGE_PLAN_MISMATCH");
  check(!fs.existsSync(path.join(packageDir, ".clasp.json")) &&
    !fs.existsSync(path.join(packageDir, "candidate", ".clasp.json")), "CLASP_CONFIGURATION_REFUSED");
  return {packageDir, reportSha256: hash(bytes(reportFile)), candidate, historical, lists};
}
function workspace(session, prefix) {
  const rows = fs.readdirSync(session, {withFileTypes: true})
    .filter(row => row.isDirectory() && row.name.startsWith(prefix + "-"));
  check(rows.length === 1, "VERSION8_WORKSPACE_AMBIGUOUS");
  return directory(path.join(session, rows[0].name));
}
function exactConfig(value) {
  return value.scriptId === b0.TARGET && value.rootDir === "src" &&
    equal(value.scriptExtensions, [".gs", ".js"]) && equal(value.htmlExtensions, [".html"]) &&
    equal(value.jsonExtensions, [".json"]) && value.skipSubdirectories === false &&
    Object.keys(value).length === 6;
}
function manifestSummary(files) {
  const rows = files.filter(row => row.name === "appsscript.json");
  check(rows.length === 1, "VERSION8_MANIFEST_NOT_EXACT");
  let value;
  try { value = JSON.parse(rows[0].bytes.toString("utf8").replace(/^\uFEFF/, "")); }
  catch (_) { throw new Error("VERSION8_MANIFEST_INVALID"); }
  const entry = Object.hasOwn(value, "webapp") ?
    {present: true, access: value.webapp?.access, executeAs: value.webapp?.executeAs} :
    {present: false, access: null, executeAs: null};
  return {sha256: hash(rows[0].bytes), entry};
}
function loadVersion8Session(sessionPath, local, pin = PIN) {
  const session = directory(sessionPath);
  check(path.basename(session) === pin.version8Session, "WRONG_VERSION8_SESSION");
  const sessionRow = json(path.join(session, "session.json"));
  const binding = sessionRow.binding;
  check(binding?.revision === "LOGREAD-version8-readonly-r1" && binding.candidate === pin.previousCandidate &&
    binding.packageSha256 === pin.previousPackage && binding.versionNumber === 8 &&
    binding.v4RestoredResultSha256 === pin.v4RestoredResult &&
    binding.baselineListsSha256 === hash(JSON.stringify(local.lists)) &&
    path.basename(directory(binding.packageRun)) === pin.previousCampaign &&
    path.basename(directory(binding.readSession)) === pin.readSession &&
    path.basename(directory(binding.technicalSession)) === pin.technicalSession &&
    path.basename(directory(binding.priorSession)) === pin.priorSession &&
    path.basename(directory(binding.v2Session)) === pin.v2Session &&
    path.basename(directory(binding.v3Session)) === pin.v3Session &&
    path.basename(directory(binding.v4Session)) === pin.v4Session,
    "VERSION8_BINDING_MISMATCH");
  const reportFile = path.join(session, "report.json"), report = json(reportFile);
  const expected = {revision: "LOGREAD-version8-readonly-r1", candidate: pin.previousCandidate,
    packageSha256: pin.previousPackage, target: b0.TARGET, versionNumber: 8,
    v4RestoredResultSha256: pin.v4RestoredResult, googleReadAttempted: true,
    googleWriteAttempted: false, readOnlyAuthorized: true,
    status: "VERSION8_MANIFEST_COLLECTED_REVIEW_REQUIRED", headFiles: pin.historicalFiles,
    headSourceSha256: pin.historicalSource, version8Files: pin.historicalFiles,
    version8SourceSha256: pin.version8Source, sourcesExact: false,
    headManifestSha256: pin.historicalManifest, version8ManifestSha256: pin.version8Manifest,
    manifestsExact: false, headWebapp: {present: false, access: null, executeAs: null},
    version8Webapp: {present: true, access: "ANYONE", executeAs: "USER_ACCESSING"},
    inventoriesUnchanged: true, generatedAt: pin.version8GeneratedAt};
  check(Object.entries(expected).every(([key, value]) => equal(report[key], value)) &&
    directory(report.session) === session &&
    path.basename(directory(report.v4Session)) === pin.v4Session, "VERSION8_REPORT_MISMATCH");
  const headDir = workspace(session, "head"), versionDir = workspace(session, "version8");
  check(exactConfig(json(path.join(headDir, ".clasp.json"))) &&
    exactConfig(json(path.join(versionDir, ".clasp.json"))), "VERSION8_CLASP_CONFIGURATION_MISMATCH");
  const head = b0.scan(directory(path.join(headDir, "src")));
  const version8 = b0.scan(directory(path.join(versionDir, "src")));
  const headLists = b0.validateLists(json(path.join(headDir, "lists.json")).versions,
    json(path.join(headDir, "lists.json")).deployments);
  const versionLists = b0.validateLists(json(path.join(versionDir, "lists.json")).versions,
    json(path.join(versionDir, "lists.json")).deployments);
  check(equal(headLists, versionLists) && headLists.versions.length === 9 &&
    headLists.deployments.length === 2 && v4.phase(headLists, {lists: local.lists}).versionNumber === 8,
    "VERSION8_POST_V4_INVENTORY_MISMATCH");
  const headManifest = manifestSummary(head), immutableManifest = manifestSummary(version8);
  check(head.length === pin.historicalFiles && b0.sourceDigest(head) === pin.historicalSource &&
    headManifest.sha256 === pin.historicalManifest && headManifest.entry.present === false &&
    version8.length === pin.historicalFiles && b0.sourceDigest(version8) === pin.version8Source &&
    immutableManifest.sha256 === pin.version8Manifest &&
    equal(immutableManifest.entry, {present: true, access: "ANYONE", executeAs: "USER_ACCESSING"}) &&
    equal(json(path.join(headDir, "inventory.json")), b0.inventory(head)) &&
    equal(json(path.join(versionDir, "inventory.json")), b0.inventory(version8)),
    "VERSION8_EVIDENCE_MISMATCH");
  return {session, reportSha256: hash(bytes(reportFile)), lists: headLists, head, version8};
}
const KEYS = ["mode", "package-run", "version8-session", "clasp-package", "output", "authorization"];
function validateOptions(options) {
  check(options && Object.keys(options).every(key => KEYS.includes(key)) &&
    ["LocalCheck", "ReadOnly"].includes(options.mode), "INVALID_ARGUMENTS");
  for (const key of ["package-run", "version8-session", "clasp-package", "output"])
    check(typeof options[key] === "string" && options[key], "MISSING_ARGUMENT");
  if (options.mode === "ReadOnly") check(options.authorization === AUTHORIZATION,
    "SEPARATE_READONLY_AUTHORIZATION_REQUIRED");
  else check(!options.authorization, "LOCAL_CHECK_MUST_NOT_AUTHORIZE_READ");
}
function parseArgs(argv) {
  const options = {mode: "LocalCheck"};
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index].replace(/^--/, "");
    check(argv[index] === "--" + key && !seen.has(key) && typeof argv[index + 1] === "string",
      "INVALID_ARGUMENTS");
    seen.add(key); options[key] = argv[index + 1];
  }
  validateOptions(options); return options;
}
function protocol() {
  return {revision: "LOGREAD-webapp-readonly-protocol-r1", defaultMode: "LocalCheck",
    readOnlyCommands: ["list-versions", "list-deployments", "pull"],
    googleWriteCommands: [], pushAuthorized: false, versionAuthorized: false,
    deploymentAuthorized: false, propertiesAuthorized: false, accessAuditAuthorized: false,
    browserAuthorized: false, mergeAuthorized: false, d5Authorized: false};
}
function collect(local, baseline, io, record, pin = PIN) {
  const first = {};
  for (const ordinal of [1, 2]) for (const target of c1.TARGETS) {
    const snapshot = io.snapshot(target.role, ordinal);
    record(snapshot.summary);
    const portal = target.role === "portal";
    const manifest = manifestSummary(snapshot.files);
    check(snapshot.summary.role === target.role && snapshot.summary.target === target.scriptId &&
      snapshot.summary.ordinal === ordinal &&
      snapshot.files.length === (portal ? pin.historicalFiles : pin.backendFiles) &&
      b0.sourceDigest(snapshot.files) === (portal ? pin.historicalSource : pin.backendSource) &&
      manifest.sha256 === (portal ? pin.historicalManifest : pin.backendManifest),
      "REMOTE_SOURCE_CHANGED_SINCE_V5");
    const lists = b0.validateLists(snapshot.lists.versions, snapshot.lists.deployments);
    if (portal) {
      check(equal(lists, baseline.lists) && v4.phase(lists, {lists: local.lists}).versionNumber === 8,
        "REMOTE_PORTAL_INVENTORY_CHANGED_SINCE_V5");
      check(b0.compare(b0.inventory(local.historical), b0.inventory(snapshot.files)).length === 0,
        "PORTAL_RESTORATION_REFERENCE_MISMATCH");
    } else check(hash(JSON.stringify(lists)) === pin.backendLists,
      "REMOTE_BACKEND_INVENTORY_CHANGED_SINCE_C1");
    if (ordinal === 1) first[target.role] = {files: snapshot.files, lists};
    else check(equal(b0.inventory(first[target.role].files), b0.inventory(snapshot.files)) &&
      equal(first[target.role].lists, lists), "INDEPENDENT_READS_DIFFER");
  }
  return {remoteSourceAndInventoriesRevalidated: true, independentReadsExact: true,
    inventoriesUnchanged: true, portalHistoricalRestorationExact: true,
    backendMatchesHistoricalC1: true, retainedVersion9Exact: true,
    webAppDeploymentRestoredToVersion8: true};
}
function main(options, deps = {}) {
  validateOptions(options); // Authorization gate precedes evidence, subprocess and output access.
  check(Number(process.versions.node.split(".")[0]) >= 20, "NODE_20_REQUIRED");
  const local = (deps.loadLocal || loadLocal)(options["package-run"]);
  const baseline = (deps.loadVersion8Session || loadVersion8Session)(options["version8-session"], local);
  const entry = b1.claspEntry(options["clasp-package"]); // File inspection only.
  const report = {revision: "LOGREAD-webapp-readonly-r1", candidate: PIN.candidate,
    packageSha256: PIN.source, packageArchiveSha256: PIN.archive,
    packageCampaign: local.packageDir, packageReportSha256: local.reportSha256,
    version8Session: baseline.session, version8ReportSha256: baseline.reportSha256,
    baselineVersionsCount: baseline.lists.versions.length,
    baselineDeploymentsCount: baseline.lists.deployments.length, retainedVersionNumber: 9,
    manifestSha256: PIN.manifest, manifestWebapp: {access: "ANYONE", executeAs: "USER_ACCESSING"},
       localEvidenceVerified: true, googleReadAttempted: false, googleWriteAttempted: false,
    readOnlyAuthorized: false, executionAuthorized: false, remoteSourceAndInventoriesRevalidated: false,
    independentReadsExact: false, inventoriesUnchanged: false,
    portalHistoricalRestorationExact: false, backendMatchesHistoricalC1: false,
    retainedVersion9Exact: false, webAppDeploymentRestoredToVersion8: false,
    currentPropertiesVerified: false, currentSecretContinuityVerified: false,
    browserDeploymentChosen: false, status: "LOGREAD_WEBAPP_READONLY_LOCAL_CHECK_ONLY"};
  if (options.mode === "LocalCheck") return report;
  const root = c1.safeOutput(options.output,
    [local.packageDir, baseline.session, __dirname, options["clasp-package"]]);
  const session = fs.mkdtempSync(path.join(root, "logread-webapp-readonly-"));
  Object.assign(report, {session, generatedAt: new Date().toISOString(), readOnlyAuthorized: true, reads: []});
  writeNew(path.join(session, "binding.json"), report);
  try {
    const transport = (deps.makeTransport || c1.makeTransport)(entry, session, deps.native || b0.native);
    report.googleReadAttempted = true;
    const runCollection = deps.collect || collect;
    Object.assign(report, runCollection(local, baseline, transport, summary => {
      report.reads.push(summary);
      writeNew(path.join(session, "read-summary-" + report.reads.length + ".json"), summary);
    }, PIN));
    report.status = "LOGREAD_WEBAPP_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED";
  } catch (error) {
    report.status = "STOPPED";
    report.failure = safeError(error);
  }
  writeNew(path.join(session, "report.json"), report);
  return report;
}
function safeError(error) {
  const allowed = ["SEPARATE_READONLY_AUTHORIZATION_REQUIRED", "LOCAL_CHECK_MUST_NOT_AUTHORIZE_READ",
    "REMOTE_SOURCE_CHANGED_SINCE_C1", "REMOTE_INVENTORIES_CHANGED_SINCE_C1",
    "PORTAL_RESTORATION_REFERENCE_MISMATCH", "INDEPENDENT_READS_DIFFER",
    "PACKAGE_REPORT_MISMATCH", "PACKAGE_CONTENT_MISMATCH", "PACKAGE_INVENTORY_MISMATCH",
    "HISTORICAL_ROLLBACK_MISMATCH", "HISTORICAL_ARCHIVE_MISMATCH", "HISTORICAL_LISTS_MISMATCH",
    "PACKAGE_METADATA_MISMATCH", "PACKAGE_PLAN_MISMATCH", "CLASP_CONFIGURATION_REFUSED",
    "WRONG_VERSION8_SESSION", "VERSION8_BINDING_MISMATCH", "VERSION8_REPORT_MISMATCH",
    "VERSION8_WORKSPACE_AMBIGUOUS", "VERSION8_CLASP_CONFIGURATION_MISMATCH",
    "VERSION8_POST_V4_INVENTORY_MISMATCH", "VERSION8_EVIDENCE_MISMATCH",
    "VERSION8_MANIFEST_NOT_EXACT", "VERSION8_MANIFEST_INVALID",
    "REMOTE_SOURCE_CHANGED_SINCE_V5", "REMOTE_PORTAL_INVENTORY_CHANGED_SINCE_V5",
    "REMOTE_BACKEND_INVENTORY_CHANGED_SINCE_C1"];
  return allowed.includes(error?.message) ? error.message : "LOGREAD_WEBAPP_READONLY_STOPPED";
}
module.exports = {PIN, AUTHORIZATION, expectedReport, loadLocal, loadVersion8Session, validateOptions,
  parseArgs, protocol, collect, main, safeError};
if (require.main === module) {
  try {
    const result = main(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
    if (result.status === "STOPPED") process.exitCode = 1;
  } catch (error) {
    console.error(safeError(error)); process.exitCode = 1;
  }
}
