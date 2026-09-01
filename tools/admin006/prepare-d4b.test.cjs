'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const api = require('./prepare-d4b.cjs');
const manifest = Buffer.from('{\n  "timeZone": "Europe/Paris", "runtimeVersion": "V8",\n  "dependencies": {}, "exceptionLogging": "STACKDRIVER",\n  "webapp": {"executeAs": "USER_ACCESSING", "access": "ANYONE"}\n}\n');
const f = (name, body) => ({name, bytes: Buffer.from(body)});
function fixture(t, mode = 'GoogleReadOnly', override = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-d4b-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const repo = path.join(root, 'repo'), pkg = path.join(root, 'clasp');
  fs.mkdirSync(repo); fs.mkdirSync(pkg);
  fs.writeFileSync(path.join(repo, '.clasp.json'), JSON.stringify({scriptId: api.TARGET, rootDir: 'src'}));
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({name: '@google/clasp', version: '3.4.1', bin: 'index.js'}));
  fs.writeFileSync(path.join(pkg, 'index.js'), '// synthetic, never executed');
  const calls = [];
  const candidate = [f('appsscript.json', '{}\n'), f('same.js', 'same'), f('added.gs', 'new')];
  function native(command, args, cwd) {
    calls.push({command, args, cwd});
    if (command === 'git-test') return Buffer.from(args.includes('status') ? '' : 'git version synthetic');
    const operation = args[2];
    if (override.failCommand === operation) throw new Error('NATIVE_COMMAND_FAILED');
    if (operation === 'list-versions') return Buffer.from('[{"versionNumber":1,"description":"synthetic"}]');
    if (operation === 'list-deployments') return Buffer.from('[{"deploymentId":"synthetic-id","versionNumber":1}]');
    assert.equal(operation, 'pull');
    const dir = path.join(cwd, 'src');
    fs.writeFileSync(path.join(dir, 'appsscript.json'), override.manifest || manifest);
    fs.writeFileSync(path.join(dir, 'same.gs'), override.drift && cwd.endsWith('independent-read') ? 'changed' : 'same');
    fs.writeFileSync(path.join(dir, 'removed.gs'), 'old');
    return Buffer.from(JSON.stringify({pulledFiles: ['appsscript.json', 'same.gs', 'removed.gs'], deletedFiles: []}));
  }
  return {root, repo, pkg, calls, candidate, native,
    options: {mode, repository: repo, output: path.join(root, 'campaigns'), 'clasp-package': pkg, git: 'git-test'},
    deps: {native, gitSource: () => candidate}};
}
test('names: reject traversal, Windows aliases and gs/js collisions', () => {
  for (const name of ['../escape.gs', '/abs.gs', 'a\\b.gs', 'CON.gs', 'a:stream.gs']) {
    assert.throws(() => api.inventory([f(name, 'x')]));
  }
  assert.throws(() => api.inventory([f('x.gs', 'a'), f('x.js', 'b')]), /COLLISION/);
  assert.throws(() => api.inventory([f('X.gs', 'a'), f('x.gs', 'b')]), /COLLISION/);
});
test('comparison uses remote names and bytes, detects removals and modifications', () => {
  const a = api.inventory([f('same.gs', 'x'), f('changed.gs', 'old'), f('gone.gs', 'gone')]);
  const b = api.inventory([f('same.js', 'x'), f('changed.js', 'new'), f('new.gs', 'new')]);
  assert.deepEqual(api.compare(a, b).map(d => [d.name, d.change]), [['changed', 'MODIFY'], ['gone', 'REMOVE'], ['new', 'ADD']]);
});
test('manifest rejects backend identity, scopes and unknown configuration', () => {
  assert.equal(api.validateManifest(manifest).webapp.executeAs, 'USER_ACCESSING');
  for (const change of [{webapp: {executeAs: 'USER_DEPLOYING', access: 'ANYONE_ANONYMOUS'}},
    {oauthScopes: ['unexpected']}, {runtimeVersion: 'DEPRECATED_ES5'}]) {
    assert.throws(() => api.validateManifest(Buffer.from(JSON.stringify({...JSON.parse(manifest), ...change}))));
  }
});
test('inventories reject duplicates and potentially truncated pagination', () => {
  assert.throws(() => api.validateLists([{versionNumber: 1}, {versionNumber: 1}], []));
  assert.throws(() => api.validateLists(Array.from({length: 1000}, (_, i) => ({versionNumber: i + 1})), []), /TRUNCATED/);
  assert.deepEqual(api.validateLists([{versionNumber: 2}, {versionNumber: 1}], []).versions.map(v => v.versionNumber), [1, 2]);
});
test('local check never invokes clasp or performs a Google read', t => {
  const ctx = fixture(t, 'LocalCheck');
  const out = api.prepare(ctx.options, ctx.deps);
  assert.equal(out.report.googleReadExecuted, false);
  assert.equal(out.report.status, 'LOCAL_CHECK_ONLY');
  assert.equal(ctx.calls.filter(c => c.command !== 'git-test').length, 0);
  assert.equal(fs.existsSync(path.join(out.campaign, 'candidate')), false);
});
test('read-only guard refuses all write operations before spawning', t => {
  const ctx = fixture(t);
  const fn = api.makeClasp('unused', 'GoogleReadOnly', () => { throw new Error('spawn must not happen'); });
  for (const op of ['push', 'run', 'create-version', 'create-deployment', 'login', '--version']) {
    assert.throws(() => fn(op, ctx.repo), /GOOGLE_OPERATION_REFUSED/);
  }
  assert.throws(() => api.makeClasp('unused', 'LocalCheck')('pull', ctx.repo), /GOOGLE_OPERATION_REFUSED/);
});
test('wrong recipe and unsupported clasp stop before native calls', t => {
  const ctx = fixture(t);
  fs.writeFileSync(path.join(ctx.repo, '.clasp.json'), '{"scriptId":"other","rootDir":"src"}');
  assert.throws(() => api.prepare(ctx.options, ctx.deps), /CONFIGURATION_MISMATCH/);
  assert.equal(ctx.calls.length, 0);
  fs.writeFileSync(path.join(ctx.repo, '.clasp.json'), JSON.stringify({scriptId: api.TARGET, rootDir: 'src'}));
  fs.writeFileSync(path.join(ctx.pkg, 'package.json'), '{"name":"@google/clasp","version":"2.0.0","bin":"index.js"}');
  assert.throws(() => api.prepare(ctx.options, ctx.deps), /CLASP_3_4_1_REQUIRED/);
  assert.equal(ctx.calls.length, 0);
});
test('successful collection preserves exact manifest and records all diff classes', t => {
  const ctx = fixture(t);
  const out = api.prepare(ctx.options, ctx.deps);
  assert.equal(out.report.status, 'READ_ONLY_COLLECTED_REVIEW_REQUIRED');
  assert.equal(out.report.googleWriteExecuted, false);
  assert.equal(out.report.propertiesVerified, false);
  assert.deepEqual(fs.readFileSync(path.join(out.campaign, 'candidate/src/appsscript.json')), manifest);
  assert.deepEqual(out.report.diffCounts, {ADD: 1, REMOVE: 1, MODIFY: 0});
  assert.equal(fs.existsSync(path.join(out.campaign, 'candidate/.clasp.json')), false);
  assert.deepEqual(ctx.calls.filter(c => c.command !== 'git-test').map(c => c.args[2]),
    ['list-versions', 'list-deployments', 'pull', 'list-versions', 'list-deployments', 'pull']);
  const bundle = JSON.parse(fs.readFileSync(path.join(out.campaign, 'backup-bundle.json')));
  assert.deepEqual(Buffer.from(bundle.files.find(f => f.name === 'appsscript.json').base64, 'base64'), manifest);
});
test('drifting HEAD stops and retains original archive and failure report', t => {
  const ctx = fixture(t, 'GoogleReadOnly', {drift: true});
  assert.throws(() => api.prepare(ctx.options, ctx.deps), /HEAD_CHANGED_DURING_READ/);
  const run = path.join(ctx.options.output, fs.readdirSync(ctx.options.output)[0]);
  assert.equal(fs.existsSync(path.join(run, 'backup-bundle.json')), true);
  assert.equal(fs.existsSync(path.join(run, 'candidate')), false);
  assert.equal(JSON.parse(fs.readFileSync(path.join(run, 'report.json'))).status, 'STOPPED');
});
test('failed pull never produces a success or candidate', t => {
  const ctx = fixture(t, 'GoogleReadOnly', {failCommand: 'pull'});
  assert.throws(() => api.prepare(ctx.options, ctx.deps), /NATIVE_COMMAND_FAILED/);
  const run = path.join(ctx.options.output, fs.readdirSync(ctx.options.output)[0]);
  assert.equal(fs.existsSync(path.join(run, 'candidate')), false);
  assert.equal(JSON.parse(fs.readFileSync(path.join(run, 'report.json'))).status, 'STOPPED');
});
test('materialization cannot overwrite an existing destination', t => {
  const ctx = fixture(t);
  assert.throws(() => api.materialize(ctx.repo, [f('x.gs', 'x')]), /ALREADY_EXISTS/);
  assert.equal(fs.existsSync(path.join(ctx.repo, 'x.gs')), false);
});
test('native runner redacts a failing subprocess stdout and stderr', () => {
  assert.throws(() => api.native(process.execPath, ['-e', 'console.error("synthetic-sensitive-value");process.exit(3)'], process.cwd()),
    error => error.message === 'NATIVE_COMMAND_FAILED');
});
test('argument parser rejects unknown, duplicated and missing switches', () => {
  for (const argv of [[], ['--mode', 'Push'], ['--mode', 'LocalCheck', '--mode', 'GoogleReadOnly'], ['--mode']]) {
    assert.throws(() => api.parseArgs(argv));
  }
});
