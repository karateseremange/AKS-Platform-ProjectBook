#!/usr/bin/env node
'use strict';
// B1-C2-r1: LocalCheck is the only currently authorized mode.
// Execute and Restore require a separate package-specific authorization.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const readline = require('node:readline/promises');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
for (const [file, sha] of Object.entries({
  'prepare-d4b.cjs': 'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b',
  'validate-d4b.cjs': '3461f26c5b3b920ff5cb123a727a55562a1ba98eefad72c3fc6d3c828418df51',
  'check-d4b-c2.cjs': 'fd28976e887cd4f3ad77707d61aa75d1287d4a5a701ee5e4ecbfd661d697d170'
})) check(hash(fs.readFileSync(path.join(__dirname, file))) === sha, 'HELPER_INTEGRITY_MISMATCH');
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const c2 = require('./check-d4b-c2.cjs');
const PIN = Object.freeze({...c2.PIN, readSession: 'c2-readonly-kD5yRC'});
const AUTHORIZATION = 'B1-C2-' + PIN.package;
const json = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
const safeError = e => /^[A-Z0-9_]+$/.test(e?.message) ? e.message : 'B1_C2_INTERNAL_FAILURE';
function writeNew(file, value) {
  const fd = fs.openSync(file, 'wx', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
}
function loadEvidence(b0Dir, c2Dir, readDir, deps = {}) {
  const local = (deps.loadLocal || c2.loadLocal)(b0Dir, c2Dir);
  const readSession = fs.realpathSync(readDir), report = json(path.join(readSession, 'report.json'));
  check(path.basename(readSession) === PIN.readSession, 'WRONG_READONLY_SESSION');
  check(report.revision === 'C2-readonly-r1' &&
    report.status === 'READ_ONLY_COLLECTED_PROPERTIES_REVIEW_REQUIRED' &&
    report.target === b0.TARGET && report.candidate === PIN.candidate &&
    report.packageSha256 === PIN.package && report.packageArchiveSha256 === PIN.archive &&
    report.backupArchiveSha256 === b1.EXPECTED.backup &&
    report.googleReadAttempted === true && report.googleWriteAttempted === false &&
    report.propertiesOperatorConfirmed === false && report.b1Authorized === false &&
    report.remoteHeadExact === true && report.independentReadsExact === true &&
    report.inventoriesUnchanged === true &&
    fs.realpathSync(report.session) === readSession, 'READONLY_REPORT_MISMATCH');
  const binding = json(path.join(readSession, 'binding.json'));
  check(binding.target === b0.TARGET && binding.candidate === PIN.candidate &&
    binding.packageSha256 === PIN.package && fs.realpathSync(binding.b0Run) === local.evidence.dir &&
    fs.realpathSync(binding.c2Run) === local.dir, 'READONLY_BINDING_MISMATCH');
  for (const label of ['read-one', 'read-two']) {
    check(report[label + 'ArchiveSha256'] === b1.EXPECTED.backup, 'READONLY_ARCHIVE_PIN_MISMATCH');
    const files = (deps.archiveFiles || b1.archiveFiles)(path.join(readSession, label + '-bundle.json'), b1.EXPECTED.backup);
    check(same(files, local.evidence.backup), 'READONLY_ARCHIVE_CONTENT_MISMATCH');
    check(equal(json(path.join(readSession, label + '-head-diff.json')), []), 'READONLY_HEAD_DIFF_MISMATCH');
    const entries = fs.readdirSync(readSession, {withFileTypes: true}).filter(e => e.name.startsWith(label + '-') && e.isDirectory());
    check(entries.length === 1, 'READONLY_SNAPSHOT_AMBIGUOUS');
    const snapshot = path.join(readSession, entries[0].name);
    const live = b0.scan(path.join(snapshot, 'src'));
    check(same(live, local.evidence.backup) &&
      equal(b0.inventory(live), json(path.join(snapshot, 'inventory.json'))) &&
      equal(local.evidence.lists, json(path.join(snapshot, 'lists.json'))), 'READONLY_SNAPSHOT_MISMATCH');
  }
  const diff = b0.compare(b0.inventory(local.evidence.backup), b0.inventory(local.candidate));
  return {...local.evidence, candidate: local.candidate, diff, c2Dir: local.dir, readSession};
}
function parseArgs(argv) {
  const allowed = ['mode', 'b0-run', 'c2-run', 'read-session', 'clasp-package', 'output', 'authorization', 'session'];
  const options = {mode: 'LocalCheck'}, seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && allowed.includes(key) && !seen.has(key) &&
      typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    seen.add(key); options[key] = argv[i + 1];
  }
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  ['b0-run', 'c2-run', 'read-session', 'clasp-package'].forEach(k => check(options[k], 'MISSING_ARGUMENT'));
  if (options.mode !== 'LocalCheck') {
    check(options.authorization === AUTHORIZATION, 'SEPARATE_B1_C2_AUTHORIZATION_REQUIRED');
    check(options.mode === 'Restore' ? options.session : options.output, 'SESSION_OR_OUTPUT_REQUIRED');
  }
  return options;
}
function within(value, root) {
  const rel = path.relative(root, value);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
}
function sessionBinding(evidence) {
  return {revision: 'B1-C2-r1', target: b0.TARGET, candidate: PIN.candidate,
    package: PIN.package, packageArchive: PIN.archive, backup: b1.EXPECTED.backup,
    b0Run: evidence.dir, c2Run: evidence.c2Dir, readSession: evidence.readSession,
    listsSha256: hash(JSON.stringify(evidence.lists))};
}
function checkRecovery(session, evidence) {
  check(equal(json(path.join(session, 'session.json')).binding, sessionBinding(evidence)), 'RECOVERY_SESSION_MISMATCH');
  const events = fs.readdirSync(session).filter(n => /^event-[a-f0-9-]+\.json$/.test(n)).map(n => json(path.join(session, n)));
  check(events.some(e => e.event === 'CANDIDATE_PUSH_INTENT'), 'NO_CANDIDATE_PUSH_INTENT');
}
async function main(options, deps = {}) {
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  if (options.mode !== 'LocalCheck') {
    check(options.authorization === AUTHORIZATION, 'SEPARATE_B1_C2_AUTHORIZATION_REQUIRED');
    check(options.mode === 'Restore' ? options.session : options.output, 'SESSION_OR_OUTPUT_REQUIRED');
  }
  const evidence = (deps.loadEvidence || loadEvidence)(options['b0-run'], options['c2-run'], options['read-session']);
  const entry = (deps.claspEntry || b1.claspEntry)(options['clasp-package']);
  const base = {revision: 'B1-C2-r1', target: b0.TARGET, candidate: PIN.candidate,
    packageSha256: PIN.package, packageArchiveSha256: PIN.archive, backupArchiveSha256: b1.EXPECTED.backup,
    preflightSession: evidence.readSession, preflightSnapshotsVerifiedLocally: true,
    googleReadAttempted: false, googleWriteAttempted: false, propertiesOperatorConfirmed: false,
    b1Authorized: false, status: 'B1_C2_LOCAL_CHECK_ONLY'};
  if (options.mode === 'LocalCheck') return base;
  const ask = deps.ask;
  check(typeof ask === 'function', 'INTERACTIVE_OPERATOR_REQUIRED');
  const executeMode = options.mode === 'Execute';
  check(await ask(executeMode
    ? 'Confirmer autorisation B1-C2 distincte, PR #145/c39cded9 et #225 recontrolees, portail/URL absents, backend false, aucune execution Apps Script ni modification concurrente ni usage du lien dev : saisir B1-C2-AUTORISE-FERME : '
    : 'Confirmer reprise B1-C2 autorisee, aucune execution Apps Script ni modification concurrente, portail/URL absents et backend false : saisir RESTAURATION-C2-AUTORISEE : '
  ) === (executeMode ? 'B1-C2-AUTORISE-FERME' : 'RESTAURATION-C2-AUTORISEE'), 'OPERATOR_CONFIRMATION_REQUIRED');
  let session;
  if (!executeMode) {
    session = fs.realpathSync(options.session);
    checkRecovery(session, evidence);
  } else {
    const root = path.resolve(options.output), protectedRoots = [evidence.dir, evidence.c2Dir, evidence.readSession];
    check(!protectedRoots.some(p => within(root, p)), 'OUTPUT_INSIDE_EVIDENCE');
    fs.mkdirSync(root, {recursive: true, mode: 0o700});
    check(!protectedRoots.some(p => within(fs.realpathSync(root), p)), 'OUTPUT_INSIDE_EVIDENCE');
    session = fs.mkdtempSync(path.join(root, 'b1-c2-'));
    writeNew(path.join(session, 'session.json'), {binding: sessionBinding(evidence), createdAt: new Date().toISOString()});
  }
  (deps.notify || (() => {}))('Session B1-C2 (conserver pour Restore) : ' + session);
  const record = event => writeNew(path.join(session, 'event-' + crypto.randomUUID() + '.json'), {event, at: new Date().toISOString()});
  record('OPERATOR_PRECONDITIONS_CONFIRMED');
  const transport = deps.io || b1.makeTransport(entry, session, deps.native || b0.native);
  let readAttempted = false, writeAttempted = false;
  const io = {
    snapshot: label => { readAttempted = true; return transport.snapshot(label); },
    push: (files, label) => { writeAttempted = true; return transport.push(files, label); }
  };
  let result;
  if (executeMode) result = await b1.execute(evidence, io, record, ask);
  else {
    try { await b1.restore(evidence, io, record); result = {status: 'RESTORED_RECOVERY_PROPERTIES_REVIEW_REQUIRED', restoredExact: true, testPassed: false}; }
    catch (error) { result = {status: 'RESTORE_REQUIRED_' + safeError(error), restoredExact: false, testPassed: false}; }
  }
  result = {...base, ...result, session, googleReadAttempted: readAttempted,
    googleWriteAttempted: writeAttempted || result.googleWriteAttempted === true, b1Authorized: true};
  if (result.restoredExact) {
    try {
      result.propertiesOperatorConfirmed = await ask('Apres restauration, verifier portail/URL absents et backend false, aucune autre propriete modifiee. Saisir PROPRIETES-CONFIRMEES : ') === 'PROPRIETES-CONFIRMEES';
    } catch (_) { /* Preserve restored result with explicit missing confirmation. */ }
  }
  writeNew(path.join(session, 'result-' + crypto.randomUUID() + '.json'), result);
  return result;
}
module.exports = {PIN, AUTHORIZATION, loadEvidence, parseArgs, sessionBinding, checkRecovery, main};
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
    if (!['B1_C2_LOCAL_CHECK_ONLY', 'RESTORED_TEST_PASS_PROPERTIES_REVIEW_REQUIRED', 'RESTORED_RECOVERY_PROPERTIES_REVIEW_REQUIRED'].includes(result.status)) process.exitCode = 1;
  })().catch(error => { console.error(safeError(error)); process.exitCode = 1; }).finally(() => rl?.close());
}
