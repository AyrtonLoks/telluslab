import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as core from '../packages/learning-core/index.mjs';
import * as profile from '../packages/curriculum-mathematics/challenge-profile.mjs';
import { parseSpecification } from '../packages/curriculum-mathematics/parse.mjs';
const api = {...core,...profile,parseSpecification};

const read = file => readFileSync(new URL('../packages/curriculum-mathematics/data/' + file, import.meta.url), 'utf8');
const markdown = read('especificacao.md');
const manifest = JSON.parse(read('source-manifest.json'));
const seed = JSON.parse(readFileSync(new URL('../dist/data/catalogo.json',import.meta.url),'utf8'));
const dag = api.createDag(seed.topics);
const at = (minutes = 0) => new Date(Date.UTC(2026, 10, 19) + minutes * 60_000).toISOString();
const defaultState = () => api.createLearningState(dag);

function master(state, id, now = at()) {
  const topic = dag.byId.get(id);
  const apply = command => { state = api.applyStudyEvent(dag, state, id, command, now); };
  apply({kind: 'completeTheory', notes: 'Fichamento de definições e exemplos'});
  apply({kind: 'passPractice', correct: 8, total: 10, evidence: 'Exercícios corrigidos'});
  topic.subtopics.forEach(sub => apply({kind: 'completeSubtopic', subtopicId: sub.id, evidence: 'Notas verificadas'}));
  topic.criteria.forEach(criterion => apply({kind: 'validateCriterion', criterionId: criterion.id,
    approved: true, withoutConsultation: true, evidence: 'Resolução avaliada'}));
  apply({kind: 'validateProof'});
  return state;
}

test('seed integral, correção auditável e todas as arestas na ordem topológica', () => {
  const result = api.parseSpecification(markdown, manifest);
  assert.equal(result.books.length, 40);
  assert.equal(result.tracks.length, 5);
  assert.equal(result.requirements.length, 10);
  assert.deepEqual(result.topics, seed.topics);
  assert.equal(result.topics.length, 88);
  assert.equal(result.topics.flatMap(t => t.subtopics).length, 538);
  assert.equal(result.topics.flatMap(t => t.criteria).length, 176);
  assert.equal(result.topics.flatMap(t => t.bibliography).length, 160);
  assert.equal(result.topics.flatMap(t => t.prerequisites).length, 201);
  assert.deepEqual(dag.byId.get('9.11').prerequisites, ['3.9','5.9','9.9','9.10']);
  assert.equal(result.sanitizations.length, 1);
  for (const topic of result.topics) {
    for (const parent of topic.prerequisites) assert(dag.order.indexOf(parent) < dag.order.indexOf(topic.id));
  }
  const truncated = markdown.slice(0, markdown.lastIndexOf('### Macrotema 9.13'));
  assert.throws(() => api.parseSpecification(truncated, manifest), /Macrotemas/);
  assert.throws(() => api.createDag([{id:'1.1', prerequisites:['1.2']}, {id:'1.2', prerequisites:['1.1']}]), /Ciclo/);
  assert.throws(() => api.createDag([{id:'1.1', prerequisites:['1.2']}]), /nó ausente/);
});

test('caminho mínimo por tema e por obra, com dependências externas à trilha', () => {
  const state = master(defaultState(), '1.1');
  const result = api.pendingPath(seed, dag, state.progress, {kind:'topic', id:'9.11'});
  const expected = new Set([...api.ancestors(dag, ['9.11']).filter(t => t !== '1.1'), '9.11']);
  assert.deepEqual(new Set(result.order), expected);
  assert(!result.edges.some(e => e.from === '1.1'));
  const book = api.pendingPath(seed, dag, state.progress, {kind:'book', id:'BIB-40'});
  assert.deepEqual(book.targets, seed.topics.filter(t=>t.bibliography.some(b=>b.bookId === 'BIB-40')).map(t=>t.id));
  assert(api.trackView(dag, 'TRL-01').nodes.some(t => t.external));
});

test('S1–S4 exigem evidências, S4 libera filhos, S6 bloqueia avanço e revisão restaura S5', () => {
  let state = defaultState();
  assert.equal(state.progress['1.1'].state, 'S1');
  assert.equal(state.progress['1.2'].state, 'S0');
  assert.throws(() => api.applyStudyEvent(dag, state, '1.2', {kind:'completeTheory', notes:'x'}, at()), /bloqueado/);
  const theory = api.applyStudyEvent(dag, state, '1.1', {kind:'completeTheory', notes:'Fichamento'}, at());
  assert.throws(() => api.applyStudyEvent(dag, theory, '1.1',
    {kind:'passPractice', correct:79,total:100,evidence:'x'}, at()), /80%/);
  const practice = api.applyStudyEvent(dag, theory, '1.1',
    {kind:'passPractice', correct:80,total:100,evidence:'x'}, at());
  assert.throws(() => api.applyStudyEvent(dag, practice, '1.1', {kind:'validateProof'}, at()), /todos os subtemas/);
  const mandatory = dag.byId.get('1.1').criteria.find(c=>c.kind==='mandatory');
  assert.throws(() => api.applyStudyEvent(dag, practice, '1.1',
    {kind:'validateCriterion', criterionId:mandatory.id, approved:true, withoutConsultation:false,evidence:'x'}, at()), /DoD/);
  state = master(state, '1.1');
  assert.equal(state.progress['1.1'].state, 'S4');
  assert.equal(state.progress['1.2'].state, 'S1');
  const cards = Object.keys(state.cards);
  assert.equal(cards.length, (dag.byId.get('1.1').subtopics.length + 1) * 3);
  state = api.refreshLearning(dag, state, at(1440));
  assert.equal(state.progress['1.1'].state, 'S6');
  assert.deepEqual(api.advancementGuard(dag, state.progress, '1.2').overdue, ['1.1']);
  for (const cardId of cards) state = api.reviewCard(dag, state, cardId, 3, at(1441));
  assert.equal(state.progress['1.1'].state, 'S5');
  assert(api.advancementGuard(dag,state.progress,'1.2').allowed);
});

test('FSRS-5 confirma retenção, atualização no mesmo dia e lapso', () => {
  const card = Object.values(master(defaultState(), '1.1').cards)[0];
  assert.equal(api.retrievability(3, 3), 0.9);
  const first = api.rateCard(card, 3, at(1440));
  assert.equal(first.stability, 3.173);
  assert.equal(first.dueAt, at(1440 + 3 * 1440));
  const sameDay = api.rateCard(first, 3, at(1441));
  assert(first.stability < sameDay.stability);
  const forgotten = api.rateCard(first, 1, at(5760));
  assert(forgotten.stability < first.stability);
  assert.equal(forgotten.lapses, 1);
  assert.equal(forgotten.dueAt, at(5770));
  assert.throws(() => api.rateCard(first, 3, at(10)), /inválido/);
});

test('50/30/20 para qualquer duração suportada, com duas trilhas e falta de cartões visível', () => {
  const toy = api.createDag([
    {id:'1.1', prerequisites:[], trackId:'TRL-00', subtopics:[], criteria:[{id:'a',kind:'mandatory',description:'A'}]},
    {id:'2.1', prerequisites:[], trackId:'TRL-01', subtopics:[], criteria:[{id:'b',kind:'mandatory',description:'B'}]},
    {id:'3.1', prerequisites:[], trackId:'TRL-02', subtopics:[], criteria:[]}
  ]);
  let state = api.createLearningState(toy);
  const empty = api.planSession(toy, state, {id:'empty',now:at(),minutes:45}).session;
  assert.deepEqual(empty.blocks.map(b=>b.seconds), [1350,810,540]);
  assert(empty.open.some(o => o.reason === 'noDueCards'));
  for (const [topicId, criterionId] of [['1.1','a'],['2.1','b']]) {
    const events = [{kind:'completeTheory',notes:'Teoria'}, {kind:'passPractice',correct:8,total:10,evidence:'Prática'},
      {kind:'validateCriterion',criterionId,approved:true,withoutConsultation:true,evidence:'Prova'}, {kind:'validateProof'}];
    for (const e of events) state = api.applyStudyEvent(toy,state,topicId,e,at());
  }
  const session = api.planSession(toy, state, {id:'planned',now:at(1440),minutes:75}).session;
  assert.deepEqual(session.blocks.map(b => b.seconds), [2250,1350,900]);
  assert.deepEqual(session.blocks[1].slots.map(s=>s.trackId), ['TRL-00','TRL-01']);
  assert.equal(session.blocks[1].slots.reduce((n,s)=>n+s.seconds,0), 1350);
  assert.throws(() => api.planSession(toy, state, {id:'long',now:at(),minutes:76}), /45 a 75/);
});

test('desafio e revisor obedecem currículo, timer, trava e snapshot integral', () => {
  let state = master(defaultState(), '1.1');
  const options = {id:'composicao', now:at(), minutes:60, topicIds:['1.2'], modality:'Cálculo/Algébrico'};
  const authored = {title:'Domínio de uma composta', statement:'Componha $f(x)=1/x$ com $g(x)=x-2$.',
    requirements:['Determine o domínio e a expressão.'], hypotheses:['As funções são reais.'],
    assumedTopicIds:['1.1'], examples:[{input:'$x=3$',expected:'$1$'}],
    tests:[{kind:'limit',scenario:'$x=2$',expected:'Fora do domínio.'}]};
  assert.throws(() => api.registerChallenge(dag,state,options,{...authored,assumedTopicIds:['1.2']}), /inválidos/);
  assert.equal(JSON.parse(api.generationMessages(dag,state,options)[1].content).allowedTopicIds[0], '1.1');
  state = api.registerChallenge(dag,state,options,authored).state;
  assert.throws(() => api.solutionMessages(state,options.id,'a'), /Envie/);
  assert.throws(() => api.socraticMessages(state,options.id,'a'), /Envie/);
  const attempt = {id:'a',challengeId:options.id,draft:'$x-2\\ne 0$',draftFormat:'latex',
    difficulty:'Lacuna em Pré-requisito',now:at(10)};
  assert.throws(() => api.submitAttempt(dag,state,attempt), /cronômetro/);
  state = api.updateTimer(state,options.id,'start',at());
  state = api.updateTimer(state,options.id,'pause',at(5));
  state = api.updateTimer(state,options.id,'resume',at(7));
  const result = api.submitAttempt(dag,state,attempt);
  assert.equal(result.attempt.elapsedMs, 8 * 60_000);
  state = result.state;
  assert.equal(state.agenda['micro:1.2:1.1'].topicId, '1.1');
  assert.equal(api.solutionMessages(state,options.id,'a').length, 2);
  assert.equal(api.socraticMessages(state,options.id,'a').length, 2);
  state = api.recordSolution(state,options.id,'a',{commentedSolution:'Para $x\\ne 2$, use $1/(x-2)$.'});
  state = api.recordFeedback(state,options.id,'a',{assessment:'needsRevision',checks:[],
    questions:['Por que $x=2$ está fora do domínio?']},at(11));
  assert.equal(api.performanceHistory(state).attempts[0].assessment, 'needsRevision');
  assert(api.calendarEvents(state,{start:at(),end:at(60)}).some(e=>e.kind==='micro'));
  assert.equal(api.weightedProgress(seed,state.progress).global.completed,1);
  const json = api.exportSnapshot(state, seed, at(11));
  assert.deepEqual(api.importSnapshot(json,seed),state);
  const broken = JSON.parse(json);
  delete broken.state.attempts.a;
  assert.throws(() => api.importSnapshot(JSON.stringify(broken),seed), /Snapshot inválido/);
});
