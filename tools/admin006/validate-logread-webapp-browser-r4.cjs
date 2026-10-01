#!/usr/bin/env node
'use strict';
// R4 preparation: CLI is LOCAL ONLY. No native Google transport or remote mode.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const parserPath = path.join(__dirname, 'r4-vendor', 'acorn.cjs');
if (crypto.createHash('sha256').update(fs.readFileSync(parserPath)).digest('hex') !== 'b373ccd10e9deb63654289f73216eeefcaf0405d9ee24289aabf596b91b4c318') {
  throw new Error('PARSER_INTEGRITY_MISMATCH');
}
const acorn = require(parserPath);
const PIN = Object.freeze({
  revision: 'LOGREAD-webapp-browser-r4-preparation-1',
  projectBook: 'fe7a9a55c7f0fdb27ae85aec2c34208b568f0f82',
  target: '1quyIoxSMlxe6xpADPlxRxGikRF3OCTEid0-xhOHeSRZH0sU0AOeIRxs4',
  backend: '1_C157CtD95GegcpxSrKcL6bRDyea1cPfH9NfJywBnTmJQzKY30qfNNUu',
  candidate: '6a7d86300d90c3f9a629e89a113dc7b0dd7e5f73',
  source: '3931cc5b455b40fa7eb3dd76f8c7cb41d5acae3b5ad7674b5a67be7f286a465f',
  archive: '19f0755b6a33aeff303f7c0c01e15e0ff1e7f467752e5a046e7288cb1d4a5594',
  manifest: '40ebf6b32fb6cba6f0b44ada9ce85fd023fee18f0599833b08e18f26336b0b38',
  packageReport: '5f79f2cb66c4d1a28f5e6ae98e2a4fd88c73dd5d37472b16664cecc52986f21e',
  historicalSource: '4ae80c6792c16f7efa006926ffafd4c202e3cb983b05b81ce63ea846c20110f3',
  historicalManifest: 'f9a8681074723b58dca5d4e55a3c35e76165aa1675909f498d5e2c0e907f9ddf',
  historicalArchive: 'c07efd3d245f6d4ba1009104c7f5fc1ea822c135eefa6658b188166b8daf6901',
  r2Result: '8710a077276902135c9071d674b9b90294bf271c9c1d06a34388969b987f74c8',
  r2Inventory: '919f02d58d9b0d848fbca9c305bd8ff67d5c06885dbc4357d4103ab139049a00',
  candidateFiles: 279, historicalFiles: 261, versions: 10, deployments: 2,
  deploymentSuffix: 'OMcZ9gl', baselineVersion: 8, candidateVersion: 10,
  packageSession: 'logread-webapp-package-arjzvs', r3Session: 'logread-webapp-browser-r3-mAKvaa'
});
const FUNCTIONS = Object.freeze([
  'AKS_connectAudit001Recipe', 'AKS_preflightAccess002LogReadRecipe',
  'AKS_applyAccess002LogReadRecipe', 'AKS_restoreAccess002LogReadRecipe',
  'AKS_disconnectAudit001Recipe'
]);
const PROPERTIES = Object.freeze([
  'AKS_PRIVATE_PORTAL_ENVIRONMENT', 'AKS_PRIVATE_CALLER_PROJECT',
  'AKS_PRIVATE_BACKEND_URL', 'AKS_PRIVATE_TIMEOUT_MS', 'AKS_PRIVATE_PORTAL_ENABLED'
]);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function check(ok, code) { if (!ok) throw new Error(code); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  return value;
}
const equal = (a, b) => JSON.stringify(stable(a)) === JSON.stringify(stable(b));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
function safeName(name) {
  check(typeof name === 'string' && name && !name.includes('\\') && !name.startsWith('/') &&
    !/[\x00-\x1f\x7f:]/.test(name) && name.split('/').every(p => p && p !== '.' && p !== '..' &&
      !/[. ]$/.test(p) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p)), 'UNSAFE_FILE_NAME');
  return name;
}
function inventory(files) {
  const seen = new Set();
  return files.map(f => {
    safeName(f.name); check(Buffer.isBuffer(f.bytes), 'INVALID_FILE_BYTES');
    const type = f.name === 'appsscript.json' ? 'JSON' : /\.(gs|js)$/.test(f.name) ? 'SERVER_JS' : f.name.endsWith('.html') ? 'HTML' : null;
    check(type, 'UNEXPECTED_FILE_TYPE');
    const remoteName = f.name.replace(/\.(gs|js|html|json)$/, '');
    check(!seen.has(remoteName.toLowerCase()), 'REMOTE_NAME_COLLISION'); seen.add(remoteName.toLowerCase());
    return {remoteName, type, bytes: f.bytes.length, sha256: hash(f.bytes)};
  }).sort((a, b) => a.remoteName < b.remoteName ? -1 : a.remoteName > b.remoteName ? 1 : 0);
}
const same = (a, b) => equal(inventory(a), inventory(b));
function sourceDigest(files) {
  const h = crypto.createHash('sha256');
  [...files].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    .forEach(f => { h.update(f.name + '\0'); h.update(f.bytes); h.update('\0'); });
  return h.digest('hex');
}
function scan(root) {
  const stat = fs.lstatSync(root); check(stat.isDirectory() && !stat.isSymbolicLink(), 'REGULAR_DIRECTORY_REQUIRED');
  const walk = (dir, prefix) => fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    check(!e.isSymbolicLink(), 'SYMLINK_REFUSED');
    const name = prefix + e.name, file = path.join(dir, e.name);
    if (e.isDirectory()) return walk(file, name + '/');
    check(e.isFile(), 'REGULAR_FILE_REQUIRED');
    return [{name: safeName(name), bytes: fs.readFileSync(file)}];
  });
  const files = walk(root, ''); inventory(files); return files;
}
function archiveFiles(file, digest, target = PIN.target) {
  const raw = fs.readFileSync(file); check(hash(raw) === digest, 'ARCHIVE_HASH_MISMATCH');
  const value = JSON.parse(raw.toString('utf8'));
  check(['AKS-D4B-SNAPSHOT/1', 'AKS-D4C-READONLY-SNAPSHOT/1'].includes(value.format) &&
    value.target === target && Array.isArray(value.files), 'ARCHIVE_FORMAT_INVALID');
  const files = value.files.map(f => {
    const bytes = Buffer.from(f.base64 || '', 'base64');
    check(typeof f.base64 === 'string' && bytes.toString('base64') === f.base64 && hash(bytes) === f.sha256 &&
      Buffer.from(bytes.toString('utf8')).equals(bytes), 'ARCHIVE_CONTENT_INVALID');
    const row = {name: f.name, bytes}; check(inventory([row])[0].type === f.type, 'ARCHIVE_TYPE_INVALID'); return row;
  });
  inventory(files); return files;
}
function manifest(files, expected = PIN.manifest) {
  const f = files.find(f => f.name === 'appsscript.json'); check(f && hash(f.bytes) === expected, 'MANIFEST_HASH_MISMATCH');
  const m = JSON.parse(f.bytes.toString('utf8'));
  check(equal(Object.keys(m).sort(), ['dependencies', 'exceptionLogging', 'runtimeVersion', 'timeZone', 'webapp']) &&
    m.timeZone === 'Europe/Paris' && equal(m.dependencies, {}) && m.exceptionLogging === 'STACKDRIVER' &&
    m.runtimeVersion === 'V8' && equal(m.webapp, {access: 'ANYONE', executeAs: 'USER_ACCESSING'}), 'MANIFEST_CONTRACT_MISMATCH');
}
// Parse actual SERVER_JS and inspect global declarations without executing Apps Script.
function functionsPresent(files) {
  inventory(files); const declarations = new Map();
  for (const f of files.filter(f => /\.(gs|js)$/.test(f.name))) {
    const names = topLevelFunctions(f.bytes.toString('utf8'));
    for (const name of names) declarations.set(name, (declarations.get(name) || 0) + 1);
  }
  for (const name of FUNCTIONS) check(declarations.get(name) === 1, 'OPERATOR_FUNCTION_MISSING_OR_DUPLICATE');
  return [...FUNCTIONS];
}
// Full parser: accept only direct Program FunctionDeclarations, with zero arguments.
function topLevelFunctions(source) {
  const ast = acorn.parse(source, {ecmaVersion: 2022, sourceType: 'script'});
  return ast.body.filter(n => n.type === 'FunctionDeclaration' && n.id &&
    n.params.length === 0 && !n.async && !n.generator).map(n => n.id.name);
}
function loadLocal(options, pin = PIN) {
  const dir = fs.realpathSync(options['package-run']);
  check(path.basename(dir) === pin.packageSession, 'WRONG_PACKAGE_SESSION');
  const reportFile = path.join(dir, 'report.json'); check(hash(fs.readFileSync(reportFile)) === pin.packageReport, 'PACKAGE_REPORT_HASH_MISMATCH');
  const report = readJson(reportFile);
  check(report.candidate === pin.candidate && report.target === pin.target && report.packageSha256 === pin.source &&
    report.packageArchiveSha256 === pin.archive && report.sourceFiles === pin.candidateFiles && report.packageFiles === pin.candidateFiles &&
    report.status === 'LOCAL_WEBAPP_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED', 'PACKAGE_REPORT_MISMATCH');
  const candidate = archiveFiles(path.join(dir, 'candidate-bundle.json'), pin.archive);
  check(candidate.length === pin.candidateFiles && sourceDigest(candidate) === pin.source, 'PACKAGE_SOURCE_MISMATCH');
  manifest(candidate, pin.manifest); functionsPresent(candidate);
  const installed = scan(path.join(dir, 'candidate', 'src'));
  check(sourceDigest(installed) === pin.source && same(installed, candidate), 'LOCAL_CANDIDATE_MISMATCH');
  const backup = scan(path.join(dir, 'historical-rollback', 'src'));
  check(backup.length === pin.historicalFiles && sourceDigest(backup) === pin.historicalSource &&
    hash(backup.find(f => f.name === 'appsscript.json')?.bytes || '') === pin.historicalManifest, 'LOCAL_ROLLBACK_MISMATCH');
  check(same(backup, archiveFiles(path.join(dir, 'historical-c1-bundle.json'), pin.historicalArchive)), 'ROLLBACK_ARCHIVE_MISMATCH');
  check(!fs.existsSync(path.join(dir, '.clasp.json')) && !fs.existsSync(path.join(dir, 'candidate', '.clasp.json')), 'CLASP_CONFIGURATION_REFUSED');
  const r3 = fs.realpathSync(options['r3-session']); check(path.basename(r3) === pin.r3Session, 'WRONG_R3_SESSION');
  const binding = readJson(path.join(r3, 'session.json')).binding;
  check(binding.revision === 'LOGREAD-webapp-browser-r3' && binding.candidate === pin.candidate &&
    binding.packageSha256 === pin.source && binding.r2ResultSha256 === pin.r2Result &&
    binding.r2CanonicalInventorySha256 === pin.r2Inventory && fs.realpathSync(binding.packageRun) === dir, 'R3_BINDING_MISMATCH');
  const rows = fs.readdirSync(r3).filter(n => /^result-[a-f0-9-]+\.json$/.test(n)).map(name => ({name, value: readJson(path.join(r3, name))}));
  const finals = rows.filter(r => r.value.status === 'RESTORED_WEBAPP_VERSION_8_VERSION_10_VERIFIED_BROWSER_REVIEW_REQUIRED' && r.value.failure === null);
  check(finals.length === 1, 'R3_FINAL_RESULT_AMBIGUOUS');
  const r = finals[0].value;
  check(r.revision === binding.revision && r.target === pin.target && r.candidate === pin.candidate && r.packageSha256 === pin.source &&
    fs.realpathSync(r.session) === r3 && r.immutableVersion10Verified === true && r.webAppRestoredToVersion8 === true &&
    r.deploymentConfigurationRestored === true && r.versionRetained === true && r.newDeploymentCreated === false &&
    r.codePushAttempted === false, 'R3_NOT_RESTORED');
  const events = new Set(fs.readdirSync(r3).filter(n => /^event-[a-f0-9-]+\.json$/.test(n)).map(n => readJson(path.join(r3, n)).event));
  for (const name of ['VERSION_10_VERIFIED', 'AUDIT_CONNECTED', 'AUDIT_DISCONNECTED', 'WEBAPP_RESTORED_TO_8', 'RESTORED_EXACT', 'CODE_RESTORED']) check(events.has(name), 'R3_EVENTS_INCOMPLETE');
  for (const name of ['LOGREAD_PREFLIGHT_OK', 'LOGREAD_ACCESS_APPLIED', 'PRIVATE_ACTIVATED', 'MANAGER_BROWSER_PASS', 'DENIED_BROWSER_PASS']) check(!events.has(name), 'R3_UNEXPECTED_COMPLETED_STEP');
  return {candidate, backup, localEvidence: {packageReportSha256: pin.packageReport,
    r3FinalResultSha256: hash(fs.readFileSync(path.join(r3, finals[0].name))), r3BindingSha256: hash(fs.readFileSync(path.join(r3, 'session.json')))}};
}
// Append-only numbered records, hash chain and fsync; recovery reads order, never a union of UUID files.
class Journal {
  constructor(dir, binding, create = false) {
    this.dir = dir;
    if (create) { fs.mkdirSync(dir, {recursive: false, mode: 0o700}); this.write('binding.json', binding); }
    check(equal(readJson(path.join(dir, 'binding.json')), binding), 'SESSION_BINDING_MISMATCH');
    this.binding = binding; this.rows = this.read();
  }
  write(name, value) {
    const fd = fs.openSync(path.join(this.dir, name), 'wx', 0o600);
    try { fs.writeFileSync(fd, JSON.stringify(value) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  }
  read() {
    const files = fs.readdirSync(this.dir).filter(n => /^event-\d{6}\.json$/.test(n)).sort();
    let previous = hash(JSON.stringify(stable(this.binding)));
    return files.map((file, i) => {
      check(file === `event-${String(i + 1).padStart(6, '0')}.json`, 'JOURNAL_GAP');
      const row = readJson(path.join(this.dir, file)), {digest, ...data} = row;
      check(data.seq === i + 1 && data.previous === previous && digest === hash(JSON.stringify(stable(data))), 'JOURNAL_CORRUPT');
      check(typeof data.op === 'string' && ['INTENT', 'DONE', 'BASELINE', 'OBSERVED', 'FAILURE'].includes(data.state), 'JOURNAL_RECORD_INVALID');
      previous = digest; return row;
    });
  }
  add(op, state, evidence = {}) {
    check(equal(this.rows, this.read()), 'JOURNAL_CONCURRENT_CHANGE');
    const data = {seq: this.rows.length + 1, previous: this.rows.at(-1)?.digest || hash(JSON.stringify(stable(this.binding))),
      op, state, evidence, at: new Date().toISOString()};
    const row = {...data, digest: hash(JSON.stringify(stable(data)))};
    this.write(`event-${String(data.seq).padStart(6, '0')}.json`, row); this.rows.push(row); return row;
  }
  last(op) { return this.rows.filter(r => r.op === op).at(-1); }
  touched(op) { return this.rows.some(r => r.op === op && r.state === 'INTENT'); }
  done(op) { return this.last(op)?.state === 'DONE'; }
}
const EXPECT = Object.freeze({
  audit: {ok: true, phase: 'CONNECTED', spreadsheetTitle: 'AKS Audit RECETTE', backupVerified: true, alreadyConnected: false},
  preflight: {ok: true, environment: 'RECETTE', scriptIdSuffix: 'eIRxs4', recipeProfile: 'LOG_READ', phase: 'PREFLIGHT',
    bootstrap: true, accountCountBefore: 0, accountCountProposed: 1, writePerformed: false},
  access: {ok: true, environment: 'RECETTE', scriptIdSuffix: 'eIRxs4', recipeProfile: 'LOG_READ', phase: 'APPLIED',
    managerAccess: true, deniedAccess: false, backupVerified: true, alreadyApplied: false},
  'restore-access': {ok: true, environment: 'RECETTE', scriptIdSuffix: 'eIRxs4', recipeProfile: 'LOG_READ', phase: 'RESTORED', exactRestore: true, backupRemoved: true},
  'disconnect-audit': {ok: true, phase: 'DISCONNECTED', exactRestore: true, backupRemoved: true}
});
const ACTIONS = Object.freeze({
  audit: {fn: FUNCTIONS[0], token: 'AUDIT-CONNECTE'}, preflight: {fn: FUNCTIONS[1], token: 'PREFLIGHT-OK'},
  access: {fn: FUNCTIONS[2], token: 'ACCESS-APPLIQUE'}, 'restore-access': {fn: FUNCTIONS[3], token: 'ACCESS-RESTAURE'},
  'disconnect-audit': {fn: FUNCTIONS[4], token: 'AUDIT-DECONNECTE'}
});
function prompt(action, extra = '') {
  const a = ACTIONS[action]; check(a, 'UNKNOWN_OPERATOR_ACTION');
  return `Project: PORTAIL RECETTE ${PIN.target}\nFunction: ${a.fn}\nExpected JSON fields: ${JSON.stringify(EXPECT[action])}${extra}\n` +
    `PowerShell token: ${a.token}\nIf absent or result differs: do not enter success token; preserve result; stop and request recovery. Never use a historical substitute.\n`;
}
function validateResult(action, response, baselineRevision) {
  check(response && response.token === ACTIONS[action].token && response.result && typeof response.result === 'object', 'OPERATOR_NOT_CONFIRMED');
  const r = response.result;
  if (action === 'restore-access' && r.alreadyRestored === true) {
    check(r.ok === true && r.environment === 'RECETTE' && r.scriptIdSuffix === 'eIRxs4' &&
      r.recipeProfile === 'LOG_READ' && r.phase === 'RESTORED' && r.revision === baselineRevision &&
      response.baselineAndBackupAbsenceOperatorConfirmed === true, 'ACCESS_RESTORATION_NOT_CONFIRMED');
  } else {
    check(Object.entries(EXPECT[action]).every(([k, v]) => equal(r[k], v)), 'OPERATOR_RESULT_MISMATCH');
    if (action === 'restore-access') check(r.revision === baselineRevision, 'ACCESS_REVISION_MISMATCH');
  }
  // Deliberately retain only fixed booleans/phase/profile, never raw logs or identities.
  return {contractConfirmed: true, operatorConfirmed: true, phase: r.phase};
}
function normalizeLists(lists) {
  check(lists && Array.isArray(lists.versions) && Array.isArray(lists.deployments), 'LISTS_INVALID');
  check(new Set(lists.versions.map(v => v.versionNumber)).size === lists.versions.length &&
    lists.versions.every(v => Number.isInteger(v.versionNumber) && v.versionNumber > 0), 'VERSIONS_INVALID');
  check(new Set(lists.deployments.map(d => d.deploymentId)).size === lists.deployments.length &&
    lists.deployments.every(d => typeof d.deploymentId === 'string' && d.deploymentId), 'DEPLOYMENTS_INVALID');
  return {versions: [...lists.versions].sort((a, b) => a.versionNumber - b.versionNumber),
    deployments: [...lists.deployments].sort((a, b) => a.deploymentId < b.deploymentId ? -1 : 1)};
}
function baseline(e, lists) {
  const l = normalizeLists(lists); check(l.versions.length === 10 && l.deployments.length === 2, 'BASELINE_COUNTS_CHANGED');
  check(l.versions.some(v => v.versionNumber === 10 && v.description === 'ADMIN-006 D4-C LOG_READ Web App ' + PIN.candidate.slice(0, 12)), 'VERSION_10_NOT_EXACT');
  const matches = l.deployments.filter(d => d.deploymentId.endsWith(PIN.deploymentSuffix));
  check(matches.length === 1 && matches[0].versionNumber === 8 && typeof matches[0].description === 'string', 'BASELINE_DEPLOYMENT_INVALID');
  check(e.propertiesBaselineOperatorConfirmed === true && e.secretContinuityOperatorConfirmed === true &&
    typeof e.registryRevision === 'string' && e.registryRevision, 'BASELINE_OPERATOR_EVIDENCE_REQUIRED');
  return {lists: l, deploymentId: matches[0].deploymentId, description: matches[0].description};
}
function phase(lists, b) {
  const l = normalizeLists(lists); check(equal(l.versions, b.lists.versions), 'VERSION_INVENTORY_CHANGED');
  check(l.deployments.length === b.lists.deployments.length, 'DEPLOYMENT_INVENTORY_CHANGED');
  for (const old of b.lists.deployments) {
    const now = l.deployments.find(d => d.deploymentId === old.deploymentId); check(now, 'DEPLOYMENT_INVENTORY_CHANGED');
    const strip = x => Object.fromEntries(Object.entries(x).filter(([k]) => k !== 'updateTime'));
    if (old.deploymentId === b.deploymentId) {
      check([8, 10].includes(now.versionNumber) && equal(strip(now), strip({...old, versionNumber: now.versionNumber})), 'DEPLOYMENT_CONFIGURATION_CHANGED');
    } else check(equal(now, old), 'OTHER_DEPLOYMENT_CHANGED');
  }
  return l.deployments.find(d => d.deploymentId === b.deploymentId).versionNumber;
}
function knownState(files, e) {
  const allowed = [...inventory(e.backup), ...inventory(e.candidate)];
  check(files.some(f => f.name === 'appsscript.json'), 'MANIFEST_MISSING');
  check(inventory(files).every(f => allowed.some(a => equal(a, f))), 'UNKNOWN_REMOTE_CHANGE');
}
async function observe(io, b, version, wait = async () => {}) {
  for (let i = 0; i < 5; i++) {
    if (phase(await io.lists(), b) === version) return;
    if (i < 4) await wait(250 * (i + 1));
  }
  throw new Error('DEPLOYMENT_OBSERVATION_TIMEOUT');
}
function capabilityPorts(io) {
  check(io && ['snapshot', 'lists', 'readVersion10', 'push', 'updateDeployment'].every(k => typeof io[k] === 'function'), 'OFFLINE_PORTS_REQUIRED');
  check(Object.keys(io).every(k => ['snapshot', 'lists', 'readVersion10', 'push', 'updateDeployment'].includes(k)), 'FORBIDDEN_TRANSPORT_CAPABILITY');
}
function sessionBinding(e, b) {
  return {revision: PIN.revision, target: PIN.target, candidate: PIN.candidate, source: PIN.source,
    candidateCanonical: hash(JSON.stringify(inventory(e.candidate))), backupCanonical: hash(JSON.stringify(inventory(e.backup))),
    baseline: b, registryRevision: e.registryRevision, localEvidence: e.localEvidence || {}};
}
async function manual(op, j, operator, revision) {
  j.add(op, 'INTENT'); const response = await operator.action(op, prompt(op));
  j.add(op, 'DONE', validateResult(op, response, revision));
}
async function property(op, j, operator, key, target, expected, token) {
  j.add(op, 'INTENT');
  const text = `Project: ${target}\nProperty: ${key}\nExpected: ${expected}\nPowerShell token: ${token}\n` +
    'If missing target, unexpected value or uncertain write: do not enter success token; preserve evidence and stop. Do not disclose secrets or backend URL.\n';
  const result = await operator.property(op, {key, target, expected, token, prompt: text});
  check(result?.token === token && result.operatorConfirmed === true, 'PROPERTY_NOT_CONFIRMED');
  j.add(op, 'DONE', {operatorConfirmed: true});
}
const propertyOp = key => 'property-' + key;
async function cleanupManual(e, j, operator, notes) {
  // Flags first, then wait for in-flight requests, then remove configuration.
  const privateTouched = PROPERTIES.some(k => j.touched(propertyOp(k))) || j.touched('backend-on');
  if (privateTouched) {
    if (j.touched(propertyOp('AKS_PRIVATE_PORTAL_ENABLED')) && !j.done('portal-off'))
      await property('portal-off', j, operator, 'AKS_PRIVATE_PORTAL_ENABLED', PIN.target, 'false', 'PORTAIL-FERME');
    if (j.touched('backend-on') && !j.done('backend-off'))
      await property('backend-off', j, operator, 'AKS_PRIVATE_ENABLED', PIN.backend, 'false', 'BACKEND-FERME');
    if (!j.done('requests-ended')) {
      j.add('requests-ended', 'INTENT');
      check(await operator.confirm('requests-ended', 'Wait for running requests to end. PowerShell token: REQUETES-TERMINEES') === 'REQUETES-TERMINEES', 'REQUESTS_STILL_UNCERTAIN');
      j.add('requests-ended', 'DONE', {operatorConfirmed: true});
    }
    for (const key of PROPERTIES) if (j.touched(propertyOp(key)) && !j.done('remove-' + key))
      await property('remove-' + key, j, operator, key, PIN.target, 'ABSENT (initial state)', 'PROPRIETE-RESTAUREE');
  }
  for (const [created, restored] of [['access', 'restore-access'], ['audit', 'disconnect-audit']]) {
    if (!j.touched(created) || j.done(restored) || j.last(restored)?.state === 'BASELINE') continue;
    if (!j.done(created) || (j.touched(restored) && !j.done(restored))) {
      const observation = await operator.resolve(created,
        `Project: ${PIN.target}. Inspect saved state without applying again. Return BASELINE, APPLIED, PARTIAL or CONFLICT with confirmed evidence. Incomplete ACCESS backup: stop; do not delete it.`);
      check(observation?.operatorConfirmed === true && ['BASELINE', 'APPLIED', 'PARTIAL', 'CONFLICT'].includes(observation.state), 'UNCERTAIN_MANUAL_STATE');
      j.add('resolve-' + created, 'OBSERVED', {state: observation.state, operatorConfirmed: true});
      if (observation.state === 'BASELINE') {
        check(observation.backupAbsent === true, 'BACKUP_STILL_PRESENT');
        j.add(restored, 'BASELINE', {operatorConfirmed: true}); continue;
      }
      check(observation.state === 'APPLIED', 'MANUAL_RECOVERY_BLOCKED');
    }
    await manual(restored, j, operator, e.registryRevision);
  }
  if (j.touched('audit') || j.touched('access') || privateTouched) {
    check(await operator.confirm('baseline-properties', 'Inspect initial properties, registry and recipe backup absences; secrets unchanged. PowerShell token: ETAT-INITIAL-CONFIRME') === 'ETAT-INITIAL-CONFIRME', 'BASELINE_PROPERTIES_NOT_CONFIRMED');
    j.add('baseline-properties', 'DONE', {operatorConfirmed: true});
  }
  notes.manualRestoredOperatorConfirmed = true;
}
async function restoreDeployment(io, b, j, wait) {
  const current = phase(await io.lists(), b);
  if (current === 10 || (j.touched('deployment-10') && !j.done('deployment-8'))) {
    j.add('deployment-8', 'INTENT');
    await io.updateDeployment(b.deploymentId, 8, b.description); await observe(io, b, 8, wait);
    j.add('deployment-8', 'DONE');
  } else j.add('deployment-8', 'DONE', {alreadyBaseline: true});
}
async function recover(e, b, io, operator, j, wait = async () => {}) {
  capabilityPorts(io);
  check(equal(sessionBinding(e, b), j.binding), 'RECOVERY_BINDING_MISMATCH');
  const notes = {manualRestoredOperatorConfirmed: false, deploymentRestored: false, headRestored: false};
  let manualFailure = null, deploymentFailure = null, codeFailure = null;
  try { await cleanupManual(e, j, operator, notes); } catch (err) { manualFailure = safeError(err); j.add('manual-recovery', 'FAILURE', {code: manualFailure}); }
  // Return to version 8 independently; retain candidate functions while manual recovery is blocked.
  try { await restoreDeployment(io, b, j, wait); notes.deploymentRestored = true; }
  catch (err) { deploymentFailure = safeError(err); j.add('deployment-recovery', 'FAILURE', {code: deploymentFailure}); }
  if (!manualFailure && !deploymentFailure) {
    try {
      const before = await io.snapshot(); check(phase(before.lists, b) === 8, 'DEPLOYMENT_NOT_RESTORED'); knownState(before.files, e);
      if (!same(before.files, e.backup)) { j.add('restore-head', 'INTENT'); await io.push(e.backup, 'restore'); }
      const after = await io.snapshot(); check(phase(after.lists, b) === 8 && same(after.files, e.backup), 'HEAD_RESTORATION_INCOMPLETE');
      j.add('restore-head', 'DONE'); notes.headRestored = true;
    } catch (err) { codeFailure = safeError(err); j.add('head-recovery', 'FAILURE', {code: codeFailure}); }
  }
  return {...notes, status: manualFailure ? 'MANUAL_RECOVERY_BLOCKED' : deploymentFailure || codeFailure ? 'RESTORE_REQUIRED' : 'RESTORED',
    recoveryFailures: [manualFailure, deploymentFailure, codeFailure].filter(Boolean)};
}
// Injectable offline engine. No native implementation is supplied in this preparation.
async function campaign(e, io, operator, j, wait = async () => {}) {
  capabilityPorts(io); check(operator && ['action', 'property', 'confirm', 'resolve', 'browser'].every(k => typeof operator[k] === 'function'), 'OPERATOR_PORTS_REQUIRED');
  check(!j.rows.length, 'EXECUTION_ALREADY_STARTED');
  let b = j.binding.baseline, failure = null, browserPassed = false;
  check(equal(sessionBinding(e, b), j.binding), 'RECOVERY_BINDING_MISMATCH');
  try {
    const initial = await io.snapshot(); check(equal(normalizeLists(initial.lists), b.lists) && phase(initial.lists, b) === 8 && same(initial.files, e.backup), 'INITIAL_STATE_CHANGED');
    functionsPresent(e.candidate); manifest(e.candidate);
    let immutable;
    for (let i = 0; i < 5; i++) {
      immutable = await io.readVersion10();
      if (immutable) break;
      if (i < 4) await wait(250 * (i + 1));
    }
    check(immutable && phase(immutable.lists, b) === 8 && immutable.files.length === PIN.candidateFiles && same(immutable.files, e.candidate), 'IMMUTABLE_VERSION_10_MISMATCH');
    manifest(immutable.files); j.add('version-10', 'DONE');
    j.add('install-head', 'INTENT'); await io.push(e.candidate, 'install');
    const installed = await io.snapshot(); check(phase(installed.lists, b) === 8 && same(installed.files, e.candidate), 'CANDIDATE_READBACK_MISMATCH');
    functionsPresent(installed.files); j.add('install-head', 'DONE');
    j.add('editor-functions', 'INTENT');
    check(await operator.confirm('editor-functions', `Project: ${PIN.target}\nRefresh editor and verify all five exact global functions: ${FUNCTIONS.join(', ')}\nPowerShell token: FONCTIONS-PRESENTES\nIf one is absent: stop; no AUDIT, ACCESS or deployment update.`) === 'FONCTIONS-PRESENTES', 'EDITOR_FUNCTIONS_NOT_CONFIRMED');
    j.add('editor-functions', 'DONE', {operatorConfirmed: true});
    await manual('audit', j, operator, e.registryRevision); await manual('preflight', j, operator, e.registryRevision);
    await manual('access', j, operator, e.registryRevision);
    check(phase(await io.lists(), b) === 8, 'DEPLOYMENT_NOT_READY');
    j.add('deployment-10', 'INTENT'); await io.updateDeployment(b.deploymentId, 10, b.description);
    await observe(io, b, 10, wait); j.add('deployment-10', 'DONE');
    const values = ['RECETTE', PIN.target, 'Exact protected D3-D3 /exec endpoint; do not paste it here', '10000'];
    for (let i = 0; i < 4; i++) await property(propertyOp(PROPERTIES[i]), j, operator, PROPERTIES[i], PIN.target, values[i], 'PROPRIETE-CONFIGUREE');
    await property('backend-on', j, operator, 'AKS_PRIVATE_ENABLED', PIN.backend, 'true', 'BACKEND-ACTIVE');
    await property(propertyOp(PROPERTIES[4]), j, operator, PROPERTIES[4], PIN.target, 'true', 'PORTAIL-ACTIVE');
    for (const [op, token] of [['oauth', 'OAUTH-REVU'], ['manager', 'GESTIONNAIRE-OK'], ['denied', 'REFUS-OK']]) {
      j.add('browser-' + op, 'INTENT');
      const response = await operator.browser(op, {project: PIN.target, deploymentId: b.deploymentId, version: 10, token,
        instruction: op === 'oauth' ? 'Review only expected consent; stop on unexpected scope.' : op === 'manager' ? 'One explicit Journaux request, enabled manager. No retry. Keep minimized proof.' : 'Separate denied account profile. Confirm denied access and no private data. No retry.'});
      check(response?.token === token && response.operatorConfirmed === true, 'BROWSER_NOT_CONFIRMED');
      j.add('browser-' + op, 'DONE', {operatorConfirmed: true});
    }
    browserPassed = true;
  } catch (err) { failure = safeError(err); j.add('campaign', 'FAILURE', {code: failure}); }
  const restoration = j.touched('install-head') ? await recover(e, b, io, operator, j, wait) :
    {status: 'STOPPED_NO_MUTATION', manualRestoredOperatorConfirmed: false, deploymentRestored: false, headRestored: false, recoveryFailures: []};
  const result = {revision: PIN.revision, target: PIN.target, candidate: PIN.candidate, packageSha256: PIN.source,
    ...restoration, campaignFailure: failure, browserPassedOperatorReported: browserPassed,
    browserValidated: false, versionCreationAttempted: false, newDeploymentCreated: false,
    googleReadAttempted: false, googleWriteAttempted: false, offlineSimulationOnly: true,
    status: restoration.status === 'RESTORED' ? browserPassed ? 'RESTORED_BROWSER_PASS_OPERATOR_REVIEW_REQUIRED' : 'RESTORED_BROWSER_NOT_PASSED' : restoration.status};
  j.add('result', 'DONE', result); return result;
}
const SAFE = new Set(['OPERATOR_NOT_CONFIRMED', 'OPERATOR_RESULT_MISMATCH', 'ACCESS_RESTORATION_NOT_CONFIRMED', 'ACCESS_REVISION_MISMATCH',
  'PROPERTY_NOT_CONFIRMED', 'REQUESTS_STILL_UNCERTAIN', 'UNCERTAIN_MANUAL_STATE', 'BACKUP_STILL_PRESENT', 'MANUAL_RECOVERY_BLOCKED',
  'BASELINE_PROPERTIES_NOT_CONFIRMED', 'DEPLOYMENT_OBSERVATION_TIMEOUT', 'DEPLOYMENT_CONFIGURATION_CHANGED', 'OTHER_DEPLOYMENT_CHANGED',
  'VERSION_INVENTORY_CHANGED', 'DEPLOYMENT_INVENTORY_CHANGED', 'UNKNOWN_REMOTE_CHANGE', 'HEAD_RESTORATION_INCOMPLETE',
  'INITIAL_STATE_CHANGED', 'IMMUTABLE_VERSION_10_MISMATCH', 'CANDIDATE_READBACK_MISMATCH', 'EDITOR_FUNCTIONS_NOT_CONFIRMED',
  'OPERATOR_FUNCTION_MISSING_OR_DUPLICATE', 'BROWSER_NOT_CONFIRMED', 'MANIFEST_HASH_MISMATCH']);
const safeError = err => SAFE.has(err?.message) ? err.message : 'R4_STOPPED_UNCLASSIFIED';
function parseArgs(argv) {
  const allowed = ['mode', 'package-run', 'r3-session'], out = {mode: 'LocalCheck'}, seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const k = argv[i]?.replace(/^--/, '');
    check(argv[i] === '--' + k && allowed.includes(k) && !seen.has(k) && typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    seen.add(k); out[k] = argv[i + 1];
  }
  check(out.mode === 'LocalCheck', 'REMOTE_MODE_NOT_AVAILABLE');
  for (const k of ['package-run', 'r3-session']) {
    check(out[k], 'MISSING_ARGUMENT');
    check(path.isAbsolute(out[k]) || path.win32.isAbsolute(out[k]), 'ABSOLUTE_INPUT_PATH_REQUIRED');
  }
  return out;
}
function localCheck(options) {
  check(options.mode === 'LocalCheck' && Object.keys(options).every(k => ['mode', 'package-run', 'r3-session'].includes(k)), 'LOCAL_ONLY_REQUIRED');
  const e = loadLocal(options);
  return {revision: PIN.revision, status: 'LOGREAD_WEBAPP_R4_LOCAL_CHECK_ONLY', candidate: PIN.candidate, packageSha256: PIN.source,
    candidateFiles: e.candidate.length, historicalFiles: e.backup.length, operatorFunctionsVerifiedLocally: FUNCTIONS,
    ...e.localEvidence, localEvidenceVerified: true, currentGoogleStateVerified: false,
    googleReadAttempted: false, googleWriteAttempted: false, browserAuthorized: false, codePushAuthorized: false,
    accessAuthorized: false, auditAuthorized: false, propertiesAuthorized: false, deploymentUpdateAuthorized: false,
    versionCreationAuthorized: false, newDeploymentAuthorized: false, remoteModeAvailable: false};
}
module.exports = {PIN, FUNCTIONS, PROPERTIES, hash, equal, inventory, same, sourceDigest, scan, archiveFiles, manifest,
  topLevelFunctions, functionsPresent, loadLocal, Journal, EXPECT, ACTIONS, prompt, validateResult, normalizeLists, baseline,
  phase, knownState, observe, capabilityPorts, sessionBinding, manual, property, cleanupManual, restoreDeployment, recover,
  campaign, safeError, parseArgs, localCheck};
if (require.main === module) {
  try { console.log(JSON.stringify(localCheck(parseArgs(process.argv.slice(2))), null, 2)); }
  catch (error) {
    const code = /^[A-Z][A-Z0-9_]{2,80}$/.test(error.message) ? error.message :
      ['ENOENT', 'EACCES', 'EPERM'].includes(error.code) ? error.code : 'R4_LOCAL_CHECK_FAILED';
    console.error(code + '. No Google operation. Preserve evidence; do not run R1/R2/R3.'); process.exitCode = 1;
  }
}
