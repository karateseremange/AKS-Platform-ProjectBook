#!/usr/bin/env node
'use strict';
// LOGREAD-executor-r1: LocalCheck only until separate package-specific authorization.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const readline = require('node:readline/promises');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
for (const [file, sha] of Object.entries({
  'prepare-d4b.cjs': 'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b',
  'validate-d4b.cjs': '3461f26c5b3b920ff5cb123a727a55562a1ba98eefad72c3fc6d3c828418df51',
  'check-logread.cjs': 'dd125729bc6b896edd9d9d548dfee9de7eab9b830bed838c6b3d75118c204c5d'
})) check(hash(fs.readFileSync(path.join(__dirname, file))) === sha, 'HELPER_INTEGRITY_MISMATCH');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const preflight = require('./check-logread.cjs');
const c1 = require('./check-d4c.cjs');
const PIN = Object.freeze({...preflight.PIN,
  readSession: 'logread-readonly-WW5Uwa',
  readGeneratedAt: '2026-09-03T20:30:38.165Z',
  packageReport: '6d0d8d403f4a82fd46c1ba5964b64b35099dce92a16ef30c945b92669b198787',
  portalSource: '4ae80c6792c16f7efa006926ffafd4c202e3cb983b05b81ce63ea846c20110f3',
  portalArchive: 'c07efd3d245f6d4ba1009104c7f5fc1ea822c135eefa6658b188166b8daf6901',
  portalLists: 'e008b6eebe885702135fc986e74e5ada01bcc6ccd317d5e336a768c7bf1f78e0',
  backendArchive: 'ee71cda8c364f22b8fe02bc14c68ced0e46a91c8a3607de3866c290913ce280c'
});
const AUTHORIZATION = 'LOGREAD-EXECUTE-' + PIN.package;
const json = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
const SAFE_CODES = new Set([
  'DEPLOYMENTS_OR_VERSIONS_CHANGED', 'HEAD_CHANGED_SINCE_PREFLIGHT',
  'CANDIDATE_READBACK_MISMATCH', 'TEST_NOT_PASSED', 'RESTORATION_INCOMPLETE',
  'UNKNOWN_REMOTE_CHANGE_STOP', 'REMOTE_MANIFEST_MISSING', 'PULL_INCOMPLETE',
  'LISTS_CHANGED_DURING_READ', 'PUSH_RESULT_INCOMPLETE', 'LOCAL_PUSH_CONTENT_CHANGED',
  'NATIVE_COMMAND_FAILED', 'CLASP_CONFIGURATION_CHANGED', 'GOOGLE_OPERATION_REFUSED'
]);
const safeError = e => SAFE_CODES.has(e?.message) ? e.message : 'LOGREAD_EXECUTOR_STOPPED';
function writeNew(file, value) {
  const fd = fs.openSync(file, 'wx', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
}
function readBundle(file, role, target, expectedHash) {
  const raw = fs.readFileSync(file);
  check(hash(raw) === expectedHash, 'READONLY_ARCHIVE_HASH_MISMATCH');
  const data = JSON.parse(raw.toString('utf8'));
  check(data.format === 'AKS-D4C-READONLY-SNAPSHOT/1' && data.role === role &&
    data.target === target && Array.isArray(data.files), 'READONLY_ARCHIVE_FORMAT_INVALID');
  const files = data.files.map(item => {
    check(typeof item.base64 === 'string', 'READONLY_ARCHIVE_CONTENT_INVALID');
    const bytes = Buffer.from(item.base64, 'base64');
    check(bytes.toString('base64') === item.base64 && hash(bytes) === item.sha256 &&
      Buffer.from(bytes.toString('utf8')).equals(bytes), 'READONLY_ARCHIVE_CONTENT_INVALID');
    return {name: item.name, bytes};
  });
  b0.inventory(files); return files;
}
function loadEvidence(packageDir, readDir, deps = {}) {
  const local = (deps.loadLocal || preflight.loadLocal)(packageDir);
  check(local.reportSha256 === PIN.packageReport, 'PACKAGE_REPORT_HASH_MISMATCH');
  const readSession = fs.realpathSync(readDir), report = json(path.join(readSession, 'report.json'));
  check(path.basename(readSession) === PIN.readSession, 'WRONG_READONLY_SESSION');
  check(report.revision === 'LOGREAD-readonly-r1' &&
    report.status === 'LOGREAD_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED' &&
    report.candidate === PIN.candidate && report.packageSha256 === PIN.package &&
    report.packageArchiveSha256 === PIN.packageArchive &&
    report.packageReportSha256 === PIN.packageReport &&
    report.historicalC1ReportSha256 === PIN.c1Report &&
    report.historicalBackupArchiveSha256 === PIN.archive &&
    report.googleReadAttempted === true && report.googleWriteAttempted === false &&
    report.readOnlyAuthorized === true && report.executionAuthorized === false &&
    report.remoteSourceAndInventoriesRevalidated === true &&
    report.independentReadsExact === true && report.inventoriesUnchanged === true &&
    report.portalHistoricalRestorationExact === true && report.backendMatchesHistoricalC1 === true &&
    report.generatedAt === PIN.readGeneratedAt && Array.isArray(report.reads) && report.reads.length === 4 &&
    fs.realpathSync(report.packageCampaign) === local.packageDir &&
    fs.realpathSync(report.session) === readSession, 'READONLY_REPORT_MISMATCH');
  const binding = json(path.join(readSession, 'binding.json'));
  check(binding.revision === report.revision && binding.packageSha256 === PIN.package &&
    binding.packageReportSha256 === PIN.packageReport &&
    fs.realpathSync(binding.packageCampaign) === local.packageDir, 'READONLY_BINDING_MISMATCH');
  const first = {};
  for (const ordinal of [1, 2]) for (const target of c1.TARGETS) {
    const summary = report.reads.find(r => r.role === target.role && r.ordinal === ordinal);
    check(summary && summary.target === target.scriptId, 'READONLY_SUMMARIES_MISMATCH');
    const entries = fs.readdirSync(readSession, {withFileTypes: true})
      .filter(e => e.isDirectory() && e.name.startsWith(target.role + '-read-' + ordinal + '-'));
    check(entries.length === 1, 'READONLY_SNAPSHOT_AMBIGUOUS');
    const snapshot = path.join(readSession, entries[0].name);
    check(!fs.existsSync(path.join(snapshot, '.clasp.json')), 'READONLY_CONFIG_REMAINS');
    const expectedArchive = target.role === 'portal' ? PIN.portalArchive : PIN.backendArchive;
    const files = readBundle(path.join(snapshot, 'snapshot-bundle.json'),
      target.role, target.scriptId, expectedArchive);
    const beforeRaw = json(path.join(snapshot, 'lists-before.json'));
    const afterRaw = json(path.join(snapshot, 'lists-after.json'));
    const before = b0.validateLists(beforeRaw.versions, beforeRaw.deployments);
    const after = b0.validateLists(afterRaw.versions, afterRaw.deployments);
    const manifest = files.find(f => f.name === 'appsscript.json');
    check(manifest && equal(before, after) &&
      equal(json(path.join(snapshot, 'inventory.json')), b0.inventory(files)) &&
      summary.fileCount === files.length && summary.sourceSha256 === b0.sourceDigest(files) &&
      summary.archiveSha256 === expectedArchive && summary.manifestSha256 === hash(manifest.bytes) &&
      summary.inventoriesSha256 === hash(JSON.stringify(after)) &&
      summary.inventoriesUnchangedDuringRead === true, 'READONLY_SNAPSHOT_MISMATCH');
    if (target.role === 'portal') {
      check(files.length === PIN.backupFiles && b0.sourceDigest(files) === PIN.portalSource &&
        same(files, local.historical.files) && equal(after, local.historical.lists),
      'PORTAL_REFERENCE_MISMATCH');
    } else {
      check(files.length === PIN.backendFiles && b0.sourceDigest(files) === PIN.backendSource &&
        hash(manifest.bytes) === PIN.backendManifest &&
        hash(JSON.stringify(after)) === PIN.backendLists, 'BACKEND_REFERENCE_MISMATCH');
    }
    if (ordinal === 1) first[target.role] = {files, lists: after};
    else check(same(files, first[target.role].files) &&
      equal(after, first[target.role].lists), 'INDEPENDENT_READS_DIFFER');
  }
  return {dir: local.packageDir, candidate: local.candidate, backup: local.historical.files,
    lists: local.historical.lists, readSession};
}
function parseArgs(argv) {
  const allowed = ['mode', 'package-run', 'read-session', 'clasp-package', 'output', 'authorization', 'session'];
  const options = {mode: 'LocalCheck'}, seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && allowed.includes(key) && !seen.has(key) &&
      typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    seen.add(key); options[key] = argv[i + 1];
  }
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  ['package-run', 'read-session', 'clasp-package'].forEach(k => check(options[k], 'MISSING_ARGUMENT'));
  if (options.mode === 'LocalCheck') {
    check(!options.authorization && !options.session, 'LOCAL_CHECK_MUST_NOT_AUTHORIZE_EXECUTION');
  } else {
    check(options.authorization === AUTHORIZATION, 'SEPARATE_LOGREAD_EXECUTION_AUTHORIZATION_REQUIRED');
    check(options.mode === 'Restore' ? options.session : options.output, 'SESSION_OR_OUTPUT_REQUIRED');
  }
  return options;
}
function within(value, root) {
  const rel = path.relative(root, value);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
}
function sessionBinding(evidence) {
  return {revision: 'LOGREAD-executor-r1', target: b0.TARGET, candidate: PIN.candidate,
    package: PIN.package, packageArchive: PIN.packageArchive, backup: PIN.archive,
    packageReportSha256: PIN.packageReport, packageRun: evidence.dir, readSession: evidence.readSession,
    listsSha256: hash(JSON.stringify(evidence.lists))};
}
function checkRecovery(session, evidence) {
  check(equal(json(path.join(session, 'session.json')).binding, sessionBinding(evidence)), 'RECOVERY_SESSION_MISMATCH');
  const events = fs.readdirSync(session).filter(n => /^event-[a-f0-9-]+\.json$/.test(n)).map(n => json(path.join(session, n)));
  check(events.some(e => e.event === 'CANDIDATE_PUSH_INTENT'), 'NO_CANDIDATE_PUSH_INTENT');
}
function assertLists(snapshot, evidence) {
  check(equal(snapshot.lists, evidence.lists), 'DEPLOYMENTS_OR_VERSIONS_CHANGED');
}
async function restore(evidence, io, record) {
  const observed = io.snapshot('before-restore');
  assertLists(observed, evidence);
  b1.knownState(observed.files, evidence);
  if (!same(observed.files, evidence.backup)) {
    record('RESTORE_PUSH_INTENT'); io.push(evidence.backup, 'restore-upload');
  }
  const restored = io.snapshot('after-restore');
  assertLists(restored, evidence);
  check(same(restored.files, evidence.backup), 'RESTORATION_INCOMPLETE');
  record('RESTORED_EXACT');
}
async function execute(evidence, io, record, ask) {
  let attempted = false, restoredExact = false, testPassed = false, failure = null;
  try {
    const before = io.snapshot('before-upload');
    assertLists(before, evidence);
    check(same(before.files, evidence.backup), 'HEAD_CHANGED_SINCE_PREFLIGHT');
    record('CANDIDATE_PUSH_INTENT'); attempted = true;
    io.push(evidence.candidate, 'candidate-upload');
    const candidate = io.snapshot('candidate-readback');
    assertLists(candidate, evidence);
    check(same(candidate.files, evidence.candidate), 'CANDIDATE_READBACK_MISMATCH');
    record('CANDIDATE_EXACT');
    const answer = await ask('Dans le portail RECETTE uniquement, executer AKS_runValidationSuiteV11. Saisir 781/781 uniquement pour 781 reussites et zero echec ; sinon ECHEC : ');
    testPassed = answer === '781/781';
    record(testPassed ? 'TEST_PASS_OPERATOR_REPORTED' : 'TEST_NOT_PASSED');
    check(testPassed, 'TEST_NOT_PASSED');
  } catch (error) { failure = safeError(error); }
  finally {
    if (attempted) {
      try { await restore(evidence, io, record); restoredExact = true; }
      catch (error) { failure = 'RESTORE_REQUIRED_' + safeError(error); }
    }
  }
  return {status: failure || 'RESTORED_TEST_PASS_OPERATOR_REVIEW_REQUIRED',
    testPassed, restoredExact, googleWriteAttempted: attempted};
}
async function main(options, deps = {}) {
  check(options && Object.keys(options).every(k =>
    ['mode', 'package-run', 'read-session', 'clasp-package', 'output', 'authorization', 'session'].includes(k)),
  'INVALID_ARGUMENTS');
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  if (options.mode === 'LocalCheck') {
    check(!options.authorization && !options.session, 'LOCAL_CHECK_MUST_NOT_AUTHORIZE_EXECUTION');
  } else {
    check(options.authorization === AUTHORIZATION, 'SEPARATE_LOGREAD_EXECUTION_AUTHORIZATION_REQUIRED');
    check(options.mode === 'Restore' ? options.session : options.output, 'SESSION_OR_OUTPUT_REQUIRED');
  }
  const evidence = (deps.loadEvidence || loadEvidence)(options['package-run'], options['read-session']);
  const entry = (deps.claspEntry || b1.claspEntry)(options['clasp-package']);
  const base = {revision: 'LOGREAD-executor-r1', target: b0.TARGET, candidate: PIN.candidate,
    packageSha256: PIN.package, packageArchiveSha256: PIN.packageArchive,
    packageReportSha256: PIN.packageReport, backupArchiveSha256: PIN.archive,
    preflightSession: evidence.readSession, preflightSnapshotsVerifiedLocally: true,
    googleReadAttempted: false, googleWriteAttempted: false, propertiesOperatorConfirmed: false,
    executionAuthorized: false, status: 'LOGREAD_EXECUTOR_LOCAL_CHECK_ONLY'};
  if (options.mode === 'LocalCheck') return base;
  const ask = deps.ask;
  check(typeof ask === 'function', 'INTERACTIVE_OPERATOR_REQUIRED');
  const executeMode = options.mode === 'Execute';
  check(await ask(executeMode
    ? 'Confirmer autorisation LOG_READ distincte, PR #146 et #226 recontrolees, C1 valide, proprietes inactives, aucune execution concurrente ni usage du portail : saisir LOGREAD-EXECUTE-AUTORISE-FERME : '
    : 'Confirmer restauration LOG_READ autorisee, aucune execution concurrente, proprietes inactives : saisir LOGREAD-RESTAURATION-AUTORISEE : '
  ) === (executeMode ? 'LOGREAD-EXECUTE-AUTORISE-FERME' : 'LOGREAD-RESTAURATION-AUTORISEE'),
  'OPERATOR_CONFIRMATION_REQUIRED');
  let session;
  if (!executeMode) {
    session = fs.realpathSync(options.session);
    checkRecovery(session, evidence);
  } else {
    const root = path.resolve(options.output), protectedRoots = [evidence.dir, evidence.readSession, __dirname,
      fs.realpathSync(options['clasp-package'])];
    check(!protectedRoots.some(p => within(root, p)), 'OUTPUT_INSIDE_EVIDENCE');
    fs.mkdirSync(root, {recursive: true, mode: 0o700});
    check(!protectedRoots.some(p => within(fs.realpathSync(root), p)), 'OUTPUT_INSIDE_EVIDENCE');
    session = fs.mkdtempSync(path.join(root, 'logread-executor-'));
    writeNew(path.join(session, 'session.json'), {binding: sessionBinding(evidence), createdAt: new Date().toISOString()});
  }
  (deps.notify || (() => {}))('Session LOG_READ (conserver pour Restore) : ' + session);
  const record = event => writeNew(path.join(session, 'event-' + crypto.randomUUID() + '.json'), {event, at: new Date().toISOString()});
  record('OPERATOR_PRECONDITIONS_CONFIRMED');
  const transport = deps.io || b1.makeTransport(entry, session, deps.native || b0.native);
  let readAttempted = false, writeAttempted = false;
  const io = {
    snapshot: label => { readAttempted = true; return transport.snapshot(label); },
    push: (files, label) => { writeAttempted = true; return transport.push(files, label); }
  };
  let result;
  if (executeMode) result = await execute(evidence, io, record, ask);
  else {
    try { await restore(evidence, io, record); result = {status: 'RESTORED_RECOVERY_OPERATOR_REVIEW_REQUIRED', restoredExact: true, testPassed: false}; }
    catch (error) { result = {status: 'RESTORE_REQUIRED_' + safeError(error), restoredExact: false, testPassed: false}; }
  }
  result = {...base, ...result, session, googleReadAttempted: readAttempted,
    googleWriteAttempted: writeAttempted || result.googleWriteAttempted === true, executionAuthorized: true};
  if (result.restoredExact) {
    try {
      result.propertiesOperatorConfirmed = await ask('Apres restauration, confirmer portail/URL absents, backend false, secrets/version inchanges. Saisir PROPRIETES-CONFIRMEES : ') === 'PROPRIETES-CONFIRMEES';
    } catch (_) { /* Preserve restored result with explicit missing confirmation. */ }
  }
  writeNew(path.join(session, 'result-' + crypto.randomUUID() + '.json'), result);
  return result;
}
module.exports = {PIN, AUTHORIZATION, readBundle, loadEvidence, parseArgs, sessionBinding,
  checkRecovery, restore, execute, safeError, main};
if (require.main === module) {
  let rl;
  (async () => {
    const options = parseArgs(process.argv.slice(2));
    if (options.mode !== 'LocalCheck') {
      check(process.stdin.isTTY && process.stdout.isTTY, 'INTERACTIVE_TERMINAL_REQUIRED');
      rl = readline.createInterface({input: process.stdin, output: process.stdout});
    }
    const result = await main(options, {ask: rl ? p => b1.operatorPrompt(rl, p) : undefined, notify: console.log});
    console.log(JSON.stringify(result, null, 2));
    if (!['LOGREAD_EXECUTOR_LOCAL_CHECK_ONLY', 'RESTORED_TEST_PASS_OPERATOR_REVIEW_REQUIRED',
      'RESTORED_RECOVERY_OPERATOR_REVIEW_REQUIRED'].includes(result.status)) process.exitCode = 1;
  })().catch(error => { console.error(safeError(error)); process.exitCode = 1; }).finally(() => rl?.close());
}
