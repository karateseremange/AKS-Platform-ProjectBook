'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const api = require('./validate-logread.cjs');
const b0 = require('./prepare-d4b.cjs');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const files = [
  {name:'appsscript.json',bytes:Buffer.from('{"runtimeVersion":"V8"}')},
  {name:'Test.gs',bytes:Buffer.from('function test() {}')}
];
const candidate = [...files,{name:'Extra.gs',bytes:Buffer.from('function extra() {}')}];
const lists = {versions:[{versionNumber:1}],deployments:[{deploymentId:'fixture',versionNumber:1}]};
const clone = rows => rows.map(x=>({name:x.name,bytes:Buffer.from(x.bytes)}));
function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'aks-logread-executor-test-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const packageDir=fs.mkdirSync(path.join(root,api.PIN.campaign))||path.join(root,api.PIN.campaign);
  const readSession=fs.mkdirSync(path.join(root,api.PIN.readSession))||path.join(root,api.PIN.readSession);
  const clasp=fs.mkdirSync(path.join(root,'clasp'))||path.join(root,'clasp');
  fs.writeFileSync(path.join(clasp,'bin.cjs'),'');
  fs.writeFileSync(path.join(clasp,'package.json'),JSON.stringify({name:'@google/clasp',version:'3.3.0',bin:'bin.cjs'}));
  const evidence={dir:packageDir,readSession,backup:clone(files),candidate:clone(candidate),lists};
  const options={mode:'LocalCheck','package-run':packageDir,'read-session':readSession,
    'clasp-package':clasp,output:path.join(root,'output')};
  return {root,packageDir,readSession,clasp,evidence,options};
}
function memoryIo(evidence, hooks={}) {
  let state=clone(evidence.backup), count=0;
  const pushes=[];
  return {pushes,get state(){return state;},snapshot(label){
    count++;let out={files:clone(state),lists:structuredClone(evidence.lists)};
    if(hooks.snapshot) out=hooks.snapshot({label,count,out,state:clone(state)})||out;
    return out;
  },push(rows,label){pushes.push(label);state=clone(rows);if(hooks.push)hooks.push({rows,label,state});}};
}
test('authorization is exact and package-specific',()=>{
  assert.equal(api.AUTHORIZATION,'LOGREAD-EXECUTE-'+api.PIN.package);
  assert.notEqual(api.AUTHORIZATION,'LOGREAD-EXECUTE-'+api.PIN.previousPackage);
});
test('CLI accepts only known unique paired arguments',t=>{
  const f=fixture(t),args=Object.entries(f.options).flatMap(([k,v])=>['--'+k,v]);
  assert.equal(api.parseArgs(args).mode,'LocalCheck');
  for(const suffix of [['--mode','LocalCheck'],['--target','x'],['--output'],['--authorization','yes']])
    assert.throws(()=>api.parseArgs([...args,...suffix]));
});
test('LocalCheck refuses authorization and recovery session',async t=>{
  const f=fixture(t);
  assert.throws(()=>api.parseArgs(Object.entries({...f.options,authorization:'x'}).flatMap(([k,v])=>['--'+k,v])));
  await assert.rejects(()=>api.main({...f.options,session:'x'},
    {loadEvidence:()=>f.evidence,claspEntry:()=>''}));
});
test('Execute and Restore require exact authorization before evidence',async t=>{
  const f=fixture(t);let touched=0;
  for(const mode of ['Execute','Restore']) {
    const o={...f.options,mode};if(mode==='Restore')o.session=f.root;
    await assert.rejects(()=>api.main(o,{loadEvidence:()=>{touched++;}}),/AUTHORIZATION/);
  }
  assert.equal(touched,0);
});
test('LocalCheck makes no subprocess or output write',async t=>{
  const f=fixture(t);let native=0;
  const r=await api.main(f.options,{loadEvidence:()=>f.evidence,claspEntry:()=>path.join(f.clasp,'bin.cjs'),
    native:()=>{native++;}});
  assert.equal(r.status,'LOGREAD_EXECUTOR_LOCAL_CHECK_ONLY');
  assert.equal(r.googleReadAttempted,false);assert.equal(r.googleWriteAttempted,false);
  assert.equal(r.executionAuthorized,false);assert.equal(native,0);
  assert.equal(fs.existsSync(f.options.output),false);
});
test('read-only snapshot bundle validates encoding and hash',t=>{
  const f=fixture(t),target='target',file=path.join(f.root,'bundle.json');
  const body={format:'AKS-D4C-READONLY-SNAPSHOT/1',role:'portal',target,
    files:files.map(x=>({name:x.name,sha256:hash(x.bytes),base64:x.bytes.toString('base64')}))};
  fs.writeFileSync(file,JSON.stringify(body)+'\n');
  assert.deepEqual(api.readBundle(file,'portal',target,hash(fs.readFileSync(file))).map(x=>x.name),
    files.map(x=>x.name));
  assert.throws(()=>api.readBundle(file,'backend',target,hash(fs.readFileSync(file))));
  body.files[0].sha256='bad';fs.writeFileSync(file,JSON.stringify(body)+'\n');
  assert.throws(()=>api.readBundle(file,'portal',target,hash(fs.readFileSync(file))));
});
test('session binding includes all package and preflight pins',t=>{
  const f=fixture(t),b=api.sessionBinding(f.evidence);
  assert.equal(b.package,api.PIN.package);assert.equal(b.packageArchive,api.PIN.packageArchive);
  assert.equal(b.packageReportSha256,api.PIN.packageReport);
  assert.equal(b.readSession,f.readSession);assert.equal(b.revision,'LOGREAD-executor-r1');
});
test('successful execution installs candidate, records test and restores exactly',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence),events=[];
  const r=await api.execute(f.evidence,io,e=>events.push(e),async()=> '781/781');
  assert.equal(r.status,'RESTORED_TEST_PASS_OPERATOR_REVIEW_REQUIRED');
  assert.equal(r.testPassed,true);assert.equal(r.restoredExact,true);
  assert.deepEqual(io.pushes,['candidate-upload','restore-upload']);
  assert.equal(b0.compare(b0.inventory(io.state),b0.inventory(files)).length,0);
  assert.ok(events.includes('CANDIDATE_PUSH_INTENT'));assert.ok(events.includes('RESTORED_EXACT'));
});
test('failed test still restores historical portal',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence);
  const r=await api.execute(f.evidence,io,()=>{},async()=> 'ECHEC');
  assert.equal(r.status,'TEST_NOT_PASSED');assert.equal(r.testPassed,false);assert.equal(r.restoredExact,true);
  assert.equal(b0.compare(b0.inventory(io.state),b0.inventory(files)).length,0);
});
test('changed HEAD stops before any push',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence,{snapshot:({out,count})=>{
    if(count===1)out.files[1].bytes=Buffer.from('concurrent');return out;}});
  const r=await api.execute(f.evidence,io,()=>{},async()=> '781/781');
  assert.equal(r.status,'HEAD_CHANGED_SINCE_PREFLIGHT');assert.equal(io.pushes.length,0);
});
test('versions or deployments drift stops before upload',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence,{snapshot:({out,count})=>{
    if(count===1)out.lists.versions.push({versionNumber:2});return out;}});
  const r=await api.execute(f.evidence,io,()=>{},async()=> '781/781');
  assert.equal(r.status,'DEPLOYMENTS_OR_VERSIONS_CHANGED');assert.equal(io.pushes.length,0);
});
test('candidate readback mismatch triggers exact restoration',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence,{snapshot:({out,count})=>{
    if(count===2)out.files[1].bytes=Buffer.from('bad readback');return out;}});
  const r=await api.execute(f.evidence,io,()=>{},async()=> '781/781');
  assert.equal(r.status,'CANDIDATE_READBACK_MISMATCH');assert.equal(r.restoredExact,true);
  assert.equal(b0.compare(b0.inventory(io.state),b0.inventory(files)).length,0);
});
test('restore accepts exact backup without push',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence),events=[];
  await api.restore(f.evidence,io,e=>events.push(e));
  assert.equal(io.pushes.length,0);assert.deepEqual(events,['RESTORED_EXACT']);
});
test('restore replaces a known candidate state',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence);io.push(f.evidence.candidate,'seed');io.pushes.length=0;
  await api.restore(f.evidence,io,()=>{});
  assert.deepEqual(io.pushes,['restore-upload']);
  assert.equal(b0.compare(b0.inventory(io.state),b0.inventory(files)).length,0);
});
test('restore refuses an unknown concurrent edit',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence,{snapshot:({out,count})=>{
    if(count===1)out.files[1].bytes=Buffer.from('unknown');return out;}});
  await assert.rejects(()=>api.restore(f.evidence,io,()=>{}),/UNKNOWN_REMOTE_CHANGE_STOP/);
  assert.equal(io.pushes.length,0);
});
test('recovery requires exact binding and push intent',t=>{
  const f=fixture(t),session=fs.mkdirSync(path.join(f.root,'session'))||path.join(f.root,'session');
  fs.writeFileSync(path.join(session,'session.json'),JSON.stringify({binding:api.sessionBinding(f.evidence)}));
  assert.throws(()=>api.checkRecovery(session,f.evidence),/NO_CANDIDATE/);
  fs.writeFileSync(path.join(session,'event-00000000-0000-0000-0000-000000000000.json'),
    JSON.stringify({event:'CANDIDATE_PUSH_INTENT'}));
  api.checkRecovery(session,f.evidence);
  fs.writeFileSync(path.join(session,'session.json'),JSON.stringify({binding:{}}));
  assert.throws(()=>api.checkRecovery(session,f.evidence),/RECOVERY_SESSION/);
});
test('full Execute flow requires confirmations and reports restored properties',async t=>{
  const f=fixture(t),io=memoryIo(f.evidence),answers=[
    'LOGREAD-EXECUTE-AUTORISE-FERME','781/781','PROPRIETES-CONFIRMEES'];
  const r=await api.main({...f.options,mode:'Execute',authorization:api.AUTHORIZATION},{
    loadEvidence:()=>f.evidence,claspEntry:()=>path.join(f.clasp,'bin.cjs'),io,
    ask:async()=>answers.shift()});
  assert.equal(r.status,'RESTORED_TEST_PASS_OPERATOR_REVIEW_REQUIRED');
  assert.equal(r.executionAuthorized,true);assert.equal(r.googleReadAttempted,true);
  assert.equal(r.googleWriteAttempted,true);assert.equal(r.propertiesOperatorConfirmed,true);
  assert.ok(fs.existsSync(path.join(r.session,'session.json')));
});
test('wrong interactive phrase stops before output and Google',async t=>{
  const f=fixture(t);
  await assert.rejects(()=>api.main({...f.options,mode:'Execute',authorization:api.AUTHORIZATION},{
    loadEvidence:()=>f.evidence,claspEntry:()=>path.join(f.clasp,'bin.cjs'),ask:async()=> 'NON'}),/OPERATOR/);
  assert.equal(fs.existsSync(f.options.output),false);
});
test('output cannot be inside package, preflight, tools or clasp',async t=>{
  const f=fixture(t),roots=[f.packageDir,f.readSession,f.clasp,__dirname];
  for(const output of roots) await assert.rejects(()=>api.main({...f.options,mode:'Execute',
    authorization:api.AUTHORIZATION,output},{loadEvidence:()=>f.evidence,
    claspEntry:()=>path.join(f.clasp,'bin.cjs'),ask:async()=> 'LOGREAD-EXECUTE-AUTORISE-FERME'}));
});
test('arbitrary native or remote error text is never shared',()=>{
  assert.equal(api.safeError(Error('PRIVATE_URL_TOKEN')),'LOGREAD_EXECUTOR_STOPPED');
  assert.equal(api.safeError(Error('https://secret.example/token')),'LOGREAD_EXECUTOR_STOPPED');
});
