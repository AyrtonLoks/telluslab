import { createDag, mastered } from './dag.mjs';
import { createLearningState } from './fsm.mjs';
import { FSRS_VERSION, timestamp } from './fsrs.mjs';
import { CROSS_PREREQUISITE_GAP, DIFFICULTIES } from './agenda.mjs';

export const SNAPSHOT_VERSION = 1;
const record = value => value && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const integer = value => Number.isSafeInteger(value) && value >= 0;
const states = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const require = (ok, label) => { if (!ok) throw new Error('Snapshot inválido: ' + label); };
const keyset = (value, reference) =>
  Object.keys(value).length === Object.keys(reference).length &&
  Object.keys(reference).every(key => Object.hasOwn(value, key));

export function importSnapshot(json, catalog, dag = createDag(catalog.topics)) {
  const x = JSON.parse(json);
  require(x?.schemaVersion === SNAPSHOT_VERSION && x.catalogId === catalog.catalogId &&
    x.domainId === catalog.domainId && x.scheduler === FSRS_VERSION && record(x.state), 'versão, catálogo ou agendador');
  timestamp(x.exportedAt);
  const s = x.state;
  const initial = createLearningState(dag);
  require(keyset(s, initial), 'coleções');
  for (const [key, sample] of Object.entries(initial)) {
    require(Array.isArray(sample) ? Array.isArray(s[key]) : record(s[key]), key);
  }
  require(keyset(s.progress, initial.progress), 'macrotemas de progresso');
  for (const topic of catalog.topics) {
    const p = s.progress[topic.id];
    require(record(p) && states.includes(p.state) && record(p.subtopics) && record(p.criteria), topic.id);
    const gate = topic.prerequisites.every(id => mastered(s.progress[id]));
    require(gate ? p.state !== 'S0' : p.state === 'S0', 'pré-requisitos de ' + topic.id);
    for (const [id, sub] of Object.entries(p.subtopics)) {
      require(topic.subtopics.some(x => x.id === id) && text(sub?.evidence), id);
      timestamp(sub.at);
    }
    for (const [id, value] of Object.entries(p.criteria)) {
      const criterion = topic.criteria.find(x => x.id === id);
      require(criterion && value?.approved === true && value.criterionId === id && text(value.evidence) &&
        value.withoutConsultation === (criterion.kind === 'mandatory' ? true : null), id);
      timestamp(value.at);
    }
    if (Number(p.state[1]) >= 2) {
      require(text(p.theory?.notes), 'teoria de ' + topic.id);
      timestamp(p.theory.at);
    } else require(p.theory === null, 'teoria fora da etapa');
    if (Number(p.state[1]) >= 3) {
      require(integer(p.practice?.correct) && integer(p.practice?.total) && p.practice.total > 0 &&
        p.practice.correct <= p.practice.total && p.practice.correct / p.practice.total >= 0.8 &&
        text(p.practice.evidence), 'fixação de ' + topic.id);
      timestamp(p.practice.at);
    } else require(p.practice === null && !Object.keys(p.criteria).length, 'fixação fora da etapa');
    if (mastered(p)) {
      require(topic.subtopics.every(sub => Object.hasOwn(p.subtopics, sub.id)) &&
        topic.criteria.every(c => Object.hasOwn(p.criteria, c.id)), 'DoD de ' + topic.id);
      timestamp(p.masteredAt);
      const sources = [...topic.subtopics, ...topic.criteria.filter(c => c.kind === 'mandatory')];
      require(sources.every(source => ['statement', 'counterexample', 'proofIdea']
        .every(kind => Object.hasOwn(s.cards, source.id + ':' + kind))), 'cartões de ' + topic.id);
    } else require(p.masteredAt === null, 'data de domínio fora da etapa');
  }
  for (const [id, card] of Object.entries(s.cards)) {
    const topic = dag.byId.get(card?.topicId);
    require(card?.id === id && ['statement', 'counterexample', 'proofIdea'].includes(card.kind) &&
      id === card.sourceId + ':' + card.kind && topic && mastered(s.progress[topic.id]) &&
      [...topic.subtopics, ...topic.criteria.filter(c => c.kind === 'mandatory')].some(item => item.id === card.sourceId) &&
      card.scheduler === FSRS_VERSION && text(card.frontLatex) && text(card.backLatex) &&
      integer(card.lapses) && integer(card.repetitions) && card.lapses <= card.repetitions, 'cartão ' + id);
    const created = timestamp(card.createdAt);
    require(timestamp(card.dueAt) >= created, 'agenda do cartão ' + id);
    require(card.repetitions === 0 ? card.lastReview === null && card.stability === null && card.difficulty === null :
      timestamp(card.lastReview) >= created && card.dueAt > card.lastReview &&
      Number.isFinite(card.stability) && card.stability > 0 && Number.isFinite(card.difficulty) &&
      card.difficulty >= 1 && card.difficulty <= 10, 'memória de ' + id);
  }
  for (const review of s.reviews) {
    require(s.cards[review?.cardId]?.topicId === review?.topicId && [1,2,3,4].includes(review.grade) &&
      Number.isFinite(review.stability) && review.stability > 0 &&
      Number.isFinite(review.difficulty) && review.difficulty >= 1 && review.difficulty <= 10, 'revisão');
    require(timestamp(review.at) < timestamp(review.dueAt), 'instantes da revisão');
    timestamp(review.previousDueAt);
  }
  for (const event of s.events) {
    require(dag.byId.has(event?.topicId) && states.includes(event.from) && states.includes(event.to) &&
      text(event.kind), 'evento de proficiência');
    timestamp(event.at);
  }
  for (const [id, session] of Object.entries(s.sessions)) {
    require(session?.id === id && integer(session.durationSeconds) && session.durationSeconds % 60 === 0 &&
      session.durationSeconds >= 2700 && session.durationSeconds <= 4500 && Array.isArray(session.blocks) &&
      session.blocks.length === 3 && Array.isArray(session.open), 'sessão ' + id);
    timestamp(session.createdAt);
    timestamp(session.scheduledAt);
    for (const [i, kind, fraction] of [[0,'advance',0.5],[1,'review',0.3],[2,'mixed',0.2]]) {
      const block = session.blocks[i];
      require(block?.kind === kind && block.seconds === session.durationSeconds * fraction, 'bloco ' + id);
      if (kind === 'review') require(Array.isArray(block.slots) && block.slots.every(slot =>
        integer(slot.seconds) && slot.cardIds.every(cardId => Object.hasOwn(s.cards, cardId)) &&
        slot.topicIds.every(topicId => dag.byId.has(topicId))), 'revisões de ' + id);
      else require(Array.isArray(block.topicIds) && block.topicIds.every(t => dag.byId.has(t)), 'temas de ' + id);
    }
  }
  for (const [id, c] of Object.entries(s.challenges)) {
    require(c?.id === id && (c.sessionId === null ? c.block === 'standalone' : Object.hasOwn(s.sessions, c.sessionId)) &&
      integer(c.durationSeconds) && c.durationSeconds > 0 && Array.isArray(c.topicIds) && c.topicIds.length > 0 &&
      c.topicIds.every(t => dag.byId.has(t)) && Array.isArray(c.allowedTopicIds) &&
      c.allowedTopicIds.every(t => mastered(s.progress[t])) && Array.isArray(c.assumedTopicIds) &&
      c.assumedTopicIds.every(t => c.allowedTopicIds.includes(t)) && Array.isArray(c.licensedCurriculum) &&
      text(c.title) && text(c.statement) && Array.isArray(c.requirements) && c.requirements.length > 0 &&
      c.requirements.every(text) && Array.isArray(c.hypotheses) && c.hypotheses.every(text) &&
      Array.isArray(c.examples) && c.examples.length > 0 &&
      c.examples.every(e => text(e?.input) && text(e?.expected)) &&
      Array.isArray(c.tests) && c.tests.length > 0 &&
      c.tests.every(t => text(t?.kind) && text(t?.scenario) && text(t?.expected)), 'desafio ' + id);
    timestamp(c.createdAt);
    timestamp(c.scheduledAt);
  }
  for (const [id, timer] of Object.entries(s.timers)) {
    require(timer?.challengeId === id && Object.hasOwn(s.challenges, id) && integer(timer.elapsedMs) &&
      timestamp(timer.startedAt) <= timestamp(timer.updatedAt) &&
      (timer.runningSince === null || timestamp(timer.runningSince) <= timestamp(timer.updatedAt)), 'cronômetro ' + id);
  }
  for (const [id, a] of Object.entries(s.attempts)) {
    const challenge = s.challenges[a?.challengeId];
    require(a?.id === id && challenge && text(a.draft) && integer(a.elapsedMs) && a.elapsedMs > 0 &&
      Array.isArray(a.topicIds) && a.topicIds.join('|') === challenge.topicIds.join('|') &&
      ['latex','code'].includes(a.draftFormat) && (catalog.difficulties ? Object.hasOwn(catalog.difficulties, a.difficulty) :
        DIFFICULTIES.includes(a.difficulty)) &&
      a.elapsedMs <= timestamp(a.submittedAt) - timestamp(a.startedAt), 'tentativa ' + id);
  }
  for (const [id, item] of Object.entries(s.agenda)) {
    require(item?.id === id && item.kind === 'micro' && dag.byId.has(item.triggerTopicId) &&
      Array.isArray(item.sourceAttemptIds) && item.sourceAttemptIds.length, 'agenda ' + id);
    const local = dag.byId.has(item.topicId);
    require((local || dag.cross?.ancestors(item.triggerTopicId).includes(item.topicId)) &&
      item.sourceAttemptIds.every(attemptId => {
        const attempt = s.attempts[attemptId];
        return attempt?.topicIds.includes(item.triggerTopicId) && (local || attempt.difficulty === CROSS_PREREQUISITE_GAP);
      }), 'agenda ' + id);
    timestamp(item.dueAt);
    if (item.completedAt !== null) require(timestamp(item.completedAt) >= timestamp(item.dueAt), 'conclusão de ' + id);
  }
  for (const [id, solution] of Object.entries(s.materials)) {
    require(solution?.challengeId === id && s.attempts[solution.createdFromAttemptId]?.challengeId === id &&
      text(solution.commentedSolution), 'trava da solução ' + id);
  }
  for (const [id, feedback] of Object.entries(s.feedback)) {
    require(feedback?.attemptId === id && Object.hasOwn(s.attempts, id) &&
      ['needsRevision','coherent','insufficientEvidence'].includes(feedback.assessment) &&
      Array.isArray(feedback.questions) && feedback.questions.length > 0 && feedback.questions.every(text) &&
      Array.isArray(feedback.checks) && feedback.checks.every(c => text(c?.category) && text(c?.excerpt) && text(c?.observation)) &&
      timestamp(feedback.at) >= timestamp(s.attempts[id].submittedAt), 'feedback ' + id);
  }
  return s;
}

export function exportSnapshot(state, catalog, now, dag) {
  const json = JSON.stringify({schemaVersion: SNAPSHOT_VERSION, catalogId: catalog.catalogId, domainId:catalog.domainId,
    scheduler: FSRS_VERSION, exportedAt: now, state}, null, 2);
  importSnapshot(json, catalog, dag);
  return json;
}
