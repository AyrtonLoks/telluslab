import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as engine from '../dist/packages/learning-core/index.mjs';
import * as profile from '../dist/packages/curriculum-mathematics/challenge-profile.mjs';
const core = {...engine,...profile};
import {makeLocalChallenge,localAuthoringMode,localFeedback,workedTopics} from '../dist/packages/curriculum-mathematics/authorship.mjs';
import {explainLocally} from '../dist/packages/curriculum-mathematics/solutions.mjs';
import {dashboard,agendaPage,historyPage} from '../dist/overview.mjs';
import {mapPage,libraryPage} from '../dist/curriculum.mjs';
import {challengePage,practiceIndex,reviewPage,sessionPage} from '../dist/practice.mjs';
import katex from '../dist/vendor/katex/katex.mjs';

const base=new URL('../dist/',import.meta.url);
const catalog=JSON.parse(readFileSync(new URL('data/catalogo.json',base),'utf8'));
const dag=core.createDag(catalog.topics);
const now='2026-11-19T23:00:00.000Z';
const later='2026-11-19T23:31:00.000Z';
const initial=core.createLearningState(dag);
const context=state=>({catalog,dag,state,workspace:{state,drafts:{},authored:{}},now,
  track:'TRL-00',selected:'1.1',targetKind:'topic',bookSearch:'',bookCategory:'',calendarDay:'2026-11-19',calendarMode:'week'});

test('as visões usam o catálogo integral e rendem sem dados de demonstração',()=>{
  const ctx=context(initial);
  assert.match(dashboard(ctx),/0 \/ 88/);
  assert.match(dashboard(ctx),/Mapa de aprendizagem/);
  assert.match(mapPage(ctx),/Macrotema 1.1/);
  assert.match(libraryPage(ctx),/40 obras/);
  assert.match(libraryPage(ctx,'BIB-40'),/Macrotemas vinculados/);
  assert.match(agendaPage(ctx),/Horário de Brasília/);
  assert.match(agendaPage({...ctx,calendarMode:'month'}),/month-cell/);
  assert.match(historyPage(ctx),/Tempo por tentativa/);
  assert.match(practiceIndex(ctx),/Nenhuma sessão criada/);
  assert.match(reviewPage(ctx),/Nenhum cartão/);
});

test('cada modalidade de cada tema tem um exercício local estruturalmente válido',()=>{
  const allValidated={...initial,progress:Object.fromEntries(Object.entries(initial.progress)
    .map(([id,value])=>[id,{...value,state:'S4'}]))};
  let count=0;
  const worked=new Set();
  for(const topic of catalog.topics) {
    for(const modality of topic.modalities) {
      const options={id:topic.id+'-'+count,now,minutes:60,topicIds:[topic.id],modality};
      const brief=core.challengeBrief(dag,allValidated,options);
      const authored=makeLocalChallenge(brief);
      const {challenge}=core.registerChallenge(dag,allValidated,options,authored);
      const result=explainLocally(brief,challenge);
      assert(result.commentedSolution.length>100);
      assert(challenge.examples.length);
      assert.equal(challenge.durationSeconds,3600);
      if(localAuthoringMode(brief)==='worked') worked.add(topic.id);
      count++;
    }
  }
  assert(count>100);
  assert.deepEqual([...worked],[...workedTopics]);
});

test('sessão, cronômetro, tentativa, material protegido e recuperação por snapshot',()=>{
  const {session,state:planned}=core.planSession(dag,initial,{id:'sessao',minutes:60,now,scheduledAt:now});
  assert.match(sessionPage(context(planned),session),/Gerar desafio/);
  const options={id:'exercicio',sessionId:session.id,block:'advance',now,topicIds:['1.1'],modality:'Cálculo/Algébrico'};
  const brief=core.challengeBrief(dag,planned,options);
  const {state:registered,challenge}=core.registerChallenge(dag,planned,options,makeLocalChallenge(brief));
  const hidden=challengePage(context(registered),challenge);
  assert.match(hidden,/Bloqueados/);
  assert.doesNotMatch(hidden,/Abrir solução comentada/);
  assert.throws(()=>core.solutionMessages(registered,challenge.id,'fake'),/Envie uma tentativa/);
  const started=core.updateTimer(registered,challenge.id,'start',now);
  const {state:submitted,attempt}=core.submitAttempt(dag,started,{id:'real',challengeId:challenge.id,now:later,
    draft:String.raw`$|A\cup B\cup C|$`,draftFormat:'latex',difficulty:'Erro Algébrico'});
  assert.equal(attempt.elapsedMs,1_860_000);
  const explained=core.recordSolution(submitted,challenge.id,attempt.id,explainLocally(brief,challenge));
  const reviewed=core.recordFeedback(explained,challenge.id,attempt.id,localFeedback(attempt,challenge),later);
  const snapshot=core.exportSnapshot(reviewed,catalog,later);
  const restored=core.importSnapshot(snapshot,catalog);
  assert.deepEqual(restored,reviewed);
  assert.match(challengePage({...context(restored),now:later},challenge),/Acesso liberado/);
  assert.match(challengePage({...context(restored),now:later},challenge),/Separe as regiões/);
  assert.match(historyPage(context(restored)),/Erro Algébrico/);
  assert.match(agendaPage(context(restored)),/Sessão de prática/);
});

test('KaTeX é local e todos os recursos do cache offline existem',async()=>{
  const math=katex.renderToString(String.raw`\frac{1}{2}+\mathbb{R}^{n}`,{throwOnError:true,trust:false});
  assert(math.includes('katex-mathml'));
  const assets=[];
  const listeners={};
  const sw=readFileSync(new URL('sw.js',base),'utf8');
  runInNewContext(sw,{self:{addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:()=>{}},
    caches:{open:async()=>({addAll:async urls=>assets.push(...urls)})}});
  let installed;
  listeners.install({waitUntil:promise=>{installed=promise;}});
  await installed;
  assert(assets.includes('./vendor/katex/katex.mjs'));
  assert(assets.length>=40);
  for(const item of assets) assert(existsSync(new URL(item,base)),item);
});

