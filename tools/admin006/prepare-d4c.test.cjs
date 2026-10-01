'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b-c2.cjs');
const api = require('./prepare-d4c.cjs');
const write = (p, data) => fs.writeFileSync(p, JSON.stringify(data));
const file = (name, text) => ({name, bytes: Buffer.from(text)});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-d4c-local-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const dir = path.join(root, 'b0'), c2Dir = path.join(root, 'c2'), readSession = path.join(root, 'readonly');
  const session = path.join(root, api.PIN.session);
  [dir, c2Dir, readSession, session].forEach(p => fs.mkdirSync(p));
  const manifest = file('appsscript.json', '{"timeZone":"Europe/Paris","dependencies":{},"runtimeVersion":"V8","exceptionLogging":"STACKDRIVER"}');
  const backup = [manifest, file('code.gs', '// backup')];
  const candidate = [manifest, file('code.gs', '// candidate'), file('added.gs', '// added')];
  const lists = b0.validateLists([{versionNumber: 1}], [{deploymentId: 'synthetic', versionNumber: 1}]);
  const evidence = {dir, c2Dir, readSession, backup, candidate, lists};
  write(path.join(session, 'session.json'), {binding: b1.sessionBinding(evidence)});
  const events = ['OPERATOR_PRECONDITIONS_CONFIRMED', 'CANDIDATE_PUSH_INTENT', 'CANDIDATE_EXACT',
    'TEST_PASS_OPERATOR_REPORTED', 'RESTORE_PUSH_INTENT', 'RESTORED_EXACT'];
  const eventFiles = {};
  events.forEach((event, n) => {
    const p = path.join(session, 'event-' + n.toString(16) + '.json'); eventFiles[event] = p;
    write(p, {event, at: '2026-09-02T00:00:00.000Z'});
  });
  const report = {revision: 'B1-C2-r1', target: api.PIN.portal, candidate: b1.PIN.candidate,
    packageSha256: b1.PIN.package, packageArchiveSha256: b1.PIN.archive,
    backupArchiveSha256: b1.sessionBinding(evidence).backup,
    preflightSession: readSession, preflightSnapshotsVerifiedLocally: true,
    googleReadAttempted: true, googleWriteAttempted: true, b1Authorized: true,
    propertiesOperatorConfirmed: true, status: 'RESTORED_TEST_PASS_PROPERTIES_REVIEW_REQUIRED',
    testPassed: true, restoredExact: true, session};
  const resultFile = path.join(session, 'result-a.json'); write(resultFile, report);
  for (const [label, files] of [['before-upload', backup], ['candidate-readback', candidate],
    ['before-restore', candidate], ['after-restore', backup]]) {
    const snapshot = path.join(session, label + '-synthetic');
    b0.materialize(path.join(snapshot, 'src'), files);
    write(path.join(snapshot, 'inventory.json'), b0.inventory(files));
    write(path.join(snapshot, 'lists.json'), lists);
  }
  const options = {mode: 'LocalCheck', 'b0-run': dir, 'c2-run': c2Dir, 'read-session': readSession,
    'b1-session': session, output: path.join(root, 'out')};
  const load = () => api.loadEvidence(options, {loadEvidence: () => evidence});
  return {root, dir, c2Dir, readSession, session, evidence, report, resultFile, eventFiles, options, load};
}
test('CLI permits only LocalCheck and known arguments', () => {
  const args = ['--b0-run', 'b0', '--c2-run', 'c2', '--read-session', 'read', '--b1-session', 'b1', '--output', 'out'];
  assert.equal(api.parseArgs(args).mode, 'LocalCheck');
  for (const mode of ['Execute', 'Restore', 'ReadOnly', 'GoogleReadOnly'])
    assert.throws(() => api.parseArgs([...args, '--mode', mode]), /LOCAL_ONLY_MODE/);
  for (const extra of [['--authorization', 'yes'], ['--output', 'other'], ['--unknown', 'x'], ['--mode']])
    assert.throws(() => api.parseArgs([...args, ...extra]), /INVALID_ARGUMENTS/);
  assert.throws(() => api.parseArgs([]), /MISSING_ARGUMENT/);
});
test('direct main call rejects remote modes before evidence loading', () => {
  assert.throws(() => api.main({mode: 'Execute'}, {load: () => assert.fail()}), /LOCAL_ONLY_MODE/);
});
test('complete historical B1 success and four snapshots are accepted', t => {
  const f = fixture(t), r = f.load();
  assert.equal(r.session, f.session);
  assert.equal(r.resultSha256, crypto.createHash('sha256').update(fs.readFileSync(f.resultFile)).digest('hex'));
});
test('wrong historical campaign is refused', t => {
  const f = fixture(t);
  assert.throws(() => api.loadEvidence({...f.options, 'b1-session': f.dir}, {loadEvidence: () => f.evidence}), /WRONG_B1_C2_SESSION/);
});
test('changed package or baseline binding is refused', t => {
  const f = fixture(t), binding = b1.sessionBinding(f.evidence);
  write(path.join(f.session, 'session.json'), {binding: {...binding, package: 'other'}});
  assert.throws(f.load, /RECOVERY_SESSION_MISMATCH/);
});
test('failed test, failed restore, missing properties and changed report pins are refused', t => {
  const f = fixture(t);
  for (const patch of [{testPassed: false}, {restoredExact: false}, {propertiesOperatorConfirmed: false},
    {status: 'TEST_NOT_PASSED'}, {target: api.PIN.backend}, {candidate: 'other'}, {packageSha256: 'other'},
    {preflightSnapshotsVerifiedLocally: false}, {googleWriteAttempted: false}, {b1Authorized: false}]) {
    write(f.resultFile, {...f.report, ...patch}); assert.throws(f.load, /B1_RESULT_MISMATCH/);
  }
});
test('multiple historical results are ambiguous', t => {
  const f = fixture(t); write(path.join(f.session, 'result-b.json'), f.report);
  assert.throws(f.load, /B1_RESULT_AMBIGUOUS/);
});
test('missing or duplicate success event is refused', t => {
  const f = fixture(t), p = f.eventFiles.TEST_PASS_OPERATOR_REPORTED, saved = fs.readFileSync(p);
  fs.unlinkSync(p); assert.throws(f.load, /B1_EVENTS_MISMATCH/); fs.writeFileSync(p, saved);
  write(path.join(f.session, 'event-f.json'), {event: 'RESTORED_EXACT'});
  assert.throws(f.load, /B1_EVENTS_MISMATCH/);
});
test('missing or duplicate snapshot is refused', t => {
  const f = fixture(t), original = path.join(f.session, 'after-restore-synthetic'), moved = path.join(f.root, 'moved');
  fs.renameSync(original, moved); assert.throws(f.load, /B1_SNAPSHOT_AMBIGUOUS/); fs.renameSync(moved, original);
  fs.mkdirSync(path.join(f.session, 'after-restore-extra')); assert.throws(f.load, /B1_SNAPSHOT_AMBIGUOUS/);
});
test('candidate and restored files are compared with the pinned evidence', t => {
  const f = fixture(t);
  for (const label of ['candidate-readback', 'after-restore']) {
    const p = path.join(f.session, label + '-synthetic', 'src', 'code.gs'), bytes = fs.readFileSync(p);
    fs.writeFileSync(p, '// tampered'); assert.throws(f.load, /B1_SNAPSHOT_MISMATCH/); fs.writeFileSync(p, bytes);
  }
});
test('saved inventories and deployment lists are independently checked', t => {
  const f = fixture(t);
  for (const name of ['inventory.json', 'lists.json']) {
    const p = path.join(f.session, 'after-restore-synthetic', name), bytes = fs.readFileSync(p);
    write(p, []); assert.throws(f.load, /B1_SNAPSHOT_MISMATCH/); fs.writeFileSync(p, bytes);
  }
});
test('plan has exactly two RECETTE targets and grants no remote authorization', () => {
  const p = api.inventoryPlan();
  assert.equal(p.executable, false); assert.deepEqual(p.targets.map(t => t.scriptId), [api.PIN.portal, api.PIN.backend]);
  assert.match(p.authorization, /SEPARATE_GOOGLE_READ_AUTHORIZATION_REQUIRED/);
  assert.match(p.secretContinuity, /NOT_PROVEN/);
});
test('local preparation never starts a subprocess and keeps current-state flags false', t => {
  const f = fixture(t), native = cp.spawnSync;
  cp.spawnSync = () => assert.fail('Subprocess forbidden');
  try {
    const r = api.main(f.options, {load: f.load});
    for (const key of ['googleReadExecuted', 'googleWriteAttempted', 'd4cExecutionAuthorized',
      'currentRemoteStateVerified', 'currentPropertiesVerified', 'currentSecretContinuityVerified',
      'browserDeploymentChosen', 'testAccountAuthorizedNow']) assert.equal(r[key], false, key);
    assert.equal(r.historicalSnapshotsVerifiedLocally, true);
    assert.equal(fs.existsSync(path.join(r.campaign, '.clasp.json')), false);
  } finally { cp.spawnSync = native; }
});
test('output cannot be inside any evidence directory', t => {
  const f = fixture(t);
  for (const root of [f.dir, f.c2Dir, f.readSession, f.session])
    assert.throws(() => api.main({...f.options, output: path.join(root, 'new')}, {load: f.load}), /OUTPUT_INSIDE_EVIDENCE/);
});
test('repeat preparation preserves earlier output and evidence', t => {
  const f = fixture(t), before = fs.readFileSync(f.resultFile);
  const first = api.main(f.options, {load: f.load}), again = api.main(f.options, {load: f.load});
  assert.notEqual(first.campaign, again.campaign); assert.deepEqual(fs.readFileSync(f.resultFile), before);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(first.campaign, 'report.json'))), first);
  assert.equal(first.inventoryPlanSha256, again.inventoryPlanSha256);
});
test('unrecognized secret or URL fields in historical report are never re-emitted', t => {
  const f = fixture(t); write(f.resultFile, {...f.report, secret: 'DO_NOT_EMIT', url: 'https://private.invalid/secret'});
  const r = api.main(f.options, {load: f.load});
  for (const name of ['report.json', 'inventory-plan.json']) {
    const out = fs.readFileSync(path.join(r.campaign, name), 'utf8');
    assert.equal(out.includes('DO_NOT_EMIT'), false); assert.equal(out.includes('private.invalid'), false);
  }
});
