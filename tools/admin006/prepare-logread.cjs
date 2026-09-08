#!/usr/bin/env node
'use strict';
// Local package preparation ONLY. No clasp entry, credentials or Google mode.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
// Only pure file/inventory helpers and the local native runner are reused.
// LF normalization here permits an unchanged helper checked out on Windows.
check(hash(fs.readFileSync(path.join(__dirname, 'prepare-d4b.cjs'), 'utf8').replace(/\r\n/g, '\n')) ===
  'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b', 'HELPER_INTEGRITY_MISMATCH');
const b0 = require('./prepare-d4b.cjs');
const PIN = Object.freeze({
  candidate: '1645734f3b81219bfd80569da21edc5d054ff223',
  source: '39c6266d3a52e12bbc9c10d79da233dbcbaeb2571a258ddd8acf5da7d3a9cb5c',
  previous: 'c39cded9f8d17493780a03cc66e408158ebb5d2d',
  previousSource: '12aaaa3bda045a7a0bc03cdcf4919d599c2e0cb8eba88489ba273ea6a7d13053',
  previousPackage: 'd2766f9e55e5795ab43df099a1aae3414183aab2aa45f07c3e92654371717d99',
  session: 'd4c-readonly-RTaB9N',
  generatedAt: '2026-09-02T09:20:54.174Z',
  archive: 'c07efd3d245f6d4ba1009104c7f5fc1ea822c135eefa6658b188166b8daf6901',
  backupSource: '4ae80c6792c16f7efa006926ffafd4c202e3cb983b05b81ce63ea846c20110f3',
  manifest: 'f9a8681074723b58dca5d4e55a3c35e76165aa1675909f498d5e2c0e907f9ddf',
  lists: 'e008b6eebe885702135fc986e74e5ada01bcc6ccd317d5e336a768c7bf1f78e0',
  sourceFiles: 279, previousFiles: 277, backupFiles: 261,
  additions: Object.freeze(['tests/access/Access002LogReadRecipe', 'tests/access/Access002LogReadRecipeTest']),
  modifications: Object.freeze(['tests/access/Access002Recipe', 'tests/access/Access002RecipeTest', 'tests/suites/TestSuiteV11'])
});
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function bytes(file) {
  check(fs.lstatSync(file).isFile(), 'REGULAR_FILE_REQUIRED');
  return fs.readFileSync(file);
}
const json = file => JSON.parse(bytes(file).toString('utf8').replace(/^\uFEFF/, ''));
function directory(dir) {
  check(fs.lstatSync(dir).isDirectory(), 'DIRECTORY_REQUIRED');
  return fs.realpathSync(dir);
}
function writeNew(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', {flag: 'wx', mode: 0o600});
}
function readSource(repository, git, commit, digest, count, run = b0.native) {
  const call = args => run(git, ['-C', repository, ...args], repository);
  check(call(['rev-parse', commit + '^{commit}']).toString().trim() === commit, 'COMMIT_NOT_AVAILABLE');
  const records = call(['ls-tree', '-r', '-z', commit, '--', 'src/']).toString('utf8').split('\0').filter(Boolean);
  const files = [];
  for (const record of records) {
    const match = /^(100644|100755) blob ([a-f0-9]{40})\t(src\/.+)$/.exec(record);
    check(match, 'UNEXPECTED_GIT_ENTRY');
    if (!/\.(gs|js|html)$/.test(match[3]) && match[3] !== 'src/appsscript.json') continue;
    files.push({name: match[3].slice(4), bytes: call(['cat-file', 'blob', match[2]])});
  }
  b0.inventory(files);
  check(files.length === count && b0.sourceDigest(files) === digest, 'SOURCE_MISMATCH');
  return files;
}
function readSnapshot(dir, ordinal, pin = PIN) {
  directory(dir);
  const bundle = bytes(path.join(dir, 'snapshot-bundle.json'));
  check(hash(bundle) === pin.archive, 'C1_ARCHIVE_MISMATCH');
  const data = JSON.parse(bundle.toString('utf8'));
  check(data.format === 'AKS-D4C-READONLY-SNAPSHOT/1' && data.role === 'portal' &&
    data.target === b0.TARGET && Array.isArray(data.files), 'C1_ARCHIVE_FORMAT');
  const files = data.files.map(f => {
    check(typeof f.base64 === 'string', 'C1_ARCHIVE_CONTENT');
    const decoded = Buffer.from(f.base64, 'base64');
    check(decoded.toString('base64') === f.base64 && hash(decoded) === f.sha256 &&
      Buffer.from(decoded.toString('utf8')).equals(decoded), 'C1_ARCHIVE_CONTENT');
    return {name: f.name, bytes: decoded};
  });
  const inventory = b0.inventory(files);
  check(files.length === pin.backupFiles && b0.sourceDigest(files) === pin.backupSource &&
    equal(inventory, json(path.join(dir, 'inventory.json'))), 'C1_INVENTORY_MISMATCH');
  const onDisk = b0.scan(directory(path.join(dir, 'src')));
  check(equal(b0.inventory(onDisk), inventory), 'C1_SOURCE_MISMATCH');
  const before = json(path.join(dir, 'lists-before.json')), after = json(path.join(dir, 'lists-after.json'));
  check(equal(b0.validateLists(before.versions, before.deployments), before) && equal(before, after) &&
    hash(JSON.stringify(after)) === pin.lists, 'C1_LISTS_MISMATCH');
  const manifest = files.find(f => f.name === 'appsscript.json');
  check(manifest && hash(manifest.bytes) === pin.manifest, 'C1_MANIFEST_MISMATCH');
  b0.validateManifest(manifest.bytes);
  return {files, bundle, lists: after, ordinal};
}
function loadHistorical(sessionPath, pin = PIN) {
  const session = directory(sessionPath);
  check(path.basename(session) === pin.session, 'WRONG_C1_SESSION');
  const reportFile = path.join(session, 'report.json'), report = json(reportFile);
  check(report.revision === 'D4C-readonly-r1' && report.generatedAt === pin.generatedAt &&
    report.status === 'D4C_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED' &&
    report.googleReadAttempted === true && report.googleWriteAttempted === false &&
    report.independentReadsExact === true && report.inventoriesUnchanged === true &&
    report.portalHistoricalRestorationExact === true && report.d4cExecutionAuthorized === false &&
    directory(report.session) === session && Array.isArray(report.reads), 'C1_REPORT_MISMATCH');
  const entries = fs.readdirSync(session, {withFileTypes: true});
  const snapshots = [1, 2].map(ordinal => {
    const matches = entries.filter(e => e.name.startsWith('portal-read-' + ordinal + '-'));
    check(matches.length === 1 && matches[0].isDirectory(), 'C1_SNAPSHOT_AMBIGUOUS');
    const snapshot = readSnapshot(path.join(session, matches[0].name), ordinal, pin);
    const summaries = report.reads.filter(r => r.role === 'portal' && r.ordinal === ordinal);
    check(summaries.length === 1 && summaries[0].target === b0.TARGET &&
      summaries[0].archiveSha256 === pin.archive && summaries[0].sourceSha256 === pin.backupSource &&
      summaries[0].manifestSha256 === pin.manifest && summaries[0].fileCount === pin.backupFiles &&
      summaries[0].inventoriesSha256 === pin.lists && summaries[0].inventoriesUnchangedDuringRead === true &&
      summaries[0].versionsCount === snapshot.lists.versions.length &&
      summaries[0].deploymentsCount === snapshot.lists.deployments.length, 'C1_SUMMARY_MISMATCH');
    return snapshot;
  });
  check(snapshots[0].bundle.equals(snapshots[1].bundle), 'C1_READS_DIFFER');
  return {...snapshots[0], session, reportSha256: hash(bytes(reportFile))};
}
function adapt(source, previous, backup, pin = PIN) {
  for (const [files, count, digest] of [[source, pin.sourceFiles, pin.source],
    [previous, pin.previousFiles, pin.previousSource], [backup, pin.backupFiles, pin.backupSource]]) {
    b0.inventory(files);
    check(files.length === count && b0.sourceDigest(files) === digest, 'SOURCE_MISMATCH');
  }
  const manifest = backup.find(f => f.name === 'appsscript.json');
  check(manifest && hash(manifest.bytes) === pin.manifest, 'MANIFEST_MISMATCH');
  const replace = files => files.map(f => f.name === 'appsscript.json' ? manifest : f);
  const candidate = replace(source), old = replace(previous);
  check(b0.sourceDigest(old) === pin.previousPackage, 'PREVIOUS_PACKAGE_MISMATCH');
  const delta = b0.compare(b0.inventory(old), b0.inventory(candidate));
  check(equal(delta.filter(d => d.change === 'ADD').map(d => d.name), pin.additions) &&
    equal(delta.filter(d => d.change === 'MODIFY').map(d => d.name), pin.modifications) &&
    !delta.some(d => d.change === 'REMOVE'), 'UNEXPECTED_CANDIDATE_DELTA');
  const diff = b0.compare(b0.inventory(backup), b0.inventory(candidate));
  check(!diff.some(d => d.change === 'REMOVE'), 'BASELINE_REMOVAL_REFUSED');
  return {candidate, diff, delta};
}
function within(value, root) {
  const rel = path.relative(root, value);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
}
function safeOutput(value, roots) {
  const output = path.resolve(value), protectedRoots = roots.map(r => fs.realpathSync(r));
  let ancestor = output;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const resolved = path.resolve(fs.realpathSync(ancestor), path.relative(ancestor, output));
  check(!protectedRoots.some(r => within(output, r) || within(resolved, r)), 'OUTPUT_INSIDE_PROTECTED_ROOT');
  fs.mkdirSync(output, {recursive: true, mode: 0o700});
  return fs.realpathSync(output);
}
function protocol() {
  return {revision: 'LOGREAD-protocol-r1', executable: false,
    currentAuthorization: 'LOCAL_PREPARATION_ONLY',
    stages: ['local-package-and-diff-review', 'separately-authorized-fresh-readonly-preflight',
      'review-C1-properties-permissions-secret-continuity', 'approve-exact-test-and-rollback-window',
      'prepare-and-review-new-package-specific-executor', 'separately-authorized-reversible-code-test',
      'separately-authorized-AUDIT-ACCESS-recipe', 'restore-ACCESS-before-AUDIT-and-code',
      'readback-and-properties-review'],
    testSuite: 'AKS_runValidationSuiteV11', expectedTests: 781,
    accessProfile: ['ACCESS_MANAGE', 'LOG_READ'], configCapabilities: [],
    restoreOrder: ['ACCESS-registry', 'AUDIT-configuration', 'portal-source'],
    retention: ['audit-events', 'before-after-snapshots', 'versions-and-deployments-inventories'],
    stopOn: ['unknown-or-concurrent-source-change', 'incomplete-ACCESS-backup', 'property-conflict',
      'failed-restore-or-audit', 'unreviewed-deployment-or-permissions'],
    recovery: 'NO_FORCED_RESTORE_OR_MANUAL_BACKUP_DELETION; reviewed targeted recovery required',
    browserDeploymentChosen: false, privateActivationAuthorized: false, d5Authorized: false,
    historicalExecutorsReusableUnchanged: false};
}
const KEYS = ['repository', 'c1-session', 'output', 'git'];
function validateOptions(o) {
  check(o && Object.keys(o).every(k => KEYS.includes(k)) &&
    KEYS.every(k => typeof o[k] === 'string' && o[k]), 'INVALID_ARGUMENTS');
}
function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && !Object.hasOwn(o, key) && typeof argv[i + 1] === 'string', 'INVALID_ARGUMENTS');
    o[key] = argv[i + 1];
  }
  validateOptions(o); return o;
}
function main(options, deps = {}, pin = PIN) {
  validateOptions(options);
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  const repository = directory(options.repository);
  const historical = (deps.loadHistorical || loadHistorical)(options['c1-session'], pin);
  const read = deps.readSource || readSource;
  const source = read(repository, options.git, pin.candidate, pin.source, pin.sourceFiles);
  const previous = read(repository, options.git, pin.previous, pin.previousSource, pin.previousFiles);
  const {candidate, diff, delta} = adapt(source, previous, historical.files, pin);
  const output = safeOutput(options.output, [repository, historical.session, __dirname]);
  const campaign = fs.mkdtempSync(path.join(output, 'logread-package-'));
  try {
    // Never create .clasp.json. Historical evidence is copied, never rewritten.
    b0.materialize(path.join(campaign, 'candidate', 'src'), candidate);
    b0.materialize(path.join(campaign, 'historical-rollback', 'src'), historical.files);
    fs.writeFileSync(path.join(campaign, 'historical-c1-bundle.json'), historical.bundle, {flag: 'wx', mode: 0o600});
    const archiveSha = b0.archive(path.join(campaign, 'candidate-bundle.json'),
      [...candidate].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    writeNew(path.join(campaign, 'candidate-inventory.json'), b0.inventory(candidate));
    writeNew(path.join(campaign, 'historical-inventory.json'), b0.inventory(historical.files));
    writeNew(path.join(campaign, 'historical-lists.json'), historical.lists);
    writeNew(path.join(campaign, 'diff.json'), diff);
    writeNew(path.join(campaign, 'delta-previous-candidate.json'), delta);
    writeNew(path.join(campaign, 'restoration-residuals.json'), diff.filter(d => d.change === 'ADD'));
    writeNew(path.join(campaign, 'test-restoration-plan.json'), protocol());
    check(b0.sourceDigest(b0.scan(path.join(campaign, 'candidate', 'src'))) === b0.sourceDigest(candidate) &&
      b0.sourceDigest(b0.scan(path.join(campaign, 'historical-rollback', 'src'))) === pin.backupSource &&
      hash(bytes(path.join(campaign, 'historical-c1-bundle.json'))) === pin.archive, 'MATERIALIZATION_MISMATCH');
    const report = {revision: 'LOGREAD-package-r1', status: 'LOCAL_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED',
      target: b0.TARGET, candidate: pin.candidate, previousCandidate: pin.previous,
      sourceSha256: pin.source, sourceFiles: source.length, packageFiles: candidate.length,
      packageSha256: b0.sourceDigest(candidate), packageArchiveSha256: archiveSha,
      manifestSha256: pin.manifest, manifestCopiedExactlyFromHistoricalC1: true,
      historicalC1Session: historical.session, historicalC1ReportSha256: historical.reportSha256,
      historicalBackupArchiveSha256: pin.archive, historicalBackupFiles: historical.files.length,
      historicalEvidenceVerifiedLocally: true, remoteStateRevalidated: false, currentPropertiesVerified: false,
      currentSecretContinuityVerified: false, browserDeploymentChosen: false,
      googleReadAttempted: false, googleWriteAttempted: false, executionAuthorized: false,
      diffCounts: Object.fromEntries(['ADD', 'REMOVE', 'MODIFY'].map(k => [k, diff.filter(d => d.change === k).length])),
      changedFromPrevious: delta.map(d => ({name: d.name, change: d.change})),
      planSha256: hash(bytes(path.join(campaign, 'test-restoration-plan.json'))),
      campaign, generatedAt: new Date().toISOString()};
    writeNew(path.join(campaign, 'report.json'), report);
    return report;
  } catch (error) {
    writeNew(path.join(campaign, 'failure.json'), {status: 'LOCAL_PREPARATION_FAILED', googleWriteAttempted: false});
    throw error;
  }
}
module.exports = {PIN, readSource, readSnapshot, loadHistorical, adapt, safeOutput, protocol, parseArgs, main};
if (require.main === module) {
  try { console.log(JSON.stringify(main(parseArgs(process.argv.slice(2))), null, 2)); }
  catch (_) { console.error('LOGREAD_LOCAL_PREPARATION_STOPPED; preserve evidence, no Google operation.'); process.exitCode = 1; }
}
