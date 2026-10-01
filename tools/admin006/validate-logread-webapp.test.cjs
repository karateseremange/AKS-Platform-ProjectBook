'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const api = require('./validate-logread-webapp.cjs');
const b0 = require('./prepare-d4b.cjs');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const files = [
  {name: 'appsscript.json', bytes: Buffer.from('{"runtimeVersion":"V8"}')},
  {name: 'Test.gs', bytes: Buffer.from('function test() {}')}
];
const candidate = [...files, {name: 'Extra.gs', bytes: Buffer.from('function extra() {}')}];
const lists = {versions: Array.from({length: 9}, (_, index) => ({versionNumber: index + 1})),
  deployments: [{deploymentId: 'head'}, {deploymentId: 'OMcZ9gl', versionNumber: 8}]};
const clone = rows => rows.map(row => ({name: row.name, bytes: Buffer.from(row.bytes)}));
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-logread-webapp-executor-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const packageDir = path.join(root, api.PIN.campaign);
  const version8Session = path.join(root, api.PIN.version8Session);
  const readSession = path.join(root, api.PIN.readSession);
  const clasp = path.join(root, 'clasp');
  for (const dir of [packageDir, version8Session, readSession, clasp]) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(clasp, 'bin.cjs'), '');
  fs.writeFileSync(path.join(clasp, 'package.json'),
    JSON.stringify({name: '@google/clasp', version: '3.3.0', bin: 'bin.cjs'}));
  const evidence = {dir: packageDir, version8Session, readSession,
    readReportSha256: hash(Buffer.from('preflight')), backup: clone(files),
    candidate: clone(candidate), lists: structuredClone(lists)};
  const options = {mode: 'LocalCheck', 'package-run': packageDir,
    'version8-session': version8Session, 'read-session': readSession,
    'clasp-package': clasp, output: path.join(root, 'output')};
  return {root, clasp, evidence, options};
}
function memoryIo(evidence) {
  let state = clone(evidence.backup);
  const pushes = [];
  return {pushes, snapshot() { return {files: clone(state), lists: structuredClone(evidence.lists)}; },
    push(rows, label) { pushes.push(label); state = clone(rows); }};
}
test('authorization is exact and bound to the Web App package', () => {
  assert.equal(api.AUTHORIZATION, 'LOGREAD-WEBAPP-EXECUTE-' + api.PIN.source);
  assert.notEqual(api.AUTHORIZATION, 'LOGREAD-EXECUTE-' + api.PIN.previousPackage);
});
test('pins corrected package, V5 baseline and successful preflight', () => {
  assert.equal(api.PIN.campaign, 'logread-webapp-package-arjzvs');
  assert.equal(api.PIN.version8Session, 'logread-version8-6Y0HL6');
  assert.equal(api.PIN.readSession, 'logread-webapp-readonly-b2U2jL');
  assert.equal(api.PIN.packageReport, '5f79f2cb66c4d1a28f5e6ae98e2a4fd88c73dd5d37472b16664cecc52986f21e');
});
test('CLI accepts only known unique paired arguments', t => {
  const f = fixture(t);
  const args = Object.entries(f.options).flatMap(([key, value]) => ['--' + key, value]);
  assert.equal(api.parseArgs(args).mode, 'LocalCheck');
  for (const suffix of [['--mode', 'LocalCheck'], ['--target', 'x'], ['--output'],
    ['--authorization', 'yes']]) assert.throws(() => api.parseArgs([...args, ...suffix]));
});
test('Execute and Restore require future exact authorization before evidence', async t => {
  const f = fixture(t); let touched = 0;
  for (const mode of ['Execute', 'Restore']) {
    const options = {...f.options, mode};
    if (mode === 'Restore') options.session = f.root;
    await assert.rejects(() => api.main(options, {loadEvidence: () => { touched++; }}), /AUTHORIZATION/);
  }
  assert.equal(touched, 0);
});
test('LocalCheck performs no Google operation and creates no output', async t => {
  const f = fixture(t); let native = 0;
  const result = await api.main(f.options, {loadEvidence: () => f.evidence,
    claspEntry: () => path.join(f.clasp, 'bin.cjs'), native: () => { native++; }});
  assert.equal(result.status, 'LOGREAD_WEBAPP_EXECUTOR_LOCAL_CHECK_ONLY');
  assert.equal(result.baselineVersionsCount, 9);
  assert.equal(result.baselineDeploymentsCount, 2);
  assert.equal(result.retainedVersionNumber, 9);
  assert.equal(result.googleReadAttempted, false);
  assert.equal(result.googleWriteAttempted, false);
  assert.equal(result.executionAuthorized, false);
  assert.equal(result.propertiesOperatorConfirmed, false);
  assert.equal(native, 0);
  assert.equal(fs.existsSync(f.options.output), false);
});
test('session binding carries package, V5 and corrected preflight identities', t => {
  const f = fixture(t), binding = api.sessionBinding(f.evidence);
  assert.equal(binding.revision, 'LOGREAD-webapp-executor-r1');
  assert.equal(binding.package, api.PIN.source);
  assert.equal(binding.version8ReportSha256, api.PIN.version8Report);
  assert.equal(binding.readReportSha256, f.evidence.readReportSha256);
  assert.equal(binding.listsSha256, hash(JSON.stringify(lists)));
});
test('full future Execute remains interactive, restores and reconfirms state', async t => {
  const f = fixture(t), io = memoryIo(f.evidence);
  const answers = ['LOGREAD-WEBAPP-EXECUTE-AUTORISE-FERME', '781/781', 'ETAT-WEBAPP-CONFIRME'];
  const result = await api.main({...f.options, mode: 'Execute', authorization: api.AUTHORIZATION}, {
    loadEvidence: () => f.evidence, claspEntry: () => path.join(f.clasp, 'bin.cjs'),
    io, ask: async () => answers.shift()
  });
  assert.equal(result.status, 'RESTORED_TEST_PASS_OPERATOR_REVIEW_REQUIRED');
  assert.equal(result.executionAuthorized, true);
  assert.equal(result.googleReadAttempted, true);
  assert.equal(result.googleWriteAttempted, true);
  assert.equal(result.propertiesOperatorConfirmed, true);
  assert.equal(result.secretContinuityOperatorConfirmed, true);
  assert.equal(result.browserDeploymentOperatorConfirmed, true);
  assert.deepEqual(io.pushes, ['candidate-upload', 'restore-upload']);
});
test('wrong interactive phrase stops before output and Google', async t => {
  const f = fixture(t);
  await assert.rejects(() => api.main({...f.options, mode: 'Execute', authorization: api.AUTHORIZATION}, {
    loadEvidence: () => f.evidence, claspEntry: () => path.join(f.clasp, 'bin.cjs'),
    ask: async () => 'NON'
  }), /OPERATOR/);
  assert.equal(fs.existsSync(f.options.output), false);
});
test('output cannot alias package, V5, preflight, tools or clasp', async t => {
  const f = fixture(t);
  for (const output of [f.evidence.dir, f.evidence.version8Session, f.evidence.readSession,
    f.clasp, __dirname]) {
    await assert.rejects(() => api.main({...f.options, mode: 'Execute',
      authorization: api.AUTHORIZATION, output}, {loadEvidence: () => f.evidence,
      claspEntry: () => path.join(f.clasp, 'bin.cjs'),
      ask: async () => 'LOGREAD-WEBAPP-EXECUTE-AUTORISE-FERME'}));
  }
});
test('recovery requires exact binding and a candidate push intent', t => {
  const f = fixture(t), session = path.join(f.root, 'session');
  fs.mkdirSync(session);
  fs.writeFileSync(path.join(session, 'session.json'),
    JSON.stringify({binding: api.sessionBinding(f.evidence)}));
  assert.throws(() => api.checkRecovery(session, f.evidence), /NO_CANDIDATE/);
  fs.writeFileSync(path.join(session, 'event-00000000-0000-0000-0000-000000000000.json'),
    JSON.stringify({event: 'CANDIDATE_PUSH_INTENT'}));
  api.checkRecovery(session, f.evidence);
  fs.writeFileSync(path.join(session, 'session.json'), JSON.stringify({binding: {}}));
  assert.throws(() => api.checkRecovery(session, f.evidence), /RECOVERY_SESSION/);
});
