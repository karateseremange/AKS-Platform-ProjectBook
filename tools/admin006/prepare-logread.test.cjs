'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const tool = require('./prepare-logread.cjs');
const b0 = require('./prepare-d4b.cjs');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const save = (p, x) => fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const file = (name, text) => ({name, bytes: Buffer.from(text)});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-logread-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const repository = path.join(root, 'repo'), session = path.join(root, 'c1-test');
  fs.mkdirSync(repository); fs.mkdirSync(session);
  const manifest = file('appsscript.json', JSON.stringify({timeZone: 'Europe/Paris', dependencies: {},
    exceptionLogging: 'STACKDRIVER', runtimeVersion: 'V8', webapp: {executeAs: 'USER_ACCESSING', access: 'ANYONE'}}));
  const backup = [manifest, file('main.gs', 'before')];
  const previous = [manifest, file('main.gs', 'previous')];
  const source = [manifest, file('main.gs', 'candidate'), file('new.gs', 'added')];
  const lists = b0.validateLists([{versionNumber: 8}], [{deploymentId: 'example', versionNumber: 8}]);
  const bundle = {format: 'AKS-D4C-READONLY-SNAPSHOT/1', role: 'portal', target: b0.TARGET,
    files: backup.map(f => ({name: f.name, sha256: hash(f.bytes), base64: f.bytes.toString('base64')}))};
  const dirs = [1, 2].map(n => {
    const dir = path.join(session, 'portal-read-' + n + '-fixture'); fs.mkdirSync(dir);
    b0.materialize(path.join(dir, 'src'), backup);
    save(path.join(dir, 'snapshot-bundle.json'), bundle);
    save(path.join(dir, 'inventory.json'), b0.inventory(backup));
    save(path.join(dir, 'lists-before.json'), lists); save(path.join(dir, 'lists-after.json'), lists);
    return dir;
  });
  const pin = {...tool.PIN, session: 'c1-test', source: b0.sourceDigest(source),
    previousSource: b0.sourceDigest(previous), previousPackage: b0.sourceDigest(previous),
    archive: hash(fs.readFileSync(path.join(dirs[0], 'snapshot-bundle.json'))),
    backupSource: b0.sourceDigest(backup), manifest: hash(manifest.bytes), lists: hash(JSON.stringify(lists)),
    sourceFiles: 3, previousFiles: 2, backupFiles: 2, additions: ['new'], modifications: ['main']};
  const report = {revision: 'D4C-readonly-r1', generatedAt: pin.generatedAt,
    status: 'D4C_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED', googleReadAttempted: true,
    googleWriteAttempted: false, independentReadsExact: true, inventoriesUnchanged: true,
    portalHistoricalRestorationExact: true, d4cExecutionAuthorized: false, session,
    reads: [1, 2].map(ordinal => ({role: 'portal', ordinal, target: b0.TARGET,
      archiveSha256: pin.archive, sourceSha256: pin.backupSource, manifestSha256: pin.manifest,
      fileCount: 2, inventoriesSha256: pin.lists, inventoriesUnchangedDuringRead: true,
      versionsCount: 1, deploymentsCount: 1}))};
  save(path.join(session, 'report.json'), report);
  const options = {repository, 'c1-session': session, output: path.join(root, 'out'), git: 'git'};
  const deps = {readSource: (repo, git, sha) => sha === pin.candidate ? source : previous};
  return {root, repository, session, dirs, pin, report, options, deps, source, previous, backup};
}
test('CLI accepts only four local arguments; no mode, authorization or target override', () => {
  assert.deepEqual(tool.parseArgs(['--repository', 'r', '--c1-session', 's', '--output', 'o', '--git', 'g']),
    {repository: 'r', 'c1-session': 's', output: 'o', git: 'g'});
  for (const args of [[], ['--mode', 'ReadOnly'], ['--authorization', 'yes'], ['--repository', 'r', '--repository', 'x']])
    assert.throws(() => tool.parseArgs(args));
});
test('direct invocation also refuses unauthorized options before IO', () => {
  assert.throws(() => tool.main({mode: 'ReadOnly'}), /INVALID_ARGUMENTS/);
});
test('Git extraction reads pinned objects rather than worktree CRLF bytes', () => {
  const content = Buffer.from('line\n'), files = [file('main.gs', 'line\n')], calls = [];
  const commit = 'a'.repeat(40), blob = 'b'.repeat(40);
  const run = (command, args) => {
    calls.push(args[2]);
    if (args[2] === 'rev-parse') return Buffer.from(commit + '\n');
    if (args[2] === 'ls-tree') return Buffer.from('100644 blob ' + blob + '\tsrc/main.gs\0');
    assert.equal(args[2], 'cat-file'); assert.equal(args[3], 'blob'); return content;
  };
  assert.equal(b0.sourceDigest(tool.readSource('repo', 'git', commit, b0.sourceDigest(files), 1, run)), b0.sourceDigest(files));
  assert.deepEqual(calls, ['rev-parse', 'ls-tree', 'cat-file']);
});
test('Git wrong source hash and symlink entries fail closed', () => {
  const commit = 'a'.repeat(40);
  const run = (c, a) => a[2] === 'rev-parse' ? Buffer.from(commit) :
    a[2] === 'ls-tree' ? Buffer.from('120000 blob ' + 'b'.repeat(40) + '\tsrc/file.gs\0') : Buffer.from('x');
  assert.throws(() => tool.readSource('r', 'git', commit, 'bad', 1, run), /UNEXPECTED_GIT_ENTRY/);
  assert.throws(() => tool.readSource('r', 'git', commit, 'bad', 0,
    (c, a) => Buffer.from(a[2] === 'rev-parse' ? commit : '')), /SOURCE_MISMATCH/);
});
test('both historical snapshots and report are verified without mutations', t => {
  const f = fixture(t), before = fs.readFileSync(path.join(f.session, 'report.json'));
  const loaded = tool.loadHistorical(f.session, f.pin);
  assert.equal(loaded.files.length, 2);
  assert.equal(loaded.reportSha256, hash(before));
  assert.deepEqual(fs.readFileSync(path.join(f.session, 'report.json')), before);
});
test('tampered archive is refused', t => {
  const f = fixture(t); fs.appendFileSync(path.join(f.dirs[1], 'snapshot-bundle.json'), ' ');
  assert.throws(() => tool.loadHistorical(f.session, f.pin), /C1_ARCHIVE_MISMATCH/);
});
test('tampered snapshot source is refused', t => {
  const f = fixture(t); fs.writeFileSync(path.join(f.dirs[1], 'src', 'main.gs'), 'changed');
  assert.throws(() => tool.loadHistorical(f.session, f.pin), /C1_SOURCE_MISMATCH/);
});
test('duplicate snapshot directories are refused', t => {
  const f = fixture(t); fs.mkdirSync(path.join(f.session, 'portal-read-1-duplicate'));
  assert.throws(() => tool.loadHistorical(f.session, f.pin), /C1_SNAPSHOT_AMBIGUOUS/);
});
test('wrong report authorization or target summary is refused', t => {
  const f = fixture(t); f.report.googleWriteAttempted = true;
  save(path.join(f.session, 'report.json'), f.report);
  assert.throws(() => tool.loadHistorical(f.session, f.pin), /C1_REPORT_MISMATCH/);
  f.report.googleWriteAttempted = false; f.report.reads[1].target = 'other';
  save(path.join(f.session, 'report.json'), f.report);
  assert.throws(() => tool.loadHistorical(f.session, f.pin), /C1_SUMMARY_MISMATCH/);
});
test('modified inventories and lists are refused', t => {
  const f = fixture(t); save(path.join(f.dirs[0], 'inventory.json'), []);
  assert.throws(() => tool.loadHistorical(f.session, f.pin), /C1_INVENTORY_MISMATCH/);
  save(path.join(f.dirs[0], 'inventory.json'), b0.inventory(f.backup));
  save(path.join(f.dirs[0], 'lists-after.json'), {versions: [], deployments: []});
  assert.throws(() => tool.loadHistorical(f.session, f.pin), /C1_LISTS_MISMATCH/);
});
test('historical manifest bytes replace Git manifest without affecting sources', t => {
  const f = fixture(t);
  f.source[0] = file('appsscript.json', '{"gitManifest":true}');
  f.previous[0] = f.source[0];
  f.pin.source = b0.sourceDigest(f.source); f.pin.previousSource = b0.sourceDigest(f.previous);
  const result = tool.adapt(f.source, f.previous, f.backup, f.pin);
  assert.deepEqual(result.candidate[0].bytes, f.backup[0].bytes);
  assert.notDeepEqual(f.source[0].bytes, f.backup[0].bytes);
});
test('extra candidate changes are refused even with otherwise consistent hashes', t => {
  const f = fixture(t); f.pin.additions = ['unexpected'];
  assert.throws(() => tool.adapt(f.source, f.previous, f.backup, f.pin), /UNEXPECTED_CANDIDATE_DELTA/);
});
test('wrong previous package binding is refused', t => {
  const f = fixture(t); f.pin.previousPackage = 'bad';
  assert.throws(() => tool.adapt(f.source, f.previous, f.backup, f.pin), /PREVIOUS_PACKAGE_MISMATCH/);
});
test('output inside evidence is refused before directory creation', t => {
  const f = fixture(t), dest = path.join(f.session, 'new', 'out');
  assert.throws(() => tool.safeOutput(dest, [f.session]), /OUTPUT_INSIDE_PROTECTED_ROOT/);
  assert.equal(fs.existsSync(path.join(f.session, 'new')), false);
});
test('output aliases into evidence are refused', t => {
  const f = fixture(t), alias = path.join(f.root, 'alias');
  fs.symlinkSync(f.session, alias, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => tool.safeOutput(path.join(alias, 'new'), [f.session]), /OUTPUT_INSIDE_PROTECTED_ROOT/);
  assert.equal(fs.existsSync(path.join(f.session, 'new')), false);
});
test('local build preserves evidence and emits no Google authorization or clasp configuration', t => {
  const f = fixture(t), before = fs.readFileSync(path.join(f.dirs[0], 'snapshot-bundle.json'));
  const result = tool.main(f.options, f.deps, f.pin);
  assert.equal(result.googleReadAttempted, false); assert.equal(result.googleWriteAttempted, false);
  assert.equal(result.executionAuthorized, false); assert.equal(result.remoteStateRevalidated, false);
  assert.equal(result.currentPropertiesVerified, false);
  assert.equal(result.packageFiles, 3); assert.equal(result.historicalBackupFiles, 2);
  assert.deepEqual(result.diffCounts, {ADD: 1, REMOVE: 0, MODIFY: 1});
  assert.deepEqual(fs.readFileSync(path.join(f.dirs[0], 'snapshot-bundle.json')), before);
  assert.deepEqual(fs.readFileSync(path.join(result.campaign, 'historical-c1-bundle.json')), before);
  assert.equal(fs.existsSync(path.join(result.campaign, '.clasp.json')), false);
  assert.equal(fs.existsSync(path.join(result.campaign, 'candidate', '.clasp.json')), false);
  assert.equal(read(path.join(result.campaign, 'test-restoration-plan.json')).executable, false);
  assert.equal(read(path.join(result.campaign, 'restoration-residuals.json')).length, 1);
});
test('successive preparations create distinct folders and stable candidate archive', t => {
  const f = fixture(t), a = tool.main(f.options, f.deps, f.pin), b = tool.main(f.options, f.deps, f.pin);
  assert.notEqual(a.campaign, b.campaign); assert.equal(a.packageArchiveSha256, b.packageArchiveSha256);
});
test('protocol requires fresh checks and explicitly excludes unchanged historical executors', () => {
  const p = tool.protocol();
  assert.equal(p.executable, false); assert.equal(p.historicalExecutorsReusableUnchanged, false);
  assert.equal(p.privateActivationAuthorized, false); assert.equal(p.d5Authorized, false);
  assert.deepEqual(p.restoreOrder, ['ACCESS-registry', 'AUDIT-configuration', 'portal-source']);
});
test('real Git object extraction ignores uncommitted CRLF worktree content', t => {
  const f = fixture(t), cp = require('node:child_process');
  const git = args => cp.execFileSync('git', ['-C', f.repository, ...args], {encoding: 'utf8', windowsHide: true});
  git(['init', '--quiet']); git(['config', 'core.autocrlf', 'false']);
  fs.mkdirSync(path.join(f.repository, 'src'));
  fs.writeFileSync(path.join(f.repository, 'src', 'main.gs'), 'line\n');
  git(['add', 'src/main.gs']);
  git(['-c', 'user.name=Local Test', '-c', 'user.email=test@example.invalid',
    '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture']);
  const commit = git(['rev-parse', 'HEAD']).trim();
  fs.writeFileSync(path.join(f.repository, 'src', 'main.gs'), 'different\r\n');
  const files = [file('main.gs', 'line\n')];
  assert.equal(b0.sourceDigest(tool.readSource(f.repository, 'git', commit, b0.sourceDigest(files), 1)), b0.sourceDigest(files));
});
test('baseline files absent from the candidate must not be silently removed', t => {
  const f = fixture(t); f.backup.push(file('orphan.gs', 'preserve'));
  f.pin.backupFiles++; f.pin.backupSource = b0.sourceDigest(f.backup);
  assert.throws(() => tool.adapt(f.source, f.previous, f.backup, f.pin), /BASELINE_REMOVAL_REFUSED/);
});
