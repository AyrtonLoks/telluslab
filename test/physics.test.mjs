import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ancestors, applyStudyEvent, challengeBrief, createAreaRegistry, createDomainPacks, createLearningState,
  exportSnapshot, MATH_DOMAIN, PHYS_DOMAIN, PROG_DOMAIN, readSolution, recordFeedback,
  recordSolution, submitAttempt, updateTimer
} from '../packages/learning-core/index.mjs';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { programmingSeed } from '../packages/curriculum-programming/seed.mjs';
import { economicsSeed } from '../domains/economics-finance/seed.mjs';
import { parsePhysicsSpecification, physicsSeed } from '../domains/physics/seed.mjs';
import * as profile from '../domains/physics/profile.mjs';
import { createTellusPediaBridge } from '../packages/telluspedia-bridge/index.mjs';

const math = mathematicsSeed();
const prog = programmingSeed(math);
const physics = physicsSeed(math, prog);
const economics = economicsSeed(math, prog);
const packs = createDomainPacks([
  {id:MATH_DOMAIN, catalog:math}, {id:PROG_DOMAIN, catalog:prog}, {id:economics.domainId, catalog:economics},
  {id:PHYS_DOMAIN, catalog:physics, profile}
]);
const now = '2026-11-19T20:00:00.000Z';
const later = '2026-11-19T20:00:30.000Z';
const states = Object.fromEntries([...packs.domains].map(([id, {dag}]) => [id, createLearningState(dag)]));
const dag = packs.scope(PHYS_DOMAIN, states, 'flexible', now);

function prepare(topicId) {
  let state = states[PHYS_DOMAIN];
  for (const parent of ancestors(dag, [topicId])) {
    const topic = dag.byId.get(parent);
    const apply = event => { state = applyStudyEvent(dag, state, parent, event, now); };
    apply({kind:'completeTheory', notes:'Fichamento'});
    apply({kind:'passPractice', correct:9, total:10, evidence:'Exercícios corrigidos'});
    for (const {id} of topic.subtopics) apply({kind:'completeSubtopic', subtopicId:id, evidence:'Memorial'});
    for (const {id, kind} of topic.criteria) apply({kind:'validateCriterion', criterionId:id, approved:true,
      withoutConsultation:kind === 'mandatory', evidence:'Dedução com análise dimensional e casos-limite'});
    apply({kind:'validateProof'});
  }
  return state;
}

test('DOM-PHYS gera catálogo reproduzível e resolve o DAG de 37 macrotemas e 79 arestas cruzadas', () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL('../dist/data/physics.json', import.meta.url))), physics);
  assert.equal(physics.books.length, 7);
  assert.equal(physics.tracks.length, 6);
  assert.equal(dag.order.length, 37);
  assert.equal(physics.topics.reduce((total, topic) => total + topic.subtopics.length, 0), 203);
  const ranks = new Map(packs.dag.order.map((id, index) => [id, index]));
  const counts = {[MATH_DOMAIN]:0, [PROG_DOMAIN]:0};
  for (const {id, crossPrerequisites} of physics.topics) {
    for (const parent of crossPrerequisites) {
      assert(ranks.get(parent) < ranks.get(PHYS_DOMAIN + '::' + id));
      counts[packs.references.get(parent).domainId]++;
    }
  }
  assert.deepEqual(counts, {[MATH_DOMAIN]:75, [PROG_DOMAIN]:4});
});

test('a ingestão de Física rejeita ciclos locais e referências ausentes nos dois domínios', () => {
  const read = path => readFileSync(new URL('../domains/physics/data/' + path, import.meta.url), 'utf8');
  const doc = read('especificacao.md');
  const manifest = JSON.parse(read('source-manifest.json'));
  const parse = markdown => parsePhysicsSpecification(markdown, manifest, math, prog);
  assert.throws(() => parse(doc.replace('Diretos: Nenhum', 'Diretos: 1.2')), /Ciclo/);
  assert.throws(() => parse(doc.replace('DOM-MATH:1.5', 'DOM-MATH:99.99')), /Pré-requisito cruzado inválido/);
  assert.throws(() => parse(doc.replace('DOM-PROG:7.5', 'DOM-PROG:99.99')), /Pré-requisito cruzado inválido/);
});

test('as quatro modalidades e as seis tags de Física passam pelo Hard Lock Gate e pelo revisor', () => {
  const topics = ['1.1', '1.2', '1.1', '1.5'];
  const difficulties = ['DIF-PHYS-01','DIF-PHYS-02','DIF-PHYS-03','DIF-PHYS-04','DIF-PHYS-05','DIF-PHYS-06'];
  assert.deepEqual(Object.keys(physics.difficulties), difficulties);
  for (const [index, difficulty] of difficulties.entries()) {
    const slot = index % topics.length;
    const topicId = topics[slot];
    const options = {id:'challenge', now, minutes:45, topicIds:[topicId], modality:profile.PHYSICS_MODALITIES[slot]};
    const initial = prepare(topicId);
    const brief = challengeBrief(dag, initial, options);
    const authored = profile.makeLocalChallenge(brief);
    for (const kind of ['dimensional', 'limit']) {
      assert.throws(() => profile.registerChallenge(dag, initial, options,
        {...authored, tests:authored.tests.filter(test => test.kind !== kind)}), /testes inválidos/);
    }
    let {state, challenge} = profile.registerChallenge(dag, initial, options, authored);
    const request = {id:'attempt', challengeId:options.id, draft:'Dedução e verificações', draftFormat:'latex',
      difficulty, now:later};
    assert.throws(() => profile.solutionMessages(state, options.id, request.id), /Envie uma tentativa/);
    assert.throws(() => profile.socraticMessages(state, options.id, request.id), /Envie uma tentativa/);
    assert.throws(() => submitAttempt(dag, state, request), /cronômetro/);
    state = updateTimer(state, options.id, 'start', now);
    assert.throws(() => submitAttempt(dag, state, {...request, draft:' '}), /rascunho/);
    assert.throws(() => submitAttempt(dag, state, {...request, difficulty:'DIF-ECON-01'}), /dificuldade/);
    const submitted = submitAttempt(dag, state, request);
    assert.equal(submitted.attempt.elapsedMs, 30_000);
    state = recordSolution(submitted.state, options.id, request.id, profile.explainLocally(brief, challenge));
    assert.match(readSolution(state, options.id, request.id), /critérios de verificação/);
    assert.match(profile.socraticMessages(state, options.id, request.id)[0].content, /análise dimensional.*casos-limite/);
    const feedback = profile.localFeedback(submitted.attempt, challenge);
    state = recordFeedback(state, options.id, request.id, feedback, later);
    const questions = state.feedback[request.id].questions.join(' ');
    assert.match(questions, /análise dimensional/);
    assert.match(questions, /caso-limite/);
  }
});

test('DIF-PHYS-01 e DIF-PHYS-04 agendam micro-revisões interdisciplinares exportáveis para TellusPedia', () => {
  const options = {id:'telescope', now, minutes:45, topicIds:['7.3'], modality:'Simulação Numérica'};
  const strict = packs.scope(PHYS_DOMAIN, states, 'strict', now);
  const initial = prepare('7.3');
  assert.throws(() => challengeBrief(strict, initial, options), /Macrotema indisponível/);
  const authored = profile.makeLocalChallenge(challengeBrief(dag, initial, options));
  assert(authored.requirements.some(text => text.includes('Python')));
  assert(authored.tests.some(({kind}) => kind === 'numerical'));
  const {state} = profile.registerChallenge(dag, initial, options, authored);
  const started = updateTimer(state, options.id, 'start', now);
  const bridge = createTellusPediaBridge(createAreaRegistry([{id:'physics', catalog:physics, dag}]));
  assert.deepEqual(bridge.parseLaunch('domain=physics&topic=7.3'), {areaId:'physics', topicId:'7.3'});
  for (const difficulty of ['DIF-PHYS-01', 'DIF-PHYS-04']) {
    const request = {id:'attempt', challengeId:options.id, draft:'simulação Python', draftFormat:'code',
      difficulty, now:later};
    assert.throws(() => submitAttempt(strict, started, request), /pré-requisitos cruzados/);
    const submitted = submitAttempt(dag, started, request);
    const reviews = new Set(Object.values(submitted.state.agenda).map(({topicId}) => topicId));
    for (const id of ['7.1', '7.2', 'DOM-MATH::6.5', 'DOM-PROG::2.5']) assert(reviews.has(id), id);
    const snapshot = JSON.parse(exportSnapshot(submitted.state, physics, later, dag));
    assert.equal(snapshot.domainId, PHYS_DOMAIN);
    assert.deepEqual(bridge.unwrapSnapshot(bridge.wrapSnapshot('physics', snapshot), 'physics').snapshot, snapshot);
  }
});
