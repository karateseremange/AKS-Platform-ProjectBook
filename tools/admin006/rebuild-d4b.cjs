#!/usr/bin/env node
'use strict';
// C2-r1 is strictly local: no clasp, Google read/write, activation or test execution.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
for (const [file, sha] of Object.entries({
  'prepare-d4b.cjs': 'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b',
  'validate-d4b.cjs': '3461f26c5b3b920ff5cb123a727a55562a1ba98eefad72c3fc6d3c828418df51'
})) check(hash(fs.readFileSync(path.join(__dirname, file))) === sha, 'HISTORICAL_HELPER_HASH_MISMATCH');
const b0 = require('./prepare-d4b.cjs');
// Only the read-only evidence validator is reused. Never invoke B1 main/execute/restore.
const b1 = require('./validate-d4b.cjs');
const CANDIDATE = 'c39cded9f8d17493780a03cc66e408158ebb5d2d';
const SOURCE_SHA = '12aaaa3bda045a7a0bc03cdcf4919d599c2e0cb8eba88489ba273ea6a7d13053';
const B1_SESSION = 'b1-2YMQP2';
const CHANGED_FILE = 'tests/admin/Admin006PrivatePortalRuntimeTest';
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
function writeNew(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx', mode: 0o600});
}
function readCandidate(repository, git, run = b0.native) {
  const gitRead = args => run(git, ['-C', repository, ...args], repository);
  check(gitRead(['rev-parse', CANDIDATE + '^{commit}']).toString().trim() === CANDIDATE, 'CANDIDATE_NOT_AVAILABLE');
  const records = gitRead(['ls-tree', '-r', '-z', CANDIDATE, '--', 'src/']).toString('utf8').split('\0').filter(Boolean);
  const files = [];
  for (const record of records) {
    const match = /^(\d+) blob ([a-f0-9]{40})\t(src\/.+)$/.exec(record);
    check(match, 'UNEXPECTED_GIT_ENTRY');
    if (!/\.(gs|js|html)$/.test(match[3]) && match[3] !== 'src/appsscript.json') continue;
    check(['100644', '100755'].includes(match[1]), 'GIT_SYMLINK_REFUSED');
    files.push({name: match[3].slice(4), bytes: gitRead(['cat-file', 'blob', match[2]])});
  }
  b0.inventory(files);
  check(files.length === 277 && b0.sourceDigest(files) === SOURCE_SHA, 'NEW_SOURCE_HASH_MISMATCH');
  return files;
}
function readRestoration(sessionPath, evidence) {
  const session = fs.realpathSync(sessionPath);
  check(path.basename(session) === B1_SESSION, 'WRONG_B1_SESSION');
  const saved = json(path.join(session, 'session.json'));
  check(saved.revision === 'B1-r1' && saved.target === b0.TARGET &&
    fs.realpathSync(saved.b0Run) === evidence.dir && saved.candidate === b0.CANDIDATE &&
    saved.package === b1.EXPECTED.package && saved.backup === b1.EXPECTED.backup &&
    saved.listsSha256 === hash(JSON.stringify(evidence.lists)), 'B1_SESSION_BINDING_MISMATCH');
  const entries = fs.readdirSync(session, {withFileTypes: true});
  const results = entries.filter(e => /^result-[a-f0-9-]+\.json$/.test(e.name));
  check(results.length === 1 && results[0].isFile(), 'B1_RESULT_AMBIGUOUS');
  const result = json(path.join(session, results[0].name));
  check(result.status === 'TEST_NOT_PASSED' && result.testPassed === false &&
    result.restoredExact === true && result.googleWriteAttempted === true &&
    result.propertiesOperatorConfirmed === true && fs.realpathSync(result.session) === session, 'B1_RESULT_MISMATCH');
  const snapshots = entries.filter(e => /^after-restore-/.test(e.name));
  check(snapshots.length === 1 && snapshots[0].isDirectory(), 'RESTORATION_SNAPSHOT_AMBIGUOUS');
  const dir = path.join(session, snapshots[0].name);
  const files = b0.scan(path.join(dir, 'src'));
  check(same(files, evidence.backup) && equal(b0.inventory(files), json(path.join(dir, 'inventory.json'))), 'RESTORATION_SNAPSHOT_MISMATCH');
  check(equal(json(path.join(dir, 'lists.json')), evidence.lists), 'RESTORATION_LISTS_MISMATCH');
  return {session, resultFile: results[0].name, snapshot: snapshots[0].name};
}
function adaptCandidate(source, evidence) {
  const manifest = evidence.backup.find(f => f.name === 'appsscript.json');
  check(manifest && source.filter(f => f.name === manifest.name).length === 1, 'MANIFEST_MISSING');
  const candidate = source.map(f => f.name === manifest.name ? manifest : f);
  b0.inventory(candidate);
  const delta = b0.compare(b0.inventory(evidence.candidate), b0.inventory(candidate));
  check(delta.length === 1 && delta[0].change === 'MODIFY' && delta[0].name === CHANGED_FILE &&
    delta[0].before.type === delta[0].after.type, 'UNEXPECTED_CANDIDATE_CHANGE');
  const diff = b0.compare(b0.inventory(evidence.backup), b0.inventory(candidate));
  check(diff.filter(d => d.change === 'ADD').length === evidence.expected.adds &&
    diff.filter(d => d.change === 'MODIFY').length === evidence.expected.modifies &&
    !diff.some(d => d.change === 'REMOVE'), 'NEW_DIFF_COUNTS_MISMATCH');
  check(equal(diff.filter(d => d.change === 'ADD').map(d => d.name),
    evidence.diff.filter(d => d.change === 'ADD').map(d => d.name)), 'NEW_RESIDUAL_NAMES_MISMATCH');
  return {candidate, diff, delta, manifest};
}
function parseArgs(argv) {
  const allowed = ['repository', 'b0-run', 'b1-session', 'output', 'git'], options = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && allowed.includes(key) && !Object.hasOwn(options, key) &&
      typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    options[key] = argv[i + 1];
  }
  allowed.forEach(key => check(options[key], 'MISSING_ARGUMENT'));
  return options;
}
function inside(candidate, root) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}
function rebuild(options, deps = {}) {
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  const repository = fs.realpathSync(options.repository);
  const config = json(path.join(repository, '.clasp.json'));
  check(config.scriptId === b0.TARGET && path.resolve(repository, config.rootDir || '.') === path.join(repository, 'src'), 'WRONG_LOCAL_RECIPE');
  const evidence = (deps.loadEvidence || b1.loadEvidence)(options['b0-run']);
  const restored = (deps.readRestoration || readRestoration)(options['b1-session'], evidence);
  const source = (deps.readCandidate || readCandidate)(repository, options.git, deps.native || b0.native);
  const {candidate, diff, delta, manifest} = adaptCandidate(source, evidence);
  const output = path.resolve(options.output), protectedRoots = [repository, evidence.dir, restored.session];
  check(!protectedRoots.some(root => inside(output, root)), 'OUTPUT_INSIDE_PROTECTED_DIRECTORY');
  fs.mkdirSync(output, {recursive: true, mode: 0o700});
  check(!protectedRoots.some(root => inside(fs.realpathSync(output), root)), 'OUTPUT_INSIDE_PROTECTED_DIRECTORY');
  const campaign = fs.mkdtempSync(path.join(output, 'local-c2-'));
  const report = {revision: 'C2-local-r1', target: b0.TARGET, candidate: CANDIDATE,
    previousCandidate: b0.CANDIDATE, sourceSha256: b0.sourceDigest(source), sourceFiles: source.length,
    backupArchiveSha256: evidence.expected.backup, backupFiles: evidence.backup.length,
    previousPackageSha256: evidence.expected.package, packageFiles: candidate.length,
    manifestSha256: hash(manifest.bytes), manifestUnchanged: true,
    historicalB1Session: restored.session, historicalRestorationSnapshotVerifiedLocally: true,
    historicalPropertiesOperatorConfirmed: true, currentPropertiesVerified: false,
    remoteStateRevalidated: false, googleReadExecuted: false, googleWriteAttempted: false,
    b1Authorized: false, status: 'LOCAL_REBUILT_REMOTE_REVIEW_REQUIRED',
    diffCounts: Object.fromEntries(['ADD', 'REMOVE', 'MODIFY'].map(k => [k, diff.filter(d => d.change === k).length])),
    changedFromPrevious: delta.map(d => ({name: d.name, change: d.change, beforeSha256: d.before.sha256, afterSha256: d.after.sha256})),
    generatedAt: new Date().toISOString()};
  try {
    b0.materialize(path.join(campaign, 'candidate', 'src'), candidate);
    // Deliberately no .clasp.json: this package directory is not a push workspace.
    report.packageSha256 = b0.sourceDigest(candidate);
    report.packageArchiveSha256 = b0.archive(path.join(campaign, 'candidate-bundle.json'), candidate);
    writeNew(path.join(campaign, 'candidate-inventory.json'), b0.inventory(candidate));
    writeNew(path.join(campaign, 'diff.json'), diff);
    writeNew(path.join(campaign, 'delta-previous-candidate.json'), delta);
    writeNew(path.join(campaign, 'restoration-residuals.json'), diff.filter(d => d.change === 'ADD'));
    writeNew(path.join(campaign, 'report.json'), report);
    return {campaign, report};
  } catch (error) {
    writeNew(path.join(campaign, 'failure.json'), {status: 'LOCAL_BUILD_FAILED', googleWriteAttempted: false});
    throw error;
  }
}
module.exports = {CANDIDATE, SOURCE_SHA, B1_SESSION, CHANGED_FILE, readCandidate, readRestoration, adaptCandidate, parseArgs, rebuild};
if (require.main === module) {
  try { console.log(JSON.stringify(rebuild(parseArgs(process.argv.slice(2))), null, 2)); }
  catch (error) {
    console.error(/^[A-Z0-9_]+$/.test(error.message) ? error.message : 'LOCAL_REBUILD_STOPPED');
    process.exitCode = 1;
  }
}
