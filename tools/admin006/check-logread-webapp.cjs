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
  historicalArchive: "c07efd3d245f6d4ba1009104c7f5fc1ea822c135eefa6658b188166b8daf6901",
  historicalLists: "e008b6eebe885702135fc986e74e5ada01bcc6ccd317d5e336a768c7bf1f78e0"
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
const KEYS = ["mode", "package-run", "clasp-package", "output", "authorization"];
function validateOptions(options) {
  check(options && Object.keys(options).every(key => KEYS.includes(key)) &&
    ["LocalCheck", "ReadOnly"].includes(options.mode), "INVALID_ARGUMENTS");
  for (const key of ["package-run", "clasp-package", "output"])
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
function main(options, deps = {}) {
  validateOptions(options); // Authorization gate precedes evidence, subprocess and output access.
  check(Number(process.versions.node.split(".")[0]) >= 20, "NODE_20_REQUIRED");
  const local = (deps.loadLocal || loadLocal)(options["package-run"]);
  const entry = b1.claspEntry(options["clasp-package"]); // File inspection only.
  const report = {revision: "LOGREAD-webapp-readonly-r1", candidate: PIN.candidate,
    packageSha256: PIN.source, packageArchiveSha256: PIN.archive,
    packageCampaign: local.packageDir, packageReportSha256: local.reportSha256,
    manifestSha256: PIN.manifest, manifestWebapp: {access: "ANYONE", executeAs: "USER_ACCESSING"},
       localEvidenceVerified: true, googleReadAttempted: false, googleWriteAttempted: false,
    readOnlyAuthorized: false, executionAuthorized: false, remoteSourceAndInventoriesRevalidated: false,
    independentReadsExact: false, inventoriesUnchanged: false,
    portalHistoricalRestorationExact: false, backendMatchesHistoricalC1: false,
    currentPropertiesVerified: false, currentSecretContinuityVerified: false,
    browserDeploymentChosen: false, status: "LOGREAD_WEBAPP_READONLY_LOCAL_CHECK_ONLY"};
  if (options.mode === "LocalCheck") return report;
  const root = c1.safeOutput(options.output, [local.packageDir, __dirname, options["clasp-package"]]);
  const session = fs.mkdtempSync(path.join(root, "logread-webapp-readonly-"));
  Object.assign(report, {session, generatedAt: new Date().toISOString(), readOnlyAuthorized: true, reads: []});
  writeNew(path.join(session, "binding.json"), report);
  try {
    const transport = (deps.makeTransport || c1.makeTransport)(entry, session, deps.native || b0.native);
    report.googleReadAttempted = true;
    const collect = deps.collect || previous.collect;
    Object.assign(report, collect({historical: {files: local.historical}}, transport, summary => {
      report.reads.push(summary);
      writeNew(path.join(session, "read-summary-" + report.reads.length + ".json"), summary);
    }, previous.PIN));
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
    "PACKAGE_METADATA_MISMATCH", "PACKAGE_PLAN_MISMATCH", "CLASP_CONFIGURATION_REFUSED"];
  return allowed.includes(error?.message) ? error.message : "LOGREAD_WEBAPP_READONLY_STOPPED";
}
module.exports = {PIN, AUTHORIZATION, expectedReport, loadLocal, validateOptions, parseArgs,
  protocol, main, safeError};
if (require.main === module) {
  try {
    const result = main(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
    if (result.status === "STOPPED") process.exitCode = 1;
  } catch (error) {
    console.error(safeError(error)); process.exitCode = 1;
  }
}
