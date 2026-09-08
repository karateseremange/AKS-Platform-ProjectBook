#!/usr/bin/env node
'use strict';
// D4C-readonly-r1. Preparation does not authorize ReadOnly execution.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const check = (ok, code) => { if (!ok) throw new Error(code); };
check(hash(fs.readFileSync(path.join(__dirname, 'prepare-d4c.cjs'))) ===
  '5a9d149f8814e7275d174bb6b46b685af038bc20de071b001e92b7d4824c7e80', 'C0_HELPER_INTEGRITY_MISMATCH');
const c0 = require('./prepare-d4c.cjs'); // Verifies its four historical dependencies before loading.
const b0 = require('./prepare-d4b.cjs');
const b1 = require('./validate-d4b.cjs');
const c2 = require('./validate-d4b-c2.cjs');
const PIN = Object.freeze({
  ...c0.PIN, c0Campaign: 'local-d4c-tV7sHd',
  plan: '33dd00146ceca42c554a842516872db5265e8a0c6a0003dba2618d78f1d482c5',
  result: '0cf9f2f82676aff106dfbb3dd7273b6db11f5df9cf9a34603a32a29b51a629fc'
});
const AUTHORIZATION = 'D4C-C1-READONLY-' + PIN.plan;
const TARGETS = Object.freeze([
  Object.freeze({role: 'portal', scriptId: PIN.portal}),
  Object.freeze({role: 'backend', scriptId: PIN.backend})
]);
const json = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => b0.compare(b0.inventory(a), b0.inventory(b)).length === 0;
function writeNew(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', {flag: 'wx', mode: 0o600});
}
function loadLocal(options, load = c0.loadEvidence) {
  const historical = load(options), dir = fs.realpathSync(options['c0-run']);
  check(path.basename(dir) === PIN.c0Campaign, 'WRONG_C0_CAMPAIGN');
  const r = json(path.join(dir, 'report.json'));
  const expected = {
    revision: 'D4C-local-r1', status: 'D4C_LOCAL_PREPARED_REVIEW_REQUIRED',
    applicationCommit: PIN.application, projectBookBaseline: PIN.projectBook,
    candidate: c2.PIN.candidate, packageSha256: c2.PIN.package,
    historicalB1ResultSha256: PIN.result, inventoryPlanSha256: PIN.plan,
    historicalSnapshotsVerifiedLocally: true, historicalTestPassOperatorReported: true,
    historicalPropertiesOperatorConfirmed: true, backupFiles: 261, packageFiles: 277,
    currentRemoteStateVerified: false, currentPropertiesVerified: false,
    currentSecretContinuityVerified: false, browserDeploymentChosen: false,
    testAccountAuthorizedNow: false, googleReadExecuted: false,
    googleWriteAttempted: false, d4cExecutionAuthorized: false
  };
  check(Object.entries(expected).every(([k, v]) => r[k] === v) &&
    historical.resultSha256 === PIN.result &&
    fs.realpathSync(r.historicalB1Session) === historical.session &&
    fs.realpathSync(r.campaign) === dir, 'C0_REPORT_MISMATCH');
  const planFile = path.join(dir, 'inventory-plan.json');
  check(hash(fs.readFileSync(planFile)) === PIN.plan &&
    equal(json(planFile), c0.inventoryPlan()), 'C0_PLAN_MISMATCH');
  return {...historical, c0Dir: dir, c0ReportSha256: hash(fs.readFileSync(path.join(dir, 'report.json')))};
}
function within(value, root) {
  const rel = path.relative(root, value);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
}
function safeOutput(value, roots) {
  const output = path.resolve(value);
  const forbidden = roots.map(r => fs.realpathSync(r));
  check(!forbidden.some(r => within(output, r)), 'OUTPUT_INSIDE_PROTECTED_ROOT');
  // Resolve existing ancestors BEFORE mkdir so an alias cannot write inside evidence.
  let ancestor = output;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const resolved = path.resolve(fs.realpathSync(ancestor), path.relative(ancestor, output));
  check(!forbidden.some(r => within(resolved, r)), 'OUTPUT_INSIDE_PROTECTED_ROOT');
  fs.mkdirSync(output, {recursive: true, mode: 0o700});
  const real = fs.realpathSync(output);
  check(!forbidden.some(r => within(real, r)), 'OUTPUT_INSIDE_PROTECTED_ROOT');
  return real;
}
function configFor(scriptId) {
  check(TARGETS.some(t => t.scriptId === scriptId), 'TARGET_REFUSED');
  return {scriptId, rootDir: 'src', scriptExtensions: ['.gs', '.js'],
    htmlExtensions: ['.html'], jsonExtensions: ['.json'], skipSubdirectories: false};
}
// Independent deny-by-default subprocess boundary. No write verb or caller-selected target.
function readOnlyNative(entry, registry, run = b0.native) {
  return (command, args, cwd) => {
    check(command === process.execPath && args.length === 3 && args[0] === entry &&
      args[1] === '--json' && ['pull', 'list-versions', 'list-deployments'].includes(args[2]),
    'GOOGLE_WRITE_OR_UNKNOWN_OPERATION_REFUSED');
    const record = registry.get(cwd);
    check(record && fs.realpathSync(cwd) === cwd &&
      equal(json(path.join(cwd, '.clasp.json')), configFor(record.scriptId)),
    'READ_WORKSPACE_OR_TARGET_CHANGED');
    const sequence = ['list-versions', 'list-deployments', 'pull', 'list-versions', 'list-deployments'];
    check(sequence[record.next] === args[2], 'READ_SEQUENCE_REFUSED');
    record.next++;
    return run(command, args, cwd);
  };
}
function makeTransport(entry, session, run = b0.native) {
  session = fs.realpathSync(session);
  const registry = new Map(), guarded = readOnlyNative(entry, registry, run);
  const used = new Set();
  return {
    snapshot(role, ordinal) {
      const target = TARGETS.find(t => t.role === role);
      check(target && [1, 2].includes(ordinal) && !used.has(role + ordinal), 'SNAPSHOT_REQUEST_REFUSED');
      used.add(role + ordinal);
      const dir = fs.mkdtempSync(path.join(session, role + '-read-' + ordinal + '-'));
      fs.mkdirSync(path.join(dir, 'src'), {mode: 0o700});
      const config = path.join(dir, '.clasp.json');
      writeNew(config, configFor(target.scriptId));
      registry.set(dir, {scriptId: target.scriptId, next: 0});
      const call = op => JSON.parse(guarded(process.execPath, [entry, '--json', op], dir).toString('utf8'));
      try {
        const before = b0.validateLists(call('list-versions'), call('list-deployments'));
        writeNew(path.join(dir, 'lists-before.json'), before);
        const pulled = call('pull'), files = b0.scan(path.join(dir, 'src'));
        check(pulled && Array.isArray(pulled.pulledFiles) && pulled.pulledFiles.length === files.length &&
          Array.isArray(pulled.deletedFiles) && pulled.deletedFiles.length === 0, 'PULL_INCOMPLETE');
        const inventory = b0.inventory(files), manifest = files.find(f => f.name === 'appsscript.json');
        check(manifest && files.length > 0, 'MANIFEST_MISSING');
        const parsed = JSON.parse(manifest.bytes.toString('utf8').replace(/^\uFEFF/, ''));
        check(parsed && typeof parsed === 'object' && !Array.isArray(parsed), 'MANIFEST_INVALID');
        writeNew(path.join(dir, 'inventory.json'), inventory);
        const bundleFile = path.join(dir, 'snapshot-bundle.json');
        writeNew(bundleFile, {format: 'AKS-D4C-READONLY-SNAPSHOT/1', role, target: target.scriptId,
          files: files.map(f => ({name: f.name, sha256: hash(f.bytes), base64: f.bytes.toString('base64')}))});
        const after = b0.validateLists(call('list-versions'), call('list-deployments'));
        writeNew(path.join(dir, 'lists-after.json'), after);
        check(equal(before, after), 'LISTS_CHANGED_DURING_READ');
        return {files, lists: after, summary: {role, target: target.scriptId, ordinal,
          fileCount: files.length, sourceSha256: b0.sourceDigest(files),
          archiveSha256: hash(fs.readFileSync(bundleFile)), manifestSha256: hash(manifest.bytes),
          versionsCount: after.versions.length, deploymentsCount: after.deployments.length,
          inventoriesSha256: hash(JSON.stringify(after)), inventoriesUnchangedDuringRead: true}};
      } finally {
        registry.delete(dir);
        // Remove only the configuration created here; snapshots are not left push-ready.
        fs.unlinkSync(config);
      }
    }
  };
}
function collect(local, io, record, onStart = () => {}) {
  const first = {};
  // Read both projects, then repeat using fresh directories.
  for (const ordinal of [1, 2]) {
    for (const target of TARGETS) {
      onStart({role: target.role, ordinal});
      const snapshot = io.snapshot(target.role, ordinal);
      record(snapshot.summary);
      if (target.role === 'portal') {
        check(same(snapshot.files, local.evidence.backup), 'PORTAL_HEAD_CHANGED_SINCE_RESTORATION');
        check(equal(snapshot.lists, local.evidence.lists), 'PORTAL_INVENTORIES_CHANGED_SINCE_RESTORATION');
      }
      if (ordinal === 1) first[target.role] = snapshot;
      else {
        check(same(snapshot.files, first[target.role].files), 'INDEPENDENT_READS_DIFFER');
        check(equal(snapshot.lists, first[target.role].lists), 'INVENTORIES_CHANGED_BETWEEN_READS');
      }
    }
  }
  return {independentReadsExact: true, inventoriesUnchanged: true,
    portalHistoricalRestorationExact: true, backendHistoricalBaselineVerified: false};
}
const KEYS = ['mode', 'b0-run', 'c2-run', 'read-session', 'b1-session', 'c0-run', 'clasp-package', 'output', 'authorization'];
function validateOptions(o) {
  check(Object.keys(o).every(k => KEYS.includes(k)), 'INVALID_ARGUMENTS');
  check(['LocalCheck', 'ReadOnly'].includes(o.mode), 'INVALID_MODE');
  for (const k of KEYS.filter(k => !['mode', 'authorization'].includes(k)))
    check(typeof o[k] === 'string' && o[k], 'MISSING_ARGUMENT');
  if (o.mode === 'ReadOnly') check(o.authorization === AUTHORIZATION, 'SEPARATE_READONLY_AUTHORIZATION_REQUIRED');
  else check(!o.authorization, 'LOCAL_CHECK_MUST_NOT_AUTHORIZE_READ');
}
function parseArgs(argv) {
  const options = {mode: 'LocalCheck'}, seen = new Set();
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && KEYS.includes(key) && !seen.has(key) &&
      typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    seen.add(key); options[key] = argv[i + 1];
  }
  validateOptions(options); return options;
}
function main(options, deps = {}) {
  validateOptions(options); // Authorization checked even for direct invocation, before any IO.
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  const local = (deps.loadLocal || loadLocal)(options);
  const entry = (deps.claspEntry || b1.claspEntry)(options['clasp-package']);
  const report = {revision: 'D4C-readonly-r1', applicationCommit: PIN.application,
    projectBookBaseline: PIN.projectBook, candidate: c2.PIN.candidate, packageSha256: c2.PIN.package,
    targets: TARGETS, c0Campaign: local.c0Dir, c0ReportSha256: local.c0ReportSha256,
    inventoryPlanSha256: PIN.plan, historicalB1ResultSha256: PIN.result,
    localEvidenceVerified: true, googleReadAttempted: false, googleWriteAttempted: false,
    readOnlyAuthorized: false, d4cExecutionAuthorized: false,
    currentPropertiesVerified: false, currentSecretContinuityVerified: false,
    ownerAndEditorsVerified: false, supportPermissionsVerified: false,
    effectiveIdentityAudienceAndScopesVerified: false, browserDeploymentChosen: false,
    testAccountAuthorizedNow: false, backendHistoricalBaselineVerified: false,
    status: 'D4C_C1_LOCAL_CHECK_ONLY'};
  if (options.mode === 'LocalCheck') return report;
  const e = local.evidence;
  const root = safeOutput(options.output, [e.dir, e.c2Dir, e.readSession, local.session,
    local.c0Dir, __dirname, options['clasp-package']]);
  const session = fs.mkdtempSync(path.join(root, 'd4c-readonly-'));
  Object.assign(report, {session, generatedAt: new Date().toISOString(), readOnlyAuthorized: true, reads: []});
  writeNew(path.join(session, 'binding.json'), {revision: report.revision, targets: TARGETS,
    c0Campaign: local.c0Dir, c0ReportSha256: local.c0ReportSha256,
    historicalB1ResultSha256: PIN.result, packageSha256: c2.PIN.package});
  writeNew(path.join(session, 'started.json'), {status: 'READ_INTENT_NOT_COMPLETION',
    generatedAt: report.generatedAt, googleWriteAttempted: false});
  try {
    const io = deps.io || makeTransport(entry, session, deps.native || b0.native);
    report.googleReadAttempted = true;
    Object.assign(report, collect(local, io, summary => {
      report.reads.push(summary);
      writeNew(path.join(session, 'read-summary-' + report.reads.length + '.json'), summary);
    }, requested => { report.lastReadRequested = requested; }));
    report.status = 'D4C_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED';
  } catch (error) {
    // Never echo subprocess messages, descriptions, URL, tokens or arbitrary remote fields.
    report.status = 'STOPPED';
    report.failure = safeError(error);
  }
  writeNew(path.join(session, 'report.json'), report);
  return report;
}
function safeError(error) {
  const codes = ['PULL_INCOMPLETE', 'MANIFEST_MISSING', 'MANIFEST_INVALID',
    'LISTS_CHANGED_DURING_READ', 'PORTAL_HEAD_CHANGED_SINCE_RESTORATION',
    'PORTAL_INVENTORIES_CHANGED_SINCE_RESTORATION', 'INDEPENDENT_READS_DIFFER',
    'INVENTORIES_CHANGED_BETWEEN_READS', 'INVENTORY_MAY_BE_TRUNCATED',
    'NATIVE_COMMAND_FAILED', 'READ_WORKSPACE_OR_TARGET_CHANGED', 'READ_SEQUENCE_REFUSED',
    'GOOGLE_WRITE_OR_UNKNOWN_OPERATION_REFUSED', 'C0_REPORT_MISMATCH', 'C0_PLAN_MISMATCH',
    'WRONG_C0_CAMPAIGN', 'SEPARATE_READONLY_AUTHORIZATION_REQUIRED'];
  return codes.includes(error?.message) ? error.message : 'D4C_C1_CHECK_STOPPED';
}
module.exports = {PIN, AUTHORIZATION, TARGETS, loadLocal, safeOutput, configFor, readOnlyNative,
  makeTransport, collect, validateOptions, parseArgs, main};
if (require.main === module) {
  try {
    const report = main(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(report, null, 2));
    if (report.status === 'STOPPED') process.exitCode = 1;
  } catch (error) { console.error(safeError(error)); process.exitCode = 1; }
}
