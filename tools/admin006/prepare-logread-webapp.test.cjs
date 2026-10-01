'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const tool = require('./prepare-logread-webapp.cjs');
const b0 = require('./prepare-d4b.cjs');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const file = (name, text) => ({name, bytes: Buffer.from(text)});
const save = (p, x) => fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-webapp-package-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const repository = path.join(root, 'repo'), previousCampaign = path.join(root, 'previous-test');
  fs.mkdirSync(repository); fs.mkdirSync(previousCampaign);
  const oldManifest = file('appsscript.json', JSON.stringify({timeZone: 'Europe/Paris', dependencies: {},
    exceptionLogging: 'STACKDRIVER', runtimeVersion: 'V8'}));
  const newManifest = file('appsscript.json', JSON.stringify({timeZone: 'Europe/Paris', dependencies: {},
    exceptionLogging: 'STACKDRIVER', runtimeVersion: 'V8',
    webapp: {access: 'ANYONE', executeAs: 'USER_ACCESSING'}}));
  const previous = [oldManifest, file('main.gs', 'same')];
  const current = [newManifest, file('main.gs', 'same')];
  const historical = [oldManifest, file('main.gs', 'old')];
  b0.materialize(path.join(previousCampaign, 'candidate', 'src'), previous);
  b0.materialize(path.join(previousCampaign, 'historical-rollback', 'src'), historical);
  const candidateArchive = b0.archive(path.join(previousCampaign, 'candidate-bundle.json'), previous);
  fs.writeFileSync(path.join(previousCampaign, 'historical-c1-bundle.json'), 'evidence');
  const lists = b0.validateLists([{versionNumber: 8}], [{deploymentId: 'example', versionNumber: 8}]);
  save(path.join(previousCampaign, 'historical-lists.json'), lists);
  const pin = {...tool.PIN, candidate: 'a'.repeat(40), source: b0.sourceDigest(current), sourceFiles: 2,
    manifest: hash(newManifest.bytes), previousCampaign: 'previous-test', previousCandidate: 'b'.repeat(40),
    previousPackage: b0.sourceDigest(previous), previousArchive: candidateArchive,
    previousManifest: hash(oldManifest.bytes), historicalSource: b0.sourceDigest(historical), historicalFiles: 2};
  const report = {revision: 'LOGREAD-package-r1', status: 'LOCAL_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED',
    candidate: pin.previousCandidate, packageFiles: 2, packageSha256: pin.previousPackage,
    packageArchiveSha256: pin.previousArchive, manifestSha256: pin.previousManifest,
    googleReadAttempted: false, googleWriteAttempted: false, executionAuthorized: false,
    campaign: previousCampaign};
  save(path.join(previousCampaign, 'report.json'), report);
  pin.previousReport = hash(fs.readFileSync(path.join(previousCampaign, 'report.json')));
  const options = {repository, 'previous-package': previousCampaign,
    output: path.join(root, 'out'), git: 'git'};
  const deps = {readSource: () => current};
  return {root, repository, previousCampaign, pin, report, options, deps, previous, current, historical};
}
test('CLI is local-only and accepts exactly four closed arguments', () => {
  assert.deepEqual(tool.parseArgs(['--repository', 'r', '--previous-package', 'p', '--output', 'o', '--git', 'g']),
    {repository: 'r', 'previous-package': 'p', output: 'o', git: 'g'});
  for (const args of [[], ['--mode', 'GoogleReadOnly'], ['--authorization', 'yes'],
    ['--repository', 'r', '--repository', 'x']]) assert.throws(() => tool.parseArgs(args));
});
test('manifest requires the exact Web App contract', t => {
  const f = fixture(t);
  assert.deepEqual(tool.manifest(f.current, f.pin).webapp,
    {access: 'ANYONE', executeAs: 'USER_ACCESSING'});
});
test('missing or changed Web App configuration is refused', t => {
  const f = fixture(t), missing = f.current.map(x => x.name === 'appsscript.json' ? f.previous[0] : x);
  assert.throws(() => tool.manifest(missing, {...f.pin, manifest: hash(missing[0].bytes)}));
  const wrong = [file('appsscript.json', JSON.stringify({timeZone: 'Europe/Paris', dependencies: {},
    exceptionLogging: 'STACKDRIVER', runtimeVersion: 'V8',
    webapp: {access: 'ANYONE_ANONYMOUS', executeAs: 'USER_DEPLOYING'}})), f.current[1]];
  assert.throws(() => tool.manifest(wrong, {...f.pin, manifest: hash(wrong[0].bytes)}));
});
test('executable API and non-Web App drift are refused', t => {
  const f = fixture(t), value = JSON.parse(f.current[0].bytes);
  value.executionApi = {access: 'ANYONE'};
  const changed = [file('appsscript.json', JSON.stringify(value)), f.current[1]];
  assert.throws(() => tool.manifest(changed, {...f.pin, manifest: hash(changed[0].bytes)}));
  const zone = JSON.parse(f.current[0].bytes); zone.timeZone = 'UTC';
  const drift = [file('appsscript.json', JSON.stringify(zone)), f.current[1]];
  assert.throws(() => tool.manifest(drift, {...f.pin, manifest: hash(drift[0].bytes)}));
});
test('previous protected package is verified without mutation', t => {
  const f = fixture(t), before = fs.readFileSync(path.join(f.previousCampaign, 'report.json'));
  const loaded = tool.loadPrevious(f.previousCampaign, f.pin);
  assert.equal(b0.sourceDigest(loaded.candidate), f.pin.previousPackage);
  assert.deepEqual(fs.readFileSync(path.join(f.previousCampaign, 'report.json')), before);
});
test('tampered previous report, package and archive are refused', t => {
  const f = fixture(t);
  fs.appendFileSync(path.join(f.previousCampaign, 'report.json'), ' ');
  assert.throws(() => tool.loadPrevious(f.previousCampaign, f.pin), /REPORT_HASH/);
  fs.truncateSync(path.join(f.previousCampaign, 'report.json'),
    fs.statSync(path.join(f.previousCampaign, 'report.json')).size - 1);
  fs.writeFileSync(path.join(f.previousCampaign, 'candidate', 'src', 'main.gs'), 'changed');
  assert.throws(() => tool.loadPrevious(f.previousCampaign, f.pin), /PACKAGE_MISMATCH/);
});
test('candidate delta is limited to the manifest', t => {
  const f = fixture(t), result = tool.compareCandidate(f.current, f.previous, f.pin);
  assert.deepEqual(result.delta, [{name: 'appsscript', change: 'MODIFY'}]);
});
test('any functional source delta is refused', t => {
  const f = fixture(t), changed = [f.current[0], file('main.gs', 'changed')];
  const pin = {...f.pin, source: b0.sourceDigest(changed)};
  assert.throws(() => tool.compareCandidate(changed, f.previous, pin), /UNEXPECTED_CURRENT_DELTA/);
});
test('local build emits a guarded package without Google or clasp', t => {
  const f = fixture(t), result = tool.main(f.options, f.deps, f.pin);
  assert.equal(result.status, 'LOCAL_WEBAPP_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED');
  assert.equal(result.googleReadAttempted, false); assert.equal(result.googleWriteAttempted, false);
  assert.equal(result.executionAuthorized, false); assert.equal(result.remoteStateRevalidated, false);
  assert.equal(result.manifestMatchesVersion8Semantics, true);
  assert.equal(result.manifestByteEqualityWithVersion8Claimed, false);
  assert.deepEqual(result.changedFromPreviousPackage, [{name: 'appsscript', change: 'MODIFY'}]);
  assert.equal(fs.existsSync(path.join(result.campaign, '.clasp.json')), false);
  assert.equal(fs.existsSync(path.join(result.campaign, 'candidate', '.clasp.json')), false);
});
test('materialized manifest and rollback remain exact', t => {
  const f = fixture(t), result = tool.main(f.options, f.deps, f.pin);
  const candidate = b0.scan(path.join(result.campaign, 'candidate', 'src'));
  const historical = b0.scan(path.join(result.campaign, 'historical-rollback', 'src'));
  assert.equal(b0.sourceDigest(candidate), f.pin.source);
  assert.equal(hash(candidate.find(x => x.name === 'appsscript.json').bytes), f.pin.manifest);
  assert.equal(b0.sourceDigest(historical), f.pin.historicalSource);
});
test('successive builds are isolated and archives are stable', t => {
  const f = fixture(t), a = tool.main(f.options, f.deps, f.pin), b = tool.main(f.options, f.deps, f.pin);
  assert.notEqual(a.campaign, b.campaign);
  assert.equal(a.packageArchiveSha256, b.packageArchiveSha256);
});
test('protocol blocks all remote and browser stages', () => {
  const p = tool.protocol();
  assert.equal(p.executable, false); assert.equal(p.manifestGuard.required, true);
  assert.equal(p.manifestGuard.access, 'ANYONE');
  assert.equal(p.manifestGuard.executeAs, 'USER_ACCESSING');
  assert.equal(p.privateActivationAuthorized, false); assert.equal(p.d5Authorized, false);
});
