#!/usr/bin/env node
'use strict';
// B1-r1: preparation only until a separate, package-specific execution authorization.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const readline = require('node:readline/promises');
const B0_HASH = 'e19b4701d423bc676948e158a78f7bb4bf85490690538f6fbeafad684db9b52b';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
if (hash(fs.readFileSync(path.join(__dirname, 'prepare-d4b.cjs'))) !== B0_HASH) {
  throw new Error('B0_ENGINE_INTEGRITY_MISMATCH');
}
const b0 = require('./prepare-d4b.cjs');
const EXPECTED = Object.freeze({
  run: 'run-2026-09-01T17-24-50-315Z-98f074',
  backup: '3daa853bd19b1de97ffbebe76ae6d273aa73cad0bb0574b20b8e60e0ce7c21de',
  packageArchive: '28bf17ac72ee8bf2b6c97d5749301861ef96de269345fb051b103793b5eebedf',
  package: 'c332f690f9544353fb6686ed121cbfb3728432fb2b7e86efe3e23080e6769ff9',
  manifest: 'f9a8681074723b58dca5d4e55a3c35e76165aa1675909f498d5e2c0e907f9ddf',
  backupFiles: 261, packageFiles: 277, adds: 16, modifies: 188
});
const AUTHORIZATION = 'B1-' + EXPECTED.package;
const check = (condition, code) => { if (!condition) throw new Error(code); };
const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function writeNew(file, data) {
  const fd = fs.openSync(file, 'wx', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(data, null, 2) + '\n'); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
}
function archiveFiles(file, expectedHash) {
  const raw = fs.readFileSync(file);
  check(hash(raw) === expectedHash, 'ARCHIVE_HASH_MISMATCH');
  const data = JSON.parse(raw.toString('utf8'));
  check(data.format === 'AKS-D4B-SNAPSHOT/1' && data.target === b0.TARGET && Array.isArray(data.files), 'ARCHIVE_FORMAT_INVALID');
  const files = data.files.map(f => {
    check(typeof f.base64 === 'string', 'ARCHIVE_CONTENT_INVALID');
    const bytes = Buffer.from(f.base64, 'base64');
    check(bytes.toString('base64') === f.base64 && hash(bytes) === f.sha256 &&
      Buffer.from(bytes.toString('utf8')).equals(bytes), 'ARCHIVE_CONTENT_INVALID');
    return {name: f.name, bytes};
  });
  const inventory = b0.inventory(files);
  check(data.files.every(f => inventory.some(i => i.name === f.name && i.type === f.type)), 'ARCHIVE_TYPE_INVALID');
  return files;
}
function loadEvidence(dir, expected = EXPECTED) {
  dir = fs.realpathSync(dir);
  check(path.basename(dir) === expected.run, 'WRONG_B0_RUN');
  const report = json(path.join(dir, 'report.json'));
  check(report.revision === 'B0-r2' && report.status === 'READ_ONLY_COLLECTED_REVIEW_REQUIRED' &&
    report.target === b0.TARGET && report.candidate === b0.CANDIDATE && report.sourceSha256 === b0.SOURCE_SHA &&
    report.googleReadExecuted === true && report.googleWriteExecuted === false &&
    report.manifestUnchanged === true && report.independentReadExact === true &&
    report.backupArchiveSha256 === expected.backup && report.packageArchiveSha256 === expected.packageArchive &&
    report.packageSha256 === expected.package && report.manifest.sha256 === expected.manifest &&
    report.backupFiles === expected.backupFiles && report.packageFiles === expected.packageFiles &&
    equal(report.diffCounts, {ADD: expected.adds, REMOVE: 0, MODIFY: expected.modifies}), 'B0_REPORT_MISMATCH');
  const backup = archiveFiles(path.join(dir, 'backup-bundle.json'), expected.backup);
  const candidate = archiveFiles(path.join(dir, 'candidate-bundle.json'), expected.packageArchive);
  check(backup.length === expected.backupFiles && candidate.length === expected.packageFiles &&
    b0.sourceDigest(candidate) === expected.package, 'PACKAGE_MISMATCH');
  const manifest = backup.find(f => f.name === 'appsscript.json');
  check(manifest && hash(manifest.bytes) === expected.manifest &&
    candidate.find(f => f.name === manifest.name)?.bytes.equals(manifest.bytes), 'MANIFEST_MISMATCH');
  b0.validateManifest(manifest.bytes);
  const diff = b0.compare(b0.inventory(backup), b0.inventory(candidate));
  check(equal(diff, json(path.join(dir, 'diff.json'))) &&
    diff.filter(d => d.change === 'ADD').length === expected.adds &&
    diff.filter(d => d.change === 'MODIFY').length === expected.modifies &&
    !diff.some(d => d.change === 'REMOVE'), 'DIFF_MISMATCH');
  check(equal(diff.filter(d => d.change === 'ADD'), json(path.join(dir, 'restoration-residuals.json'))), 'RESIDUAL_LIST_MISMATCH');
  const lists = json(path.join(dir, 'backup-deployments-versions.json'));
  const other = json(path.join(dir, 'independent-read-deployments-versions.json'));
  check(equal(b0.validateLists(lists.versions, lists.deployments), lists) && equal(lists, other), 'B0_LISTS_MISMATCH');
  return {dir, backup, candidate, lists, diff, expected};
}
function knownState(files, evidence) {
  const allowed = new Map();
  for (const item of b0.inventory([...evidence.backup])) allowed.set(item.remoteName, [item]);
  for (const item of b0.inventory(evidence.candidate)) {
    allowed.set(item.remoteName, [...(allowed.get(item.remoteName) || []), item]);
  }
  // A partial known upload can be recovered; an unknown or concurrently edited file cannot.
  check(files.some(f => f.name === 'appsscript.json'), 'REMOTE_MANIFEST_MISSING');
  for (const item of b0.inventory(files)) {
    check(allowed.get(item.remoteName)?.some(a => a.type === item.type && a.sha256 === item.sha256), 'UNKNOWN_REMOTE_CHANGE_STOP');
  }
}
function claspEntry(packageRoot) {
  const dir = fs.realpathSync(packageRoot), pkg = json(path.join(dir, 'package.json'));
  check(pkg.name === '@google/clasp' && pkg.version === '3.3.0', 'B1_REQUIRES_REVIEWED_CLASP_330');
  const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.clasp;
  check(typeof bin === 'string' && !path.isAbsolute(bin), 'CLASP_ENTRY_INVALID');
  const entry = fs.realpathSync(path.join(dir, bin));
  check(entry.startsWith(dir + path.sep), 'CLASP_ENTRY_OUTSIDE_PACKAGE');
  return entry;
}
function newWorkspace(session, label, files) {
  const dir = fs.mkdtempSync(path.join(session, label + '-'));
  b0.materialize(path.join(dir, 'src'), files);
  writeNew(path.join(dir, '.clasp.json'), {scriptId: b0.TARGET, rootDir: 'src',
    scriptExtensions: ['.gs', '.js'], htmlExtensions: ['.html'], jsonExtensions: ['.json'], skipSubdirectories: false});
  return dir;
}
function makeTransport(entry, session, run = b0.native) {
  function call(operation, cwd) {
    check(['pull', 'list-versions', 'list-deployments', 'push'].includes(operation), 'GOOGLE_OPERATION_REFUSED');
    check(fs.realpathSync(cwd).startsWith(fs.realpathSync(session) + path.sep), 'WORKSPACE_OUTSIDE_SESSION');
    const config = json(path.join(cwd, '.clasp.json'));
    check(config.scriptId === b0.TARGET && config.rootDir === 'src' &&
      equal(config.scriptExtensions, ['.gs', '.js']) && equal(config.htmlExtensions, ['.html']) &&
      equal(config.jsonExtensions, ['.json']) && config.skipSubdirectories === false &&
      Object.keys(config).length === 6, 'CLASP_CONFIGURATION_CHANGED');
    const args = [entry, '--json', operation];
    if (operation === 'push') args.push('--force'); // Exact saved manifest, not permission to alter it.
    return JSON.parse(run(process.execPath, args, cwd).toString('utf8'));
  }
  return {
    snapshot(label) {
      const dir = newWorkspace(session, label, []);
      const before = b0.validateLists(call('list-versions', dir), call('list-deployments', dir));
      const result = call('pull', dir), files = b0.scan(path.join(dir, 'src'));
      check(result && Array.isArray(result.pulledFiles) && result.pulledFiles.length === files.length &&
        Array.isArray(result.deletedFiles) && result.deletedFiles.length === 0, 'PULL_INCOMPLETE');
      const after = b0.validateLists(call('list-versions', dir), call('list-deployments', dir));
      check(equal(before, after), 'LISTS_CHANGED_DURING_READ');
      writeNew(path.join(dir, 'inventory.json'), b0.inventory(files));
      writeNew(path.join(dir, 'lists.json'), after);
      return {files, lists: after};
    },
    push(files, label) {
      const dir = newWorkspace(session, label, files);
      check(same(b0.scan(path.join(dir, 'src')), files), 'LOCAL_PUSH_CONTENT_CHANGED');
      const result = call('push', dir);
      check(Array.isArray(result) && result.length === files.length, 'PUSH_RESULT_INCOMPLETE');
    }
  };
}
function assertLists(snapshot, evidence) {
  check(equal(snapshot.lists, evidence.lists), 'DEPLOYMENTS_OR_VERSIONS_CHANGED');
}
async function restore(evidence, io, record) {
  const observed = io.snapshot('before-restore');
  assertLists(observed, evidence);
  knownState(observed.files, evidence);
  if (!same(observed.files, evidence.backup)) {
    record('RESTORE_PUSH_INTENT');
    io.push(evidence.backup, 'restore-upload');
  }
  const restored = io.snapshot('after-restore');
  assertLists(restored, evidence);
  check(same(restored.files, evidence.backup), 'RESTORATION_INCOMPLETE');
  record('RESTORED_EXACT');
}
// A finally handles normal failures and EOF. OS/process termination needs the independent Restore mode.
async function execute(evidence, io, record, ask) {
  let attempted = false, restoredExact = false, testPassed = false, failure = null;
  try {
    const before = io.snapshot('before-upload');
    assertLists(before, evidence);
    check(same(before.files, evidence.backup), 'HEAD_CHANGED_SINCE_B0');
    record('CANDIDATE_PUSH_INTENT');
    attempted = true;
    io.push(evidence.candidate, 'candidate-upload');
    const candidate = io.snapshot('candidate-readback');
    assertLists(candidate, evidence);
    check(same(candidate.files, evidence.candidate), 'CANDIDATE_READBACK_MISMATCH');
    record('CANDIDATE_EXACT');
    const answer = await ask('Dans le portail RECETTE uniquement, executer AKS_runValidationSuiteV11. Attendre la fin (ou annuler et attendre son arret). Ne pas accepter de consentement inattendu. Saisir 761/761 uniquement pour 761 reussites et zero echec ; sinon ECHEC : ');
    testPassed = answer === '761/761';
    record(testPassed ? 'TEST_PASS_OPERATOR_REPORTED' : 'TEST_NOT_PASSED');
    check(testPassed, 'TEST_NOT_PASSED');
  } catch (error) { failure = safeError(error); }
  finally {
    if (attempted) {
      // Never overwrite an unknown concurrent edit, even during error recovery.
      try { await restore(evidence, io, record); restoredExact = true; }
      catch (error) { failure = 'RESTORE_REQUIRED_' + safeError(error); }
    }
  }
  return {status: failure || 'RESTORED_TEST_PASS_PROPERTIES_REVIEW_REQUIRED', testPassed, restoredExact, googleWriteAttempted: attempted};
}
function safeError(error) { return /^[A-Z0-9_]+$/.test(error?.message) ? error.message : 'B1_INTERNAL_FAILURE'; }
async function operatorPrompt(rl, prompt) {
  // Explicit abort on EOF: a pending readline question must not leave finally unexecuted.
  const controller = new AbortController();
  const closed = () => controller.abort();
  rl.once('close', closed);
  try { return await rl.question(prompt, {signal: controller.signal}); }
  finally { rl.removeListener('close', closed); }
}
function parseArgs(argv) {
  const allowed = ['mode', 'b0-run', 'repository', 'output', 'clasp-package', 'git', 'authorization', 'session'];
  const options = {mode: 'LocalCheck'};
  const seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && allowed.includes(key) && !seen.has(key) && typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    seen.add(key); options[key] = argv[i + 1];
  }
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  ['b0-run', 'clasp-package'].forEach(key => check(options[key], 'MISSING_ARGUMENT'));
  if (options.mode !== 'Restore') ['repository', 'git', 'output'].forEach(key => check(options[key], 'MISSING_ARGUMENT'));
  else check(options.session, 'RESTORE_SESSION_REQUIRED');
  if (options.mode !== 'LocalCheck') check(options.authorization === AUTHORIZATION, 'SEPARATE_B1_AUTHORIZATION_REQUIRED');
  return options;
}
async function main(options, deps = {}) {
  // Re-validate even for a caller not using the CLI parser.
  check(['LocalCheck', 'Execute', 'Restore'].includes(options.mode), 'INVALID_MODE');
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  if (options.mode !== 'LocalCheck') check(options.authorization === AUTHORIZATION, 'SEPARATE_B1_AUTHORIZATION_REQUIRED');
  const evidence = (deps.loadEvidence || loadEvidence)(options['b0-run']);
  const entry = claspEntry(options['clasp-package']);
  const run = deps.native || b0.native;
  if (options.mode !== 'Restore') {
    const repo = fs.realpathSync(options.repository);
    const config = json(path.join(repo, '.clasp.json'));
    check(config.scriptId === b0.TARGET && path.resolve(repo, config.rootDir || '.') === path.join(repo, 'src'), 'LOCAL_RECIPE_CONFIGURATION_MISMATCH');
    const source = (deps.gitSource || b0.gitSource)(repo, options.git, run);
    const adapted = source.map(f => f.name === 'appsscript.json' ? evidence.backup.find(b => b.name === f.name) : f);
    check(same(adapted, evidence.candidate), 'CANDIDATE_GIT_MISMATCH');
  }
  if (options.mode === 'LocalCheck') return {status: 'B1_LOCAL_CHECK_ONLY', googleWriteAttempted: false};
  const ask = deps.ask;
  check(typeof ask === 'function', 'INTERACTIVE_OPERATOR_REQUIRED');
  const confirmation = options.mode === 'Execute'
    ? 'Confirmer autorisation B1 distincte, references PR #145/688c81bb et #225 recontrolees, portail/URL absents, backend false, fenetre sans ecriture ni usage du lien dev : saisir B1-AUTORISE-FERME : '
    : 'Confirmer reprise autorisee, aucune execution Apps Script en cours, aucun changement concurrent, portail/URL absents et backend false : saisir RESTAURATION-AUTORISEE : ';
  check(await ask(confirmation) === (options.mode === 'Execute' ? 'B1-AUTORISE-FERME' : 'RESTAURATION-AUTORISEE'), 'OPERATOR_CONFIRMATION_REQUIRED');
  let session;
  if (options.mode === 'Restore') {
    session = fs.realpathSync(options.session);
    const saved = json(path.join(session, 'session.json'));
    check(saved.revision === 'B1-r1' && saved.target === b0.TARGET && saved.b0Run === evidence.dir &&
      saved.candidate === b0.CANDIDATE && saved.package === EXPECTED.package && saved.backup === EXPECTED.backup &&
      saved.listsSha256 === hash(JSON.stringify(evidence.lists)), 'RECOVERY_SESSION_MISMATCH');
    const events = fs.readdirSync(session).filter(n => /^event-[a-f0-9-]+\.json$/.test(n)).map(n => json(path.join(session, n)));
    check(events.some(e => e.event === 'CANDIDATE_PUSH_INTENT'), 'NO_CANDIDATE_PUSH_INTENT');
  } else {
    const root = path.resolve(options.output), repo = fs.realpathSync(options.repository);
    check(root !== repo && !root.startsWith(repo + path.sep) && root !== evidence.dir && !root.startsWith(evidence.dir + path.sep), 'OUTPUT_INSIDE_PROTECTED_DIRECTORY');
    fs.mkdirSync(root, {recursive: true, mode: 0o700});
    session = fs.mkdtempSync(path.join(root, 'b1-'));
    writeNew(path.join(session, 'session.json'), {revision: 'B1-r1', target: b0.TARGET,
      b0Run: evidence.dir, candidate: b0.CANDIDATE, package: EXPECTED.package, backup: EXPECTED.backup,
      listsSha256: hash(JSON.stringify(evidence.lists)), createdAt: new Date().toISOString()});
  }
  const notify = deps.notify || (() => {});
  notify('Session B1 (conserver pour Restore) : ' + session);
  const record = event => writeNew(path.join(session, 'event-' + crypto.randomUUID() + '.json'), {event, at: new Date().toISOString()});
  record('OPERATOR_PRECONDITIONS_CONFIRMED');
  const io = deps.io || makeTransport(entry, session, run);
  let result;
  if (options.mode === 'Restore') {
    try { await restore(evidence, io, record); result = {status: 'RESTORED_RECOVERY_PROPERTIES_REVIEW_REQUIRED', restoredExact: true, testPassed: false}; }
    catch (error) { result = {status: 'RESTORE_REQUIRED_' + safeError(error), restoredExact: false, testPassed: false}; }
  } else result = await execute(evidence, io, record, ask);
  result.session = session;
  // A restored code snapshot never proves equality of unobserved properties.
  result.propertiesOperatorConfirmed = false;
  if (result.restoredExact) {
    try {
      result.propertiesOperatorConfirmed = await ask('Apres restauration, recontroler portail/URL absents et backend false, aucune autre propriete modifiee. Saisir PROPRIETES-CONFIRMEES : ') === 'PROPRIETES-CONFIRMEES';
    } catch (_) { /* Keep the restored result and the explicit missing confirmation. */ }
  }
  writeNew(path.join(session, 'result-' + crypto.randomUUID() + '.json'), result);
  return result;
}
module.exports = {EXPECTED, AUTHORIZATION, archiveFiles, loadEvidence, knownState, claspEntry,
  makeTransport, newWorkspace, restore, execute, parseArgs, main, operatorPrompt};
if (require.main === module) {
  let rl;
  (async () => {
    const options = parseArgs(process.argv.slice(2));
    if (options.mode !== 'LocalCheck') {
      check(process.stdin.isTTY && process.stdout.isTTY, 'INTERACTIVE_TERMINAL_REQUIRED');
      rl = readline.createInterface({input: process.stdin, output: process.stdout});
    }
    const result = await main(options, {ask: rl ? prompt => operatorPrompt(rl, prompt) : undefined, notify: console.log});
    console.log(JSON.stringify(result, null, 2));
    // Even a successful run awaits human review; a non-pass/recovery is never test success.
    if (!['B1_LOCAL_CHECK_ONLY', 'RESTORED_TEST_PASS_PROPERTIES_REVIEW_REQUIRED', 'RESTORED_RECOVERY_PROPERTIES_REVIEW_REQUIRED'].includes(result.status)) process.exitCode = 1;
  })().catch(error => { console.error(safeError(error)); process.exitCode = 1; }).finally(() => rl?.close());
}
