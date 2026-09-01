#!/usr/bin/env node
'use strict';
// B0-r2: local preparation and explicitly selected Google reads only.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const TARGET = '1quyIoxSMlxe6xpADPlxRxGikRF3OCTEid0-xhOHeSRZH0sU0AOeIRxs4';
const CANDIDATE = '688c81bb64e6aa09f9955743b783fca989369ae2';
const SOURCE_SHA = '91871173349d843986aab23fc74271606e6562f79de8bdb2e5c9fbd1206b8580';
// This revision uses the JSON CLI and 100*10 paging bound reviewed in clasp 3.3.0 and 3.4.1.
// Stop on another installed version; do not install or update the user's tools.
const CLASP_VERSIONS = Object.freeze(['3.3.0', '3.4.1']);
function check(ok, code) { if (!ok) throw new Error(code); }
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', {flag: 'wx', mode: 0o600});
}
function safeName(name) {
  check(typeof name === 'string' && name && !name.includes('\\') &&
    !name.startsWith('/') && !/[\x00-\x1f\x7f:]/.test(name) &&
    name.split('/').every(part => part && part !== '.' && part !== '..' &&
      !/[. ]$/.test(part) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)),
  'UNSAFE_FILE_NAME');
  return name;
}
function kind(name) {
  safeName(name);
  if (name === 'appsscript.json') return 'JSON';
  if (/\.(gs|js)$/.test(name)) return 'SERVER_JS';
  if (name.endsWith('.html')) return 'HTML';
  throw new Error('UNEXPECTED_FILE_TYPE');
}
function inventory(files) {
  const seen = new Set();
  return files.map(file => {
    const type = kind(file.name);
    const remoteName = file.name.replace(/\.(gs|js|html|json)$/, '');
    // Apps Script names, not local suffixes, identify server files.
    const key = remoteName.toLowerCase();
    check(!seen.has(key), 'REMOTE_NAME_COLLISION'); seen.add(key);
    check(Buffer.isBuffer(file.bytes), 'INVALID_FILE_BYTES');
    return {name: file.name, remoteName, type, bytes: file.bytes.length, sha256: hash(file.bytes)};
  }).sort((a, b) => a.remoteName < b.remoteName ? -1 : a.remoteName > b.remoteName ? 1 : 0);
}
function sourceDigest(files) {
  const digest = crypto.createHash('sha256');
  [...files].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0).forEach(file => {
    digest.update(file.name + '\0'); digest.update(file.bytes); digest.update('\0');
  });
  return digest.digest('hex');
}
function compare(before, after) {
  const a = new Map(before.map(f => [f.remoteName, f]));
  const b = new Map(after.map(f => [f.remoteName, f]));
  return [...new Set([...a.keys(), ...b.keys()])].sort().flatMap(name => {
    const left = a.get(name), right = b.get(name);
    if (left && right && left.type === right.type && left.sha256 === right.sha256) return [];
    return [{name, change: !left ? 'ADD' : !right ? 'REMOVE' : 'MODIFY',
      before: left || null, after: right || null}];
  });
}
function validateManifest(bytes) {
  const m = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
  check(m.runtimeVersion === 'V8' && m.timeZone === 'Europe/Paris' &&
    m.exceptionLogging === 'STACKDRIVER', 'MANIFEST_RUNTIME_UNEXPECTED');
  check(m.dependencies && Object.keys(m.dependencies).length === 0, 'MANIFEST_DEPENDENCIES_UNEXPECTED');
  const allowed = ['timeZone', 'dependencies', 'exceptionLogging', 'runtimeVersion', 'webapp'];
  check(Object.keys(m).every(key => allowed.includes(key)), 'MANIFEST_FIELDS_REQUIRE_REVIEW');
  // Absence is accepted and recorded; no webapp section is invented.
  if (m.webapp !== undefined) {
    check(m.webapp && m.webapp.executeAs === 'USER_ACCESSING' && m.webapp.access === 'ANYONE' &&
      Object.keys(m.webapp).every(key => ['executeAs', 'access'].includes(key)),
    'MANIFEST_WEBAPP_REQUIRES_REVIEW');
  }
  return {sha256: hash(bytes), webapp: m.webapp || null, timeZone: m.timeZone};
}
function materialize(root, files) {
  check(!fs.existsSync(root), 'DESTINATION_ALREADY_EXISTS');
  fs.mkdirSync(root, {recursive: true, mode: 0o700});
  inventory(files);
  for (const file of files) {
    const target = path.join(root, ...safeName(file.name).split('/'));
    fs.mkdirSync(path.dirname(target), {recursive: true, mode: 0o700});
    fs.writeFileSync(target, file.bytes, {flag: 'wx', mode: 0o600});
  }
}
function scan(root) {
  const files = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
      const file = path.join(dir, item.name);
      check(!item.isSymbolicLink(), 'SYMLINK_REFUSED');
      if (item.isDirectory()) walk(file);
      else {
        check(item.isFile(), 'NON_REGULAR_FILE');
        files.push({name: path.relative(root, file).split(path.sep).join('/'), bytes: fs.readFileSync(file)});
      }
    }
  }
  walk(root); inventory(files); return files;
}
function archive(file, files) {
  writeJson(file, {format: 'AKS-D4B-SNAPSHOT/1', target: TARGET, files: files.map(f => ({
    name: f.name, type: kind(f.name), sha256: hash(f.bytes), base64: f.bytes.toString('base64')
  }))});
  return hash(fs.readFileSync(file));
}
function parseArgs(argv) {
  const options = {};
  const allowed = ['mode', 'repository', 'output', 'clasp-package', 'git'];
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    check(argv[i] === '--' + key && allowed.includes(key) && !Object.hasOwn(options, key) &&
      typeof argv[i + 1] === 'string' && argv[i + 1], 'INVALID_ARGUMENTS');
    options[key] = argv[i + 1];
  }
  check(['LocalCheck', 'GoogleReadOnly'].includes(options.mode), 'INVALID_MODE');
  allowed.forEach(key => check(options[key], 'MISSING_ARGUMENT'));
  return options;
}
function native(command, args, cwd) {
  const env = {...process.env, DEBUG: '', NODE_DEBUG: '', NO_COLOR: '1'};
  // Never pass through a shell or print subprocess output: clasp errors may include URLs.
  const result = cp.spawnSync(command, args, {cwd, shell: false, env,
    input: '', windowsHide: true, maxBuffer: 16 * 1024 * 1024, timeout: 120000});
  check(!result.error && result.status === 0, 'NATIVE_COMMAND_FAILED');
  return result.stdout;
}
function gitSource(repository, git, run = native) {
  const base = ['-C', repository];
  let observed;
  try { observed = run(git, [...base, 'rev-parse', CANDIDATE + '^{commit}'], repository).toString().trim(); }
  catch (_) { throw new Error('CANDIDATE_NOT_AVAILABLE_LOCALLY'); }
  check(observed === CANDIDATE, 'CANDIDATE_NOT_AVAILABLE_LOCALLY');
  const tree = run(git, [...base, 'ls-tree', '-r', '-z', CANDIDATE, '--', 'src/'], repository)
    .toString('utf8').split('\0').filter(Boolean);
  const files = [];
  for (const record of tree) {
    const match = /^(\d+) blob ([a-f0-9]{40})\t(src\/.+)$/.exec(record);
    check(match, 'UNEXPECTED_GIT_TREE_ENTRY');
    if (!/\.(gs|js|html)$/.test(match[3]) && match[3] !== 'src/appsscript.json') continue;
    check(match[1] === '100644' || match[1] === '100755', 'GIT_SYMLINK_REFUSED');
    files.push({name: match[3].slice(4), bytes: run(git, [...base, 'cat-file', 'blob', match[2]], repository)});
  }
  inventory(files);
  check(files.length === 277 && sourceDigest(files) === SOURCE_SHA, 'SOURCE_INVENTORY_OR_HASH_MISMATCH');
  return files;
}
function validateLists(versions, deployments) {
  check(Array.isArray(versions) && Array.isArray(deployments), 'INVENTORY_NOT_ARRAY');
  // clasp 3.3.0/3.4.1 fetchWithPages caps at 10 pages of 100 and omits the partial flag in CLI JSON.
  check(versions.length < 1000 && deployments.length < 1000, 'INVENTORY_MAY_BE_TRUNCATED');
  const ids = new Set(), numbers = new Set();
  versions.forEach(v => {
    check(Number.isInteger(v.versionNumber) && v.versionNumber > 0 && !numbers.has(v.versionNumber), 'VERSION_INVALID');
    numbers.add(v.versionNumber);
  });
  deployments.forEach(d => {
    check(typeof d.deploymentId === 'string' && d.deploymentId && !ids.has(d.deploymentId), 'DEPLOYMENT_INVALID');
    check(d.versionNumber === undefined || (Number.isInteger(d.versionNumber) && d.versionNumber > 0), 'DEPLOYMENT_VERSION_INVALID');
    ids.add(d.deploymentId);
  });
  const sortObject = obj => Object.fromEntries(Object.keys(obj).sort().map(key => [key, obj[key]]));
  return {versions: versions.map(sortObject).sort((a, b) => a.versionNumber - b.versionNumber),
    deployments: deployments.map(sortObject).sort((a, b) => a.deploymentId.localeCompare(b.deploymentId))};
}
function makeClasp(entry, mode, run = native) {
  const allowed = new Set(['pull', 'list-versions', 'list-deployments']);
  return (command, cwd) => {
    check(mode === 'GoogleReadOnly' && allowed.has(command), 'GOOGLE_OPERATION_REFUSED');
    const config = readJson(path.join(cwd, '.clasp.json'));
    check(config.scriptId === TARGET && config.rootDir === 'src', 'WRONG_READ_TARGET');
    const raw = run(process.execPath, [entry, '--json', command], cwd);
    return JSON.parse(raw.toString('utf8'));
  };
}
function prepare(options, deps = {}) {
  check(Number(process.versions.node.split('.')[0]) >= 20, 'NODE_20_REQUIRED');
  const run = deps.native || native;
  const repository = fs.realpathSync(options.repository);
  const output = path.resolve(options.output);
  check(output !== repository && !output.startsWith(repository + path.sep), 'OUTPUT_INSIDE_REPOSITORY');
  const localConfig = readJson(path.join(repository, '.clasp.json'));
  check(localConfig.scriptId === TARGET && path.resolve(repository, localConfig.rootDir || '.') === path.join(repository, 'src'),
    'LOCAL_RECIPE_CONFIGURATION_MISMATCH');
  const claspPackage = fs.realpathSync(options['clasp-package']);
  const packageJson = readJson(path.join(claspPackage, 'package.json'));
  check(packageJson.name === '@google/clasp' && CLASP_VERSIONS.includes(packageJson.version), 'CLASP_VERSION_NOT_REVIEWED');
  const bin = typeof packageJson.bin === 'string' ? packageJson.bin : packageJson.bin?.clasp;
  check(typeof bin === 'string' && !path.isAbsolute(bin), 'CLASP_ENTRY_INVALID');
  const entry = fs.realpathSync(path.join(claspPackage, bin));
  check(entry.startsWith(claspPackage + path.sep), 'CLASP_ENTRY_OUTSIDE_PACKAGE');
  const gitVersion = run(options.git, ['--version'], repository).toString().trim();
  const status = run(options.git, ['-C', repository, 'status', '--porcelain'], repository).toString();
  const files = (deps.gitSource || gitSource)(repository, options.git, run);
  fs.mkdirSync(output, {recursive: true, mode: 0o700});
  const campaign = path.join(output, 'run-' + new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomBytes(3).toString('hex'));
  fs.mkdirSync(campaign, {mode: 0o700});
  const report = {revision: 'B0-r2', mode: options.mode, target: TARGET, candidate: CANDIDATE,
    generatedAt: new Date().toISOString(), gitVersion, node: process.version, clasp: packageJson.version,
    localWorktreeDirty: !!status.trim(), sourceFiles: files.length, sourceSha256: sourceDigest(files),
    googleReadExecuted: false, googleWriteExecuted: false, propertiesVerified: false,
    status: 'LOCAL_CHECK_ONLY', blockers: ['PROPERTIES_OPERATOR_CHECK_REQUIRED', 'DIFF_REVIEW_REQUIRED', 'B1_NOT_AUTHORIZED']};
  try {
    materialize(path.join(campaign, 'git-source'), files);
    writeJson(path.join(campaign, 'git-source-inventory.json'), inventory(files));
    report.gitArchiveSha256 = archive(path.join(campaign, 'git-source-bundle.json'), files);
    if (options.mode === 'GoogleReadOnly') {
      const clasp = makeClasp(entry, options.mode, run);
      function snapshot(label) {
        const dest = path.join(campaign, label); fs.mkdirSync(dest);
        fs.mkdirSync(path.join(dest, 'src'));
        writeJson(path.join(dest, '.clasp.json'), {scriptId: TARGET, rootDir: 'src', scriptExtensions: ['.gs', '.js'], htmlExtensions: ['.html']});
        const versions = clasp('list-versions', dest), deployments = clasp('list-deployments', dest);
        const lists = validateLists(versions, deployments);
        const pulled = clasp('pull', dest);
        const contents = scan(path.join(dest, 'src'));
        check(pulled && Array.isArray(pulled.pulledFiles) && pulled.pulledFiles.length === contents.length &&
          Array.isArray(pulled.deletedFiles) && pulled.deletedFiles.length === 0, 'PULL_INVENTORY_INCOMPLETE');
        check(contents.length && contents.some(f => f.name === 'appsscript.json'), 'PULL_MANIFEST_MISSING');
        writeJson(path.join(campaign, label + '-inventory.json'), inventory(contents));
        writeJson(path.join(campaign, label + '-deployments-versions.json'), lists);
        return {files: contents, lists};
      }
      report.googleReadExecuted = true;
      const backup = snapshot('backup');
      // Archive the first read before any comparison can fail; never discard recovery evidence.
      report.backupArchiveSha256 = archive(path.join(campaign, 'backup-bundle.json'), backup.files);
      const reread = snapshot('independent-read');
      check(compare(inventory(backup.files), inventory(reread.files)).length === 0, 'HEAD_CHANGED_DURING_READ');
      check(JSON.stringify(backup.lists) === JSON.stringify(reread.lists), 'DEPLOYMENTS_OR_VERSIONS_CHANGED');
      report.manifest = validateManifest(backup.files.find(f => f.name === 'appsscript.json').bytes);
      const adapted = files.map(f => f.name === 'appsscript.json' ? backup.files.find(b => b.name === f.name) : f);
      materialize(path.join(campaign, 'candidate', 'src'), adapted);
      // No clasp configuration is installed in the candidate: B0 must not create a push-ready directory.
      report.packageArchiveSha256 = archive(path.join(campaign, 'candidate-bundle.json'), adapted);
      report.packageSha256 = sourceDigest(adapted);
      const diff = compare(inventory(backup.files), inventory(adapted));
      writeJson(path.join(campaign, 'candidate-inventory.json'), inventory(adapted));
      writeJson(path.join(campaign, 'diff.json'), diff);
      writeJson(path.join(campaign, 'restoration-residuals.json'), diff.filter(d => d.change === 'ADD'));
      report.backupFiles = backup.files.length; report.packageFiles = adapted.length;
      report.diffCounts = Object.fromEntries(['ADD', 'REMOVE', 'MODIFY'].map(k => [k, diff.filter(d => d.change === k).length]));
      report.manifestUnchanged = true; report.independentReadExact = true;
      report.status = 'READ_ONLY_COLLECTED_REVIEW_REQUIRED';
    }
    writeJson(path.join(campaign, 'report.json'), report);
    return {campaign, report};
  } catch (error) {
    report.status = 'STOPPED'; report.failure = /^[A-Z0-9_]+$/.test(error.message) ? error.message : 'B0_INTERNAL_FAILURE';
    writeJson(path.join(campaign, 'report.json'), report);
    throw new Error(report.failure + ' (local report: ' + path.join(campaign, 'report.json') + ')');
  }
}
module.exports = {TARGET, CANDIDATE, SOURCE_SHA, inventory, sourceDigest, compare, validateManifest,
  materialize, scan, archive, parseArgs, native, gitSource, validateLists, makeClasp, prepare};
if (require.main === module) {
  try {
    const result = prepare(parseArgs(process.argv.slice(2)));
    console.log('B0: ' + result.report.status);
    console.log('Dossier local: ' + result.campaign);
    console.log('Google write: false. Properties: operator check required. B1: not authorized.');
  } catch (error) {
    // Do not print raw exceptions originating in credentials, manifests or subprocesses.
    const message = error && typeof error.message === 'string' ? error.message : '';
    console.error(/^[A-Z0-9_]+(?: \(local report: [^\r\n]+\))?$/.test(message) ? message : 'B0_STOPPED_SEE_LOCAL_PREREQUISITES');
    process.exitCode = 1;
  }
}
