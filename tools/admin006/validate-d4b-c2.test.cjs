'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const c2 = require('./check-d4b-c2.cjs');
const api = require('./validate-d4b-c2.cjs');
const file = (name, text) => ({name, bytes: Buffer.from(text)});
const write = (p, value) => fs.writeFileSync(p, JSON.stringify(value));
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-b1-c2-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const dir = path.join(root, 'b0'), c2Dir = path.join(root, 'c2'), readSession = path.join(root, api.PIN.readSession);
  for (const p of [dir, c2Dir, readSession]) fs.mkdirSync(p);
  const manifest = file('appsscript.json', '{"timeZone":"Europe/Paris","dependencies":{},"runtimeVersion":"V8","exceptionLogging":"STACKDRIVER"}');
  const backup = [manifest, file('changed.gs', '// saved\n')];
  const candidate = [manifest, file('changed.gs', '// candidate\n'), file('added.gs', '// new\n')];
  const lists = b0.validateLists([{versionNumber: 1}], [{deploymentId: 'synthetic', versionNumber: 1}]);
  const evidence = {dir, c2Dir, readSession, backup, candidate, lists};
  const local = {dir: c2Dir, evidence: {...evidence, candidate: backup}, candidate};
  const report = {revision: 'C2-readonly-r1', status: 'READ_ONLY_COLLECTED_PROPERTIES_REVIEW_REQUIRED',
    target: b0.TARGET, candidate: api.PIN.candidate, packageSha256: api.PIN.package,
    packageArchiveSha256: api.PIN.archive, backupArchiveSha256: b1.EXPECTED.backup,
    googleReadAttempted: true, googleWriteAttempted: false, propertiesOperatorConfirmed: false,
    b1Authorized: false, remoteHeadExact: true, independentReadsExact: true, inventoriesUnchanged: true,
    session: readSession};
  const actualArchiveHashes = {};
  for (const label of ['read-one', 'read-two']) {
    report[label + 'ArchiveSha256'] = b1.EXPECTED.backup;
    const archive = path.join(readSession, label + '-bundle.json');
    actualArchiveHashes[archive] = b0.archive(archive, backup);
    write(path.join(readSession, label + '-head-diff.json'), []);
    const snapshot = path.join(readSession, label + '-synthetic');
    b0.materialize(path.join(snapshot, 'src'), backup);
    write(path.join(snapshot, 'inventory.json'), b0.inventory(backup));
    write(path.join(snapshot, 'lists.json'), lists);
  }
  write(path.join(readSession, 'report.json'), report);
  const binding = {target: b0.TARGET, candidate: api.PIN.candidate, packageSha256: api.PIN.package, b0Run: dir, c2Run: c2Dir};
  write(path.join(readSession, 'binding.json'), binding);
  const loadDeps = {loadLocal: () => local, archiveFiles: (p, expected) => {
    assert.equal(expected, b1.EXPECTED.backup); return b1.archiveFiles(p, actualArchiveHashes[p]);
  }};
  const load = () => api.loadEvidence(dir, c2Dir, readSession, loadDeps);
  const options = {mode: 'Execute', authorization: api.AUTHORIZATION, output: path.join(root, 'sessions'),
    'b0-run': dir, 'c2-run': c2Dir, 'read-session': readSession, 'clasp-package': 'unused'};
  const deps = {loadEvidence: load, claspEntry: () => 'synthetic-entry'};
  return {root, dir, c2Dir, readSession, report, binding, evidence, local, loadDeps, load, options, deps};
}
function simulation(f, opts = {}) {
  let remote = opts.initial || f.evidence.backup;
  const pushes = [], reads = [], prompts = [];
  const io = {
    snapshot(label) {
      reads.push(label);
      if (opts.failRead === label) throw new Error('SIMULATED_READ_FAILURE');
      const files = opts.unknownAt === label ? [...remote, file('unknown.gs', '// concurrent')] : remote;
      return {files, lists: opts.listDrift === label ? {versions: [], deployments: []} : f.evidence.lists};
    },
    push(files, label) {
      pushes.push(label);
      if (opts.failRestore && label === 'restore-upload') throw new Error('SIMULATED_RESTORE_FAILURE');
      remote = opts.residuals && label === 'restore-upload' ? [...files, f.evidence.candidate.at(-1)] : files;
      if (opts.failAfterPush && label === 'candidate-upload') throw new Error('SIMULATED_PUSH_FAILURE');
    }
  };
  const ask = async prompt => {
    prompts.push(prompt);
    if (prompt.includes('Confirmer')) return opts.decline ? 'NON' :
      prompt.includes('reprise') ? 'RESTAURATION-C2-AUTORISEE' : 'B1-C2-AUTORISE-FERME';
    if (prompt.includes('AKS_runValidationSuiteV11')) {
      if (opts.eof) throw new Error('EOF');
      return opts.testAnswer || '761/761';
    }
    return opts.propertiesMissing ? 'NON' : 'PROPRIETES-CONFIRMEES';
  };
  return {io, ask, pushes, reads, prompts, remote: () => remote};
}
test('new authorization differs from historical B1 and C2-readonly tokens', () => {
  assert.equal(api.AUTHORIZATION, 'B1-C2-' + c2.PIN.package);
  assert.notEqual(api.AUTHORIZATION, b1.AUTHORIZATION); assert.notEqual(api.AUTHORIZATION, c2.AUTHORIZATION);
});
test('CLI defaults local and rejects old tokens, duplicate flags and unknown modes', () => {
  const args = ['--b0-run', 'a', '--c2-run', 'b', '--read-session', 'c', '--clasp-package', 'd'];
  assert.equal(api.parseArgs(args).mode, 'LocalCheck');
  for (const token of ['yes', b1.AUTHORIZATION, c2.AUTHORIZATION])
    assert.throws(() => api.parseArgs([...args, '--mode', 'Execute', '--output', 'out', '--authorization', token]), /AUTHORIZATION/);
  assert.throws(() => api.parseArgs([...args, '--mode', 'Push']), /MODE/);
  assert.throws(() => api.parseArgs([...args, '--b0-run', 'again']), /ARGUMENT/);
  assert.throws(() => api.parseArgs([...args, '--mode', 'Restore', '--authorization', api.AUTHORIZATION]), /SESSION/);
});
test('mutation without authorization fails before loading evidence', async () => {
  await assert.rejects(api.main({mode: 'Execute'}, {loadEvidence: () => assert.fail()}), /AUTHORIZATION/);
  await assert.rejects(api.main({mode: 'Restore', authorization: b1.AUTHORIZATION}, {loadEvidence: () => assert.fail()}), /AUTHORIZATION/);
});
test('both read-only archives and materialized snapshots are verified locally', t => {
  const f = fixture(t), e = f.load();
  assert.deepEqual(e.candidate, f.local.candidate); assert.equal(e.readSession, f.readSession);
  assert.equal(e.diff.filter(x => x.change === 'ADD').length, 1);
});
test('changed report pins, flags and status cannot authorize B1', t => {
  const f = fixture(t);
  for (const patch of [{candidate: b0.CANDIDATE}, {target: 'backend'}, {packageSha256: 'other'},
    {status: 'STOPPED'}, {remoteHeadExact: false}, {independentReadsExact: false}, {inventoriesUnchanged: false},
    {googleWriteAttempted: true}, {b1Authorized: true}, {propertiesOperatorConfirmed: true}]) {
    write(path.join(f.readSession, 'report.json'), {...f.report, ...patch});
    assert.throws(f.load, /READONLY_REPORT_MISMATCH/);
  }
});
test('read-only binding cannot point to a different evidence directory', t => {
  const f = fixture(t);
  write(path.join(f.readSession, 'binding.json'), {...f.binding, b0Run: f.c2Dir});
  assert.throws(f.load, /READONLY_BINDING_MISMATCH/);
});
test('corrupted first or second archive is refused', t => {
  const f = fixture(t);
  for (const label of ['read-one', 'read-two']) {
    const p = path.join(f.readSession, label + '-bundle.json'), saved = fs.readFileSync(p);
    fs.appendFileSync(p, ' '); assert.throws(f.load, /ARCHIVE_HASH_MISMATCH/); fs.writeFileSync(p, saved);
  }
});
test('nonempty saved HEAD diff is refused', t => {
  const f = fixture(t); write(path.join(f.readSession, 'read-two-head-diff.json'), [{change: 'MODIFY'}]);
  assert.throws(f.load, /READONLY_HEAD_DIFF_MISMATCH/);
});
test('ambiguous or altered materialized snapshots are refused', t => {
  const f = fixture(t), extra = path.join(f.readSession, 'read-one-extra'); fs.mkdirSync(extra);
  assert.throws(f.load, /READONLY_SNAPSHOT_AMBIGUOUS/); fs.rmdirSync(extra);
  fs.writeFileSync(path.join(f.readSession, 'read-two-synthetic', 'src', 'changed.gs'), '// tampered');
  assert.throws(f.load, /READONLY_SNAPSHOT_MISMATCH/);
});
test('metadata saved alongside each snapshot is checked', t => {
  const f = fixture(t); write(path.join(f.readSession, 'read-two-synthetic', 'lists.json'), {});
  assert.throws(f.load, /READONLY_SNAPSHOT_MISMATCH/);
});
test('LocalCheck makes no Google call, asks nothing and creates no B1 session', async t => {
  const f = fixture(t);
  const r = await api.main({...f.options, mode: 'LocalCheck'}, {...f.deps,
    ask: () => assert.fail(), native: () => assert.fail(), io: {snapshot: () => assert.fail()}});
  assert.equal(r.status, 'B1_C2_LOCAL_CHECK_ONLY');
  assert.equal(r.googleReadAttempted, false); assert.equal(r.googleWriteAttempted, false);
  assert.equal(r.propertiesOperatorConfirmed, false); assert.equal(r.b1Authorized, false);
  assert.equal(fs.existsSync(f.options.output), false);
});
test('declined preconditions stop before remote IO and session creation', async t => {
  const f = fixture(t), sim = simulation(f, {decline: true});
  await assert.rejects(api.main(f.options, {...f.deps, ...sim}), /OPERATOR_CONFIRMATION_REQUIRED/);
  assert.deepEqual(sim.reads, []); assert.deepEqual(sim.pushes, []); assert.equal(fs.existsSync(f.options.output), false);
});
test('all three proof directories are protected from session output', async t => {
  const f = fixture(t), sim = simulation(f);
  for (const output of [f.dir, path.join(f.c2Dir, 'new'), f.readSession])
    await assert.rejects(api.main({...f.options, output}, {...f.deps, ...sim}), /OUTPUT_INSIDE_EVIDENCE/);
  assert.deepEqual(sim.reads, []);
});
test('successful orchestration uses C2 candidate once then restores and journals', async t => {
  const f = fixture(t), sim = simulation(f);
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.status, 'RESTORED_TEST_PASS_PROPERTIES_REVIEW_REQUIRED');
  assert.equal(r.testPassed, true); assert.equal(r.restoredExact, true); assert.equal(r.propertiesOperatorConfirmed, true);
  assert.equal(r.googleWriteAttempted, true); assert.equal(r.candidate, api.PIN.candidate);
  assert.deepEqual(sim.pushes, ['candidate-upload', 'restore-upload']); assert.deepEqual(sim.remote(), f.evidence.backup);
  const saved = JSON.parse(fs.readFileSync(path.join(r.session, 'session.json')));
  assert.equal(saved.binding.package, api.PIN.package); assert.equal(saved.binding.readSession, f.readSession);
  api.checkRecovery(r.session, f.load());
  const resultFiles = fs.readdirSync(r.session).filter(n => n.startsWith('result-'));
  assert.equal(resultFiles.length, 1); assert.deepEqual(JSON.parse(fs.readFileSync(path.join(r.session, resultFiles[0]))), r);
});
test('test failure restores exactly but remains failed', async t => {
  const f = fixture(t), sim = simulation(f, {testAnswer: 'ECHEC'});
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.status, 'TEST_NOT_PASSED'); assert.equal(r.restoredExact, true); assert.equal(r.testPassed, false);
});
test('operator EOF during test still triggers restoration', async t => {
  const f = fixture(t), sim = simulation(f, {eof: true});
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.restoredExact, true); assert.equal(r.testPassed, false);
});
test('preflight HEAD or metadata drift refuses every push', async t => {
  const f = fixture(t);
  for (const opts of [{initial: f.evidence.candidate}, {listDrift: 'before-upload'}]) {
    const sim = simulation(f, opts), r = await api.main(f.options, {...f.deps, ...sim});
    assert.equal(r.googleWriteAttempted, false); assert.equal(r.testPassed, false); assert.deepEqual(sim.pushes, []);
  }
});
test('push failure after simulated write restores from durable intent', async t => {
  const f = fixture(t), sim = simulation(f, {failAfterPush: true});
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.restoredExact, true); assert.equal(r.testPassed, false);
  assert.deepEqual(sim.pushes, ['candidate-upload', 'restore-upload']);
});
test('candidate read failure skips test and restores', async t => {
  const f = fixture(t), sim = simulation(f, {failRead: 'candidate-readback'});
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.restoredExact, true); assert.equal(r.testPassed, false);
  assert.equal(sim.prompts.some(p => p.includes('AKS_runValidationSuiteV11')), false);
});
test('unknown concurrent change prevents automatic overwrite during restoration', async t => {
  const f = fixture(t), sim = simulation(f, {unknownAt: 'before-restore'});
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.restoredExact, false); assert.match(r.status, /UNKNOWN_REMOTE_CHANGE_STOP/);
  assert.deepEqual(sim.pushes, ['candidate-upload']);
});
test('retained residuals cannot report exact restoration', async t => {
  const f = fixture(t), sim = simulation(f, {residuals: true});
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.restoredExact, false); assert.match(r.status, /RESTORATION_INCOMPLETE/);
  assert.deepEqual(sim.pushes, ['candidate-upload', 'restore-upload']);
});
test('missing post-restoration confirmation is explicit', async t => {
  const f = fixture(t), sim = simulation(f, {propertiesMissing: true});
  const r = await api.main(f.options, {...f.deps, ...sim});
  assert.equal(r.restoredExact, true); assert.equal(r.propertiesOperatorConfirmed, false);
});
test('independent Restore reuses C2 session, restores and never invokes the suite', async t => {
  const f = fixture(t), failed = simulation(f, {failRestore: true});
  const first = await api.main(f.options, {...f.deps, ...failed});
  assert.equal(first.restoredExact, false);
  const recovery = simulation(f, {initial: f.evidence.candidate});
  const r = await api.main({...f.options, mode: 'Restore', session: first.session}, {...f.deps, ...recovery});
  assert.equal(r.restoredExact, true); assert.equal(r.testPassed, false);
  assert.equal(r.googleWriteAttempted, true); assert.deepEqual(recovery.pushes, ['restore-upload']);
  assert.equal(recovery.prompts.some(p => p.includes('AKS_runValidationSuiteV11')), false);
});
test('already restored recovery performs reads without any push', async t => {
  const f = fixture(t), sim = simulation(f), first = await api.main(f.options, {...f.deps, ...sim});
  const recovery = simulation(f);
  const r = await api.main({...f.options, mode: 'Restore', session: first.session}, {...f.deps, ...recovery});
  assert.equal(r.restoredExact, true); assert.equal(r.googleWriteAttempted, false); assert.deepEqual(recovery.pushes, []);
});
test('historical or altered recovery binding is refused before Google', async t => {
  const f = fixture(t), sim = simulation(f), first = await api.main(f.options, {...f.deps, ...sim});
  const p = path.join(first.session, 'session.json'), saved = JSON.parse(fs.readFileSync(p));
  saved.binding.candidate = b0.CANDIDATE; write(p, saved);
  const recovery = simulation(f);
  await assert.rejects(api.main({...f.options, mode: 'Restore', session: first.session}, {...f.deps, ...recovery}), /RECOVERY_SESSION_MISMATCH/);
  assert.deepEqual(recovery.reads, []);
});
