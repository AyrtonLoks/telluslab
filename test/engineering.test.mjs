import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ancestors, applyStudyEvent, challengeBrief, createAreaRegistry, createDomainPacks, createLearningState,
  ENG_DOMAIN, MATH_DOMAIN, PHYS_DOMAIN, PROG_DOMAIN, exportSnapshot, importSnapshot,
  readSolution, recordSolution, submitAttempt, updateTimer
} from '../packages/learning-core/index.mjs';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { programmingSeed } from '../packages/curriculum-programming/seed.mjs';
import { physicsSeed } from '../domains/physics/seed.mjs';
import { engineeringSeed, parseEngineeringSpecification } from '../domains/engineering/seed.mjs';
import * as profile from '../domains/engineering/profile.mjs';
import { createTellusPediaBridge } from '../packages/telluspedia-bridge/index.mjs';

const math = mathematicsSeed();
const programming = programmingSeed(math);
const physics = physicsSeed(math, programming);
const engineering = engineeringSeed(math, physics, programming);
const packs = createDomainPacks([
  {id:MATH_DOMAIN, catalog:math}, {id:PROG_DOMAIN, catalog:programming},
  {id:PHYS_DOMAIN, catalog:physics}, {id:ENG_DOMAIN, catalog:engineering, profile}
]);
const now = '2026-11-19T20:00:00.000Z';
const later = '2026-11-19T20:00:30.000Z';
const states = Object.fromEntries([...packs.domains].map(([id, {dag}]) => [id, createLearningState(dag)]));
const dag = packs.scope(ENG_DOMAIN, states, 'flexible', now);
const strict = packs.scope(ENG_DOMAIN, states, 'strict', now);

function prepare(topicId) {
  let state = states[ENG_DOMAIN];
  for (const parent of ancestors(dag, [topicId])) {
    const apply = event => { state = applyStudyEvent(dag, state, parent, event, now); };
    const topic = dag.byId.get(parent);
    apply({kind:'completeTheory', notes:'Fichamento'});
    apply({kind:'passPractice', correct:9, total:10, evidence:'Memoriais corrigidos'});
    for (const {id} of topic.subtopics) apply({kind:'completeSubtopic', subtopicId:id, evidence:'Memorial'});
    for (const {id, kind} of topic.criteria) apply({kind:'validateCriterion', criterionId:id,
      approved:true, withoutConsultation:kind === 'mandatory', evidence:'Verificação de engenharia'});
    apply({kind:'validateProof'});
  }
  return state;
}

test('DOM-ENG gera um catálogo reproduzível com as 65 arestas cruzadas resolvidas', () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL('../dist/data/engineering.json', import.meta.url))), engineering);
  assert.equal(engineering.books.length, 5);
  assert.equal(engineering.tracks.length, 5);
  assert.equal(dag.order.length, 28);
  assert.equal(engineering.topics.flatMap(topic => topic.subtopics).length, 143);
  assert.deepEqual(dag.byId.get('1.1').modalities, ['Dimensionamento e Projeto', 'Normas, Metrologia e Falhas']);
  assert.deepEqual(engineering.sanitizations.map(({topicId}) => topicId), ['1.1']);
  const counts = {[MATH_DOMAIN]:0, [PHYS_DOMAIN]:0, [PROG_DOMAIN]:0};
  for (const {crossPrerequisites} of engineering.topics) {
    for (const ref of crossPrerequisites) counts[packs.references.get(ref).domainId]++;
  }
  assert.deepEqual(counts, {[MATH_DOMAIN]:14, [PHYS_DOMAIN]:48, [PROG_DOMAIN]:3});
});

test('o parser de Engenharia rejeita ciclos locais e referências ausentes nos três domínios', () => {
  const read = path => readFileSync(new URL('../domains/engineering/data/' + path, import.meta.url), 'utf8');
  const doc = read('especificacao.md');
  const manifest = JSON.parse(read('source-manifest.json'));
  const parse = markdown => parseEngineeringSpecification(markdown, manifest, math, physics, programming);
  assert.throws(() => parse(doc.replace('Diretos: Nenhum', 'Diretos: 1.2')), /Ciclo/);
  for (const ref of ['DOM-MATH:7.1', 'DOM-PHYS:1.1', 'DOM-PROG:6.4']) {
    assert.throws(() => parse(doc.replace(ref, ref.split(':')[0] + ':99.99')), /Pré-requisito cruzado inválido/);
  }
});

test('as modalidades e tags de Engenharia passam pela trava de tentativa e pelo revisor', () => {
  const topics = ['1.1', '1.2', '2.1', '1.1'];
  const tags = Array.from({length:6}, (_, index) => 'DIF-ENG-0' + (index + 1));
  assert.deepEqual(Object.keys(engineering.difficulties), tags);
  for (const [index, difficulty] of tags.entries()) {
    const slot = index % topics.length;
    const topicId = topics[slot];
    const options = {id:'challenge', now, minutes:45, topicIds:[topicId], modality:profile.ENGINEERING_MODALITIES[slot]};
    const initial = prepare(topicId);
    const brief = challengeBrief(dag, initial, options);
    const authored = profile.makeLocalChallenge(brief);
    for (const {kind} of authored.tests) {
      assert.throws(() => profile.registerChallenge(dag, initial, options,
        {...authored, tests:authored.tests.filter(test => test.kind !== kind)}), /testes inválidos/);
    }
    if (slot === 2) {
      assert(authored.requirements.some(requirement => requirement.includes('Python')));
      assert(authored.tests.some(({kind}) => kind === 'numerical'));
    }
    const {state, challenge} = profile.registerChallenge(dag, initial, options, authored);
    const request = {id:'attempt', challengeId:challenge.id, draft:'Memorial de cálculo', draftFormat:'latex',
      difficulty, now:later};
    assert.throws(() => profile.solutionMessages(state, challenge.id, request.id), /Envie uma tentativa/);
    assert.throws(() => profile.socraticMessages(state, challenge.id, request.id), /Envie uma tentativa/);
    assert.throws(() => submitAttempt(dag, state, request), /cronômetro/);
    const started = updateTimer(state, challenge.id, 'start', now);
    assert.throws(() => submitAttempt(dag, started, {...request, draft:' '}), /rascunho/);
    assert.throws(() => submitAttempt(dag, started, {...request, difficulty:'DIF-PHYS-01'}), /dificuldade/);
    const submitted = submitAttempt(dag, started, request);
    assert.equal(submitted.attempt.elapsedMs, 30_000);
    const unlocked = recordSolution(submitted.state, challenge.id, request.id, profile.explainLocally(brief, challenge));
    assert.match(readSolution(unlocked, challenge.id, request.id), /memorial/);
    const local = profile.localFeedback(submitted.attempt, challenge).questions.join(' ');
    const prompt = profile.socraticMessages(unlocked, challenge.id, request.id)[0].content;
    for (const text of [local, prompt]) assert.match(text, /SI\/Imperial.*fator de segurança.*fabricação/);
  }
});

test('DIF-ENG-01 agenda revisões locais e nos três domínios e preserva as referências no snapshot', () => {
  const options = {id:'mirror', now, minutes:45, topicIds:['6.3'], modality:'Simulação e Cálculo Numérico'};
  const initial = prepare('6.3');
  assert.throws(() => challengeBrief(strict, initial, options), /Macrotema indisponível/);
  const authored = profile.makeLocalChallenge(challengeBrief(dag, initial, options));
  const {state} = profile.registerChallenge(dag, initial, options, authored);
  const started = updateTimer(state, options.id, 'start', now);
  const request = {id:'attempt', challengeId:options.id, draft:'simulação Python', draftFormat:'code',
    difficulty:'DIF-ENG-01', now:later};
  assert.throws(() => submitAttempt(strict, started, request), /pré-requisitos cruzados/);
  const submitted = submitAttempt(dag, started, request);
  const reviews = new Set(Object.values(submitted.state.agenda).map(({topicId}) => topicId));
  for (const id of ['6.1', '6.2', 'DOM-MATH::6.5', 'DOM-PHYS::6.4', 'DOM-PROG::2.5']) assert(reviews.has(id), id);
  const bridge = createTellusPediaBridge(createAreaRegistry([{id:'engineering', catalog:engineering, dag}]));
  assert.deepEqual(bridge.parseLaunch('domain=engineering&topic=7.4'), {areaId:'engineering', topicId:'7.4'});
  const json = exportSnapshot(submitted.state, engineering, later, dag);
  const envelope = bridge.wrapSnapshot('engineering', JSON.parse(json));
  assert.equal(envelope.snapshot.domainId, ENG_DOMAIN);
  const {snapshot} = bridge.unwrapSnapshot(envelope, 'engineering');
  assert.deepEqual(snapshot, JSON.parse(json));
  assert.deepEqual(importSnapshot(JSON.stringify(snapshot), engineering, dag).agenda, submitted.state.agenda);
});
