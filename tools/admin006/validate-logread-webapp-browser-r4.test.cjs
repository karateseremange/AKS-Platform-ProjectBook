'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), vm = require('node:vm');
const crypto = require('node:crypto');
const api = require('./validate-logread-webapp-browser-r4.cjs');
const bundle = JSON.parse(fs.readFileSync(path.join(__dirname, 'r4-fixtures/candidate.json')));
const actualCandidate = bundle.files.map(f => ({name: f.name, bytes: Buffer.from(f.base64, 'base64')}));
const copy = files => files.map(f => ({name: f.name, bytes: Buffer.from(f.bytes)}));
const clone = x => JSON.parse(JSON.stringify(x));
const historical = [{name: 'appsscript.json', bytes: Buffer.from('{"runtimeVersion":"V8"}')},
  ...Array.from({length: 260}, (_, i) => ({name: 'historical/File' + i + '.gs', bytes: Buffer.from('// Synthetic historical fixture ' + i)}))];
function context() {
  const blocked = () => { throw Error('NO_GOOGLE_IN_OFFLINE_TEST'); };
  const defaults = {};
  const store = {getProperty: k => defaults[k] ?? null, getProperties: () => ({...defaults}),
    setProperty: (k, v) => { defaults[k] = String(v); }, deleteProperty: k => { delete defaults[k]; }};
  const signed = bytes => [...bytes].map(n => n > 127 ? n - 256 : n);
  const c = vm.createContext({console: {log() {}, error() {}}, Logger: {log() {}},
    Utilities: {getUuid: () => 'offline-uuid', DigestAlgorithm: {SHA_256: 'sha256'}, Charset: {UTF_8: 'utf-8'},
      computeDigest: (_a, x) => signed(crypto.createHash('sha256').update(String(x)).digest()),
      computeHmacSha256Signature: (x, secret) => signed(crypto.createHmac('sha256', secret).update(String(x)).digest())},
    LockService: {getScriptLock: () => ({tryLock: () => true, releaseLock() {}})},
    PropertiesService: {getScriptProperties: () => store}, ScriptApp: {getScriptId: blocked, getService: blocked},
    Session: {getActiveUser: blocked}, SpreadsheetApp: {openById: blocked}, UrlFetchApp: {fetch: blocked},
    DriveApp: {getFileById: blocked}, MailApp: {sendEmail: blocked}});
  vm.runInContext(actualCandidate.filter(f => /\.(gs|js)$/.test(f.name)).map(f => f.bytes.toString()).join('\n;\n'), c, {timeout: 10000});
  return c;
}
function environment(t, faults = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'r4-offline-')); t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const c = context(), accessOptions = {recipeProfile: 'LOG_READ'}, access = c.AKS_access002RecipeFixture_(accessOptions), audit = c.AKS_audit001RecipeFixture_();
  const revision = access.recipe.preflight().registryRevision; accessOptions.persistentAudit = false;
  c.AKS_createDefaultAccess002Recipe_ = () => access.recipe;
  c.AKS_createDefaultAudit001Recipe_ = () => audit.recipe;
  const e = {candidate: copy(actualCandidate), backup: copy(historical), registryRevision: revision,
    propertiesBaselineOperatorConfirmed: true, secretContinuityOperatorConfirmed: true, localEvidence: {fixture: 'real-candidate-synthetic-historical'}};
  const lists = {versions: Array.from({length: 10}, (_, i) => ({versionNumber: i + 1,
    description: i === 9 ? 'ADMIN-006 D4-C LOG_READ Web App ' + api.PIN.candidate.slice(0, 12) : 'v' + (i + 1)})),
    deployments: [{deploymentId: 'head', description: 'Head'}, {deploymentId: 'AKfycb-fixture-OMcZ9gl', description: 'Application Web', versionNumber: 8}]};
  const b = api.baseline(e, lists), binding = api.sessionBinding(e, b), j = new api.Journal(path.join(root, 'session'), binding, true);
  const state = {head: copy(e.backup), lists: clone(lists), backend: false, operations: [], immutableReads: 0, browser: [], observedFunctions: false};
  let used = false;
  function once(name) { if (faults.fail === name && !used) { used = true; throw Error(name); } }
  const io = {
    async snapshot() { once('snapshot'); return {files: copy(state.head), lists: clone(state.lists)}; },
    async lists() { once('lists'); return clone(state.lists); },
    async readVersion10() {
      state.immutableReads++; if (state.immutableReads <= (faults.delayedReads || 0)) return null;
      const files = copy(e.candidate); if (faults.extensionNormalization) files.forEach(f => { f.name = f.name.replace(/\.gs$/, '.js'); });
      if (faults.immutableCorrupt) files[0].bytes = Buffer.from('bad');
      return {files, lists: clone(state.lists)};
    },
    async push(files, reason) {
      state.operations.push('push-' + reason);
      if (faults.fail === 'partial-push' && !used) {
        used = true; const byName = new Map(e.backup.slice(0, 150).map(f => [f.name, f]));
        for (const f of e.candidate.slice(0, 70)) byName.set(f.name, f);
        state.head = copy([...byName.values()]); throw Error('partial-push');
      }
      state.head = copy(files); once('push-' + reason);
      if (reason === 'install' && faults.readbackCorrupt) state.head[0].bytes = Buffer.from('unknown-concurrent-code');
    },
    async updateDeployment(id, version, description) {
      assert.equal(id, b.deploymentId); assert.equal(description, b.description); assert([8, 10].includes(version));
      state.operations.push('deploy-' + version); state.lists.deployments[1].versionNumber = version; once('deploy-' + version);
    }
  };
  const operator = {
    async action(op, prompt) {
      assert(prompt.includes(api.PIN.target) && prompt.includes(api.ACTIONS[op].fn) && prompt.includes(api.ACTIONS[op].token));
      assert(state.head.length === 279, 'Keep candidate functions through cleanup');
      if (op === 'audit') { assert(state.observedFunctions); accessOptions.persistentAudit = true; }
      if (op === 'disconnect-audit') {
        assert.equal(access.values.AKS_ACCESS002_RECIPE_BACKUP, undefined);
        accessOptions.persistentAudit = false;
      }
      const result = c[api.ACTIONS[op].fn]();
      once(op);
      return {token: api.ACTIONS[op].token, result, baselineAndBackupAbsenceOperatorConfirmed:
        access.values.AKS_ACCESS_REGISTRY === undefined && access.values.AKS_ACCESS002_RECIPE_BACKUP === undefined};
    },
    async property(op, spec) {
      assert(spec.prompt.includes(spec.target) && spec.prompt.includes(spec.key) && spec.prompt.includes(spec.token));
      state.operations.push(op);
      if (spec.target === api.PIN.backend) state.backend = spec.expected === 'true';
      else if (spec.expected.startsWith('ABSENT')) delete access.values[spec.key];
      else access.values[spec.key] = spec.key === 'AKS_PRIVATE_BACKEND_URL' ? 'https://fixture.invalid/exec' : spec.expected;
      once(op);
      return {token: spec.token, operatorConfirmed: true};
    },
    async confirm(op) {
      once(op);
      if (op === 'editor-functions') {
        if (faults.editorAbsent) return 'ABSENT';
        api.functionsPresent(state.head); state.observedFunctions = true; return 'FONCTIONS-PRESENTES';
      }
      if (op === 'requests-ended') return 'REQUETES-TERMINEES';
      assert.equal(op, 'baseline-properties');
      assert.equal(state.backend, false); for (const key of api.PROPERTIES) assert.equal(access.values[key], undefined);
      assert.equal(access.values.AKS_ACCESS_REGISTRY, undefined); assert.equal(access.values.AKS_ACCESS002_RECIPE_BACKUP, undefined);
      assert.equal(audit.values.AKS_AUDIT001_RECIPE_CONNECTION_BACKUP, undefined);
      return 'ETAT-INITIAL-CONFIRME';
    },
    async resolve(op) {
      if (faults.resolveState) return {operatorConfirmed: true, state: faults.resolveState, backupAbsent: false};
      const store = op === 'access' ? access.values : audit.values;
      const key = op === 'access' ? 'AKS_ACCESS002_RECIPE_BACKUP' : 'AKS_AUDIT001_RECIPE_CONNECTION_BACKUP';
      return {operatorConfirmed: true, state: store[key] ? 'APPLIED' : 'BASELINE', backupAbsent: !store[key]};
    },
    async browser(op, spec) {
      assert.equal(state.lists.deployments[1].versionNumber, 10); assert.equal(state.backend, true);
      assert.equal(access.values.AKS_PRIVATE_PORTAL_ENABLED, 'true');
      state.browser.push(op); once('browser-' + op);
      if (op === 'manager') assert.equal(c.AKS_authorizePrivatePortal_(access.accessService('manager@example.com')), 'manager@example.com');
      if (op === 'denied') assert.throws(() => c.AKS_authorizePrivatePortal_(access.accessService('denied@example.com')));
      return {token: spec.token, operatorConfirmed: true};
    }
  };
  return {root, c, e, b, binding, j, state, io, operator, access, audit, accessOptions};
}
function restored(f, r) {
  assert.equal(r.headRestored, true); assert.equal(r.deploymentRestored, true); assert(api.same(f.state.head, f.e.backup));
  assert.equal(f.state.lists.deployments[1].versionNumber, 8); assert.equal(f.state.lists.versions.length, 10); assert.equal(f.state.lists.deployments.length, 2);
  assert.equal(f.state.backend, false); assert.equal(f.access.values.AKS_ACCESS_REGISTRY, undefined);
  assert.equal(f.access.values.AKS_ACCESS002_RECIPE_BACKUP, undefined); assert.equal(f.audit.values.AKS_AUDIT001_RECIPE_CONNECTION_BACKUP, undefined);
}
test('real candidate Git bytes match 279 files, package digest, manifest and global editor functions', () => {
  assert.equal(actualCandidate.length, 279); assert.equal(api.sourceDigest(actualCandidate), api.PIN.source); api.manifest(actualCandidate);
  assert.deepEqual(api.functionsPresent(actualCandidate), api.FUNCTIONS);
});
test('AST rejects comments, nested declarations, strings, function expressions, parameters and duplicate declarations', () => {
  const valid = api.FUNCTIONS.map(n => `function ${n}(){}`).join('\n');
  for (const spoof of [`// ${valid.replace(/\n/g, ' ')}`, `/* ${valid} */`, `function outer(){${valid}}`,
    `var x=${JSON.stringify(valid)};`, api.FUNCTIONS.map(n => `var ${n}=function(){}`).join(';'),
    api.FUNCTIONS.map(n => `function ${n}(required){}`).join(';'), valid + '\nfunction ' + api.FUNCTIONS[0] + '(){}'])
    assert.throws(() => api.functionsPresent([{name: 'Code.gs', bytes: Buffer.from(spoof)}]));
});
test('R2 normalization passes canonically; modified byte, renamed file, changed type, missing file fail', () => {
  const normalized = copy(actualCandidate); normalized.forEach(f => { f.name = f.name.replace(/\.gs$/, '.js'); });
  assert.notEqual(api.sourceDigest(normalized), api.PIN.source); assert(api.same(normalized, actualCandidate));
  for (const mutation of [f => { f[1].bytes = Buffer.from('changed'); }, f => { f[1].name = 'Other.gs'; },
    f => { f[1].name = f[1].name.replace(/\.(gs|js|html)$/, '.html'); f[1].bytes = Buffer.from('changed type'); }, f => { f.pop(); }]) {
    const modified = copy(normalized); mutation(modified); assert.equal(api.same(modified, actualCandidate), false);
  }
});
test('canonical collisions and unsafe paths are rejected', () => {
  assert.throws(() => api.inventory([{name: 'Code.gs', bytes: Buffer.from('x')}, {name: 'code.js', bytes: Buffer.from('x')}]), /COLLISION/);
  for (const name of ['../Code.gs', '/Code.gs', 'Code\\x.gs', 'CON.gs', 'a:Code.gs']) assert.throws(() => api.inventory([{name, bytes: Buffer.from('x')}]));
});
test('CLI is local-only and rejects every Google mode and authority parameter', () => {
  const base = ['--package-run', 'D:\\fixture', '--r3-session', 'D:\\r3'];
  assert.equal(api.parseArgs(base).mode, 'LocalCheck');
  for (const mode of ['ReadOnly', 'Execute', 'Resume', 'Restore', 'R1', 'R2', 'R3']) assert.throws(() => api.parseArgs([...base, '--mode', mode]));
  for (const name of ['authorization', 'target', 'session', 'clasp-package', 'output']) assert.throws(() => api.parseArgs([...base, '--' + name, 'x']));
  assert.throws(() => api.parseArgs([...base, '--r3-session', 'x']));
  assert.throws(() => api.parseArgs(['--package-run', 'relative', '--r3-session', 'relative']), /ABSOLUTE/);
});
test('full real orchestration uses real ACCESS/AUDIT functions, distinct HEAD/v10/deployment states and restores', async t => {
  const f = environment(t, {extensionNormalization: true}), r = await api.campaign(f.e, f.io, f.operator, f.j);
  restored(f, r); assert.equal(r.status, 'RESTORED_BROWSER_PASS_OPERATOR_REVIEW_REQUIRED');
  assert.equal(r.browserPassedOperatorReported, true); assert.equal(r.browserValidated, false); assert.equal(r.offlineSimulationOnly, true);
  assert.equal(r.googleReadAttempted, false); assert.equal(r.googleWriteAttempted, false);
  assert.deepEqual(f.state.browser, ['oauth', 'manager', 'denied']);
  assert.deepEqual(f.state.operations.filter(n => n.startsWith('push-') || n.startsWith('deploy-')), ['push-install', 'deploy-10', 'deploy-8', 'push-restore']);
  assert(f.access.auditEvents.length > 0, 'AUDIT proof is preserved');
  const sequence = f.j.rows.map(r => r.op);
  assert(sequence.indexOf('editor-functions') < sequence.indexOf('audit'));
  assert(sequence.indexOf('access') < sequence.indexOf('deployment-10'));
  assert(sequence.indexOf('restore-access') < sequence.indexOf('disconnect-audit'));
  assert(sequence.indexOf('disconnect-audit') < sequence.indexOf('restore-head'));
});
test('R1 delayed version visibility causes only bounded reads, never creation', async t => {
  const f = environment(t, {delayedReads: 3}), waits = [], r = await api.campaign(f.e, f.io, f.operator, f.j, ms => { waits.push(ms); });
  restored(f, r); assert.equal(f.state.immutableReads, 4); assert.deepEqual(waits, [250, 500, 750]);
});
test('R1 persistent absence of version 10 stops without any mutation', async t => {
  const f = environment(t, {delayedReads: 100}), r = await api.campaign(f.e, f.io, f.operator, f.j);
  assert.equal(r.status, 'STOPPED_NO_MUTATION'); assert.equal(f.state.immutableReads, 5); assert.deepEqual(f.state.operations, []);
});
test('immutable byte mismatch stops before installation and never updates deployment', async t => {
  const f = environment(t, {immutableCorrupt: true}), r = await api.campaign(f.e, f.io, f.operator, f.j);
  assert.equal(r.status, 'STOPPED_NO_MUTATION'); assert.equal(r.campaignFailure, 'IMMUTABLE_VERSION_10_MISMATCH'); assert.deepEqual(f.state.operations, []);
});
test('R3 actual missing editor function blocks AUDIT, ACCESS and deployment then restores HEAD', async t => {
  const f = environment(t, {editorAbsent: true}), r = await api.campaign(f.e, f.io, f.operator, f.j);
  restored(f, r); assert.equal(r.browserPassedOperatorReported, false); assert.equal(r.campaignFailure, 'EDITOR_FUNCTIONS_NOT_CONFIRMED');
  assert.equal(f.j.touched('audit'), false); assert.equal(f.j.touched('access'), false); assert(!f.state.operations.includes('deploy-10'));
});
test('R3 missing candidate declaration is detected before every mutation', async t => {
  const f = environment(t); f.e.candidate = f.e.candidate.filter(row => row.name !== 'tests/access/Access002LogReadRecipe.gs');
  const binding = api.sessionBinding(f.e, f.b), j = new api.Journal(path.join(f.root, 'missing'), binding, true);
  const r = await api.campaign(f.e, f.io, f.operator, j); assert.equal(r.status, 'STOPPED_NO_MUTATION'); assert.deepEqual(f.state.operations, []);
});
for (const failure of ['partial-push', 'push-install', 'editor-functions', 'audit', 'preflight', 'access', 'deploy-10',
  ...api.PROPERTIES.slice(0, 4).map(apiKey => 'property-' + apiKey), 'backend-on', 'property-AKS_PRIVATE_PORTAL_ENABLED',
  'browser-oauth', 'browser-manager', 'browser-denied']) {
  test('interruption after ' + failure + ': real recovery cleans only touched mutations', async t => {
    const f = environment(t, {fail: failure}), r = await api.campaign(f.e, f.io, f.operator, f.j);
    restored(f, r); assert.equal(r.status, 'RESTORED_BROWSER_NOT_PASSED'); assert.equal(r.browserPassedOperatorReported, false);
    assert.equal(r.versionCreationAttempted, false); assert.equal(r.newDeploymentCreated, false);
  });
}
for (const failure of ['portal-off', 'backend-off', 'requests-ended', 'remove-AKS_PRIVATE_BACKEND_URL', 'restore-access', 'disconnect-audit', 'baseline-properties', 'deploy-8', 'push-restore']) {
  test('cleanup interruption at ' + failure + ': independent recovery from reopened journal', async t => {
    const f = environment(t, {fail: failure}), r = await api.campaign(f.e, f.io, f.operator, f.j);
    assert.notEqual(r.status, 'RESTORED_BROWSER_PASS_OPERATOR_REVIEW_REQUIRED');
    const reopened = new api.Journal(f.j.dir, f.binding), recovery = await api.recover(f.e, f.b, f.io, f.operator, reopened);
    restored(f, recovery); assert.equal(recovery.status, 'RESTORED');
  });
}
for (const state of ['PARTIAL', 'CONFLICT']) test('incomplete/conflicting ACCESS backup keeps candidate functions and returns deployment to 8: ' + state, async t => {
  const f = environment(t, {fail: 'access', resolveState: state}), r = await api.campaign(f.e, f.io, f.operator, f.j);
  assert.equal(r.status, 'MANUAL_RECOVERY_BLOCKED'); assert.equal(r.headRestored, false); assert.equal(r.deploymentRestored, true);
  assert(api.same(f.state.head, f.e.candidate)); assert(f.access.values.AKS_ACCESS002_RECIPE_BACKUP); assert(f.audit.values.AKS_AUDIT001_RECIPE_CONNECTION_BACKUP);
});
test('unknown concurrent HEAD change is never overwritten', async t => {
  const f = environment(t, {readbackCorrupt: true}), r = await api.campaign(f.e, f.io, f.operator, f.j);
  assert.equal(r.status, 'RESTORE_REQUIRED'); assert.equal(r.headRestored, false); assert.deepEqual(f.state.operations, ['push-install']);
});
test('initial drift produces no automatic repair and no mutation', async t => {
  const f = environment(t); f.state.head = copy(actualCandidate);
  const r = await api.campaign(f.e, f.io, f.operator, f.j); assert.equal(r.status, 'STOPPED_NO_MUTATION'); assert.deepEqual(f.state.operations, []);
});
test('recovery refuses changed source/binding before transport or cleanup', async t => {
  const f = environment(t); f.e.candidate[1].bytes = Buffer.from('changed');
  await assert.rejects(() => api.recover(f.e, f.b, f.io, f.operator, f.j), /BINDING/); assert.deepEqual(f.state.operations, []);
});
test('journal rejects corruption, gaps and concurrent appends', t => {
  const f = environment(t); f.j.add('x', 'INTENT'); const file = path.join(f.j.dir, 'event-000001.json'), raw = fs.readFileSync(file);
  const row = JSON.parse(raw); row.op = 'changed'; fs.writeFileSync(file, JSON.stringify(row));
  assert.throws(() => new api.Journal(f.j.dir, f.binding), /CORRUPT/); fs.writeFileSync(file, raw);
  const second = new api.Journal(f.j.dir, f.binding); second.add('y', 'DONE'); assert.throws(() => f.j.add('z', 'INTENT'), /CONCURRENT/);
  fs.renameSync(path.join(f.j.dir, 'event-000002.json'), path.join(f.j.dir, 'event-000003.json'));
  assert.throws(() => new api.Journal(f.j.dir, f.binding), /GAP/);
});
test('transport cannot expose version/deployment creation or deletion', t => {
  const f = environment(t); for (const capability of ['createVersion', 'createDeployment', 'deleteDeployment', 'deleteVersion', 'pushAnything'])
    assert.throws(() => api.capabilityPorts({...f.io, [capability]() {}}), /FORBIDDEN/);
});
test('deployment observation tolerates lag and stops on changed configuration', async t => {
  const f = environment(t); let reads = 0;
  await api.observe({lists: async () => { const lists = clone(f.b.lists); if (++reads > 2) lists.deployments.find(d => d.deploymentId === f.b.deploymentId).versionNumber = 10; return lists; }}, f.b, 10);
  assert.equal(reads, 3); const drift = clone(f.b.lists); drift.deployments.find(d => d.deploymentId === f.b.deploymentId).description = 'unexpected';
  assert.throws(() => api.phase(drift, f.b), /CONFIGURATION/);
});
test('alreadyRestored branch requires exact initial revision and backup absence confirmation', () => {
  const response = {token: 'ACCESS-RESTAURE', result: {ok: true, environment: 'RECETTE', scriptIdSuffix: 'eIRxs4', recipeProfile: 'LOG_READ', phase: 'RESTORED', alreadyRestored: true, revision: 'initial'}, baselineAndBackupAbsenceOperatorConfirmed: true};
  api.validateResult('restore-access', response, 'initial');
  assert.throws(() => api.validateResult('restore-access', {...response, baselineAndBackupAbsenceOperatorConfirmed: false}, 'initial'));
  assert.throws(() => api.validateResult('restore-access', response, 'other'));
});
test('manual success token with wrong JSON result is refused; logs contain no raw identity or URL', async t => {
  const f = environment(t), real = f.operator.action;
  f.operator.action = async (op, prompt) => { const r = await real(op, prompt); return op === 'preflight' ? {...r, result: {...r.result, writePerformed: true}} : r; };
  const r = await api.campaign(f.e, f.io, f.operator, f.j); restored(f, r); assert.equal(r.campaignFailure, 'OPERATOR_RESULT_MISMATCH');
  const text = JSON.stringify(f.j.rows); for (const secret of ['manager@example.com', 'denied@example.com', 'https://fixture.invalid', 'secret-value']) assert(!text.includes(secret));
});
test('real ACCESS incomplete-backup failure retains registry and backup, with no blind cleanup', () => {
  const c = context(); let failRestore = false;
  const f = c.AKS_access002LogReadFixture_({beforeSet(key, value) {
    if (key === 'AKS_ACCESS002_RECIPE_BACKUP' && JSON.parse(value).afterRevision) { failRestore = true; throw Error('backup failed'); }
  }, beforeDelete(key) { if (key === 'AKS_ACCESS_REGISTRY' && failRestore) throw Error('restore failed'); }});
  assert.throws(() => f.recipe.apply()); assert(f.values.AKS_ACCESS_REGISTRY); assert(f.values.AKS_ACCESS002_RECIPE_BACKUP);
  assert.throws(() => f.recipe.restore()); assert(f.values.AKS_ACCESS_REGISTRY); assert(f.values.AKS_ACCESS002_RECIPE_BACKUP);
});

function localEvidence(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'r4-local-evidence-')); t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const dir = path.join(root, api.PIN.packageSession), r3 = path.join(root, api.PIN.r3Session); fs.mkdirSync(dir); fs.mkdirSync(r3);
  const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data));
  // Candidate uses the actual local producer; historical follows check-d4c's independent schema.
  const candidateProducer = require('./prepare-d4b.cjs');
  const historicalArchive = files => ({format: 'AKS-D4C-READONLY-SNAPSHOT/1', role: 'portal', target: api.PIN.target,
    files: files.map(f => ({name: f.name, sha256: api.hash(f.bytes), base64: f.bytes.toString('base64')}))});
  for (const [files, location] of [[actualCandidate, path.join(dir, 'candidate', 'src')], [historical, path.join(dir, 'historical-rollback', 'src')]]) {
    for (const f of files) { const file = path.join(location, f.name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, f.bytes); }
  }
  const cf = path.join(dir, 'candidate-bundle.json'), hf = path.join(dir, 'historical-c1-bundle.json'); candidateProducer.archive(cf, [...actualCandidate].sort((a, b) => a.name < b.name ? -1 : 1)); write(hf, historicalArchive(historical));
  const report = {candidate: api.PIN.candidate, target: api.PIN.target, packageSha256: api.PIN.source,
    packageArchiveSha256: api.hash(fs.readFileSync(cf)), sourceFiles: 279, packageFiles: 279, status: 'LOCAL_WEBAPP_PACKAGE_PREPARED_REMOTE_REVIEW_REQUIRED'};
  write(path.join(dir, 'report.json'), report);
  const binding = {revision: 'LOGREAD-webapp-browser-r3', candidate: api.PIN.candidate, packageSha256: api.PIN.source,
    r2ResultSha256: api.PIN.r2Result, r2CanonicalInventorySha256: api.PIN.r2Inventory, packageRun: dir};
  write(path.join(r3, 'session.json'), {binding, createdAt: '2026-10-01T00:00:00.000Z'});
  const result = {revision: binding.revision, target: api.PIN.target, candidate: api.PIN.candidate, packageSha256: api.PIN.source,
    session: r3, status: 'RESTORED_WEBAPP_VERSION_8_VERSION_10_VERIFIED_BROWSER_REVIEW_REQUIRED', failure: null,
    immutableVersion10Verified: true, webAppRestoredToVersion8: true, deploymentConfigurationRestored: true,
    versionRetained: true, newDeploymentCreated: false, codePushAttempted: false};
  write(path.join(r3, 'result-abcdef.json'), result);
  for (const [i, event] of ['VERSION_10_VERIFIED', 'AUDIT_CONNECTED', 'AUDIT_DISCONNECTED', 'WEBAPP_RESTORED_TO_8', 'RESTORED_EXACT', 'CODE_RESTORED'].entries())
    write(path.join(r3, 'event-' + '00000000-0000-4000-8000-' + String(i).padStart(12, '0') + '.json'),
      {event, at: '2026-10-01T00:00:00.000Z'});
  const pin = {...api.PIN, archive: report.packageArchiveSha256, packageReport: api.hash(fs.readFileSync(path.join(dir, 'report.json'))),
    historicalSource: api.sourceDigest(historical), historicalManifest: api.hash(historical[0].bytes), historicalArchive: api.hash(fs.readFileSync(hf))};
  return {root, dir, r3, pin, result, options: {'package-run': dir, 'r3-session': r3}, write};
}
test('local evidence reader checks real candidate bytes and synthetic protected proof chain without writes', t => {
  const f = localEvidence(t), before = [];
  const walk = dir => { for (const x of fs.readdirSync(dir, {withFileTypes: true})) { const p = path.join(dir, x.name); if (x.isDirectory()) walk(p); else before.push([p, api.hash(fs.readFileSync(p))]); } };
  walk(f.root); const e = api.loadLocal(f.options, f.pin); assert.equal(e.candidate.length, 279); assert.equal(e.backup.length, 261);
  for (const [p, h] of before) assert.equal(api.hash(fs.readFileSync(p)), h);
});
// Exercise historical bytes/schema separately from the R4 inventory implementation.
for (const mutation of ['role-missing', 'role-backend', 'wrong-target', 'wrong-format', 'missing-type-d4b',
  'wrong-type-d4b', 'wrong-type-d4c', 'bad-sha256', 'bad-base64', 'unknown-extension', 'duplicate-name']) {
  test('archive contracts refuse ' + mutation, t => {
    const f = localEvidence(t), candidate = mutation.endsWith('d4b');
    const file = path.join(f.dir, candidate ? 'candidate-bundle.json' : 'historical-c1-bundle.json');
    const data = JSON.parse(fs.readFileSync(file));
    if (mutation === 'role-missing') delete data.role;
    if (mutation === 'role-backend') data.role = 'backend';
    if (mutation === 'wrong-target') data.target = api.PIN.backend;
    if (mutation === 'wrong-format') data.format = 'AKS-D4B-SNAPSHOT/1';
    if (mutation === 'missing-type-d4b') delete data.files[0].type;
    if (mutation.startsWith('wrong-type')) data.files[0].type = 'HTML';
    if (mutation === 'bad-sha256') data.files[0].sha256 = '0'.repeat(64);
    if (mutation === 'bad-base64') data.files[0].base64 += '!';
    if (mutation === 'unknown-extension') data.files[1].name = 'File.exe';
    if (mutation === 'duplicate-name') data.files.push(data.files[0]);
    f.write(file, data);
    // Pin new raw hash to reach schema checks; production CLI pins remain unchanged.
    const digest = api.hash(fs.readFileSync(file));
    assert.throws(() => api.archiveFiles(file, digest, api.PIN.target,
      candidate ? 'AKS-D4B-SNAPSHOT/1' : 'AKS-D4C-READONLY-SNAPSHOT/1'));
  });
}
test('historical schema regression omits type and preserves exact names and bytes', t => {
  const f = localEvidence(t), file = path.join(f.dir, 'historical-c1-bundle.json');
  const data = JSON.parse(fs.readFileSync(file));
  assert.equal(data.format, 'AKS-D4C-READONLY-SNAPSHOT/1'); assert.equal(data.role, 'portal');
  assert(data.files.every(row => !Object.hasOwn(row, 'type')));
  const result = api.archiveFiles(file, f.pin.historicalArchive, api.PIN.target, data.format);
  assert.deepEqual(result, historical);
});
for (const mutation of ['report', 'archive', 'materialized-candidate', 'historical', 'r3-result', 'r3-binding', 'r3-event', 'r3-ambiguous']) {
  test('local evidence reader refuses altered ' + mutation, t => {
    const f = localEvidence(t);
    if (mutation === 'report') fs.appendFileSync(path.join(f.dir, 'report.json'), ' ');
    if (mutation === 'archive') fs.appendFileSync(path.join(f.dir, 'candidate-bundle.json'), ' ');
    if (mutation === 'materialized-candidate') fs.appendFileSync(path.join(f.dir, 'candidate/src/appsscript.json'), ' ');
    if (mutation === 'historical') fs.appendFileSync(path.join(f.dir, 'historical-rollback/src/appsscript.json'), ' ');
    if (mutation === 'r3-result') f.write(path.join(f.r3, 'result-abcdef.json'), {...f.result, webAppRestoredToVersion8: false});
    if (mutation === 'r3-binding') { const p = path.join(f.r3, 'session.json'), x = JSON.parse(fs.readFileSync(p)); x.binding.r2ResultSha256 = 'bad'; f.write(p, x); }
    if (mutation === 'r3-event') f.write(path.join(f.r3, 'event-999999.json'), {event: 'LOGREAD_ACCESS_APPLIED'});
    if (mutation === 'r3-ambiguous') f.write(path.join(f.r3, 'result-123abc.json'), f.result);
    assert.throws(() => api.loadLocal(f.options, f.pin));
  });
}
test('default local check cannot accept fixture hashes or injected loaders as arguments', t => {
  const f = localEvidence(t); assert.throws(() => api.localCheck({mode: 'LocalCheck', ...f.options}), /HASH/);
  assert.throws(() => api.localCheck({mode: 'LocalCheck', ...f.options, pin: f.pin}), /LOCAL_ONLY/);
});
test('real ACCESS restoration conflict preserves independent change and pending evidence', () => {
  const c = context(), f = c.AKS_access002LogReadFixture_(); f.recipe.apply();
  f.values.AKS_ACCESS_REGISTRY = f.values.AKS_ACCESS_REGISTRY + ' ';
  const observed = f.values.AKS_ACCESS_REGISTRY; assert.throws(() => f.recipe.restore());
  assert.equal(f.values.AKS_ACCESS_REGISTRY, observed); assert(f.values.AKS_ACCESS002_RECIPE_BACKUP);
});
test('new campaign cannot reuse old or already started journal', async t => {
  const f = environment(t); f.j.add('install-head', 'INTENT');
  await assert.rejects(() => api.campaign(f.e, f.io, f.operator, f.j), /ALREADY_STARTED/);
  assert.deepEqual(f.state.operations, []);
});
