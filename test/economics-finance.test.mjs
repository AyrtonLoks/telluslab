import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  advancementGuard, ancestors, applyStudyEvent, challengeBrief, createAreaRegistry, createDomainPacks,
  createLearningState, ECON_DOMAIN, exportSnapshot, MATH_DOMAIN, PROG_DOMAIN, readSolution,
  recordSolution, submitAttempt, updateTimer
} from '../packages/learning-core/index.mjs';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { programmingSeed } from '../packages/curriculum-programming/seed.mjs';
import { economicsSeed, parseEconomicsSpecification } from '../domains/economics-finance/seed.mjs';
import * as profile from '../domains/economics-finance/profile.mjs';
import { createTellusPediaBridge } from '../packages/telluspedia-bridge/index.mjs';

const math = mathematicsSeed();
const prog = programmingSeed(math);
const econ = economicsSeed(math, prog);
const packs = createDomainPacks([{id:MATH_DOMAIN,catalog:math}, {id:PROG_DOMAIN,catalog:prog},
  {id:ECON_DOMAIN,catalog:econ,profile}]);
const now = '2026-11-19T20:00:00.000Z';
const later = '2026-11-19T20:00:30.000Z';
const initialStates = () => Object.fromEntries([...packs.domains].map(([id,{dag}]) => [id,createLearningState(dag)]));

function masterAncestors(dag, state, id) {
  for (const topicId of ancestors(dag, [id])) {
    const apply = event => { state = applyStudyEvent(dag,state,topicId,event,now); };
    const {subtopics, criteria} = dag.byId.get(topicId);
    apply({kind:'completeTheory', notes:'Fichamento'});
    apply({kind:'passPractice', correct:9, total:10, evidence:'Exercícios corrigidos'});
    for (const sub of subtopics) apply({kind:'completeSubtopic', subtopicId:sub.id, evidence:'Memorial'});
    for (const c of criteria) apply({kind:'validateCriterion', criterionId:c.id, approved:true,
      withoutConsultation:c.kind === 'mandatory', evidence:'Verificação'});
    apply({kind:'validateProof'});
  }
  return state;
}

test('o seed gerado é determinístico e ordena os 32 macrotemas e as 43 arestas cruzadas', () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL('../dist/data/economics-finance.json',import.meta.url))),econ);
  const dag = packs.domains.get(ECON_DOMAIN).dag;
  assert.equal(dag.order.length,32);
  assert.equal(econ.books.length,19);
  assert.equal(econ.topics.reduce((sum,t) => sum + t.subtopics.length,0),160);
  const counts = {[MATH_DOMAIN]:0,[PROG_DOMAIN]:0};
  const ranks = new Map(packs.dag.order.map((id,index) => [id,index]));
  for (const {id,crossPrerequisites} of econ.topics) {
    const ref = ECON_DOMAIN+'::'+id;
    for (const parent of crossPrerequisites) {
      assert(ranks.get(parent) < ranks.get(ref));
      counts[packs.references.get(parent).domainId]++;
    }
  }
  assert.deepEqual(counts,{[MATH_DOMAIN]:41,[PROG_DOMAIN]:2});
});

test('a ingestão rejeita ciclo local e referência cruzada de Programação inexistente', () => {
  const read = file => readFileSync(new URL('../domains/economics-finance/data/'+file,import.meta.url),'utf8');
  const doc = read('especificacao.md');
  const manifest = JSON.parse(read('source-manifest.json'));
  assert.throws(() => parseEconomicsSpecification(doc.replace('Diretos: Nenhum','Diretos: 1.2'),manifest,math,prog),/Ciclo/);
  assert.throws(() => parseEconomicsSpecification(doc.replace('DOM-PROG:8.8','DOM-PROG:99.99'),manifest,math,prog),
    /Pré-requisito cruzado inválido.*DOM-ECON::8\.3/);
});

test('as quatro modalidades exigem testes, tentativa cronometrada e uma das seis tags de Economia', () => {
  const states = initialStates();
  const dag = packs.scope(ECON_DOMAIN,states,'flexible',now);
  const available = ['1.1','2.1','1.2','1.4'];
  const difficulties = Object.keys(profile.ECONOMICS_DIFFICULTIES);
  assert.equal(difficulties.length,6);
  for (const [index, difficulty] of difficulties.entries()) {
    const m = index % available.length;
    const topicId = available[m];
    const input = {id:'challenge', now, minutes:45, topicIds:[topicId], modality:profile.ECONOMICS_MODALITIES[m]};
    const original = masterAncestors(dag, states[ECON_DOMAIN], topicId);
    const authored = profile.makeLocalChallenge(challengeBrief(dag,original,input));
    assert.throws(() => profile.registerChallenge(dag,original,input,{...authored,tests:[]}),/testes inválidos/);
    let {state} = profile.registerChallenge(dag,original,input,authored);
    assert.throws(() => readSolution(state,input.id,'attempt'),/Envie uma tentativa/);
    const attempt = {id:'attempt',challengeId:input.id,draft:'Memorial de cálculo e evidências',draftFormat:'latex',
      difficulty,now:later};
    assert.throws(() => submitAttempt(dag,state,attempt),/cronômetro/);
    state = updateTimer(state,input.id,'start',now);
    assert.throws(() => submitAttempt(dag,state,{...attempt,difficulty:'DIF-PROG-01'}),/dificuldade/);
    ({state} = submitAttempt(dag,state,attempt));
    state = recordSolution(state,input.id,attempt.id,profile.explainLocally(challengeBrief(dag,original,input),state.challenges[input.id]));
    assert.match(readSolution(state,input.id,attempt.id),/Confira as premissas/);
  }
});

test('DIF-ECON-01 agenda revisões locais, de Matemática e de Programação e circula pela ponte', () => {
  const states = initialStates();
  const dag = packs.scope(ECON_DOMAIN,states,'flexible',now);
  const strict = packs.scope(ECON_DOMAIN,states,'strict',now);
  const input = {id:'challenge',now,minutes:45,topicIds:['8.3'],modality:'Modelagem e Simulação'};
  const original = masterAncestors(dag,states[ECON_DOMAIN],'8.3');
  assert.deepEqual(advancementGuard(strict,original.progress,'8.3').crossPending,
    ['DOM-MATH::7.7','DOM-MATH::7.11','DOM-PROG::8.8']);
  assert.throws(() => challengeBrief(strict,original,input),/Macrotema indisponível/);
  let {state} = profile.registerChallenge(dag,original,input,profile.makeLocalChallenge(challengeBrief(dag,original,input)));
  state = updateTimer(state,input.id,'start',now);
  const attempt = {id:'attempt',challengeId:input.id,draft:'modelo em Python',draftFormat:'code',difficulty:'DIF-ECON-01',now:later};
  assert.throws(() => submitAttempt(strict,state,attempt),/pré-requisitos cruzados/);
  ({state} = submitAttempt(dag,state,attempt));
  const reviews = Object.values(state.agenda).map(item => item.topicId);
  for (const id of ['8.2','DOM-MATH::7.7','DOM-PROG::8.8']) assert(reviews.includes(id),id);
  const snapshot = JSON.parse(exportSnapshot(state,econ,later,dag));
  const bridge = createTellusPediaBridge(createAreaRegistry([{id:econ.slug,catalog:econ,dag}]));
  assert.deepEqual(bridge.parseLaunch('domain=economics-finance&topic=8.3'),{areaId:econ.slug,topicId:'8.3'});
  const envelope = bridge.wrapSnapshot(econ.slug,snapshot);
  assert.deepEqual(bridge.unwrapSnapshot(envelope,econ.slug).snapshot,snapshot);
});
