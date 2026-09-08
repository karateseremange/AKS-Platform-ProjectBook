#!/usr/bin/env node
'use strict';
// D4C-local-r1: local evidence review and inventory plan only. No Google mode.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
const HELPERS = Object.freeze({
  'prepare-d4b.cjs': 'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b',
  'validate-d4b.cjs': '3461f26c5b3b920ff5cb123a727a55562a1ba98eefad72c3fc6d3c828418df51',
  'check-d4b-c2.cjs': 'fd28976e887cd4f3ad77707d61aa75d1287d4a5a701ee5e4ecbfd661d697d170',
  'validate-d4b-c2.cjs': '47345d00f08fb1fb71ea5a4befd9952da5165c40ce3167cb6d9a3f7986c6bcba'
});
for (const [name, sha] of Object.entries(HELPERS))
  check(hash(fs.readFileSync(path.join(__dirname, name))) === sha, 'HELPER_INTEGRITY_MISMATCH');
const b0 = require('./prepare-d4b.cjs');
const b1c2 = require('./validate-d4b-c2.cjs');
const PIN = Object.freeze({
  application: 'f600560edb941bbfb63c7d75e881d7d5de836bd0',
  projectBook: 'fdddfa281e1fb280404db721d5fc17c2b99670fc',
  portal: b0.TARGET,
  backend: '1_C157CtD95GegcpxSrKcL6bRDyea1cPfH9NfJywBnTmJQzKY30qfNNUu',
  session: 'b1-c2-vglRNl'
});
const json = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
function writeNew(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', {flag: 'wx', mode: 0o600});
}
function loadEvidence(options, deps = {}) {
  const evidence = (deps.loadEvidence || b1c2.loadEvidence)(options['b0-run'], options['c2-run'], options['read-session']);
  const session = fs.realpathSync(options['b1-session']);
  check(path.basename(session) === PIN.session, 'WRONG_B1_C2_SESSION');
  b1c2.checkRecovery(session, evidence);
  const entries = fs.readdirSync(session, {withFileTypes: true});
  const results = entries.filter(e => /^result-[a-f0-9-]+\.json$/.test(e.name));
  check(results.length === 1 && results[0].isFile(), 'B1_RESULT_AMBIGUOUS');
  const resultFile = path.join(session, results[0].name), report = json(resultFile);
  check(report.revision === 'B1-C2-r1' && report.target === PIN.portal &&
    report.candidate === b1c2.PIN.candidate && report.packageSha256 === b1c2.PIN.package &&
    report.packageArchiveSha256 === b1c2.PIN.archive &&
    report.backupArchiveSha256 === b1c2.sessionBinding(evidence).backup &&
    fs.realpathSync(report.preflightSession) === evidence.readSession &&
    report.preflightSnapshotsVerifiedLocally === true &&
    report.googleReadAttempted === true && report.googleWriteAttempted === true &&
    report.b1Authorized === true && report.propertiesOperatorConfirmed === true &&
    report.status === 'RESTORED_TEST_PASS_PROPERTIES_REVIEW_REQUIRED' &&
    report.testPassed === true && report.restoredExact === true &&
    fs.realpathSync(report.session) === session, 'B1_RESULT_MISMATCH');
  const events = entries.filter(e => /^event-[a-f0-9-]+\.json$/.test(e.name)).map(e => json(path.join(session, e.name)).event);
  for (const event of ['CANDIDATE_PUSH_INTENT', 'CANDIDATE_EXACT', 'TEST_PASS_OPERATOR_REPORTED', 'RESTORE_PUSH_INTENT', 'RESTORED_EXACT'])
    check(events.filter(e => e === event).length === 1, 'B1_EVENTS_MISMATCH');
  for (const [label, expected] of [
    ['before-upload', evidence.backup], ['candidate-readback', evidence.candidate],
    ['before-restore', evidence.candidate], ['after-restore', evidence.backup]
  ]) {
    const snapshots = entries.filter(e => e.isDirectory() && e.name.startsWith(label + '-'));
    check(snapshots.length === 1, 'B1_SNAPSHOT_AMBIGUOUS');
    const dir = path.join(session, snapshots[0].name), files = b0.scan(path.join(dir, 'src'));
    check(same(files, expected) && equal(b0.inventory(files), json(path.join(dir, 'inventory.json'))) &&
      equal(evidence.lists, json(path.join(dir, 'lists.json'))), 'B1_SNAPSHOT_MISMATCH');
  }
  return {evidence, session, resultSha256: hash(fs.readFileSync(resultFile))};
}
function inventoryPlan() {
  return {
    revision: 'D4C-inventory-plan-r1', executable: false,
    authorization: 'SEPARATE_GOOGLE_READ_AUTHORIZATION_REQUIRED',
    targets: [
      {role: 'PORTAL_RECETTE', scriptId: PIN.portal},
      {role: 'PRIVATE_BACKEND_RECETTE', scriptId: PIN.backend}
    ],
    readOnlyCollectionToPrepare: ['two-independent-HEAD-snapshots', 'versions-and-deployments-before-and-after',
      'full-project-identity', 'manifest-and-source-inventory', 'owner-and-editors'],
    operatorReviewRequired: ['current-nonsecret-property-names-and-values', 'existing-LOG_READ-assignment',
      'effective-portal-USER_ACCESSING-and-audience', 'inferred-OAuth-scopes-including-external_request',
      'backend-deployment-binding-to-protected-D3-D3-report', 'existing-LOG-and-proof-support-permissions'],
    secretContinuity: 'NOT_PROVEN_BY_CLASP_PULL_OR_HISTORICAL_HASHES',
    secretInspection: 'NO_EXTRACTION; any new inspector requires a separate reviewed authorization',
    pendingDecisions: ['portal-browser-deployment-target', 'exact-mutations-and-rollback',
      'supervised-window-and-backup-operator', 'authorized-test-calls-and-proof-retention'],
    exclusions: ['Google-calls-in-this-tool', 'backend-URL-in-output', 'secret-values', 'OAuth-tokens',
      'Google-writes', 'activation', 'deployment', 'ACCESS-writes', 'production', 'D5', 'merge']
  };
}
function parseArgs(argv) {
  const keys = ['mode', 'b0-run', 'c2-run', 'read-session', 'b1-session', 'output'];
  const options = {mode: 'LocalCheck'}, seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const k = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + k && keys.includes(k) && !seen.has(k) &&
      typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    seen.add(k); options[k] = argv[i + 1];
  }
  check(options.mode === 'LocalCheck', 'LOCAL_ONLY_MODE');
  keys.filter(k => k !== 'mode').forEach(k => check(options[k], 'MISSING_ARGUMENT'));
  return options;
}
function within(value, root) {
  const rel = path.relative(root, value);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
}
function main(options, deps = {}) {
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  check(options.mode === 'LocalCheck', 'LOCAL_ONLY_MODE');
  check(typeof options.output === 'string' && options.output, 'OUTPUT_REQUIRED');
  const loaded = (deps.load || loadEvidence)(options), e = loaded.evidence;
  const root = path.resolve(options.output), protectedRoots = [e.dir, e.c2Dir, e.readSession, loaded.session];
  check(!protectedRoots.some(p => within(root, p)), 'OUTPUT_INSIDE_EVIDENCE');
  fs.mkdirSync(root, {recursive: true, mode: 0o700});
  check(!protectedRoots.some(p => within(fs.realpathSync(root), p)), 'OUTPUT_INSIDE_EVIDENCE');
  const campaign = fs.mkdtempSync(path.join(root, 'local-d4c-'));
  const plan = inventoryPlan();
  writeNew(path.join(campaign, 'inventory-plan.json'), plan);
  const report = {
    revision: 'D4C-local-r1', status: 'D4C_LOCAL_PREPARED_REVIEW_REQUIRED',
    applicationCommit: PIN.application, projectBookBaseline: PIN.projectBook,
    candidate: b1c2.PIN.candidate, packageSha256: b1c2.PIN.package,
    historicalB1Session: loaded.session, historicalB1ResultSha256: loaded.resultSha256,
    historicalSnapshotsVerifiedLocally: true, historicalTestPassOperatorReported: true,
    historicalPropertiesOperatorConfirmed: true, backupFiles: e.backup.length, packageFiles: e.candidate.length,
    currentRemoteStateVerified: false, currentPropertiesVerified: false,
    currentSecretContinuityVerified: false, browserDeploymentChosen: false, testAccountAuthorizedNow: false,
    googleReadExecuted: false, googleWriteAttempted: false, d4cExecutionAuthorized: false,
    inventoryPlanSha256: hash(fs.readFileSync(path.join(campaign, 'inventory-plan.json'))),
    campaign, generatedAt: new Date().toISOString()
  };
  writeNew(path.join(campaign, 'report.json'), report);
  return report;
}
module.exports = {PIN, HELPERS, loadEvidence, inventoryPlan, parseArgs, main};
if (require.main === module) {
  try { console.log(JSON.stringify(main(parseArgs(process.argv.slice(2))), null, 2)); }
  catch (error) {
    console.error(/^[A-Z0-9_]+$/.test(error?.message) ? error.message : 'D4C_LOCAL_CHECK_STOPPED');
    process.exitCode = 1;
  }
}
