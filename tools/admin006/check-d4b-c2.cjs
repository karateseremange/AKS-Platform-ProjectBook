#!/usr/bin/env node
'use strict';
// Preparation via GitHub; Node/PowerShell execution must first be verified on the operator's workstation.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
for (const [file, sha] of Object.entries({
  'prepare-d4b.cjs': 'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b',
  'validate-d4b.cjs': '3461f26c5b3b920ff5cb123a727a55562a1ba98eefad72c3fc6d3c828418df51'
})) check(hash(fs.readFileSync(path.join(__dirname, file))) === sha, 'HISTORICAL_HELPER_HASH_MISMATCH');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const PIN = Object.freeze({
  candidate: 'c39cded9f8d17493780a03cc66e408158ebb5d2d',
  source: '12aaaa3bda045a7a0bc03cdcf4919d599c2e0cb8eba88489ba273ea6a7d13053',
  campaign: 'local-c2-G8mK7N',
  package: 'd2766f9e55e5795ab43df099a1aae3414183aab2aa45f07c3e92654371717d99',
  archive: '571d7841fbf3ee6cb2f156fb3285adb205ecb1ada4f50a66ad635ef3a11aa07a',
  testFile: 'tests/admin/Admin006PrivatePortalRuntimeTest',
  testSha: 'd1a8d12b6bec6069aba4c8ad76169ed442c29bb0962ca6aca24dbb3f3990e6a5'
});
const AUTHORIZATION = 'C2-READONLY-' + PIN.package;
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
function writeNew(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', {flag: 'wx', mode: 0o600});
}
function loadLocal(b0Dir, c2Dir, pin = PIN, loadB0 = b1.loadEvidence) {
  const evidence = loadB0(b0Dir), dir = fs.realpathSync(c2Dir), r = json(path.join(dir, 'report.json'));
  check(path.basename(dir) === pin.campaign, 'WRONG_C2_CAMPAIGN');
  check(r.revision === 'C2-local-r1' && r.status === 'LOCAL_REBUILT_REMOTE_REVIEW_REQUIRED' &&
    r.target === b0.TARGET && r.candidate === pin.candidate && r.sourceSha256 === pin.source &&
    r.sourceFiles === 277 && r.packageFiles === 277 && r.backupFiles === 261 &&
    r.packageSha256 === pin.package && r.packageArchiveSha256 === pin.archive &&
    r.backupArchiveSha256 === b1.EXPECTED.backup && r.manifestSha256 === b1.EXPECTED.manifest &&
    r.manifestUnchanged === true && r.googleReadExecuted === false && r.googleWriteAttempted === false &&
    r.b1Authorized === false, 'C2_REPORT_MISMATCH');
  const candidate = b1.archiveFiles(path.join(dir, 'candidate-bundle.json'), pin.archive);
  check(candidate.length === 277 && b0.sourceDigest(candidate) === pin.package, 'C2_PACKAGE_MISMATCH');
  const oldManifest = evidence.backup.find(f => f.name === 'appsscript.json');
  check(candidate.find(f => f.name === 'appsscript.json')?.bytes.equals(oldManifest.bytes), 'MANIFEST_MISMATCH');
  const delta = b0.compare(b0.inventory(evidence.candidate), b0.inventory(candidate));
  check(delta.length === 1 && delta[0].name === pin.testFile && delta[0].change === 'MODIFY' &&
    delta[0].after.sha256 === pin.testSha && delta[0].before.type === delta[0].after.type, 'C2_DELTA_MISMATCH');
  const diff = b0.compare(b0.inventory(evidence.backup), b0.inventory(candidate));
  check(equal(diff, json(path.join(dir, 'diff.json'))) &&
    equal(delta, json(path.join(dir, 'delta-previous-candidate.json'))) &&
    equal(diff.filter(d => d.change === 'ADD'), json(path.join(dir, 'restoration-residuals.json'))), 'C2_DIFF_MISMATCH');
  check(diff.filter(d => d.change === 'ADD').length === 16 &&
    diff.filter(d => d.change === 'MODIFY').length === 188 && !diff.some(d => d.change === 'REMOVE'), 'C2_COUNTS_MISMATCH');
  return {evidence, candidate, dir};
}
function readOnlyNative(entry, run = b0.native) {
  return (command, args, cwd) => {
    check(command === process.execPath && args.length === 3 && args[0] === entry && args[1] === '--json' &&
      ['pull', 'list-versions', 'list-deployments'].includes(args[2]), 'GOOGLE_WRITE_OR_UNKNOWN_OPERATION_REFUSED');
    return run(command, args, cwd);
  };
}
function assertSnapshot(snapshot, evidence) {
  check(equal(snapshot.lists, evidence.lists), 'VERSIONS_OR_DEPLOYMENTS_CHANGED');
  check(same(snapshot.files, evidence.backup), 'HEAD_CHANGED_SINCE_BACKUP');
}
function collect(local, io, record) {
  const first = io.snapshot('read-one');
  record('read-one', first);
  assertSnapshot(first, local.evidence);
  const second = io.snapshot('read-two');
  record('read-two', second);
  assertSnapshot(second, local.evidence);
  check(same(first.files, second.files) && equal(first.lists, second.lists), 'READS_NOT_IDENTICAL');
  return {remoteHeadExact: true, independentReadsExact: true, inventoriesUnchanged: true};
}
function parseArgs(argv) {
  const allowed = ['mode', 'b0-run', 'c2-run', 'clasp-package', 'output', 'authorization'];
  const options = {mode: 'LocalCheck'}, seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && allowed.includes(key) && !seen.has(key) &&
      typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    seen.add(key); options[key] = argv[i + 1];
  }
  check(['LocalCheck', 'ReadOnly'].includes(options.mode), 'INVALID_MODE');
  ['b0-run', 'c2-run', 'clasp-package'].forEach(key => check(options[key], 'MISSING_ARGUMENT'));
  if (options.mode === 'ReadOnly') {
    check(options.output, 'OUTPUT_REQUIRED');
    check(options.authorization === AUTHORIZATION, 'READONLY_AUTHORIZATION_REQUIRED');
  }
  return options;
}
function within(value, root) {
  const rel = path.relative(root, value);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
}
function main(options, deps = {}) {
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  check(['LocalCheck', 'ReadOnly'].includes(options.mode), 'INVALID_MODE');
  if (options.mode === 'ReadOnly') check(options.authorization === AUTHORIZATION && options.output, 'READONLY_AUTHORIZATION_REQUIRED');
  const local = (deps.loadLocal || loadLocal)(options['b0-run'], options['c2-run']);
  const entry = (deps.claspEntry || b1.claspEntry)(options['clasp-package']);
  const report = {revision: 'C2-readonly-r1', target: b0.TARGET, candidate: PIN.candidate, packageSha256: PIN.package,
    packageArchiveSha256: PIN.archive, backupArchiveSha256: b1.EXPECTED.backup,
    googleReadAttempted: false, googleWriteAttempted: false, propertiesOperatorConfirmed: false,
    b1Authorized: false, status: 'C2_READONLY_LOCAL_CHECK_ONLY'};
  if (options.mode === 'LocalCheck') return report;
  const output = path.resolve(options.output), protectedRoots = [local.dir, local.evidence.dir];
  check(!protectedRoots.some(p => within(output, p)), 'OUTPUT_INSIDE_EVIDENCE');
  fs.mkdirSync(output, {recursive: true, mode: 0o700});
  check(!protectedRoots.some(p => within(fs.realpathSync(output), p)), 'OUTPUT_INSIDE_EVIDENCE');
  const session = fs.mkdtempSync(path.join(output, 'c2-readonly-'));
  report.session = session; report.generatedAt = new Date().toISOString();
  writeNew(path.join(session, 'binding.json'), {candidate: PIN.candidate, packageSha256: PIN.package,
    target: b0.TARGET, b0Run: local.evidence.dir, c2Run: local.dir});
  // Reuse only snapshot(). The independent native guard rejects push even if called accidentally.
  const io = deps.io || b1.makeTransport(entry, session, readOnlyNative(entry, deps.native || b0.native));
  try {
    report.googleReadAttempted = true;
    Object.assign(report, collect(local, io, (label, snapshot) => {
      const sha = b0.archive(path.join(session, label + '-bundle.json'), snapshot.files);
      report[label + 'ArchiveSha256'] = sha;
      writeNew(path.join(session, label + '-head-diff.json'), b0.compare(b0.inventory(local.evidence.backup), b0.inventory(snapshot.files)));
    }));
    report.status = 'READ_ONLY_COLLECTED_PROPERTIES_REVIEW_REQUIRED';
  } catch (error) {
    report.status = 'STOPPED';
    report.failure = /^[A-Z0-9_]+$/.test(error.message) ? error.message : 'READONLY_CHECK_FAILED';
  }
  writeNew(path.join(session, 'report.json'), report);
  return report;
}
module.exports = {PIN, AUTHORIZATION, loadLocal, readOnlyNative, assertSnapshot, collect, parseArgs, main};
if (require.main === module) {
  try {
    const report = main(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(report, null, 2));
    if (report.status === 'STOPPED') process.exitCode = 1;
  } catch (error) {
    console.error(/^[A-Z0-9_]+$/.test(error.message) ? error.message : 'READONLY_CHECK_STOPPED');
    process.exitCode = 1;
  }
}
