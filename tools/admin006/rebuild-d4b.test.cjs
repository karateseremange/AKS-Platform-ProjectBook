'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const api = require('./rebuild-d4b.cjs');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const file = (name, body) => ({name, bytes: Buffer.from(body)});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-c2-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const b0dir = path.join(root, 'b0'), session = path.join(root, api.B1_SESSION), repo = path.join(root, 'repo');
  for (const dir of [b0dir, session, repo]) fs.mkdirSync(dir);
  const manifest = file('appsscript.json', '{"timeZone":"Europe/Paris","runtimeVersion":"V8","dependencies":{},"exceptionLogging":"STACKDRIVER"}');
  const backup = [manifest, file('same.gs', 'same'), file('existing.gs', 'backup')];
  const previous = [manifest, file('same.js', 'same'), file('existing.gs', 'previous'), file(api.CHANGED_FILE + '.gs', 'old test')];
  const source = previous.map(f => f.name === api.CHANGED_FILE + '.gs' ? file(f.name, 'corrected test') :
    f.name === 'appsscript.json' ? file(f.name, '{}') : f);
  const lists = b0.validateLists([{versionNumber: 1}], [{deploymentId: 'synthetic', versionNumber: 1}]);
  const evidence = {dir: b0dir, backup, candidate: previous, lists, diff: b0.compare(b0.inventory(backup), b0.inventory(previous)),
    expected: {backup: b1.EXPECTED.backup, package: b1.EXPECTED.package, adds: 1, modifies: 1}};
  const write = (base, name, value) => fs.writeFileSync(path.join(base, name), JSON.stringify(value));
  write(repo, '.clasp.json', {scriptId: b0.TARGET, rootDir: 'src'});
  const saved = {revision: 'B1-r1', target: b0.TARGET, b0Run: b0dir, candidate: b0.CANDIDATE,
    package: b1.EXPECTED.package, backup: b1.EXPECTED.backup, listsSha256: hash(JSON.stringify(lists))};
  const result = {status: 'TEST_NOT_PASSED', testPassed: false, restoredExact: true,
    googleWriteAttempted: true, propertiesOperatorConfirmed: true, session};
  write(session, 'session.json', saved); write(session, 'result-aaaa.json', result);
  const snap = path.join(session, 'after-restore-test'); fs.mkdirSync(snap);
  b0.materialize(path.join(snap, 'src'), backup);
  write(snap, 'inventory.json', b0.inventory(backup)); write(snap, 'lists.json', lists);
  const options = {repository: repo, 'b0-run': b0dir, 'b1-session': session, output: path.join(root, 'out'), git: 'git-synthetic'};
  const deps = {loadEvidence: () => evidence, readCandidate: () => source, native: () => assert.fail('No native/Google call expected')};
  return {root, session, snap, repo, evidence, source, manifest, options, deps, saved, result, write};
}
test('fixed new candidate and digest differ from B1-r1', () => {
  assert.equal(api.CANDIDATE, 'c39cded9f8d17493780a03cc66e408158ebb5d2d');
  assert.equal(api.SOURCE_SHA, '12aaaa3bda045a7a0bc03cdcf4919d599c2e0cb8eba88489ba273ea6a7d13053');
  assert.notEqual(api.CANDIDATE, b0.CANDIDATE);
});
test('parser requires all local paths and refuses Google or execution modes', () => {
  const args = ['--repository','r','--b0-run','b','--b1-session','s','--output','o','--git','g'];
  assert.equal(api.parseArgs(args).repository, 'r');
  for (const extra of [['--mode','Execute'],['--authorization','yes'],['--clasp-package','c'],['--repository','other']]) {
    assert.throws(() => api.parseArgs([...args,...extra]), /ARGUMENT/);
  }
  assert.throws(() => api.parseArgs(args.slice(0,-2)), /MISSING/);
});
test('historical restoration is verified against actual local readback bytes', t => {
  const f = fixture(t), result = api.readRestoration(f.session, f.evidence);
  assert.equal(result.snapshot, 'after-restore-test');
  fs.writeFileSync(path.join(f.snap, 'src', 'same.gs'), 'tampered');
  assert.throws(() => api.readRestoration(f.session, f.evidence), /SNAPSHOT_MISMATCH/);
});
test('wrong session, target or candidate are refused', t => {
  const f = fixture(t);
  assert.throws(() => api.readRestoration(f.root, f.evidence), /WRONG_B1_SESSION/);
  for (const change of [{target: 'other'}, {candidate: api.CANDIDATE}, {package: 'other'}, {listsSha256: 'other'}]) {
    f.write(f.session, 'session.json', {...f.saved,...change});
    assert.throws(() => api.readRestoration(f.session, f.evidence), /BINDING/);
  }
});
test('missing restoration or property confirmation cannot be treated as success', t => {
  const f = fixture(t);
  for (const change of [{restoredExact: false}, {propertiesOperatorConfirmed: false}, {testPassed: true}, {status: 'OTHER'}]) {
    f.write(f.session, 'result-aaaa.json', {...f.result,...change});
    assert.throws(() => api.readRestoration(f.session, f.evidence), /RESULT_MISMATCH/);
  }
});
test('multiple historical results require human review', t => {
  const f = fixture(t); f.write(f.session, 'result-bbbb.json', f.result);
  assert.throws(() => api.readRestoration(f.session, f.evidence), /AMBIGUOUS/);
});
test('multiple readbacks or changed inventories are refused', t => {
  const f = fixture(t);
  f.write(f.snap, 'lists.json', {versions: [], deployments: []});
  assert.throws(() => api.readRestoration(f.session, f.evidence), /LISTS_MISMATCH/);
  f.write(f.snap, 'lists.json', f.evidence.lists);
  fs.mkdirSync(path.join(f.session,'after-restore-other'));
  assert.throws(() => api.readRestoration(f.session, f.evidence), /AMBIGUOUS/);
});
test('manifest bytes preserved and only corrected test differs from previous package', t => {
  const f = fixture(t), result = api.adaptCandidate(f.source, f.evidence);
  assert.ok(result.candidate[0].bytes.equals(f.manifest.bytes));
  assert.equal(result.delta.length, 1); assert.equal(result.delta[0].name, api.CHANGED_FILE);
  assert.equal(result.diff.filter(d => d.change === 'ADD').length, 1);
});
test('functional change, addition or missing file is refused', t => {
  const f = fixture(t);
  for (const source of [f.source.map(x => x.name==='same.js'?file(x.name,'different'):x),
    [...f.source,file('extra.gs','extra')],f.source.slice(1)]) {
    assert.throws(() => api.adaptCandidate(source, f.evidence));
  }
});
test('changed diff-count expectations are refused', t => {
  const f = fixture(t); f.evidence.expected.adds = 99;
  assert.throws(() => api.adaptCandidate(f.source, f.evidence), /COUNTS/);
});
test('local reconstruction never calls Google, carries explicit stale-state flags', t => {
  const f = fixture(t), output = api.rebuild(f.options, f.deps), r = output.report;
  assert.equal(r.status, 'LOCAL_REBUILT_REMOTE_REVIEW_REQUIRED');
  for (const key of ['googleReadExecuted','googleWriteAttempted','remoteStateRevalidated','currentPropertiesVerified','b1Authorized']) assert.equal(r[key], false);
  assert.equal(r.historicalRestorationSnapshotVerifiedLocally, true);
  assert.equal(fs.existsSync(path.join(output.campaign,'candidate','.clasp.json')),false);
  assert.equal(hash(fs.readFileSync(path.join(output.campaign,'candidate-bundle.json'))),r.packageArchiveSha256);
  assert.equal(b0.sourceDigest(b0.scan(path.join(output.campaign,'candidate','src'))),r.packageSha256);
});
test('repeated builds create new directories and reproducible package hashes', t => {
  const f = fixture(t), a = api.rebuild(f.options,f.deps), b = api.rebuild(f.options,f.deps);
  assert.notEqual(a.campaign,b.campaign);
  assert.equal(a.report.packageSha256,b.report.packageSha256);
  assert.equal(a.report.packageArchiveSha256,b.report.packageArchiveSha256);
});
test('prior B0 and B1 files are not modified', t => {
  const f = fixture(t), before = fs.readFileSync(path.join(f.session,'session.json'));
  api.rebuild(f.options,f.deps);
  assert.ok(fs.readFileSync(path.join(f.session,'session.json')).equals(before));
  assert.deepEqual(fs.readdirSync(f.evidence.dir), []);
  assert.deepEqual(fs.readdirSync(f.session).sort(), ['after-restore-test','result-aaaa.json','session.json']);
});
test('output inside repository or historical evidence is refused', t => {
  const f = fixture(t);
  for(const output of [f.repo,path.join(f.repo,'new'),f.evidence.dir,f.session]) {
    assert.throws(() => api.rebuild({...f.options,output},f.deps), /PROTECTED/);
  }
});
test('wrong local Apps Script target stops before evidence or Git reads', t => {
  const f=fixture(t); f.write(f.repo,'.clasp.json',{scriptId:'other',rootDir:'src'});
  assert.throws(() => api.rebuild(f.options,{loadEvidence:()=>assert.fail('no read')}), /WRONG_LOCAL_RECIPE/);
});
test('Git extraction requests only pinned objects, never working-tree bytes', () => {
  const calls=[];
  const run=(cmd,args)=>{calls.push(args);const op=args[2];
    if(op==='rev-parse')return Buffer.from(api.CANDIDATE);
    if(op==='ls-tree')return Buffer.from('100644 blob '+'a'.repeat(40)+'\tsrc/appsscript.json\0');
    assert.equal(op,'cat-file');return Buffer.from('{}');};
  assert.throws(()=>api.readCandidate('repo','git',run), /SOURCE_HASH/);
  assert.deepEqual(calls.map(a=>a[2]),['rev-parse','ls-tree','cat-file']);
  assert.ok(calls[0].includes(api.CANDIDATE+'^{commit}'));
});
test('wrong Git candidate and symlink sources are refused', () => {
  assert.throws(()=>api.readCandidate('repo','git',()=>Buffer.from('wrong')), /CANDIDATE/);
  assert.throws(()=>api.readCandidate('repo','git',(cmd,args)=>Buffer.from(args[2]==='rev-parse'?api.CANDIDATE:
    '120000 blob '+'a'.repeat(40)+'\tsrc/x.gs\0')), /SYMLINK/);
});
