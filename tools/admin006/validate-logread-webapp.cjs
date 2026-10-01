#!/usr/bin/env node
'use strict';
// LOGREAD-webapp-executor-r1: LocalCheck only until separate package-specific authorization.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const readline = require('node:readline/promises');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
for (const [file, sha] of Object.entries({
  'prepare-d4b.cjs': 'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b',
  'validate-d4b.cjs': '3461f26c5b3b920ff5cb123a727a55562a1ba98eefad72c3fc6d3c828418df51',
  'check-logread-webapp.cjs': 'e8f1513d4621c5eff41576aeea88016987588a319eb4ca7596799580087c0e65',
  'validate-logread.cjs': '3228ae8ed7a21a33ea40ff05c2c8f33b3c4a68265e0175c6f8868e54938d6fb8'
})) check(hash(fs.readFileSync(path.join(__dirname, file))) === sha, 'HELPER_INTEGRITY_MISMATCH');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const preflight = require('./check-logread-webapp.cjs');
const c1 = require('./check-d4c.cjs');
const legacy = require('./validate-logread.cjs');
const PIN = Object.freeze({...preflight.PIN,
  packageReport: '5f79f2cb66c4d1a28f5e6ae98e2a4fd88c73dd5d37472b16664cecc52986f21e',
  version8Report: '2a7334472e5522bdc5b88f96837a8587a6256480f6e2ce49264a83033b01c26a',
  readSession: 'logread-webapp-readonly-b2U2jL',
  readGeneratedAt: '2026-09-08T21:05:12.178Z',
  portalArchive: 'c07efd3d245f6d4ba1009104c7f5fc1ea822c135eefa6658b188166b8daf6901',
  portalLists: '69c6d66ad11ffea92279145b9830848378b9aaf6761f5a6251e39b06e80721d6',
  backendArchive: 'ee71cda8c364f22b8fe02bc14c68ced0e46a91c8a3607de3866c290913ce280c',
  backendLists: '4893782a94a1b529845543cfda9b0be63f3b4b615cce24a858e58e1bc0a12a96'
});
const AUTHORIZATION = 'LOGREAD-WEBAPP-EXECUTE-' + PIN.source;
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
function writeNew(file, value) {
  const fd = fs.openSync(file, 'wx', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
}
function loadEvidence(packageDir, version8Dir, readDir, deps = {}) {
  const local = (deps.loadLocal || preflight.loadLocal)(packageDir);
  check(local.reportSha256 === PIN.packageReport, 'PACKAGE_REPORT_HASH_MISMATCH');
  const baseline = (deps.loadVersion8Session || preflight.loadVersion8Session)(version8Dir, local);
  check(baseline.reportSha256 === PIN.version8Report, 'VERSION8_REPORT_HASH_MISMATCH');
  const readSession = fs.realpathSync(readDir);
  check(path.basename(readSession) === PIN.readSession, 'WRONG_READONLY_SESSION');
  const reportFile = path.join(readSession, 'report.json');
  const report = json(reportFile);
  const expected = {
    revision: 'LOGREAD-webapp-readonly-r1', candidate: PIN.candidate,
    packageSha256: PIN.source, packageArchiveSha256: PIN.archive,
    packageReportSha256: PIN.packageReport, version8ReportSha256: PIN.version8Report,
    baselineVersionsCount: 9, baselineDeploymentsCount: 2, retainedVersionNumber: 9,
    manifestSha256: PIN.manifest,
    manifestWebapp: {access: 'ANYONE', executeAs: 'USER_ACCESSING'},
    localEvidenceVerified: true, googleReadAttempted: true, googleWriteAttempted: false,
    readOnlyAuthorized: true, executionAuthorized: false,
    remoteSourceAndInventoriesRevalidated: true, independentReadsExact: true,
    inventoriesUnchanged: true, portalHistoricalRestorationExact: true,
    backendMatchesHistoricalC1: true, retainedVersion9Exact: true,
    webAppDeploymentRestoredToVersion8: true,
    currentPropertiesVerified: false, currentSecretContinuityVerified: false,
    browserDeploymentChosen: false,
    status: 'LOGREAD_WEBAPP_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED',
    generatedAt: PIN.readGeneratedAt
  };
  check(Object.entries(expected).every(([key, value]) => equal(report[key], value)) &&
    fs.realpathSync(report.packageCampaign) === local.packageDir &&
    fs.realpathSync(report.version8Session) === baseline.session &&
    fs.realpathSync(report.session) === readSession &&
    Array.isArray(report.reads) && report.reads.length === 4, 'READONLY_REPORT_MISMATCH');
  const binding = json(path.join(readSession, 'binding.json'));
  check(binding.revision === report.revision && binding.candidate === PIN.candidate &&
    binding.packageSha256 === PIN.source && binding.packageArchiveSha256 === PIN.archive &&
    binding.packageReportSha256 === PIN.packageReport &&
    binding.version8ReportSha256 === PIN.version8Report && binding.readOnlyAuthorized === true &&
    fs.realpathSync(binding.packageCampaign) === local.packageDir &&
    fs.realpathSync(binding.version8Session) === baseline.session &&
    fs.realpathSync(binding.session) === readSession, 'READONLY_BINDING_MISMATCH');
  const first = {};
  for (const ordinal of [1, 2]) for (const target of c1.TARGETS) {
    const summary = report.reads.find(row => row.role === target.role && row.ordinal === ordinal);
    check(summary && summary.target === target.scriptId, 'READONLY_SUMMARIES_MISMATCH');
    const entries = fs.readdirSync(readSession, {withFileTypes: true})
      .filter(row => row.isDirectory() && row.name.startsWith(target.role + '-read-' + ordinal + '-'));
    check(entries.length === 1, 'READONLY_SNAPSHOT_AMBIGUOUS');
    const snapshot = path.join(readSession, entries[0].name);
    check(!fs.existsSync(path.join(snapshot, '.clasp.json')), 'READONLY_CONFIG_REMAINS');
    const expectedArchive = target.role === 'portal' ? PIN.portalArchive : PIN.backendArchive;
    const files = legacy.readBundle(path.join(snapshot, 'snapshot-bundle.json'),
      target.role, target.scriptId, expectedArchive);
    const beforeRaw = json(path.join(snapshot, 'lists-before.json'));
    const afterRaw = json(path.join(snapshot, 'lists-after.json'));
    const before = b0.validateLists(beforeRaw.versions, beforeRaw.deployments);
    const after = b0.validateLists(afterRaw.versions, afterRaw.deployments);
    const manifest = files.find(row => row.name === 'appsscript.json');
    check(manifest && equal(before, after) &&
      equal(json(path.join(snapshot, 'inventory.json')), b0.inventory(files)) &&
      summary.fileCount === files.length && summary.sourceSha256 === b0.sourceDigest(files) &&
      summary.archiveSha256 === expectedArchive && summary.manifestSha256 === hash(manifest.bytes) &&
      summary.versionsCount === after.versions.length &&
      summary.deploymentsCount === after.deployments.length &&
      summary.inventoriesSha256 === hash(JSON.stringify(after)) &&
      summary.inventoriesUnchangedDuringRead === true, 'READONLY_SNAPSHOT_MISMATCH');
    if (target.role === 'portal') {
      check(files.length === PIN.historicalFiles && b0.sourceDigest(files) === PIN.historicalSource &&
        same(files, local.historical) && equal(after, baseline.lists) &&
        hash(JSON.stringify(after)) === PIN.portalLists, 'PORTAL_REFERENCE_MISMATCH');
    } else {
      check(files.length === PIN.backendFiles && b0.sourceDigest(files) === PIN.backendSource &&
        hash(manifest.bytes) === PIN.backendManifest &&
        hash(JSON.stringify(after)) === PIN.backendLists, 'BACKEND_REFERENCE_MISMATCH');
    }
    if (ordinal === 1) first[target.role] = {files, lists: after};
    else check(same(files, first[target.role].files) && equal(after, first[target.role].lists),
      'INDEPENDENT_READS_DIFFER');
  }
  return {dir: local.packageDir, candidate: local.candidate, backup: local.historical,
    lists: baseline.lists, version8Session: baseline.session, readSession,
    readReportSha256: hash(fs.readFileSync(reportFile))};
}
function parseArgs(argv) {
  const allowed = ['mode', 'package-run', 'version8-session', 'read-session', 'clasp-package',
    'output', 'authorization', 'session'];
  const options = {mode: 'LocalCheck'}, seen = new Set();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index].replace(/^--/, '');
    check(argv[index] === '--' + key && allowed.includes(key) && !seen.has(key) &&
      typeof argv[index + 1] === 'string' && argv[index + 1], 'INVALID_ARGUMENTS');
    seen.add(key); options[key] = argv[index + 1];
  }
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  ['package-run', 'version8-session', 'read-session', 'clasp-package']
    .forEach(key => check(options[key], 'MISSING_ARGUMENT'));
  if (options.mode === 'LocalCheck')
    check(!options.authorization && !options.session, 'LOCAL_CHECK_MUST_NOT_AUTHORIZE_EXECUTION');
  else {
    check(options.authorization === AUTHORIZATION, 'SEPARATE_LOGREAD_WEBAPP_EXECUTION_AUTHORIZATION_REQUIRED');
    check(options.mode === 'Restore' ? options.session : options.output, 'SESSION_OR_OUTPUT_REQUIRED');
  }
  return options;
}
function within(value, root) {
  const relative = path.relative(root, value);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
}
function sessionBinding(evidence) {
  return {revision: 'LOGREAD-webapp-executor-r1', target: b0.TARGET, candidate: PIN.candidate,
    package: PIN.source, packageArchive: PIN.archive, backup: PIN.historicalArchive,
    packageReportSha256: PIN.packageReport, packageRun: evidence.dir,
    version8ReportSha256: PIN.version8Report, version8Session: evidence.version8Session,
    readReportSha256: evidence.readReportSha256, readSession: evidence.readSession,
    listsSha256: hash(JSON.stringify(evidence.lists))};
}
function checkRecovery(session, evidence) {
  check(equal(json(path.join(session, 'session.json')).binding, sessionBinding(evidence)),
    'RECOVERY_SESSION_MISMATCH');
  const events = fs.readdirSync(session).filter(name => /^event-[a-f0-9-]+\.json$/.test(name))
    .map(name => json(path.join(session, name)));
  check(events.some(event => event.event === 'CANDIDATE_PUSH_INTENT'), 'NO_CANDIDATE_PUSH_INTENT');
}
async function main(options, deps = {}) {
  check(options && Object.keys(options).every(key => ['mode', 'package-run', 'version8-session',
    'read-session', 'clasp-package', 'output', 'authorization', 'session'].includes(key)), 'INVALID_ARGUMENTS');
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  if (options.mode === 'LocalCheck')
    check(!options.authorization && !options.session, 'LOCAL_CHECK_MUST_NOT_AUTHORIZE_EXECUTION');
  else {
    check(options.authorization === AUTHORIZATION, 'SEPARATE_LOGREAD_WEBAPP_EXECUTION_AUTHORIZATION_REQUIRED');
    check(options.mode === 'Restore' ? options.session : options.output, 'SESSION_OR_OUTPUT_REQUIRED');
  }
  const evidence = (deps.loadEvidence || loadEvidence)(options['package-run'],
    options['version8-session'], options['read-session']);
  const entry = (deps.claspEntry || b1.claspEntry)(options['clasp-package']);
  const base = {revision: 'LOGREAD-webapp-executor-r1', target: b0.TARGET,
    candidate: PIN.candidate, packageSha256: PIN.source, packageArchiveSha256: PIN.archive,
    packageReportSha256: PIN.packageReport, version8ReportSha256: PIN.version8Report,
    preflightReportSha256: evidence.readReportSha256, preflightSession: evidence.readSession,
    baselineVersionsCount: evidence.lists.versions.length,
    baselineDeploymentsCount: evidence.lists.deployments.length,
    retainedVersionNumber: 9, preflightSnapshotsVerifiedLocally: true,
    googleReadAttempted: false, googleWriteAttempted: false,
    propertiesOperatorConfirmed: false, secretContinuityOperatorConfirmed: false,
    browserDeploymentOperatorConfirmed: false, executionAuthorized: false,
    status: 'LOGREAD_WEBAPP_EXECUTOR_LOCAL_CHECK_ONLY'};
  if (options.mode === 'LocalCheck') return base;
  const ask = deps.ask;
  check(typeof ask === 'function', 'INTERACTIVE_OPERATOR_REQUIRED');
  const executeMode = options.mode === 'Execute';
  const phrase = executeMode ? 'LOGREAD-WEBAPP-EXECUTE-AUTORISE-FERME' : 'LOGREAD-WEBAPP-RESTAURATION-AUTORISEE';
  check(await ask(executeMode
    ? 'Confirmer autorisation distincte, PR recontrolee, proprietes et secrets conformes, OMcZ9gl version 8, aucune execution concurrente : saisir ' + phrase + ' : '
    : 'Confirmer restauration autorisee, aucune execution concurrente, proprietes inactives : saisir ' + phrase + ' : '
  ) === phrase, 'OPERATOR_CONFIRMATION_REQUIRED');
  let session;
  if (!executeMode) {
    session = fs.realpathSync(options.session);
    checkRecovery(session, evidence);
  } else {
    const root = path.resolve(options.output);
    const protectedRoots = [evidence.dir, evidence.version8Session, evidence.readSession,
      __dirname, fs.realpathSync(options['clasp-package'])];
    check(!protectedRoots.some(item => within(root, item)), 'OUTPUT_INSIDE_EVIDENCE');
    fs.mkdirSync(root, {recursive: true, mode: 0o700});
    check(!protectedRoots.some(item => within(fs.realpathSync(root), item)), 'OUTPUT_INSIDE_EVIDENCE');
    session = fs.mkdtempSync(path.join(root, 'logread-webapp-executor-'));
    writeNew(path.join(session, 'session.json'),
      {binding: sessionBinding(evidence), createdAt: new Date().toISOString()});
  }
  (deps.notify || (() => {}))('Session LOG_READ Web App (conserver pour Restore) : ' + session);
  const record = event => writeNew(path.join(session, 'event-' + crypto.randomUUID() + '.json'),
    {event, at: new Date().toISOString()});
  record('OPERATOR_PRECONDITIONS_CONFIRMED');
  const transport = deps.io || b1.makeTransport(entry, session, deps.native || b0.native);
  let readAttempted = false, writeAttempted = false;
  const io = {
    snapshot: label => { readAttempted = true; return transport.snapshot(label); },
    push: (files, label) => { writeAttempted = true; return transport.push(files, label); }
  };
  let result;
  if (executeMode) result = await legacy.execute(evidence, io, record, ask);
  else {
    try {
      await legacy.restore(evidence, io, record);
      result = {status: 'RESTORED_RECOVERY_OPERATOR_REVIEW_REQUIRED', restoredExact: true, testPassed: false};
    } catch (error) {
      result = {status: 'RESTORE_REQUIRED_' + legacy.safeError(error), restoredExact: false, testPassed: false};
    }
  }
  result = {...base, ...result, session, googleReadAttempted: readAttempted,
    googleWriteAttempted: writeAttempted || result.googleWriteAttempted === true, executionAuthorized: true};
  if (result.restoredExact) {
    try {
      const answer = await ask('Apres restauration, reconfirmer proprietes temporaires absentes, secrets/version identiques et OMcZ9gl version 8. Saisir ETAT-WEBAPP-CONFIRME : ');
      result.propertiesOperatorConfirmed = answer === 'ETAT-WEBAPP-CONFIRME';
      result.secretContinuityOperatorConfirmed = result.propertiesOperatorConfirmed;
      result.browserDeploymentOperatorConfirmed = result.propertiesOperatorConfirmed;
    } catch (_) { /* Preserve restored result with explicit missing confirmation. */ }
  }
  writeNew(path.join(session, 'result-' + crypto.randomUUID() + '.json'), result);
  return result;
}
module.exports = {PIN, AUTHORIZATION, loadEvidence, parseArgs, sessionBinding,
  checkRecovery, main};
if (require.main === module) {
  let rl;
  (async () => {
    const options = parseArgs(process.argv.slice(2));
    if (options.mode !== 'LocalCheck') {
      check(process.stdin.isTTY && process.stdout.isTTY, 'INTERACTIVE_TERMINAL_REQUIRED');
      rl = readline.createInterface({input: process.stdin, output: process.stdout});
    }
    const result = await main(options,
      {ask: rl ? prompt => b1.operatorPrompt(rl, prompt) : undefined, notify: console.log});
    console.log(JSON.stringify(result, null, 2));
    if (!['LOGREAD_WEBAPP_EXECUTOR_LOCAL_CHECK_ONLY', 'RESTORED_TEST_PASS_OPERATOR_REVIEW_REQUIRED',
      'RESTORED_RECOVERY_OPERATOR_REVIEW_REQUIRED'].includes(result.status)) process.exitCode = 1;
  })().catch(error => { console.error(legacy.safeError(error)); process.exitCode = 1; })
    .finally(() => rl?.close());
}
