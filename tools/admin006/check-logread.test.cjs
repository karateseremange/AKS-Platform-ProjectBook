'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const api = require('./check-logread.cjs');
const c1 = require('./check-d4c.cjs');
const b0 = require('./prepare-d4b.cjs');
const p = require('./prepare-logread.cjs');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const put = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const files = [{name:'appsscript.json',bytes:Buffer.from('{"runtimeVersion":"V8"}')},
  {name:'Test.gs',bytes:Buffer.from('function test() {}')}];
const candidate = [...files, {name:'Extra.gs',bytes:Buffer.from('function extra() {}')}];
const lists = b0.validateLists([{versionNumber:1}], [{deploymentId:'fixture-id',versionNumber:1}]);
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'aks-logread-check-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const packageDir = path.join(root,api.PIN.campaign), history = path.join(root,'history'), clasp = path.join(root,'clasp');
  for(const d of [packageDir,history,clasp]) fs.mkdirSync(d);
  const bundle = Buffer.from('historical fixture bytes');
  fs.writeFileSync(path.join(packageDir,'historical-c1-bundle.json'),bundle);
  b0.archive(path.join(packageDir,'candidate-bundle.json'),candidate);
  b0.materialize(path.join(packageDir,'candidate/src'),candidate);
  b0.materialize(path.join(packageDir,'historical-rollback/src'),files);
  const before=b0.inventory(files), after=b0.inventory(candidate), diff=b0.compare(before,after);
  for(const [name,value] of Object.entries({'candidate-inventory.json':after,'historical-inventory.json':before,
    'historical-lists.json':lists,'diff.json':diff,'restoration-residuals.json':diff,
    'delta-previous-candidate.json':diff,'test-restoration-plan.json':p.protocol()})) put(path.join(packageDir,name),value);
  const pin={...api.PIN,package:b0.sourceDigest(candidate),sourceFiles:3,backupFiles:2,
    packageArchive:hash(fs.readFileSync(path.join(packageDir,'candidate-bundle.json'))),
    plan:hash(fs.readFileSync(path.join(packageDir,'test-restoration-plan.json'))),
    additions:['Extra'],modifications:[],diffCounts:{ADD:1,REMOVE:0,MODIFY:0},
    backupSource:b0.sourceDigest(files),backendSource:b0.sourceDigest(files),backendFiles:2,
    manifest:hash(files[0].bytes),backendManifest:hash(files[0].bytes),
    lists:hash(JSON.stringify(lists)),backendLists:hash(JSON.stringify(lists))};
  const report={...api.expectedReport(pin),campaign:packageDir,historicalC1Session:history,
    changedFromPrevious:diff.map(d=>({name:d.name,change:d.change}))};
  put(path.join(packageDir,'report.json'),report);
  fs.writeFileSync(path.join(clasp,'bin.cjs'),'');
  put(path.join(clasp,'package.json'),{name:'@google/clasp',version:'3.3.0',bin:'bin.cjs'});
  const historical={files,bundle,lists,session:history,reportSha256:pin.c1Report};
  const load=()=>api.loadLocal(packageDir,pin,()=>historical);
  return {root,packageDir,pin,report,historical,load,options:{mode:'LocalCheck','package-run':packageDir,
    'clasp-package':clasp,output:path.join(root,'output')}};
}
test('exact CLI modes, closed keys, unique paired arguments',t=>{
  const f=fixture(t), args=Object.entries(f.options).flatMap(([k,v])=>['--'+k,v]);
  assert.equal(api.parseArgs(args).mode,'LocalCheck');
  assert.equal(api.parseArgs(args.slice(2)).mode,'LocalCheck');
  for(const suffix of [['--mode','LocalCheck'],['--output'],['--target','x'],['--authorization','yes']])
    assert.throws(()=>api.parseArgs([...args,...suffix]));
  for(const mode of ['Push','Execute','Restore']) assert.throws(()=>api.validateOptions({...f.options,mode}));
});
test('authorization rejected before evidence or output writes',t=>{
  const f=fixture(t);let touched=false;
  for(const authorization of [undefined,'yes','LOGREAD-READONLY-'+api.PIN.previousPackage])
    assert.throws(()=>api.main({...f.options,mode:'ReadOnly',authorization},{loadLocal:()=>{touched=true;}}));
  assert.equal(touched,false);assert.equal(fs.existsSync(f.options.output),false);
});
test('local package, inventory, historical copy and restoration plan validated',t=>{
  const f=fixture(t);assert.equal(f.load().candidate.length,3);
});
test('every pinned report field must match',t=>{
  const f=fixture(t);
  for(const k of Object.keys(api.expectedReport(f.pin))) {
    put(path.join(f.packageDir,'report.json'),{...f.report,[k]:'tampered'});
    assert.throws(f.load,/PACKAGE_REPORT_MISMATCH/);
  }
});
for(const filename of ['candidate-bundle.json','historical-c1-bundle.json','candidate-inventory.json',
  'historical-inventory.json','historical-lists.json','diff.json','restoration-residuals.json',
  'delta-previous-candidate.json','test-restoration-plan.json']) {
  test('tampering rejected: '+filename,t=>{
    const f=fixture(t);put(path.join(f.packageDir,filename),{tampered:true});assert.throws(f.load);
  });
}
test('materialized candidate and rollback bytes cannot drift',t=>{
  const f=fixture(t);
  for(const prefix of ['candidate','historical-rollback']) {
    const file=path.join(f.packageDir,prefix,'src','Test.gs'), original=fs.readFileSync(file);
    fs.writeFileSync(file,'drift');assert.throws(f.load,/INVENTORY/);fs.writeFileSync(file,original);
  }
});
test('historical report identity cannot drift',t=>{
  const f=fixture(t);f.historical.reportSha256='bad';assert.throws(f.load,/HISTORICAL_BINDING/);
});
test('wrong campaign and report directory rejected',t=>{
  const f=fixture(t);assert.throws(()=>api.loadLocal(f.packageDir,{...f.pin,campaign:'wrong'},()=>f.historical));
  put(path.join(f.packageDir,'report.json'),{...f.report,campaign:f.root});assert.throws(f.load,/PACKAGE_REPORT/);
});
test('LocalCheck invokes no subprocess and creates no output',t=>{
  const f=fixture(t);let called=false;
  const r=api.main(f.options,{loadLocal:f.load,native:()=>{called=true;throw Error('unexpected');}});
  assert.equal(called,false);assert.equal(fs.existsSync(f.options.output),false);
  assert.equal(r.status,'LOGREAD_READONLY_LOCAL_CHECK_ONLY');
  for(const k of ['googleReadAttempted','googleWriteAttempted','readOnlyAuthorized','executionAuthorized',
    'remoteSourceAndInventoriesRevalidated','currentPropertiesVerified','currentSecretContinuityVerified',
    'ownerAndEditorsVerified','supportPermissionsVerified','effectiveIdentityAudienceAndScopesVerified',
    'browserDeploymentChosen','testAccountAuthorizedNow','backendHistoricalBaselineVerified']) assert.equal(r[k],false,k);
});
test('unreviewed clasp version stopped locally',t=>{
  const f=fixture(t);put(path.join(f.options['clasp-package'],'package.json'),{name:'@google/clasp',version:'9',bin:'bin.cjs'});
  assert.throws(()=>api.main(f.options,{loadLocal:f.load}));
});
function simulated(f, mutate=()=>{}) {
  const calls=[];
  return {calls,snapshot(role,ordinal) {
    calls.push([role,ordinal]);
    const s={files:files.map(x=>({...x,bytes:Buffer.from(x.bytes)})),lists:structuredClone(lists),
      summary:{role,target:c1.TARGETS.find(x=>x.role===role).scriptId,ordinal}};
    mutate(s);return s;
  }};
}
test('four ordered reads match exact portal and backend historical C1 references',t=>{
  const f=fixture(t),io=simulated(f),records=[];
  const r=api.collect(f.load(),io,s=>records.push(s),f.pin);
  assert.deepEqual(io.calls,[['portal',1],['backend',1],['portal',2],['backend',2]]);
  assert.equal(records.length,4);assert.equal(r.backendMatchesHistoricalC1,true);
  assert.equal(r.portalHistoricalRestorationExact,true);assert.equal(r.independentReadsExact,true);
  assert.equal(r.backendHistoricalBaselineVerified,undefined);
});
for(const role of ['portal','backend']) test(role+' source drift rejected',t=>{
  const f=fixture(t),io=simulated(f,s=>{if(s.summary.role===role)s.files[1].bytes=Buffer.from('drift');});
  assert.throws(()=>api.collect(f.load(),io,()=>{},f.pin),/REMOTE_SOURCE/);
});
test('version or deployment inventory drift rejected',t=>{
  const f=fixture(t),io=simulated(f,s=>{s.lists.versions.push({versionNumber:2});});
  assert.throws(()=>api.collect(f.load(),io,()=>{},f.pin),/REMOTE_INVENTORIES/);
});
test('second independent read cannot drift',t=>{
  const f=fixture(t),io=simulated(f,s=>{if(s.summary.ordinal===2)s.files[1].bytes=Buffer.from('drift');});
  assert.throws(()=>api.collect(f.load(),io,()=>{},f.pin),/REMOTE_SOURCE/);assert.equal(io.calls.length,3);
});
test('ReadOnly transport failure retains safe report without writing Google',t=>{
  const f=fixture(t);let calls=0;
  const r=api.main({...f.options,mode:'ReadOnly',authorization:api.AUTHORIZATION},{loadLocal:f.load,
    native:(_cmd,args)=>{calls++;assert.equal(args[2],'list-versions');throw Error('private-url-and-token');}});
  assert.equal(calls,1);assert.equal(r.status,'STOPPED');assert.equal(r.googleWriteAttempted,false);
  assert.equal(r.failure,'LOGREAD_READONLY_STOPPED');assert.ok(fs.existsSync(path.join(r.session,'report.json')));
  const dirs=fs.readdirSync(r.session,{withFileTypes:true}).filter(x=>x.isDirectory());
  for(const d of dirs) assert.equal(fs.existsSync(path.join(r.session,d.name,'.clasp.json')),false);
});
test('arbitrary errors are redacted',()=>assert.equal(api.safeError(Error('secret-url')),'LOGREAD_READONLY_STOPPED'));
