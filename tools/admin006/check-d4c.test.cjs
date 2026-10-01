'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const api = require('./check-d4c.cjs');
const c0 = require('./prepare-d4c.cjs');
const b0 = require('./prepare-d4b.cjs');
const c2 = require('./validate-d4b-c2.cjs');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const put = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const files = [
  {name: 'appsscript.json', bytes: Buffer.from('{"runtimeVersion":"V8"}')},
  {name: 'Test.gs', bytes: Buffer.from('function test() {}')}
];
const lists = {versions: [{versionNumber: 1}], deployments: [{deploymentId: 'protected-id', versionNumber: 1}]};
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aks-d4c-c1-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const dirs = {};
  for (const name of ['b0', 'c2', 'read', 'b1', api.PIN.c0Campaign, 'clasp', 'session'])
    dirs[name] = fs.mkdirSync(path.join(root, name)) || path.join(root, name);
  const local = {session: dirs.b1, resultSha256: api.PIN.result, c0Dir: dirs[api.PIN.c0Campaign],
    c0ReportSha256: 'a'.repeat(64), evidence: {dir: dirs.b0, c2Dir: dirs.c2, readSession: dirs.read,
      backup: files, candidate: files, lists}};
  const report = {
    revision: 'D4C-local-r1', status: 'D4C_LOCAL_PREPARED_REVIEW_REQUIRED',
    applicationCommit: api.PIN.application, projectBookBaseline: api.PIN.projectBook,
    candidate: c2.PIN.candidate, packageSha256: c2.PIN.package,
    historicalB1ResultSha256: api.PIN.result, inventoryPlanSha256: api.PIN.plan,
    historicalSnapshotsVerifiedLocally: true, historicalTestPassOperatorReported: true,
    historicalPropertiesOperatorConfirmed: true, backupFiles: 261, packageFiles: 277,
    currentRemoteStateVerified: false, currentPropertiesVerified: false,
    currentSecretContinuityVerified: false, browserDeploymentChosen: false,
    testAccountAuthorizedNow: false, googleReadExecuted: false,
    googleWriteAttempted: false, d4cExecutionAuthorized: false,
    historicalB1Session: dirs.b1, campaign: local.c0Dir
  };
  put(path.join(local.c0Dir, 'report.json'), report);
  put(path.join(local.c0Dir, 'inventory-plan.json'), c0.inventoryPlan());
  const options = {mode: 'LocalCheck', 'b0-run': dirs.b0, 'c2-run': dirs.c2,
    'read-session': dirs.read, 'b1-session': dirs.b1, 'c0-run': local.c0Dir,
    'clasp-package': dirs.clasp, output: path.join(root, 'output')};
  const entry = path.join(dirs.clasp, 'bin.cjs');
  fs.writeFileSync(entry, '');
  put(path.join(dirs.clasp, 'package.json'), {name: '@google/clasp', version: '3.3.0', bin: 'bin.cjs'});
  return {root, dirs, local, report, options, entry};
}
function remote(f, hook = () => {}) {
  const calls = [];
  const run = (command, args, cwd) => {
    const config = JSON.parse(fs.readFileSync(path.join(cwd, '.clasp.json')));
    const role = config.scriptId === api.PIN.portal ? 'portal' : 'backend';
    const context = {command, args, cwd, role, config, op: args[2]};
    calls.push(context);
    const altered = hook(context, calls);
    if (altered !== undefined) return Buffer.from(JSON.stringify(altered));
    if (args[2] === 'pull') {
      for (const item of files) fs.writeFileSync(path.join(cwd, 'src', item.name), item.bytes);
      return Buffer.from(JSON.stringify({pulledFiles: files.map(x => x.name), deletedFiles: []}));
    }
    return Buffer.from(JSON.stringify(args[2] === 'list-versions' ? lists.versions : lists.deployments));
  };
  return {calls, run};
}
function deps(f, run) { return {loadLocal: () => f.local, native: run}; }
function authorize(f) { return {...f.options, mode: 'ReadOnly', authorization: api.AUTHORIZATION}; }
test('CLI accepts only exact modes, known unique paired options', t => {
  const f = fixture(t), args = Object.entries(f.options).flatMap(([k,v]) => ['--'+k,v]);
  assert.equal(api.parseArgs(args).mode, 'LocalCheck');
  for (const suffix of [['--mode','LocalCheck'], ['--target',api.PIN.backend], ['--output'], ['--authorization','yes']])
    assert.throws(() => api.parseArgs([...args, ...suffix]));
  for (const mode of ['Execute','Restore','Push']) assert.throws(() => api.validateOptions({...f.options, mode}));
});
test('ReadOnly authorization checked before evidence, filesystem and native', t => {
  const f = fixture(t); let touched = false;
  assert.throws(() => api.main({...f.options, mode: 'ReadOnly'},
    {loadLocal: () => {touched=true;}}), /AUTHORIZATION/);
  assert.equal(touched, false); assert.equal(fs.existsSync(f.options.output), false);
});
test('loadLocal validates C0 report, exact plan and historical chain', t => {
  const f = fixture(t); let count=0;
  const loaded = api.loadLocal(f.options, o => {assert.equal(o, f.options); count++; return f.local;});
  assert.equal(count,1); assert.equal(loaded.resultSha256,api.PIN.result);
  assert.equal(loaded.c0ReportSha256,hash(fs.readFileSync(path.join(f.local.c0Dir,'report.json'))));
});
test('C0 binding, hashes, flags and counts cannot drift', t => {
  const f=fixture(t);
  for(const [key,value] of Object.entries({candidate:'changed',backupFiles:260,
    historicalB1ResultSha256:'bad',currentPropertiesVerified:true,d4cExecutionAuthorized:true,
    historicalSnapshotsVerifiedLocally:false,inventoryPlanSha256:'bad'})) {
    put(path.join(f.local.c0Dir,'report.json'),{...f.report,[key]:value});
    assert.throws(()=>api.loadLocal(f.options,()=>f.local),/C0_REPORT/);
  }
  put(path.join(f.local.c0Dir,'report.json'),f.report);
  assert.throws(()=>api.loadLocal(f.options,()=>({...f.local,resultSha256:'bad'})),/C0_REPORT/);
});
test('modified C0 plan is rejected', t => {
  const f=fixture(t);put(path.join(f.local.c0Dir,'inventory-plan.json'),{executable:true});
  assert.throws(()=>api.loadLocal(f.options,()=>f.local),/C0_PLAN/);
});
test('LocalCheck makes no subprocess, Google or output-directory write', t => {
  const f=fixture(t);let called=false;
  const r=api.main(f.options,deps(f,()=>{called=true;throw Error('forbidden');}));
  assert.equal(called,false);assert.equal(fs.existsSync(f.options.output),false);
  assert.equal(r.status,'D4C_C1_LOCAL_CHECK_ONLY');assert.equal(r.googleReadAttempted,false);
  assert.equal(r.readOnlyAuthorized,false);assert.equal(r.d4cExecutionAuthorized,false);
});
test('unreviewed clasp is rejected without execution', t => {
  const f=fixture(t);put(path.join(f.dirs.clasp,'package.json'),{name:'@google/clasp',version:'4.0.0',bin:'bin.cjs'});
  assert.throws(()=>api.main(f.options,deps(f,()=>{throw Error('never');})),/CLASP/);
});
test('target allowlist contains only the exact two RECETTE projects', () => {
  assert.equal(api.TARGETS.length,2);
  assert.equal(api.configFor(api.PIN.portal).scriptId,api.PIN.portal);
  assert.equal(api.configFor(api.PIN.backend).scriptId,api.PIN.backend);
  assert.throws(()=>api.configFor('other'),/TARGET/);
});
test('native boundary rejects write verbs, extra flags, other entry and workspace', t => {
  const f=fixture(t);const registry=new Map(), guard=api.readOnlyNative(f.entry,registry,()=>{throw Error('never');});
  for(const op of ['push','deploy','create-version','run','delete-deployment','login'])
    assert.throws(()=>guard(process.execPath,[f.entry,'--json',op],f.dirs.session),/REFUSED/);
  assert.throws(()=>guard(process.execPath,[f.entry,'--json','pull','--force'],f.dirs.session),/REFUSED/);
  assert.throws(()=>guard('clasp',[f.entry,'--json','pull'],f.dirs.session),/REFUSED/);
  assert.throws(()=>guard(process.execPath,['other','--json','pull'],f.dirs.session),/REFUSED/);
  assert.throws(()=>guard(process.execPath,[f.entry,'--json','pull'],f.dirs.session),/WORKSPACE/);
});
test('native boundary rejects config changes and out-of-order/repeated reads', t => {
  const f=fixture(t), config=path.join(f.dirs.session,'.clasp.json');
  put(config,api.configFor(api.PIN.portal));
  const registry=new Map([[f.dirs.session,{scriptId:api.PIN.portal,next:0}]]);
  let calls=0;const guard=api.readOnlyNative(f.entry,registry,()=>{calls++;return Buffer.from('[]');});
  assert.throws(()=>guard(process.execPath,[f.entry,'--json','pull'],f.dirs.session),/SEQUENCE/);
  put(config,api.configFor(api.PIN.backend));
  assert.throws(()=>guard(process.execPath,[f.entry,'--json','list-versions'],f.dirs.session),/TARGET/);
  put(config,{...api.configFor(api.PIN.portal),rootDir:'../outside'});
  assert.throws(()=>guard(process.execPath,[f.entry,'--json','list-versions'],f.dirs.session),/TARGET/);
  put(config,api.configFor(api.PIN.portal));
  guard(process.execPath,[f.entry,'--json','list-versions'],f.dirs.session);
  assert.throws(()=>guard(process.execPath,[f.entry,'--json','list-versions'],f.dirs.session),/SEQUENCE/);
  assert.equal(calls,1);
});
test('full mocked collection uses 20 read commands and four independent workspaces', t => {
  const f=fixture(t), fake=remote(f);
  const r=api.main(authorize(f),deps(f,fake.run));
  assert.equal(r.status,'D4C_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED');
  assert.equal(fake.calls.length,20); assert.equal(new Set(fake.calls.map(c=>c.cwd)).size,4);
  assert.deepEqual(r.reads.map(x=>x.role+':'+x.ordinal),['portal:1','backend:1','portal:2','backend:2']);
  for(const cwd of new Set(fake.calls.map(c=>c.cwd))) {
    assert.equal(fs.existsSync(path.join(cwd,'.clasp.json')),false);
    const bundle=JSON.parse(fs.readFileSync(path.join(cwd,'snapshot-bundle.json')));
    assert.equal(bundle.target,bundle.role==='portal'?api.PIN.portal:api.PIN.backend);
    assert.equal(bundle.files.length,2);
  }
  for(const key of ['googleWriteAttempted','d4cExecutionAuthorized','currentPropertiesVerified',
    'currentSecretContinuityVerified','ownerAndEditorsVerified','supportPermissionsVerified',
    'browserDeploymentChosen','testAccountAuthorizedNow','backendHistoricalBaselineVerified',
    'effectiveIdentityAudienceAndScopesVerified']) assert.equal(r[key],false,key);
  assert.equal(r.independentReadsExact,true);assert.equal(r.portalHistoricalRestorationExact,true);
});
test('transport disallows duplicate snapshots and other roles', t => {
  const f=fixture(t), fake=remote(f), io=api.makeTransport(f.entry,f.dirs.session,fake.run);
  io.snapshot('portal',1);
  assert.throws(()=>io.snapshot('portal',1),/REQUEST/);
  assert.throws(()=>io.snapshot('production',1),/REQUEST/);
  assert.throws(()=>io.snapshot('backend',3),/REQUEST/);
});
test('mid-read inventory drift stops and preserves both inventory files', t => {
  const f=fixture(t), fake=remote(f,(c,calls)=>c.op==='list-versions'&&calls.length===4?[{versionNumber:2}]:undefined);
  const r=api.main(authorize(f),deps(f,fake.run));
  assert.equal(r.status,'STOPPED');assert.equal(fake.calls.length,5);
  const dir=fake.calls[0].cwd;
  for(const name of ['lists-before.json','lists-after.json','snapshot-bundle.json'])
    assert.equal(fs.existsSync(path.join(dir,name)),true);
  assert.equal(fs.existsSync(path.join(dir,'.clasp.json')),false);
});
test('partial pull is refused, no retry or write follows', t => {
  const f=fixture(t), fake=remote(f,c=>c.op==='pull'?{pulledFiles:['missing'],deletedFiles:[]}:undefined);
  const r=api.main(authorize(f),deps(f,fake.run));
  assert.equal(r.status,'STOPPED');assert.equal(fake.calls.length,3);
  assert.equal(fs.existsSync(path.join(fake.calls[0].cwd,'.clasp.json')),false);
});
test('missing manifest, malformed JSON and truncated inventories fail closed', t => {
  const f=fixture(t);
  for(const variant of ['manifest','json','truncated']){
    const fake=remote(f,c=>{
      if(variant==='truncated'&&c.op==='list-versions')return Array.from({length:1000},(_,i)=>({versionNumber:i+1}));
      if(c.op==='pull'){
        fs.writeFileSync(path.join(c.cwd,'src','Test.gs'),'function test() {}');
        if(variant==='json')fs.writeFileSync(path.join(c.cwd,'src','appsscript.json'),'{broken');
        return {pulledFiles:variant==='json'?['a','b']:['a'],deletedFiles:[]};
      }
    });
    assert.equal(api.main(authorize(f),deps(f,fake.run)).status,'STOPPED');
  }
});
test('portal HEAD and inventory changes since B1 stop immediately after first read', t => {
  const f=fixture(t);
  for(const kind of ['head','lists']){
    const local={...f.local,evidence:{...f.local.evidence}};
    if(kind==='head')local.evidence.backup=[...files,{name:'Added.gs',bytes:Buffer.from('x')}];
    else local.evidence.lists={versions:[],deployments:[]};
    const fake=remote(f),r=api.main(authorize(f),{loadLocal:()=>local,native:fake.run});
    assert.equal(r.status,'STOPPED');assert.equal(fake.calls.length,5);
    assert.equal(r.reads.length,1);
  }
});
test('backend independent source drift is refused without historical-baseline claim', () => {
  const local={evidence:{backup:files,lists}};
  const io={snapshot(role,ordinal){return {files:role==='backend'&&ordinal===2?
    [...files,{name:'Added.gs',bytes:Buffer.from('x')}]:files,lists,summary:{}};}};
  assert.throws(()=>api.collect(local,io,()=>{}),/READS_DIFFER/);
});
test('backend deployment drift between snapshots is refused', () => {
  const local={evidence:{backup:files,lists}};
  const io={snapshot(role,ordinal){return {files,lists:role==='backend'&&ordinal===2?
    {versions:[],deployments:[]}:lists,summary:{}};}};
  assert.throws(()=>api.collect(local,io,()=>{}),/INVENTORIES_CHANGED/);
});
test('output cannot be inside any evidence, tool or clasp root', t => {
  const f=fixture(t);const roots=[f.dirs.b0,f.dirs.c2,f.dirs.read,f.dirs.b1,f.local.c0Dir,f.dirs.clasp,__dirname];
  for(const root of roots) {
    const output=path.join(root,'forbidden-new');
    assert.throws(()=>api.main({...authorize(f),output},deps(f,()=>{throw Error('never');})),/PROTECTED/);
    assert.equal(fs.existsSync(output),false);
  }
});
test('output alias is resolved before creating directories inside protected evidence', t => {
  const f=fixture(t),alias=path.join(f.root,'alias');
  fs.symlinkSync(f.dirs.b0,alias,process.platform==='win32'?'junction':'dir');
  assert.throws(()=>api.safeOutput(path.join(alias,'new','nested'),[f.dirs.b0]),/PROTECTED/);
  assert.equal(fs.existsSync(path.join(f.dirs.b0,'new')),false);
});
test('raw error text never reaches shareable reports and config is removed on native failure', t => {
  const f=fixture(t),fake=remote(f,()=>{throw Error('https://script.google.com/private SECRET_TOKEN');});
  const r=api.main(authorize(f),deps(f,fake.run));
  assert.equal(r.status,'STOPPED');
  assert.equal(JSON.stringify(r).includes('SECRET_TOKEN'),false);
  assert.equal(JSON.stringify(r).includes('https://'),false);
  assert.equal(fs.existsSync(path.join(fake.calls[0].cwd,'.clasp.json')),false);
});
test('remote descriptions remain only in protected inventories, not shared summaries', t => {
  const f=fixture(t),fake=remote(f,c=>c.op==='list-deployments'?
    [{deploymentId:'protected-id',versionNumber:1,description:'SECRET https://backend.example'}]:undefined);
  f.local.evidence.lists=b0.validateLists(lists.versions,[{deploymentId:'protected-id',versionNumber:1,
    description:'SECRET https://backend.example'}]);
  const r=api.main(authorize(f),deps(f,fake.run));
  assert.equal(r.status,'D4C_READONLY_COLLECTED_OPERATOR_REVIEW_REQUIRED');
  assert.equal(JSON.stringify(r).includes('SECRET'),false);
  assert.equal(JSON.stringify(r).includes('backend.example'),false);
});
test('repeat runs use new sessions and preserve the original C0 report', t => {
  const f=fixture(t),before=fs.readFileSync(path.join(f.local.c0Dir,'report.json'));
  const r1=api.main(authorize(f),deps(f,remote(f).run)),r2=api.main(authorize(f),deps(f,remote(f).run));
  assert.notEqual(r1.session,r2.session);
  assert.deepEqual(fs.readFileSync(path.join(f.local.c0Dir,'report.json')),before);
});
