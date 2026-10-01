#!/usr/bin/env node
'use strict';
// Local Web App package preparation ONLY. No clasp entry, credentials or Google mode.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
const normalizedHash = file => hash(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
check(normalizedHash(path.join(__dirname, 'prepare-logread.cjs')) ===
  '414ff5638360b80f4ece53c3a181baabfe944f6ef535b4112fd0c4ed43fbda49',
  'PREVIOUS_TOOL_INTEGRITY_MISMATCH');
const previousTool = require('./prepare-logread.cjs');
const b0 = require('./prepare-d4b.cjs');
const PIN = Object.freeze({
  candidate: '6a7d86300d90c3f9a629e89a113dc7b0dd7e5f73',
  source: '3931cc5b455b40fa7eb3dd76f8c7cb41d5acae3b5ad7674b5a67be7f286a465f',
  sourceFiles: 279,
  manifest: '40ebf6b32fb6cba6f0b44ada9ce85fd023fee18f0599833b08e18f26336b0b38',
  previousCampaign: 'logread-package-gF5KXy',
  previousCandidate: '1645734f3b81219bfd80569da21edc5d054ff223',
  previousPackage: 'cd635f54e1c8c6cc5d7a43053a4a1bd37c866d728abb3a89dd04c0e91620689b',
  previousArchive: '6e4aa0e50271ed64d3079c32beff9905c90f3c422919b85349fa4173df5d0c51',
  previousReport: '6d0d8d403f4a82fd46c1ba5964b64b35099dce92a16ef30c945b92669b198787',
  previousManifest: 'f9a8681074723b58dca5d4e55a3c35e76165aa1675909f498d5e2c0e907f9ddf',
  historicalSource: '4ae80c6792c16f7efa006926ffafd4c202e3cb983b05b81ce63ea846c20110f3',
  historicalFiles: 261
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
function manifest(files, pin = PIN) {
  const matches = files.filter(f => f.name === 'appsscript.json');
  check(matches.length === 1 && hash(matches[0].bytes) === pin.manifest, 'WEBAPP_MANIFEST_HASH_MISMATCH');
  let value;
  try { value = JSON.parse(matches[0].bytes.toString('utf8').replace(/^\uFEFF/, '')); }
  catch (_) { throw new Error('WEBAPP_MANIFEST_INVALID'); }
  check(value && !Array.isArray(value) && equal(Object.keys(value),
    ['timeZone', 'dependencies', 'exceptionLogging', 'runtimeVersion', 'webapp']),
    'WEBAPP_MANIFEST_FIELDS_MISMATCH');
  check(value.timeZone === 'Europe/Paris' && equal(value.dependencies, {}) &&
    value.exceptionLogging === 'STACKDRIVER' && value.runtimeVersion === 'V8',
    'WEBAPP_MANIFEST_BASELINE_MISMATCH');
  check(equal(value.webapp, {access: 'ANYONE', executeAs: 'USER_ACCESSING'}) &&
    !Object.hasOwn(value, 'executionApi'), 'WEBAPP_ENTRYPOINT_MISMATCH');
  return value;
}
function withoutWebapp(value) {
  const copy = JSON.parse(JSON.stringify(value));
  delete copy.webapp;
  return copy;
}
function loadPrevious(value, pin = PIN) {
  const campaign = directory(value);
  check(path.basename(campaign) === pin.previousCampaign, 'WRONG_PREVIOUS_CAMPAIGN');
  const reportFile = path.join(campaign, 'report.json');
  check(hash(bytes(reportFile)) === pin.previousReport, 'PREVIOUS_REPORT_HASH_MISMATCH');
  const report = json(reportFile);
  check(report.revision === 'LOGREAD-package-r1' &&
    report.status === 'LOCAL_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED' &&
    report.candidate === pin.previousCandidate && report.packageFiles === pin.sourceFiles &&
    report.packageSha256 === pin.previousPackage && report.packageArchiveSha256 === pin.previousArchive &&
    report.manifestSha256 === pin.previousManifest && report.googleReadAttempted === false &&
    report.googleWriteAttempted === false && report.executionAuthorized === false &&
    directory(report.campaign) === campaign, 'PREVIOUS_REPORT_MISMATCH');
  const candidate = b0.scan(directory(path.join(campaign, 'candidate', 'src')));
  check(candidate.length === pin.sourceFiles && b0.sourceDigest(candidate) === pin.previousPackage,
    'PREVIOUS_PACKAGE_MISMATCH');
  check(hash(bytes(path.join(campaign, 'candidate-bundle.json'))) === pin.previousArchive,
    'PREVIOUS_ARCHIVE_MISMATCH');
  const historical = b0.scan(directory(path.join(campaign, 'historical-rollback', 'src')));
  check(historical.length === pin.historicalFiles && b0.sourceDigest(historical) === pin.historicalSource,
    'HISTORICAL_ROLLBACK_MISMATCH');
  const historicalBundle = bytes(path.join(campaign, 'historical-c1-bundle.json'));
  const historicalLists = json(path.join(campaign, 'historical-lists.json'));
  b0.validateLists(historicalLists.versions, historicalLists.deployments);
  return {campaign, report, candidate, historical, historicalBundle, historicalLists};
}
function compareCandidate(current, previous, pin = PIN) {
  b0.inventory(current); b0.inventory(previous);
  check(current.length === pin.sourceFiles && b0.sourceDigest(current) === pin.source,
    'CURRENT_SOURCE_MISMATCH');
  check(previous.length === pin.sourceFiles && b0.sourceDigest(previous) === pin.previousPackage,
    'PREVIOUS_SOURCE_MISMATCH');
  const currentManifest = manifest(current, pin);
  const oldRows = previous.filter(f => f.name === 'appsscript.json');
  check(oldRows.length === 1 && hash(oldRows[0].bytes) === pin.previousManifest,
    'PREVIOUS_MANIFEST_MISMATCH');
  const oldManifest = JSON.parse(oldRows[0].bytes.toString('utf8').replace(/^\uFEFF/, ''));
  check(!Object.hasOwn(oldManifest, 'webapp') && equal(withoutWebapp(currentManifest), oldManifest),
    'NON_WEBAPP_MANIFEST_DRIFT');
  const rawDelta = b0.compare(b0.inventory(previous), b0.inventory(current));
  const delta = rawDelta.map(({name, change}) => ({name, change}));
  check(equal(delta, [{name: 'appsscript', change: 'MODIFY'}]), 'UNEXPECTED_CURRENT_DELTA');
  return {delta, currentManifest};
}
function protocol() {
  const value = previousTool.protocol();
  return {...value, revision: 'LOGREAD-webapp-protocol-r1', executable: false,
    currentAuthorization: 'LOCAL_WEBAPP_PACKAGE_PREPARATION_ONLY',
    manifestGuard: {required: true, sha256: PIN.manifest, access: 'ANYONE',
      executeAs: 'USER_ACCESSING', executionApiPresent: false},
    browserDeploymentChosen: false, privateActivationAuthorized: false, d5Authorized: false};
}
const KEYS = ['repository', 'previous-package', 'output', 'git'];
function validateOptions(o) {
  check(o && Object.keys(o).every(k => KEYS.includes(k)) &&
    KEYS.every(k => typeof o[k] === 'string' && o[k]), 'INVALID_ARGUMENTS');
}
function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && !Object.hasOwn(o, key) && typeof argv[i + 1] === 'string',
      'INVALID_ARGUMENTS');
    o[key] = argv[i + 1];
  }
  validateOptions(o); return o;
}
function main(options, deps = {}, pin = PIN) {
  validateOptions(options);
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  const repository = directory(options.repository);
  const previous = (deps.loadPrevious || loadPrevious)(options['previous-package'], pin);
  const current = (deps.readSource || previousTool.readSource)(repository, options.git,
    pin.candidate, pin.source, pin.sourceFiles);
  const comparison = compareCandidate(current, previous.candidate, pin);
  const diff = b0.compare(b0.inventory(previous.historical), b0.inventory(current));
  check(!diff.some(d => d.change === 'REMOVE'), 'HISTORICAL_REMOVAL_REFUSED');
  const output = previousTool.safeOutput(options.output,
    [repository, previous.campaign, __dirname]);
  const campaign = fs.mkdtempSync(path.join(output, 'logread-webapp-package-'));
  try {
    b0.materialize(path.join(campaign, 'candidate', 'src'), current);
    b0.materialize(path.join(campaign, 'historical-rollback', 'src'), previous.historical);
    fs.writeFileSync(path.join(campaign, 'historical-c1-bundle.json'), previous.historicalBundle,
      {flag: 'wx', mode: 0o600});
    writeNew(path.join(campaign, 'historical-lists.json'), previous.historicalLists);
    const archiveSha = b0.archive(path.join(campaign, 'candidate-bundle.json'),
      [...current].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    writeNew(path.join(campaign, 'candidate-inventory.json'), b0.inventory(current));
    writeNew(path.join(campaign, 'historical-inventory.json'), b0.inventory(previous.historical));
    writeNew(path.join(campaign, 'diff.json'), diff);
    writeNew(path.join(campaign, 'delta-previous-package.json'), comparison.delta);
    writeNew(path.join(campaign, 'restoration-residuals.json'), diff.filter(d => d.change === 'ADD'));
    writeNew(path.join(campaign, 'test-restoration-plan.json'), protocol());
    const materialized = b0.scan(path.join(campaign, 'candidate', 'src'));
    check(b0.sourceDigest(materialized) === pin.source &&
      hash(materialized.find(f => f.name === 'appsscript.json').bytes) === pin.manifest &&
      b0.sourceDigest(b0.scan(path.join(campaign, 'historical-rollback', 'src'))) === pin.historicalSource,
      'MATERIALIZATION_MISMATCH');
    const report = {revision: 'LOGREAD-webapp-package-r1',
      status: 'LOCAL_WEBAPP_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED', target: b0.TARGET,
      candidate: pin.candidate, previousCandidate: pin.previousCandidate,
      sourceSha256: pin.source, sourceFiles: current.length, packageFiles: current.length,
      packageSha256: b0.sourceDigest(current), packageArchiveSha256: archiveSha,
      manifestSha256: pin.manifest, manifestWebapp: {access: comparison.currentManifest.webapp.access,
        executeAs: comparison.currentManifest.webapp.executeAs},
      manifestMatchesVersion8Semantics: true, manifestByteEqualityWithVersion8Claimed: false,
      nonWebappExactWithPreviousPackage: true, previousPackageCampaign: previous.campaign,
      previousPackageSha256: pin.previousPackage, previousPackageReportSha256: pin.previousReport,
      historicalBackupFiles: previous.historical.length,
      historicalBackupSha256: b0.sourceDigest(previous.historical),
      historicalEvidenceVerifiedLocally: true, remoteStateRevalidated: false,
      currentPropertiesVerified: false, currentSecretContinuityVerified: false,
      browserDeploymentChosen: false, googleReadAttempted: false, googleWriteAttempted: false,
      executionAuthorized: false,
      diffCounts: Object.fromEntries(['ADD', 'REMOVE', 'MODIFY'].map(k =>
        [k, diff.filter(d => d.change === k).length])),
      changedFromPreviousPackage: comparison.delta,
      planSha256: hash(bytes(path.join(campaign, 'test-restoration-plan.json'))),
      campaign, generatedAt: new Date().toISOString()};
    writeNew(path.join(campaign, 'report.json'), report);
    return report;
  } catch (error) {
    writeNew(path.join(campaign, 'failure.json'),
      {status: 'LOCAL_WEBAPP_PACKAGE_PREPARATION_FAILED', googleWriteAttempted: false});
    throw error;
  }
}
module.exports = {PIN, manifest, withoutWebapp, loadPrevious, compareCandidate,
  protocol, parseArgs, main};
if (require.main === module) {
  try { console.log(JSON.stringify(main(parseArgs(process.argv.slice(2))), null, 2)); }
  catch (_) {
    console.error('LOGREAD_WEBAPP_LOCAL_PREPARATION_STOPPED; preserve evidence, no Google operation.');
    process.exitCode = 1;
  }
}
