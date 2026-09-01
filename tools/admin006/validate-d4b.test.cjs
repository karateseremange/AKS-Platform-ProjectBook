'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const b0 = require('./prepare-d4b.cjs');
const api = require('./validate-d4b.cjs');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const file = (name, source) => ({name, bytes: Buffer.from(source)});
const manifest = file('appsscript.json', '{"timeZone":"Europe/Paris","runtimeVersion":"V8","dependencies":{},"exceptionLogging":"STACKDRIVER"}');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-b1-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const dir = path.join(root, 'b0-synthetic'); fs.mkdirSync(dir);
  const backup = [manifest, file('same.gs', 'same\r\n'), file('changed.gs', 'old\r\n')];
  const candidate = [manifest, file('same.js', 'same\r\n'), file('changed.gs', 'new\n'), file('added.gs', 'added')];
  const diff = b0.compare(b0.inventory(backup), b0.inventory(candidate));
  const lists = b0.validateLists([{versionNumber: 1}], [{deploymentId: 'synthetic', versionNumber: 1}]);
  const expected = {run: 'b0-synthetic', backup: b0.archive(path.join(dir, 'backup-bundle.json'), backup),
    packageArchive: b0.archive(path.join(dir, 'candidate-bundle.json'), candidate), package: b0.sourceDigest(candidate),
    manifest: hash(manifest.bytes), backupFiles: 3, packageFiles: 4, adds: 1, modifies: 1};
  const report = {revision: 'B0-r2', status: 'READ_ONLY_COLLECTED_REVIEW_REQUIRED', target: b0.TARGET,
    candidate: b0.CANDIDATE, sourceSha256: b0.SOURCE_SHA, googleReadExecuted: true, googleWriteExecuted: false,
    manifestUnchanged: true, independentReadExact: true, backupArchiveSha256: expected.backup,
    packageArchiveSha256: expected.packageArchive, packageSha256: expected.package, manifest: {sha256: expected.manifest},
    backupFiles: 3, packageFiles: 4, diffCounts: {ADD: 1, REMOVE: 0, MODIFY: 1}};
  const write = (name, value) => fs.writeFileSync(path.join(dir, name), JSON.stringify(value));
  write('report.json', report); write('diff.json', diff); write('restoration-residuals.json', diff.filter(d => d.change === 'ADD'));
  write('backup-deployments-versions.json', lists); write('independent-read-deployments-versions.json', lists);
  return {root, dir, backup, candidate, lists, expected, report, write, evidence: {dir, backup, candidate, lists, diff, expected}};
}
function simulation(f, opts = {}) {
  let remote = opts.initial || f.backup;
  const events = [], pushes = [], snapshots = [];
  const io = {
    snapshot(label) {
      snapshots.push(label);
      if (opts.failRead === label) throw new Error('READ_FAILED');
      const files = opts.readFiles?.(label, remote) || remote;
      return {files, lists: opts.changeLists === label ? {versions: [], deployments: []} : f.lists};
    },
    push(files, label) {
      pushes.push(label);
      if (opts.rejectBeforeWrite === label) throw new Error('PUSH_FAILED');
      remote = files;
      if (opts.residuals && label === 'restore-upload') remote = [...files, f.candidate.at(-1)];
      if (opts.failAfterWrite === label) throw new Error('PUSH_FAILED');
    }
  };
  return {io, events, pushes, snapshots, record: e => events.push(e), remote: () => remote};
}
test('fixed authorization binds to the reviewed package, no wildcard', () => {
  assert.equal(api.AUTHORIZATION, 'B1-c332f690f9544353fb6686ed121cbfb3728432fb2b7e86efe3e23080e6769ff9');
  assert.equal(api.EXPECTED.backupFiles, 261); assert.equal(api.EXPECTED.packageFiles, 277);
});
test('CLI defaults to LocalCheck; mutation needs exact authorization', () => {
  const args = ['--b0-run', 'a', '--repository', 'r', '--output', 'o', '--git', 'g', '--clasp-package', 'c'];
  assert.equal(api.parseArgs(args).mode, 'LocalCheck');
  assert.throws(() => api.parseArgs([...args, '--mode', 'Execute']), /AUTHORIZATION/);
  assert.throws(() => api.parseArgs([...args, '--mode', 'Execute', '--authorization', 'yes']), /AUTHORIZATION/);
  assert.equal(api.parseArgs([...args, '--mode', 'Execute', '--authorization', api.AUTHORIZATION]).mode, 'Execute');
  assert.throws(() => api.parseArgs([...args, '--run', 'anything']), /ARGUMENT/);
  assert.throws(() => api.parseArgs([...args, '--b0-run', 'b']), /ARGUMENT/);
  assert.throws(() => api.parseArgs([...args, '--mode', 'Restore', '--authorization', api.AUTHORIZATION]), /SESSION/);
});
test('main refuses missing authorization before any dependency or IO', async () => {
  await assert.rejects(api.main({mode: 'Execute'}, {loadEvidence: () => assert.fail('must not read')}), /AUTHORIZATION/);
});
test('complete B0 evidence is decoded and checked without remote access', t => {
  const f = fixture(t), e = api.loadEvidence(f.dir, f.expected);
  assert.equal(e.backup.length, 3); assert.equal(e.candidate.length, 4);
});
test('archive corruption, wrong target and file types are refused', t => {
  const f = fixture(t), p = path.join(f.dir, 'backup-bundle.json');
  fs.appendFileSync(p, ' '); assert.throws(() => api.archiveFiles(p, f.expected.backup), /HASH/);
  const data = JSON.parse(fs.readFileSync(p)); data.target = 'not-recipe';
  fs.writeFileSync(p, JSON.stringify(data)); assert.throws(() => api.archiveFiles(p, hash(fs.readFileSync(p))), /FORMAT/);
  data.target = b0.TARGET; data.files[1].type = 'HTML'; fs.writeFileSync(p, JSON.stringify(data));
  assert.throws(() => api.archiveFiles(p, hash(fs.readFileSync(p))), /TYPE/);
});
test('archive traversal/collisions and invalid UTF8 are refused', t => {
  const f = fixture(t), p = path.join(f.dir, 'backup-bundle.json'), original = JSON.parse(fs.readFileSync(p));
  for (const name of ['../escape.gs', '/root.gs', 'same.js']) {
    const data = structuredClone(original); data.files[2].name = name;
    fs.writeFileSync(p, JSON.stringify(data)); assert.throws(() => api.archiveFiles(p, hash(fs.readFileSync(p))));
  }
  const data = structuredClone(original), invalid = Buffer.from([255]);
  data.files[1].base64 = invalid.toString('base64'); data.files[1].sha256 = hash(invalid);
  fs.writeFileSync(p, JSON.stringify(data)); assert.throws(() => api.archiveFiles(p, hash(fs.readFileSync(p))), /CONTENT/);
});
test('wrong run, report and diff cannot reuse an authorization', t => {
  const f = fixture(t);
  assert.throws(() => api.loadEvidence(f.dir, {...f.expected, run: 'other'}), /RUN/);
  f.write('report.json', {...f.report, googleWriteExecuted: true}); assert.throws(() => api.loadEvidence(f.dir, f.expected), /REPORT/);
  f.write('report.json', f.report); f.write('diff.json', []); assert.throws(() => api.loadEvidence(f.dir, f.expected), /DIFF/);
});
test('residual list and independently collected inventories must match', t => {
  const f = fixture(t); f.write('restoration-residuals.json', []);
  assert.throws(() => api.loadEvidence(f.dir, f.expected), /RESIDUAL/);
  f.write('restoration-residuals.json', f.evidence.diff.filter(d => d.change === 'ADD'));
  f.write('independent-read-deployments-versions.json', {versions: [], deployments: []});
  assert.throws(() => api.loadEvidence(f.dir, f.expected), /LISTS/);
});
test('known partial state can be restored, foreign content cannot', t => {
  const f = fixture(t);
  api.knownState(f.backup, f.evidence); api.knownState(f.candidate, f.evidence);
  api.knownState([manifest, f.candidate.at(-1)], f.evidence);
  assert.throws(() => api.knownState([...f.candidate, file('foreign.gs', 'x')], f.evidence), /UNKNOWN/);
  assert.throws(() => api.knownState([manifest, file('changed.gs', 'concurrent')], f.evidence), /UNKNOWN/);
  assert.throws(() => api.knownState([file('added.gs', 'added')], f.evidence), /MANIFEST/);
});
test('successful candidate is tested once then restored exactly', async t => {
  const f = fixture(t), s = simulation(f); let asks = 0;
  const r = await api.execute(f.evidence, s.io, s.record, async () => { asks++; return '761/761'; });
  assert.equal(asks, 1); assert.equal(r.testPassed, true); assert.equal(r.restoredExact, true);
  assert.deepEqual(s.pushes, ['candidate-upload', 'restore-upload']);
  assert.deepEqual(s.events, ['CANDIDATE_PUSH_INTENT', 'CANDIDATE_EXACT', 'TEST_PASS_OPERATOR_REPORTED', 'RESTORE_PUSH_INTENT', 'RESTORED_EXACT']);
  assert.deepEqual(s.remote(), f.backup);
});
for (const reason of ['ECHEC', 'ABANDON', '760/761', '761/761 ']) {
  test('non-exact test success '+reason+' still restores', async t => {
    const f = fixture(t), s = simulation(f), r = await api.execute(f.evidence, s.io, s.record, async () => reason);
    assert.equal(r.testPassed, false); assert.equal(r.restoredExact, true); assert.equal(r.status, 'TEST_NOT_PASSED');
  });
}
test('operator EOF/exception restores and cannot report test success', async t => {
  const f = fixture(t), s = simulation(f), r = await api.execute(f.evidence, s.io, s.record, async () => { throw new Error('EOF'); });
  assert.equal(r.restoredExact, true); assert.equal(r.testPassed, false);
});
test('preflight HEAD drift refuses candidate and restoration writes', async t => {
  const f = fixture(t), s = simulation(f, {initial: f.candidate});
  const r = await api.execute(f.evidence, s.io, s.record, async () => assert.fail());
  assert.equal(r.status, 'HEAD_CHANGED_SINCE_B0'); assert.deepEqual(s.pushes, []);
});
test('preflight inventory drift refuses all writes', async t => {
  const f = fixture(t), s = simulation(f, {changeLists: 'before-upload'});
  const r = await api.execute(f.evidence, s.io, s.record, async () => assert.fail());
  assert.equal(r.status, 'DEPLOYMENTS_OR_VERSIONS_CHANGED'); assert.deepEqual(s.pushes, []);
});
test('push failure before remote write still verifies recovery', async t => {
  const f = fixture(t), s = simulation(f, {rejectBeforeWrite: 'candidate-upload'});
  const r = await api.execute(f.evidence, s.io, s.record, async () => assert.fail());
  assert.equal(r.restoredExact, true); assert.deepEqual(s.pushes, ['candidate-upload']);
});
test('push failure after remote write restores from durable intent', async t => {
  const f = fixture(t), s = simulation(f, {failAfterWrite: 'candidate-upload'});
  const r = await api.execute(f.evidence, s.io, s.record, async () => assert.fail());
  assert.equal(r.restoredExact, true); assert.deepEqual(s.pushes, ['candidate-upload', 'restore-upload']);
});
test('failed candidate readback skips test and restores', async t => {
  const f = fixture(t), s = simulation(f, {failRead: 'candidate-readback'});
  const r = await api.execute(f.evidence, s.io, s.record, async () => assert.fail());
  assert.equal(r.restoredExact, true); assert.equal(r.testPassed, false);
});
test('candidate mismatch skips tests and restores only known contents', async t => {
  const f = fixture(t), s = simulation(f, {readFiles: (label, remote) => label === 'candidate-readback' ? f.backup : remote});
  const r = await api.execute(f.evidence, s.io, s.record, async () => assert.fail());
  assert.equal(r.status, 'CANDIDATE_READBACK_MISMATCH'); assert.equal(r.restoredExact, true);
});
test('concurrent edit blocks restoration instead of overwriting it', async t => {
  const f = fixture(t), s = simulation(f, {readFiles: (label, remote) => label === 'before-restore' ? [...remote, file('foreign.gs', 'x')] : remote});
  const r = await api.execute(f.evidence, s.io, s.record, async () => '761/761');
  assert.match(r.status, /RESTORE_REQUIRED_UNKNOWN/); assert.equal(r.restoredExact, false);
  assert.deepEqual(s.pushes, ['candidate-upload']);
});
test('manifest persistence is an explicit stop, never silently rewritten', async t => {
  const f = fixture(t), changed = file('appsscript.json', manifest.bytes.toString()+' ');
  const s = simulation(f, {readFiles: (label, remote) => label === 'before-restore' ? [changed, ...remote.slice(1)] : remote});
  const r = await api.execute(f.evidence, s.io, s.record, async () => '761/761');
  assert.match(r.status, /RESTORE_REQUIRED_UNKNOWN/); assert.deepEqual(s.pushes, ['candidate-upload']);
});
test('inventory drift during recovery blocks overwrite', async t => {
  const f = fixture(t), s = simulation(f, {changeLists: 'before-restore'});
  const r = await api.execute(f.evidence, s.io, s.record, async () => '761/761');
  assert.match(r.status, /RESTORE_REQUIRED_DEPLOYMENTS/); assert.deepEqual(s.pushes, ['candidate-upload']);
});
test('retained residuals fail restoration, no repeated automatic push', async t => {
  const f = fixture(t), s = simulation(f, {residuals: true});
  const r = await api.execute(f.evidence, s.io, s.record, async () => '761/761');
  assert.match(r.status, /RESTORE_REQUIRED_RESTORATION_INCOMPLETE/); assert.equal(s.pushes.length, 2);
});
test('failed restoration is not hidden by successful tests', async t => {
  const f = fixture(t), s = simulation(f, {rejectBeforeWrite: 'restore-upload'});
  const r = await api.execute(f.evidence, s.io, s.record, async () => '761/761');
  assert.equal(r.testPassed, true); assert.equal(r.restoredExact, false); assert.match(r.status, /^RESTORE_REQUIRED/);
});
test('independent Restore works without invoking any test', async t => {
  const f = fixture(t), s = simulation(f, {initial: f.candidate});
  await api.restore(f.evidence, s.io, s.record);
  assert.deepEqual(s.pushes, ['restore-upload']); assert.equal(s.events.at(-1), 'RESTORED_EXACT');
});
test('already restored state is read twice and never pushed again', async t => {
  const f = fixture(t), s = simulation(f);
  await api.restore(f.evidence, s.io, s.record); assert.deepEqual(s.pushes, []); assert.equal(s.snapshots.length, 2);
});
function packageFixture(f) {
  const pkg = path.join(f.root, 'clasp'); fs.mkdirSync(pkg);
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({name: '@google/clasp', version: '3.3.0', bin: 'index.js'}));
  fs.writeFileSync(path.join(pkg, 'index.js'), '// never executed'); return pkg;
}
test('unreviewed clasp version is refused', t => {
  const f = fixture(t), pkg = packageFixture(f); assert.ok(api.claspEntry(pkg).endsWith('index.js'));
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({name: '@google/clasp', version: '3.4.1', bin: 'index.js'}));
  assert.throws(() => api.claspEntry(pkg), /330/);
});
test('LocalCheck makes no clasp call and creates no session', async t => {
  const f = fixture(t), pkg = packageFixture(f), repo = path.join(f.root, 'repo'); fs.mkdirSync(repo);
  fs.writeFileSync(path.join(repo, '.clasp.json'), JSON.stringify({scriptId: b0.TARGET, rootDir: 'src'}));
  const out = path.join(f.root, 'output');
  const result = await api.main({mode: 'LocalCheck', 'b0-run': f.dir, 'clasp-package': pkg, repository: repo, output: out, git: 'git'}, {
    loadEvidence: () => f.evidence, gitSource: () => f.candidate, native: () => assert.fail('no clasp calls'), ask: () => assert.fail('no prompts')});
  assert.equal(result.status, 'B1_LOCAL_CHECK_ONLY'); assert.equal(fs.existsSync(out), false);
});
test('transport uses only fixed target, exact four operations and force without shell', t => {
  const f = fixture(t), session = path.join(f.root, 'session'); fs.mkdirSync(session); const calls = [];
  const io = api.makeTransport('fake-entry', session, (exe, args, cwd) => {
    calls.push(args); assert.equal(exe, process.execPath);
    assert.equal(JSON.parse(fs.readFileSync(path.join(cwd, '.clasp.json'))).scriptId, b0.TARGET);
    if (args[2] === 'list-versions') return Buffer.from(JSON.stringify(f.lists.versions));
    if (args[2] === 'list-deployments') return Buffer.from(JSON.stringify(f.lists.deployments));
    if (args[2] === 'pull') {
      for (const file of f.backup) fs.writeFileSync(path.join(cwd, 'src', file.name), file.bytes);
      return Buffer.from(JSON.stringify({pulledFiles: f.backup.map(f => f.name), deletedFiles: []}));
    }
    assert.deepEqual(args, ['fake-entry', '--json', 'push', '--force']);
    return Buffer.from(JSON.stringify(f.candidate.map(f => f.name)));
  });
  assert.equal(io.snapshot('synthetic-read').files.length, 3); io.push(f.candidate, 'synthetic-upload');
  assert.equal(calls.length, 6); assert.equal(calls.some(a => ['run', 'deploy', 'version'].includes(a[2])), false);
});
test('transport detects empty-file omission in pull response', t => {
  const f = fixture(t), session = path.join(f.root, 'session'); fs.mkdirSync(session);
  const io = api.makeTransport('fake', session, (exe, args) => Buffer.from(args[2] === 'pull' ? '{"pulledFiles":["empty.gs"],"deletedFiles":[]}' : '[]'));
  assert.throws(() => io.snapshot('read'), /PULL_INCOMPLETE/);
});
test('push exit success is insufficient when clasp returns incomplete inventory', t => {
  const f = fixture(t), session = path.join(f.root, 'session'); fs.mkdirSync(session);
  const io = api.makeTransport('fake', session, () => Buffer.from('[]'));
  assert.throws(() => io.push(f.candidate, 'push'), /PUSH_RESULT_INCOMPLETE/);
});
test('readline EOF aborts its pending question so finally can run', async () => {
  const {EventEmitter} = require('node:events');
  const rl = new EventEmitter();
  rl.question = (text, {signal}) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('EOF'))));
  const pending = api.operatorPrompt(rl, 'synthetic'); rl.emit('close');
  await assert.rejects(pending, /EOF/); assert.equal(rl.listenerCount('close'), 0);
});
async function mainFixture(t, answer) {
  const f = fixture(t), pkg = packageFixture(f), repo = path.join(f.root, 'repo'); fs.mkdirSync(repo);
  fs.writeFileSync(path.join(repo, '.clasp.json'), JSON.stringify({scriptId: b0.TARGET, rootDir: 'src'}));
  const s = simulation(f), answers = ['B1-AUTORISE-FERME', '761/761', answer];
  const options = {mode: 'Execute', 'b0-run': f.dir, 'clasp-package': pkg, repository: repo,
    output: path.join(f.root, 'sessions'), git: 'git', authorization: api.AUTHORIZATION};
  const deps = {loadEvidence: () => f.evidence, gitSource: () => f.candidate, io: s.io,
    native: () => assert.fail('synthetic transport only'), ask: async () => answers.shift()};
  const result = await api.main(options, deps);
  return {f, s, options, deps, result};
}
test('full orchestration journals intent and requires post-restore operator evidence', async t => {
  const {result} = await mainFixture(t, 'PROPRIETES-CONFIRMEES');
  assert.equal(result.restoredExact, true); assert.equal(result.propertiesOperatorConfirmed, true);
  const saved = JSON.parse(fs.readFileSync(path.join(result.session, 'session.json')));
  assert.equal(saved.target, b0.TARGET);
  const events = fs.readdirSync(result.session).filter(n => n.startsWith('event-')).map(n => JSON.parse(fs.readFileSync(path.join(result.session, n))).event);
  assert.ok(events.includes('CANDIDATE_PUSH_INTENT')); assert.ok(events.includes('RESTORED_EXACT'));
});
test('missing property confirmation never masquerades as verified properties', async t => {
  const {result} = await mainFixture(t, '');
  assert.equal(result.restoredExact, true); assert.equal(result.propertiesOperatorConfirmed, false);
});
test('Restore reloads its original durable session without Git or another test', async t => {
  const {f, options, result} = await mainFixture(t, 'PROPRIETES-CONFIRMEES');
  const s = simulation(f, {initial: f.candidate}), answers = ['RESTAURATION-AUTORISEE', 'PROPRIETES-CONFIRMEES'];
  const recovered = await api.main({...options, mode: 'Restore', repository: undefined, git: undefined, session: result.session}, {
    loadEvidence: () => f.evidence, io: s.io, ask: async () => answers.shift(), gitSource: () => assert.fail('no git in recovery')});
  assert.equal(recovered.restoredExact, true); assert.equal(recovered.testPassed, false);
  assert.deepEqual(s.pushes, ['restore-upload']);
});
test('Restore refuses altered session binding before any remote IO', async t => {
  const {f, options, result} = await mainFixture(t, 'PROPRIETES-CONFIRMEES');
  const p = path.join(result.session, 'session.json'), session = JSON.parse(fs.readFileSync(p));
  session.package = 'wrong'; fs.writeFileSync(p, JSON.stringify(session));
  await assert.rejects(api.main({...options, mode: 'Restore', session: result.session}, {
    loadEvidence: () => f.evidence, ask: async () => 'RESTAURATION-AUTORISEE',
    io: {snapshot: () => assert.fail('no remote IO')}}), /RECOVERY_SESSION_MISMATCH/);
});
test('declined operator confirmation performs no remote operation', async t => {
  const f = fixture(t), pkg = packageFixture(f), repo = path.join(f.root, 'repo'); fs.mkdirSync(repo);
  fs.writeFileSync(path.join(repo, '.clasp.json'), JSON.stringify({scriptId: b0.TARGET, rootDir: 'src'}));
  await assert.rejects(api.main({mode: 'Execute', 'b0-run': f.dir, 'clasp-package': pkg, repository: repo,
    output: path.join(f.root, 'out'), git: 'git', authorization: api.AUTHORIZATION}, {
    loadEvidence: () => f.evidence, gitSource: () => f.candidate, ask: async () => 'NON',
    io: {snapshot: () => assert.fail('no remote IO')}}), /OPERATOR_CONFIRMATION/);
});
