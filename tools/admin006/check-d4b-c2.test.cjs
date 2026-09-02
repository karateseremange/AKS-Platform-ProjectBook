'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const c2 = require('./check-d4b-c2.cjs');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const file = (name, value) => ({name, bytes: Buffer.from(value)});
const write = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-c2-readonly-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const dir = path.join(root, 'campaign'), oldDir = path.join(root, 'b0');
  fs.mkdirSync(dir); fs.mkdirSync(oldDir);
  const manifest = JSON.stringify({timeZone: 'Europe/Paris', dependencies: {}, exceptionLogging: 'STACKDRIVER', runtimeVersion: 'V8'});
  const backup = [file('appsscript.json', manifest), ...Array.from({length: 260}, (_, i) => file('base/f' + i + '.gs', 'var f' + i + '=0;\n'))];
  const previous = backup.map((f, i) => i > 0 && i <= 188 ? file(f.name, f.bytes.toString() + '// old candidate\n') : f);
  previous.push(file(c2.PIN.testFile + '.gs', '// previous fixture\n'));
  for (let i = 0; i < 15; i++) previous.push(file('added/f' + i + '.gs', '// new file\n'));
  const candidate = previous.map(f => f.name === c2.PIN.testFile + '.gs' ? file(f.name, '// corrected fixture\n') : f);
  const pin = {...c2.PIN, campaign: 'campaign', package: b0.sourceDigest(candidate),
    archive: b0.archive(path.join(dir, 'candidate-bundle.json'), candidate),
    testSha: hash(candidate.find(f => f.name === c2.PIN.testFile + '.gs').bytes)};
  const diff = b0.compare(b0.inventory(backup), b0.inventory(candidate));
  const delta = b0.compare(b0.inventory(previous), b0.inventory(candidate));
  const report = {revision: 'C2-local-r1', status: 'LOCAL_REBUILT_REMOTE_REVIEW_REQUIRED',
    target: b0.TARGET, candidate: pin.candidate, sourceSha256: pin.source,
    sourceFiles: 277, packageFiles: 277, backupFiles: 261,
    packageSha256: pin.package, packageArchiveSha256: pin.archive,
    backupArchiveSha256: b1.EXPECTED.backup, manifestSha256: b1.EXPECTED.manifest,
    manifestUnchanged: true, googleReadExecuted: false, googleWriteAttempted: false, b1Authorized: false};
  write(path.join(dir, 'report.json'), report);
  write(path.join(dir, 'diff.json'), diff);
  write(path.join(dir, 'delta-previous-candidate.json'), delta);
  write(path.join(dir, 'restoration-residuals.json'), diff.filter(d => d.change === 'ADD'));
  const evidence = {dir: oldDir, backup, candidate: previous, lists: b0.validateLists([], [])};
  const local = {dir, candidate, evidence};
  const load = () => c2.loadLocal(oldDir, dir, pin, () => evidence);
  const snapshot = () => ({files: backup, lists: evidence.lists});
  const options = {mode: 'ReadOnly', authorization: c2.AUTHORIZATION,
    output: path.join(root, 'output'), 'b0-run': oldDir, 'c2-run': dir, 'clasp-package': 'unused'};
  const deps = {loadLocal: () => local, claspEntry: () => '/synthetic/clasp.js', io: {snapshot}};
  return {root, dir, pin, report, evidence, local, load, snapshot, options, deps};
}
const args = ['--b0-run', 'b0', '--c2-run', 'c2', '--clasp-package', 'clasp'];
test('default mode is LocalCheck; ReadOnly requires the exact separate token', () => {
  assert.equal(c2.parseArgs(args).mode, 'LocalCheck');
  assert.throws(() => c2.parseArgs([...args, '--mode', 'ReadOnly', '--output', 'out']), /AUTHORIZATION/);
  assert.throws(() => c2.parseArgs([...args, '--mode', 'ReadOnly', '--output', 'out', '--authorization', b1.AUTHORIZATION]), /AUTHORIZATION/);
  assert.equal(c2.parseArgs([...args, '--mode', 'ReadOnly', '--output', 'out', '--authorization', c2.AUTHORIZATION]).mode, 'ReadOnly');
});
test('unknown, repeated, incomplete arguments and write modes are rejected', () => {
  for (const tail of [['--push', 'true'], ['--mode', 'Execute'], ['--mode', 'Restore'], ['--mode'], ['--b0-run', 'other']])
    assert.throws(() => c2.parseArgs([...args, ...tail]));
});
test('native guard permits only the three exact read commands', () => {
  const calls = [], run = c2.readOnlyNative('entry', (...a) => calls.push(a));
  for (const op of ['pull', 'list-versions', 'list-deployments']) run(process.execPath, ['entry', '--json', op], 'cwd');
  assert.equal(calls.length, 3);
});
test('native guard refuses every write, extra argument and alternate executable', () => {
  let count = 0;
  const run = c2.readOnlyNative('entry', () => { count++; });
  for (const op of ['push', 'run', 'deploy', 'version', 'login', 'unknown'])
    assert.throws(() => run(process.execPath, ['entry', '--json', op], 'cwd'), /REFUSED/);
  for (const a of [['entry', '--json', 'pull', '--force'], ['other', '--json', 'pull'], ['entry', 'pull', '--json']])
    assert.throws(() => run(process.execPath, a, 'cwd'), /REFUSED/);
  assert.throws(() => run('other-node', ['entry', '--json', 'pull'], 'cwd'), /REFUSED/);
  assert.equal(count, 0);
});
test('local evidence accepts exact 277/261 fixture and sole test delta', t => {
  const f = fixture(t); assert.equal(f.load().candidate.length, 277);
});
test('changed campaign identity is refused', t => {
  const f = fixture(t);
  assert.throws(() => c2.loadLocal(f.evidence.dir, f.dir, {...f.pin, campaign: 'other'}, () => f.evidence), /WRONG_C2_CAMPAIGN/);
});
test('report pins and false authorization flags are mandatory', t => {
  const f = fixture(t);
  for (const patch of [{target: 'other'}, {candidate: 'other'}, {packageSha256: 'other'}, {manifestUnchanged: false},
    {googleReadExecuted: true}, {googleWriteAttempted: true}, {b1Authorized: true}, {packageFiles: 276}]) {
    write(path.join(f.dir, 'report.json'), {...f.report, ...patch});
    assert.throws(f.load, /C2_REPORT_MISMATCH/);
  }
});
test('tampered archive is refused', t => {
  const f = fixture(t); fs.appendFileSync(path.join(f.dir, 'candidate-bundle.json'), ' ');
  assert.throws(f.load, /ARCHIVE_HASH_MISMATCH/);
});
test('saved diff, delta and residual evidence are independently checked', t => {
  const f = fixture(t);
  for (const name of ['diff.json', 'delta-previous-candidate.json', 'restoration-residuals.json']) {
    const p = path.join(f.dir, name), bytes = fs.readFileSync(p);
    write(p, []); assert.throws(f.load, /C2_DIFF_MISMATCH/); fs.writeFileSync(p, bytes);
  }
});
test('changed manifest or previous functional content is refused', t => {
  const f = fixture(t);
  const saved = f.evidence.backup[0];
  f.evidence.backup[0] = file('appsscript.json', '{}');
  assert.throws(f.load, /MANIFEST_MISMATCH/);
  f.evidence.backup[0] = saved;
  f.evidence.candidate[1] = file(f.evidence.candidate[1].name, '// unexpected old package\n');
  assert.throws(f.load, /C2_DELTA_MISMATCH/);
});
test('two matching snapshots pass and are both recorded', t => {
  const f = fixture(t), labels = [];
  const r = c2.collect(f.local, {snapshot: f.snapshot}, label => labels.push(label));
  assert.deepEqual(labels, ['read-one', 'read-two']); assert.equal(r.remoteHeadExact, true);
});
test('first HEAD drift is recorded and stops before a second read', t => {
  const f = fixture(t); let calls = 0, records = 0;
  assert.throws(() => c2.collect(f.local, {snapshot: () => {
    calls++; return {...f.snapshot(), files: f.evidence.backup.slice(1)};
  }}, () => records++), /HEAD_CHANGED_SINCE_BACKUP/);
  assert.equal(calls, 1); assert.equal(records, 1);
});
test('second HEAD drift or metadata drift cannot pass', t => {
  const f = fixture(t); let calls = 0;
  assert.throws(() => c2.collect(f.local, {snapshot: () => ++calls === 1 ? f.snapshot() :
    {...f.snapshot(), files: f.evidence.backup.slice(1)}}, () => {}), /HEAD_CHANGED/);
  assert.throws(() => c2.assertSnapshot({...f.snapshot(), lists: {changed: true}}, f.evidence), /VERSIONS_OR_DEPLOYMENTS_CHANGED/);
});
test('LocalCheck neither calls Google nor creates output', t => {
  const f = fixture(t);
  f.deps.io.snapshot = () => { throw new Error('must not call'); };
  const r = c2.main({...f.options, mode: 'LocalCheck'}, f.deps);
  assert.equal(r.status, 'C2_READONLY_LOCAL_CHECK_ONLY');
  assert.equal(r.googleReadAttempted, false); assert.equal(r.googleWriteAttempted, false);
  assert.equal(r.b1Authorized, false); assert.equal(fs.existsSync(f.options.output), false);
});
test('missing ReadOnly authorization stops before evidence loading', () => {
  let calls = 0;
  assert.throws(() => c2.main({mode: 'ReadOnly', output: 'out'}, {loadLocal: () => calls++}), /AUTHORIZATION/);
  assert.equal(calls, 0);
});
test('successful reads preserve reports, snapshots and pending property review', t => {
  const f = fixture(t), original = fs.readFileSync(path.join(f.dir, 'report.json'));
  const r = c2.main(f.options, f.deps);
  assert.equal(r.status, 'READ_ONLY_COLLECTED_PROPERTIES_REVIEW_REQUIRED');
  assert.equal(r.propertiesOperatorConfirmed, false); assert.equal(r.b1Authorized, false);
  assert.equal(r.googleWriteAttempted, false); assert.equal(r.googleReadAttempted, true);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(r.session, 'report.json'))), r);
  assert.ok(fs.existsSync(path.join(r.session, 'read-two-bundle.json')));
  assert.ok(original.equals(fs.readFileSync(path.join(f.dir, 'report.json'))));
  const again = c2.main(f.options, f.deps); assert.notEqual(again.session, r.session);
});
test('failure preserves first snapshot and a STOPPED report without restoration', t => {
  const f = fixture(t);
  f.deps.io.snapshot = () => ({...f.snapshot(), files: f.evidence.backup.slice(1)});
  const r = c2.main(f.options, f.deps);
  assert.equal(r.status, 'STOPPED'); assert.equal(r.failure, 'HEAD_CHANGED_SINCE_BACKUP');
  assert.equal(r.googleWriteAttempted, false);
  assert.ok(fs.existsSync(path.join(r.session, 'read-one-bundle.json')));
  assert.equal(fs.existsSync(path.join(r.session, 'read-two-bundle.json')), false);
});
test('native failures are sanitized in the retained report', t => {
  const f = fixture(t); f.deps.io.snapshot = () => { throw new Error('sensitive remote output'); };
  const r = c2.main(f.options, f.deps);
  assert.equal(r.status, 'STOPPED'); assert.equal(r.failure, 'READONLY_CHECK_FAILED');
  assert.equal(JSON.stringify(r).includes('sensitive'), false);
});
test('output inside either evidence directory is refused', t => {
  const f = fixture(t);
  for (const output of [f.dir, path.join(f.dir, 'new'), f.evidence.dir])
    assert.throws(() => c2.main({...f.options, output}, f.deps), /OUTPUT_INSIDE_EVIDENCE/);
});
test('real transport with fake native uses ten reads and blocks inherited push', t => {
  const f = fixture(t), session = path.join(f.root, 'transport'); fs.mkdirSync(session);
  const calls = [];
  const native = (command, argv, cwd) => {
    const op = argv[2]; calls.push(op);
    const config = JSON.parse(fs.readFileSync(path.join(cwd, '.clasp.json')));
    assert.equal(config.scriptId, b0.TARGET);
    if (op !== 'pull') return Buffer.from('[]');
    for (const item of f.evidence.backup) {
      const dest = path.join(cwd, 'src', item.name);
      fs.mkdirSync(path.dirname(dest), {recursive: true}); fs.writeFileSync(dest, item.bytes);
    }
    return Buffer.from(JSON.stringify({pulledFiles: f.evidence.backup.map(x => x.name), deletedFiles: []}));
  };
  const io = b1.makeTransport('entry', session, c2.readOnlyNative('entry', native));
  c2.collect(f.local, io, () => {});
  assert.deepEqual(calls, Array(2).fill(['list-versions', 'list-deployments', 'pull', 'list-versions', 'list-deployments']).flat());
  assert.throws(() => io.push(f.evidence.backup, 'forbidden'), /GOOGLE_WRITE_OR_UNKNOWN_OPERATION_REFUSED/);
  assert.equal(calls.length, 10);
});
