#!/usr/bin/env node
'use strict';
// Default LocalCheck does not invoke a subprocess or contact Google.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
for (const [name, digest] of Object.entries({
  'check-d4c.cjs': 'fc35c95b8e188bc835c530346a545daadc64903c2b9575df16c6bc6bef90af6b',
  'prepare-logread.cjs': '414ff5638360b80f4ece53c3a181baabfe944f6ef535b4112fd0c4ed43fbda49'
})) check(hash(fs.readFileSync(path.join(__dirname, name))) === digest, 'HELPER_INTEGRITY_MISMATCH');
const c1 = require('./check-d4c.cjs'); // Verifies its unchanged dependency chain.
const p = require('./prepare-logread.cjs');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const PIN = Object.freeze({...p.PIN,
  campaign: 'logread-package-gF5KXy',
  package: 'cd635f54e1c8c6cc5d7a43053a4a1bd37c866d728abb3a89dd04c0e91620689b',
  packageArchive: '6e4aa0e50271ed64d3079c32beff9905c90f3c422919b85349fa4173df5d0c51',
  plan: 'bac9b57eafd9fd690978a47221e9f1da4a2916d0b2c21c561127675c1f9942c3',
  c1Report: 'e1681ff7c83e5ad745187320236f92215426ecf345e3e94e7940576a14e55d24',
  packageGeneratedAt: '2026-09-03T20:00:11.459Z',
  diffCounts: Object.freeze({ADD: 18, REMOVE: 0, MODIFY: 188}),
  backendSource: '1eaf705b265301c7640cbf12040436a3eef206fc26a1a4aa09f6bc7bd93d576c',
  backendManifest: 'dfb7244bf96f619e36c762942c6f211db5e041319a85f2d0eba35c4fe911829d',
  backendLists: '4893782a94a1b529845543cfda9b0be63f3b4b615cce24a858e58e1bc0a12a96',
  backendFiles: 7
});
const AUTHORIZATION = 'LOGREAD-READONLY-' + PIN.package;
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function bytes(file) { check(fs.lstatSync(file).isFile(), 'REGULAR_FILE_REQUIRED'); return fs.readFileSync(file); }
const json = file => JSON.parse(bytes(file).toString('utf8').replace(/^\uFEFF/, ''));
function dir(value) { check(fs.lstatSync(value).isDirectory(), 'DIRECTORY_REQUIRED'); return fs.realpathSync(value); }
function writeNew(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', {flag: 'wx', mode: 0o600}); }
function expectedReport(pin = PIN) {
  return {revision: 'LOGREAD-package-r1', status: 'LOCAL_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED',
    target: b0.TARGET, candidate: pin.candidate, previousCandidate: pin.previous,
    sourceSha256: pin.source, sourceFiles: pin.sourceFiles, packageFiles: pin.sourceFiles,
    packageSha256: pin.package, packageArchiveSha256: pin.packageArchive,
    manifestSha256: pin.manifest, manifestCopiedExactlyFromHistoricalC1: true,
    historicalC1ReportSha256: pin.c1Report, historicalBackupArchiveSha256: pin.archive,
    historicalBackupFiles: pin.backupFiles, historicalEvidenceVerifiedLocally: true,
    remoteStateRevalidated: false, currentPropertiesVerified: false, currentSecretContinuityVerified: false,
    browserDeploymentChosen: false, googleReadAttempted: false, googleWriteAttempted: false,
    executionAuthorized: false, diffCounts: pin.diffCounts, planSha256: pin.plan,
    generatedAt: pin.packageGeneratedAt};
}
function loadLocal(packagePath, pin = PIN, loadHistorical = p.loadHistorical) {
  const packageDir = dir(packagePath);
  check(path.basename(packageDir) === pin.campaign, 'WRONG_PACKAGE_CAMPAIGN');
  const reportFile = path.join(packageDir, 'report.json'), report = json(reportFile);
  check(Object.entries(expectedReport(pin)).every(([k, v]) => equal(report[k], v)) &&
    dir(report.campaign) === packageDir, 'PACKAGE_REPORT_MISMATCH');
  const historical = loadHistorical(report.historicalC1Session);
  check(historical.reportSha256 === pin.c1Report &&
    bytes(path.join(packageDir, 'historical-c1-bundle.json')).equals(historical.bundle), 'HISTORICAL_BINDING_MISMATCH');
  const candidate = b1.archiveFiles(path.join(packageDir, 'candidate-bundle.json'), pin.packageArchive);
  check(candidate.length === pin.sourceFiles && b0.sourceDigest(candidate) === pin.package &&
    candidate.find(f => f.name === 'appsscript.json')?.bytes.equals(
      historical.files.find(f => f.name === 'appsscript.json')?.bytes), 'PACKAGE_CONTENT_MISMATCH');
  for (const [root, inv, files] of [['candidate/src', 'candidate-inventory.json', candidate],
    ['historical-rollback/src', 'historical-inventory.json', historical.files]]) {
    check(equal(b0.inventory(b0.scan(dir(path.join(packageDir, root)))), b0.inventory(files)) &&
      equal(json(path.join(packageDir, inv)), b0.inventory(files)), 'PACKAGE_INVENTORY_MISMATCH');
  }
  const diff = b0.compare(b0.inventory(historical.files), b0.inventory(candidate));
  check(equal(json(path.join(packageDir, 'diff.json')), diff) &&
    equal(json(path.join(packageDir, 'restoration-residuals.json')), diff.filter(d => d.change === 'ADD')) &&
    equal(json(path.join(packageDir, 'historical-lists.json')), historical.lists), 'PACKAGE_DIFF_MISMATCH');
  const delta = json(path.join(packageDir, 'delta-previous-candidate.json'));
  check(equal(delta.map(d => ({name: d.name, change: d.change})), report.changedFromPrevious) &&
    equal(delta.filter(d => d.change === 'ADD').map(d => d.name), pin.additions) &&
    equal(delta.filter(d => d.change === 'MODIFY').map(d => d.name), pin.modifications) &&
    delta.length === pin.additions.length + pin.modifications.length &&
    delta.every(d => b0.inventory(candidate).some(i => i.remoteName === d.name && equal(i, d.after))),
  'PACKAGE_DELTA_MISMATCH');
  const planFile = path.join(packageDir, 'test-restoration-plan.json');
  check(hash(bytes(planFile)) === pin.plan && equal(json(planFile), p.protocol()), 'PACKAGE_PLAN_MISMATCH');
  return {packageDir, candidate, historical, reportSha256: hash(bytes(reportFile))};
}
const KEYS = ['mode', 'package-run', 'clasp-package', 'output', 'authorization'];
function validateOptions(o) {
  check(o && Object.keys(o).every(k => KEYS.includes(k)) && ['LocalCheck', 'ReadOnly'].includes(o.mode), 'INVALID_ARGUMENTS');
  for (const k of ['package-run', 'clasp-package', 'output']) check(typeof o[k] === 'string' && o[k], 'MISSING_ARGUMENT');
  if (o.mode === 'ReadOnly') check(o.authorization === AUTHORIZATION, 'SEPARATE_READONLY_AUTHORIZATION_REQUIRED');
  else check(!o.authorization, 'LOCAL_CHECK_MUST_NOT_AUTHORIZE_READ');
}
function parseArgs(argv) {
  const o = {mode: 'LocalCheck'}, seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const k = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + k && !seen.has(k) && typeof argv[i + 1] === 'string', 'INVALID_ARGUMENTS');
    seen.add(k); o[k] = argv[i + 1];
  }
  validateOptions(o); return o;
}
function collect(local, io, record, pin = PIN) {
  const first = {};
  for (const ordinal of [1, 2]) for (const target of c1.TARGETS) {
    const s = io.snapshot(target.role, ordinal);
    record(s.summary);
    const portal = target.role === 'portal', manifest = s.files.find(f => f.name === 'appsscript.json');
    const expectedSource = portal ? pin.backupSource : pin.backendSource;
    check(s.summary.role === target.role && s.summary.target === target.scriptId &&
      s.summary.ordinal === ordinal && s.files.length === (portal ? pin.backupFiles : pin.backendFiles) &&
      b0.sourceDigest(s.files) === expectedSource && manifest &&
      hash(manifest.bytes) === (portal ? pin.manifest : pin.backendManifest), 'REMOTE_SOURCE_CHANGED_SINCE_C1');
    check(hash(JSON.stringify(b0.validateLists(s.lists.versions, s.lists.deployments))) ===
      (portal ? pin.lists : pin.backendLists), 'REMOTE_INVENTORIES_CHANGED_SINCE_C1');
    if (portal) check(b0.compare(b0.inventory(local.historical.files), b0.inventory(s.files)).length === 0,
      'PORTAL_RESTORATION_REFERENCE_MISMATCH');
    if (ordinal === 1) first[target.role] = s;
    else check(equal(b0.inventory(first[target.role].files), b0.inventory(s.files)) &&
      equal(first[target.role].lists, s.lists), 'INDEPENDENT_READS_DIFFER');
  }
  return {remoteSourceAndInventoriesRevalidated: true, independentReadsExact: true,
    inventoriesUnchanged: true, portalHistoricalRestorationExact: true, backendMatchesHistoricalC1: true};
}
function main(options, deps = {}) {
  validateOptions(options); // Gate before evidence, native process or output writes.
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  const local = (deps.loadLocal || loadLocal)(options['package-run']);
  const entry = b1.claspEntry(options['clasp-package']); // Inspects files, does not run clasp.
  const report = {revision: 'LOGREAD-readonly-r1', candidate: PIN.candidate,
    packageSha256: PIN.package, packageArchiveSha256: PIN.packageArchive,
    packageCampaign: local.packageDir, packageReportSha256: local.reportSha256,
    historicalC1ReportSha256: PIN.c1Report, historicalBackupArchiveSha256: PIN.archive,
    targets: c1.TARGETS, localEvidenceVerified: true, googleReadAttempted: false, googleWriteAttempted: false,
    readOnlyAuthorized: false, executionAuthorized: false, remoteSourceAndInventoriesRevalidated: false,
    currentPropertiesVerified: false, currentSecretContinuityVerified: false, ownerAndEditorsVerified: false,
    supportPermissionsVerified: false, effectiveIdentityAudienceAndScopesVerified: false,
    browserDeploymentChosen: false, testAccountAuthorizedNow: false, backendHistoricalBaselineVerified: false,
    status: 'LOGREAD_READONLY_LOCAL_CHECK_ONLY'};
  if (options.mode === 'LocalCheck') return report;
  const root = c1.safeOutput(options.output, [local.packageDir, local.historical.session,
    __dirname, options['clasp-package']]);
  const session = fs.mkdtempSync(path.join(root, 'logread-readonly-'));
  Object.assign(report, {session, generatedAt: new Date().toISOString(), readOnlyAuthorized: true, reads: []});
  writeNew(path.join(session, 'binding.json'), report);
  try {
    const io = c1.makeTransport(entry, session, deps.native || b0.native);
    report.googleReadAttempted = true;
    Object.assign(report, collect(local, io, summary => {
      report.reads.push(summary); writeNew(path.join(session, 'read-summary-' + report.reads.length + '.json'), summary);
    }));
    report.status = 'LOGREAD_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED';
  } catch (error) {
    report.status = 'STOPPED'; report.failure = safeError(error);
  }
  writeNew(path.join(session, 'report.json'), report);
  return report;
}
function safeError(error) {
  const allowed = ['SEPARATE_READONLY_AUTHORIZATION_REQUIRED', 'LOCAL_CHECK_MUST_NOT_AUTHORIZE_READ',
    'REMOTE_SOURCE_CHANGED_SINCE_C1', 'REMOTE_INVENTORIES_CHANGED_SINCE_C1',
    'PORTAL_RESTORATION_REFERENCE_MISMATCH', 'INDEPENDENT_READS_DIFFER', 'PACKAGE_REPORT_MISMATCH',
    'HISTORICAL_BINDING_MISMATCH', 'PACKAGE_CONTENT_MISMATCH', 'PACKAGE_INVENTORY_MISMATCH',
    'PACKAGE_DIFF_MISMATCH', 'PACKAGE_DELTA_MISMATCH', 'PACKAGE_PLAN_MISMATCH'];
  return allowed.includes(error?.message) ? error.message : 'LOGREAD_READONLY_STOPPED';
}
module.exports = {PIN, AUTHORIZATION, expectedReport, loadLocal, validateOptions, parseArgs, collect, main, safeError};
if (require.main === module) {
  try { const r = main(parseArgs(process.argv.slice(2))); console.log(JSON.stringify(r, null, 2));
    if (r.status === 'STOPPED') process.exitCode = 1;
  } catch (error) { console.error(safeError(error)); process.exitCode = 1; }
}
