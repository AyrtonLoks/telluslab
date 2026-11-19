import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  applyStudyEvent, advancementGuard, challengeBrief, createAreaRegistry, createDomainPacks, createLearningState,
  exportSnapshot, importSnapshot, MATH_DOMAIN, pendingPath, planSession, PROG_DOMAIN, submitAttempt, updateTimer
} from '../packages/learning-core/index.mjs';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { parseProgrammingSpecification, programmingSeed } from '../packages/curriculum-programming/seed.mjs';
import * as profile from '../packages/curriculum-programming/profile.mjs';
import { createTellusPediaBridge } from '../packages/telluspedia-bridge/index.mjs';

const math = mathematicsSeed();
const prog = programmingSeed(math);
const definitions = [{id:MATH_DOMAIN,catalog:math}, {id:PROG_DOMAIN,catalog:prog,profile}];
const packs = createDomainPacks(definitions);
const now = '2026-11-19T20:00:00.000Z';
const later = '2026-11-19T20:00:30.000Z';
const scope = (states, mode = 'flexible') => packs.scope(PROG_DOMAIN, states, mode, now);
const initialStates = () => Object.fromEntries([...packs.domains].map(([id,{dag}])=>[id,createLearningState(dag)]));
const options = {id:'challenge',now,minutes:45,topicIds:['1.1'],modality:'Implementação Algorítmica'};

test('DOM-PROG é reproduzível e o grafo ordena as 50 arestas cruzadas com IDs qualificados', () => {
  assert.deepEqual(programmingSeed(math), prog);
  assert.equal(prog.books.length, 41);
  assert.equal(prog.topics.length, 49);
  assert.equal(packs.dag.order.length, 137);
  assert.equal(prog.topics.flatMap(topic=>topic.crossPrerequisites).length, 50);
  const ranks = new Map(packs.dag.order.map((id,index)=>[id,index]));
  for (const [id, topic] of packs.dag.byId) {
    assert(topic.prerequisites.every(parent=>ranks.get(parent)<ranks.get(id)));
    assert(topic.criteria.every(item=>item.id.startsWith(topic.domainId+'::')));
  }
  assert.notEqual(packs.references.get('DOM-MATH::1.1').title,packs.references.get('DOM-PROG::1.1').title);
  assert.equal(prog.books[2].title,'Python Fluente (1ª Edição — Referência Secundária)');
});

test('o parser recusa ciclos locais, referências ausentes e ciclos interdisciplinares', () => {
  const source = file=>readFileSync(new URL('../packages/curriculum-programming/data/'+file,import.meta.url),'utf8');
  const doc = source('especificacao.md');
  const manifest = JSON.parse(source('source-manifest.json'));
  assert.throws(()=>parseProgrammingSpecification(doc.replace('Diretos: Nenhum','Diretos: 1.2'),manifest,math),/Ciclo.*1\.1/);
  assert.throws(()=>parseProgrammingSpecification(doc.replace('DOM-MATH:1.1','DOM-MATH:99.99'),manifest,math),
    /Pré-requisito cruzado inválido/);
  const reverse = {...math, topics:math.topics.map(topic=>topic.id==='1.1'
    ? {...topic,crossPrerequisites:['DOM-PROG::1.1']} : topic)};
  assert.throws(()=>createDomainPacks([{id:MATH_DOMAIN,catalog:reverse},definitions[1]]),/Ciclo.*DOM-MATH.*DOM-PROG/);
});

test('o modo estrito consulta Matemática para avanço, sessão e desafio', () => {
  const states = initialStates();
  const state = states[PROG_DOMAIN];
  const event = {kind:'completeTheory',notes:'Invariantes e escopo'};
  const flexible = scope(states);
  const strict = scope(states,'strict');
  assert.deepEqual(advancementGuard(flexible,state.progress,'1.1').crossPending,['DOM-MATH::1.1','DOM-MATH::2.2']);
  assert.equal(applyStudyEvent(flexible,state,'1.1',event,now).progress['1.1'].state,'S2');
  assert.throws(()=>applyStudyEvent(strict,state,'1.1',event,now),/DOM-MATH::1\.1/);
  assert.throws(()=>planSession(strict,state,{...options,preferredTopicId:'1.1'}),/preferido indisponível/);
  assert.throws(()=>challengeBrief(strict,state,options),/Macrotema indisponível/);
  assert(pendingPath(prog,strict,state.progress,{kind:'topic',id:'1.2'}).crossOrder.includes('DOM-MATH::1.1'));
  const other = states[MATH_DOMAIN];
  other.progress['1.1'].state = 'S4';
  other.progress['2.2'].state = 'S4';
  assert.equal(advancementGuard(scope(states,'strict'),state.progress,'1.1').allowed,true);
  other.cards.overdue = {topicId:'1.1',dueAt:now,repetitions:0};
  assert.deepEqual(advancementGuard(scope(states,'strict'),state.progress,'1.1').crossPending,['DOM-MATH::1.1']);
});

test('DIF-PROG-01 agenda micro-revisões cruzadas e passa pelo snapshot e pela ponte', () => {
  const states = initialStates();
  const dag = scope(states);
  let state = states[PROG_DOMAIN];
  const authored = profile.makeLocalChallenge(challengeBrief(dag,state,options));
  ({state} = profile.registerChallenge(dag,state,options,authored));
  state = updateTimer(state,'challenge','start',now);
  ({state} = submitAttempt(dag,state,{id:'attempt',challengeId:'challenge',draft:'int main() { return 0; }',
    draftFormat:'code',difficulty:'DIF-PROG-01',now:later}));
  assert(Object.values(state.agenda).some(item=>item.topicId==='DOM-MATH::1.1'&&item.triggerTopicId==='1.1'));
  const json = exportSnapshot(state,prog,later,dag);
  assert.deepEqual(importSnapshot(json,prog,dag),state);
  assert.throws(()=>importSnapshot(json,math),/catálogo/);
  const tampered = JSON.parse(json);
  Object.values(tampered.state.agenda)[0].topicId = 'DOM-MATH::9.11';
  assert.throws(()=>importSnapshot(JSON.stringify(tampered),prog,dag),/agenda/);
  const bridge = createTellusPediaBridge(createAreaRegistry([{id:'programming',catalog:prog,dag}]));
  const snapshot = JSON.parse(json);
  assert.deepEqual(bridge.parseLaunch('domain=programming&topic=1.1'),{areaId:'programming',topicId:'1.1'});
  assert.deepEqual(bridge.unwrapSnapshot(bridge.wrapSnapshot('programming',snapshot)).snapshot,snapshot);
});
