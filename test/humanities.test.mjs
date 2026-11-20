import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  applyStudyEvent, challengeBrief, createAreaRegistry, createDomainPacks, createLearningState,
  ECON_DOMAIN, HUM_DOMAIN, MATH_DOMAIN, PROG_DOMAIN, PHYS_DOMAIN, exportSnapshot, importSnapshot,
  readSolution, recordSolution, submitAttempt, updateTimer
} from '../packages/learning-core/index.mjs';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { programmingSeed } from '../packages/curriculum-programming/seed.mjs';
import { economicsSeed } from '../domains/economics-finance/seed.mjs';
import { physicsSeed } from '../domains/physics/seed.mjs';
import { humanitiesSeed, parseHumanitiesSpecification } from '../domains/humanities/seed.mjs';
import * as profile from '../domains/humanities/profile.mjs';
import { createTellusPediaBridge } from '../packages/telluspedia-bridge/index.mjs';

const math = mathematicsSeed();
const programming = programmingSeed(math);
const economics = economicsSeed(math, programming);
const physics = physicsSeed(math, programming);
const humanities = humanitiesSeed(math, economics, programming, physics);
const packs = createDomainPacks([
  {id:MATH_DOMAIN, catalog:math}, {id:PROG_DOMAIN, catalog:programming},
  {id:ECON_DOMAIN, catalog:economics}, {id:PHYS_DOMAIN, catalog:physics},
  {id:HUM_DOMAIN, catalog:humanities, profile}
]);
const now = '2026-11-19T20:00:00.000Z';
const later = '2026-11-19T20:01:00.000Z';
const initial = createLearningState(packs.domains.get(HUM_DOMAIN).dag);
const dag = packs.scope(HUM_DOMAIN, {}, 'flexible', now);
const strict = packs.scope(HUM_DOMAIN, {}, 'strict', now);

test('DOM-HUM reproduz a fonte e resolve 18 arestas cruzadas em quatro domínios', () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL('../dist/data/humanities.json', import.meta.url))), humanities);
  assert.equal(humanities.books.length, 53);
  assert.equal(dag.order.length, 36);
  assert.deepEqual(humanities.sanitizations.map(({topicId}) => topicId), ['1.1', '5.1']);
  const cross = humanities.topics.flatMap(topic => topic.crossPrerequisites);
  assert.equal(cross.length, 18);
  assert.deepEqual(new Set(cross.map(ref => packs.references.get(ref).domainId)),
    new Set([MATH_DOMAIN, PROG_DOMAIN, ECON_DOMAIN, PHYS_DOMAIN]));

  const read = path => readFileSync(new URL('../domains/humanities/data/' + path, import.meta.url), 'utf8');
  const doc = read('especificacao.md');
  const manifest = JSON.parse(read('source-manifest.json'));
  const parse = source => parseHumanitiesSpecification(source, manifest, math, economics, programming, physics);
  assert.throws(() => parse(doc.replace('Diretos: Nenhum', 'Diretos: 1.2')), /Ciclo/);
  for (const ref of ['DOM-MATH:7.2', 'DOM-ECON:6.3', 'DOM-PROG:8.7', 'DOM-PHYS:1.1']) {
    assert.throws(() => parse(doc.replace(ref, ref.split(':')[0] + ':99.99')), /Pré-requisito cruzado inválido/);
  }
});

function master(state, topicId) {
  const apply = event => { state = applyStudyEvent(dag, state, topicId, event, now); };
  const topic = dag.byId.get(topicId);
  apply({kind:'completeTheory', notes:'Fichamento'});
  apply({kind:'passPractice', correct:8, total:10, evidence:'Questões corrigidas'});
  for (const {id} of topic.subtopics) apply({kind:'completeSubtopic', subtopicId:id, evidence:'Fichamento'});
  for (const {id, kind} of topic.criteria) apply({kind:'validateCriterion', criterionId:id, approved:true,
    withoutConsultation:kind === 'mandatory', evidence:'Tese, passagem e objeção'});
  apply({kind:'validateProof'});
  return state;
}

test('as quatro modalidades e seis tags passam pela trava e pela rubrica de Humanidades', () => {
  const baseline = ['1.1', '1.4'].reduce(master, initial);
  const tags = Array.from({length:6}, (_, index) => 'DIF-HUM-0' + (index + 1));
  assert.deepEqual(Object.keys(humanities.difficulties), tags);
  for (const [index, difficulty] of tags.entries()) {
    const slot = index % 4;
    const topicId = ['1.1', '1.3', '1.5', '1.1'][slot];
    const options = {id:'challenge', now, minutes:45, topicIds:[topicId], modality:profile.HUMANITIES_MODALITIES[slot]};
    const brief = challengeBrief(dag, baseline, options);
    const authored = profile.makeLocalChallenge(brief);
    assert.deepEqual(authored.tests.map(({kind}) => kind), ['textualFidelity', 'historicalContext', 'steelmanning',
      ['reconstruction', 'comparison', 'argument', 'application'][slot]]);
    assert.throws(() => profile.registerChallenge(dag, baseline, options,
      {...authored, tests:authored.tests.filter(({kind}) => kind !== 'steelmanning')}), /testes inválidos/);
    const {state, challenge} = profile.registerChallenge(dag, baseline, options, authored);
    const request = {id:'attempt', challengeId:challenge.id, draft:'Passagem, contexto, objeção e réplica.',
      draftFormat:'latex', difficulty, now:later};
    assert.throws(() => profile.solutionMessages(state, challenge.id, request.id, humanities), /Envie uma tentativa/);
    assert.throws(() => profile.socraticMessages(state, challenge.id, request.id, humanities), /Envie uma tentativa/);
    assert.throws(() => submitAttempt(dag, state, request), /cronômetro/);
    const timed = updateTimer(state, challenge.id, 'start', now);
    assert.throws(() => submitAttempt(dag, timed, {...request, difficulty:'DIF-PHYS-01'}), /dificuldade/);
    const submitted = submitAttempt(dag, timed, request);
    const unlocked = recordSolution(submitted.state, challenge.id, request.id, profile.explainLocally(brief, challenge));
    assert.match(readSolution(unlocked, challenge.id, request.id), /Critérios de revisão/);
    const [instruction, context] = profile.socraticMessages(unlocked, challenge.id, request.id, humanities);
    assert.match(instruction.content, /fonte primária.*anacronismo.*objeção mais forte/);
    assert(JSON.parse(context.content).curriculum[0].bibliography[0].title);
    const {questions} = profile.localFeedback(submitted.attempt, challenge);
    const checks = authored.tests.map(({kind}, i) =>
      ({category:kind, excerpt:['Passagem', 'contexto', 'objeção', 'réplica'][i], observation:'Evidência examinada'}));
    const feedback = {assessment:'coherent', questions, checks};
    assert.doesNotThrow(() => profile.validateFeedback(submitted.attempt, challenge, feedback));
    assert.throws(() => profile.validateFeedback(submitted.attempt, challenge, {...feedback,
      checks:checks.map(check => ({...check, excerpt:'Excerto inventado'}))}), /evidências do rascunho/);
  }
});

test('DIF-HUM-01 diagnostica pré-requisitos locais e cruzados e circula por TellusPedia', () => {
  const baseline = master(initial, '1.1');
  const options = {id:'challenge', now, minutes:45, topicIds:['1.3'], modality:profile.HUMANITIES_MODALITIES[1]};
  assert.throws(() => challengeBrief(strict, baseline, options), /Macrotema indisponível/);
  const {state} = profile.registerChallenge(dag, baseline, options, profile.makeLocalChallenge(challengeBrief(dag, baseline, options)));
  const timed = updateTimer(state, options.id, 'start', now);
  const request = {id:'attempt', challengeId:options.id, draft:'Análise comparativa', draftFormat:'latex',
    difficulty:'DIF-HUM-01', now:later};
  assert.throws(() => submitAttempt(strict, timed, request), /pré-requisitos cruzados/);
  const result = submitAttempt(dag, timed, request);
  const reviews = new Set(Object.values(result.state.agenda).map(({topicId}) => topicId));
  for (const id of ['1.1', 'DOM-MATH::7.2', 'DOM-ECON::6.3']) assert(reviews.has(id), id);

  const bridge = createTellusPediaBridge(createAreaRegistry([{id:'humanities', catalog:humanities, dag}]));
  assert.deepEqual(bridge.parseLaunch('domain=humanities&topic=7.2'), {areaId:'humanities', topicId:'7.2'});
  const snapshot = JSON.parse(exportSnapshot(result.state, humanities, later, dag));
  const envelope = bridge.wrapSnapshot('humanities', snapshot);
  assert.equal(envelope.snapshot.domainId, HUM_DOMAIN);
  const unwrapped = bridge.unwrapSnapshot(envelope, 'humanities').snapshot;
  assert.deepEqual(importSnapshot(JSON.stringify(unwrapped), humanities, dag).agenda, result.state.agenda);
});
