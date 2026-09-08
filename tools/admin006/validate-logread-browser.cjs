#!/usr/bin/env node
'use strict';
// LOGREAD-browser-r1. LocalCheck only until a separate D4-C authorization.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const readline=require('node:readline/promises');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const check=(ok,code)=>{if(!ok)throw new Error(code);};
check(hash(fs.readFileSync(path.join(__dirname,'validate-logread.cjs')))===
  '3228ae8ed7a21a33ea40ff05c2c8f33b3c4a68265e0175c6f8868e54938d6fb8','HELPER_INTEGRITY_MISMATCH');
const tech=require('./validate-logread.cjs');
const b0=require('./prepare-d4b.cjs');
const b1=require('./validate-d4b.cjs');
const PIN=Object.freeze({...tech.PIN,technicalSession:'logread-executor-WunNuE'});
const AUTHORIZATION='LOGREAD-BROWSER-'+PIN.package;
const json=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const same=(a,b)=>b0.compare(b0.inventory(a),b0.inventory(b)).length===0;
function writeNew(file,value){const fd=fs.openSync(file,'wx',0o600);try{fs.writeFileSync(fd,JSON.stringify(value,null,2)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
function events(session){return fs.readdirSync(session).filter(n=>/^event-[a-f0-9-]+\.json$/.test(n)).map(n=>json(path.join(session,n)));}
function loadTechnical(session,evidence){
  session=fs.realpathSync(session);check(path.basename(session)===PIN.technicalSession,'WRONG_TECHNICAL_SESSION');
  check(equal(json(path.join(session,'session.json')).binding,tech.sessionBinding(evidence)),'TECHNICAL_BINDING_MISMATCH');
  const names=fs.readdirSync(session).filter(n=>/^result-[a-f0-9-]+\.json$/.test(n));
  check(names.length===1,'TECHNICAL_RESULT_AMBIGUOUS');
  const r=json(path.join(session,names[0]));
  const expected={revision:'LOGREAD-executor-r1',target:b0.TARGET,candidate:PIN.candidate,
    packageSha256:PIN.package,packageArchiveSha256:PIN.packageArchive,
    packageReportSha256:PIN.packageReport,backupArchiveSha256:PIN.archive,
    preflightSession:evidence.readSession,preflightSnapshotsVerifiedLocally:true,
    googleReadAttempted:true,googleWriteAttempted:true,propertiesOperatorConfirmed:true,
    executionAuthorized:true,status:'RESTORED_TEST_PASS_OPERATOR_REVIEW_REQUIRED',
    testPassed:true,restoredExact:true,session};
  check(Object.entries(expected).every(([k,v])=>equal(r[k],v)),'TECHNICAL_RESULT_MISMATCH');
  const namesSeen=new Set(events(session).map(e=>e.event));
  for(const event of ['CANDIDATE_PUSH_INTENT','CANDIDATE_EXACT','TEST_PASS_OPERATOR_REPORTED','RESTORED_EXACT'])
    check(namesSeen.has(event),'TECHNICAL_EVENTS_INCOMPLETE');
  return {session,resultSha256:hash(fs.readFileSync(path.join(session,names[0])))};
}
const STEPS=Object.freeze([
  Object.freeze({event:'AUDIT_CONNECTED',token:'AUDIT-CONNECTE',
    prompt:'Executer AKS_connectAudit001Recipe. Conserver son JSON. Saisir AUDIT-CONNECTE uniquement si ok=true et phase=CONNECTED : '}),
  Object.freeze({event:'LOGREAD_PREFLIGHT_OK',token:'LOGREAD-PREFLIGHT-OK',
    prompt:'Executer AKS_preflightAccess002LogReadRecipe. Conserver son JSON. Saisir LOGREAD-PREFLIGHT-OK uniquement si ok=true, phase=PREFLIGHT, recipeProfile=LOG_READ et writePerformed=false : '}),
  Object.freeze({event:'LOGREAD_ACCESS_APPLIED',token:'LOGREAD-ACCESS-APPLIQUE',
    prompt:'Executer AKS_applyAccess002LogReadRecipe. Conserver son JSON. Saisir LOGREAD-ACCESS-APPLIQUE uniquement si ok=true, phase=APPLIED et recipeProfile=LOG_READ : '}),
  Object.freeze({event:'PRIVATE_ACTIVATED',token:'PRIVE-ACTIVE',
    prompt:'Configurer les quatre proprietes portail hors flag depuis les references protegees, puis backend true et enfin AKS_PRIVATE_PORTAL_ENABLED=true. Ne copier aucune valeur ici. Saisir PRIVE-ACTIVE apres relecture : '}),
  Object.freeze({event:'OAUTH_REVIEWED',token:'OAUTH-REVU',
    prompt:'Avec le gestionnaire, revoir uniquement le consentement OAuth attendu, dont external_request si demande. Saisir OAUTH-REVU apres revue : '}),
  Object.freeze({event:'MANAGER_BROWSER_PASS',token:'GESTIONNAIRE-OK',
    prompt:'Tester OMcZ9gl avec le gestionnaire : menu Journaux, widget/page, mention 500 lignes et aucun contenu sensible partage. Saisir GESTIONNAIRE-OK : '}),
  Object.freeze({event:'DENIED_BROWSER_PASS',token:'REFUS-OK',
    prompt:'Tester le compte de refus dans un profil separe, acces direct admin/logs refuse. Saisir REFUS-OK : '}),
  Object.freeze({event:'PRIVATE_CLOSED',token:'PRIVE-FERME',
    prompt:'Fermer portail puis backend, attendre les appels, restaurer les cinq proprietes portail a leur absence et backend a false. Saisir PRIVE-FERME apres relecture : '}),
  Object.freeze({event:'ACCESS_RESTORED',token:'ACCESS-RESTAURE',
    prompt:'Executer AKS_restoreAccess002LogReadRecipe. Conserver son JSON. Saisir ACCESS-RESTAURE uniquement si exactRestore=true et backupRemoved=true : '}),
  Object.freeze({event:'AUDIT_DISCONNECTED',token:'AUDIT-DECONNECTE',
    prompt:'Executer AKS_disconnectAudit001Recipe. Conserver son JSON. Saisir AUDIT-DECONNECTE uniquement si exactRestore=true et backupRemoved=true : '})
]);
function completed(session){return new Set(events(session).map(e=>e.event));}
async function runSteps(session,ask,record,onlyRecovery=false){
  const done=completed(session);
  const selected=onlyRecovery?STEPS.filter(s=>['PRIVATE_CLOSED','ACCESS_RESTORED','AUDIT_DISCONNECTED'].includes(s.event)):STEPS;
  for(const step of selected){
    if(done.has(step.event))continue;
    if(onlyRecovery&&step.event==='PRIVATE_CLOSED'&&!done.has('PRIVATE_ACTIVATED')&&!done.has('PRIVATE_ACTIVATED_INTENT'))continue;
    if(onlyRecovery&&step.event==='ACCESS_RESTORED'&&!done.has('LOGREAD_ACCESS_APPLIED')&&!done.has('LOGREAD_ACCESS_APPLIED_INTENT'))continue;
    if(onlyRecovery&&step.event==='AUDIT_DISCONNECTED'&&!done.has('AUDIT_CONNECTED')&&!done.has('AUDIT_CONNECTED_INTENT'))continue;
    record(step.event+'_INTENT');done.add(step.event+'_INTENT');
    check(await ask(step.prompt)===step.token,'OPERATOR_STEP_NOT_CONFIRMED');
    record(step.event);done.add(step.event);
  }
  return done;
}
function parseArgs(argv){
  const allowed=['mode','package-run','read-session','technical-session','clasp-package','output','authorization','session'];
  const o={mode:'LocalCheck'},seen=new Set();
  for(let i=0;i<argv.length;i+=2){const k=argv[i].replace(/^--/,'');check(argv[i]==='--'+k&&allowed.includes(k)&&!seen.has(k)&&typeof argv[i+1]==='string'&&argv[i+1],'INVALID_ARGUMENTS');seen.add(k);o[k]=argv[i+1];}
  check(['LocalCheck','Execute','Restore'].includes(o.mode),'INVALID_MODE');
  for(const k of ['package-run','read-session','technical-session','clasp-package'])check(o[k],'MISSING_ARGUMENT');
  if(o.mode==='LocalCheck')check(!o.authorization&&!o.session,'LOCAL_CHECK_MUST_NOT_AUTHORIZE_EXECUTION');
  else{check(o.authorization===AUTHORIZATION,'SEPARATE_BROWSER_AUTHORIZATION_REQUIRED');check(o.mode==='Execute'?o.output:o.session,'SESSION_OR_OUTPUT_REQUIRED');}
  return o;
}
function binding(e,t){return{revision:'LOGREAD-browser-r1',candidate:PIN.candidate,packageSha256:PIN.package,
  packageReportSha256:PIN.packageReport,packageRun:e.dir,readSession:e.readSession,
  technicalSession:t.session,technicalResultSha256:t.resultSha256,
  listsSha256:hash(JSON.stringify(e.lists))};}
function within(v,r){const rel=path.relative(r,v);return rel===''||(!path.isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+path.sep));}
function output(value,roots){const out=path.resolve(value),forbidden=roots.map(r=>fs.realpathSync(r));check(!forbidden.some(r=>within(out,r)),'OUTPUT_INSIDE_PROTECTED_ROOT');fs.mkdirSync(out,{recursive:true,mode:0o700});check(!forbidden.some(r=>within(fs.realpathSync(out),r)),'OUTPUT_INSIDE_PROTECTED_ROOT');return fs.realpathSync(out);}
function assertLists(s,e){check(equal(s.lists,e.lists),'DEPLOYMENTS_OR_VERSIONS_CHANGED');}
async function install(e,io,record){const before=io.snapshot('before-browser-upload');assertLists(before,e);check(same(before.files,e.backup),'HEAD_CHANGED_SINCE_PREFLIGHT');record('CANDIDATE_PUSH_INTENT');io.push(e.candidate,'browser-candidate-upload');const after=io.snapshot('browser-candidate-readback');assertLists(after,e);check(same(after.files,e.candidate),'CANDIDATE_READBACK_MISMATCH');record('CANDIDATE_EXACT');}
async function restoreCode(e,io,record){await tech.restore(e,io,record);record('CODE_RESTORED');}
const SAFE=new Set(['DEPLOYMENTS_OR_VERSIONS_CHANGED','HEAD_CHANGED_SINCE_PREFLIGHT','CANDIDATE_READBACK_MISMATCH','OPERATOR_STEP_NOT_CONFIRMED','UNKNOWN_REMOTE_CHANGE_STOP','RESTORATION_INCOMPLETE']);
const safeError=e=>SAFE.has(e?.message)?e.message:'LOGREAD_BROWSER_STOPPED';
async function main(o,deps={}){
  check(['LocalCheck','Execute','Restore'].includes(o.mode),'INVALID_MODE');
  if(o.mode==='LocalCheck')check(!o.authorization&&!o.session,'LOCAL_CHECK_MUST_NOT_AUTHORIZE_EXECUTION');
  else check(o.authorization===AUTHORIZATION,'SEPARATE_BROWSER_AUTHORIZATION_REQUIRED');
  const evidence=(deps.loadEvidence||tech.loadEvidence)(o['package-run'],o['read-session']);
  const technical=(deps.loadTechnical||loadTechnical)(o['technical-session'],evidence);
  const entry=(deps.claspEntry||b1.claspEntry)(o['clasp-package']);
  const base={revision:'LOGREAD-browser-r1',candidate:PIN.candidate,packageSha256:PIN.package,
    preflightSession:evidence.readSession,technicalSession:technical.session,
    technicalResultSha256:technical.resultSha256,localEvidenceVerified:true,
    googleReadAttempted:false,googleWriteAttempted:false,browserAuthorized:false,
    status:'LOGREAD_BROWSER_LOCAL_CHECK_ONLY'};
  if(o.mode==='LocalCheck')return base;
  const ask=deps.ask;check(typeof ask==='function','INTERACTIVE_OPERATOR_REQUIRED');
  const execute=o.mode==='Execute';
  check(await ask(execute?'Confirmer autorisation D4-C distincte, secours disponible, fenetre sans concurrence et restauration complete : saisir LOGREAD-BROWSER-AUTORISE-FERME : ':'Confirmer reprise D4-C et restauration manuelle puis code : saisir LOGREAD-BROWSER-RESTAURATION-AUTORISEE : ')===
    (execute?'LOGREAD-BROWSER-AUTORISE-FERME':'LOGREAD-BROWSER-RESTAURATION-AUTORISEE'),'OPERATOR_CONFIRMATION_REQUIRED');
  let session;
  if(execute){session=fs.mkdtempSync(path.join(output(o.output,[evidence.dir,evidence.readSession,technical.session,__dirname,o['clasp-package']]),'logread-browser-'));writeNew(path.join(session,'session.json'),{binding:binding(evidence,technical),createdAt:new Date().toISOString()});}
  else{session=fs.realpathSync(o.session);check(equal(json(path.join(session,'session.json')).binding,binding(evidence,technical)),'RECOVERY_SESSION_MISMATCH');check(completed(session).has('CANDIDATE_PUSH_INTENT'),'NO_CANDIDATE_PUSH_INTENT');}
  (deps.notify||(()=>{}))('Session navigateur LOG_READ : '+session);
  const record=event=>writeNew(path.join(session,'event-'+crypto.randomUUID()+'.json'),{event,at:new Date().toISOString()});
  record('OPERATOR_PRECONDITIONS_CONFIRMED');
  const transport=deps.io||b1.makeTransport(entry,session,deps.native||b0.native);
  let read=false,write=false;const io={snapshot:l=>{read=true;return transport.snapshot(l);},push:(f,l)=>{write=true;return transport.push(f,l);}};
  let status='LOGREAD_BROWSER_STOPPED',failure=null;
  try{
    if(execute)await install(evidence,io,record);
    const done=await runSteps(session,ask,record,!execute);
    check(done.has('PRIVATE_CLOSED')&&done.has('ACCESS_RESTORED')&&done.has('AUDIT_DISCONNECTED'),'MANUAL_RECOVERY_REQUIRED');
    await restoreCode(evidence,io,record);status='RESTORED_BROWSER_REVIEW_REQUIRED';
  }catch(error){
    failure=safeError(error);
    const done=completed(session);
    const manualOpen=((done.has('PRIVATE_ACTIVATED')||done.has('PRIVATE_ACTIVATED_INTENT'))&&!done.has('PRIVATE_CLOSED'))||
      ((done.has('LOGREAD_ACCESS_APPLIED')||done.has('LOGREAD_ACCESS_APPLIED_INTENT'))&&!done.has('ACCESS_RESTORED'))||
      ((done.has('AUDIT_CONNECTED')||done.has('AUDIT_CONNECTED_INTENT'))&&!done.has('AUDIT_DISCONNECTED'));
    if(manualOpen)status='MANUAL_RECOVERY_REQUIRED';
    else try{await restoreCode(evidence,io,record);status='RESTORED_BROWSER_NOT_PASSED';}catch(e){status='RESTORE_REQUIRED';failure=safeError(e);}
  }
  const result={...base,status,failure,session,googleReadAttempted:read,googleWriteAttempted:write,
    browserAuthorized:true,completedEvents:Array.from(completed(session)).sort()};
  writeNew(path.join(session,'result-'+crypto.randomUUID()+'.json'),result);return result;
}
async function operatorPrompt(rl,prompt){const controller=new AbortController(),closed=()=>controller.abort();rl.once('close',closed);try{return await rl.question(prompt,{signal:controller.signal});}finally{rl.removeListener('close',closed);}}
module.exports={PIN,AUTHORIZATION,STEPS,loadTechnical,runSteps,parseArgs,binding,install,restoreCode,safeError,main,operatorPrompt};
if(require.main===module){let rl;(async()=>{const o=parseArgs(process.argv.slice(2));if(o.mode!=='LocalCheck'){check(process.stdin.isTTY&&process.stdout.isTTY,'INTERACTIVE_TERMINAL_REQUIRED');rl=readline.createInterface({input:process.stdin,output:process.stdout});}const r=await main(o,{ask:rl?p=>operatorPrompt(rl,p):undefined,notify:console.log});console.log(JSON.stringify(r,null,2));if(!['LOGREAD_BROWSER_LOCAL_CHECK_ONLY','RESTORED_BROWSER_REVIEW_REQUIRED','RESTORED_BROWSER_NOT_PASSED'].includes(r.status))process.exitCode=1;})().catch(e=>{console.error(safeError(e));process.exitCode=1;}).finally(()=>rl?.close());}
