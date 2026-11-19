import { mastered } from './dag.mjs';
import { DAY_MS, FSRS_VERSION, rateCard, timestamp } from './fsrs.mjs';

const active = new Set(['S1', 'S2', 'S3']);

export function createLearningState(dag) {
  return {
    progress: Object.fromEntries(dag.order.map(id => [id, {
      state: dag.byId.get(id).prerequisites.length ? 'S0' : 'S1',
      subtopics: {}, theory: null, practice: null, criteria: {}, masteredAt: null
    }])),
    cards: {}, reviews: [], events: [], sessions: {}, challenges: {}, timers: {},
    attempts: {}, agenda: {}, materials: {}, feedback: {}
  };
}

function guards(dag, progress, id) {
  const prerequisites = dag.byId.get(id).prerequisites;
  return {
    locked: prerequisites.filter(parent => !mastered(progress[parent])),
    overdue: prerequisites.filter(parent => progress[parent]?.state === 'S6')
  };
}

export function advancementGuard(dag, progress, id) {
  if (!dag.byId.has(id)) throw new Error('Macrotema desconhecido: ' + id);
  const {locked, overdue} = guards(dag, progress, id);
  const crossPending = dag.cross?.pending(id) ?? [];
  const crossBlocked = dag.cross?.mode === 'strict' && crossPending.length > 0;
  return {allowed: active.has(progress[id]?.state) && !locked.length && !overdue.length && !crossBlocked,
    locked, overdue, ...(dag.cross && {crossPending, crossBlocked})};
}

export function refreshLearning(dag, state, now) {
  const nowMs = timestamp(now);
  const progress = {...state.progress};
  const cardsByTopic = Map.groupBy ? Map.groupBy(Object.values(state.cards), card => card.topicId) : new Map();
  if (!Map.groupBy) {
    for (const card of Object.values(state.cards)) {
      if (!cardsByTopic.has(card.topicId)) cardsByTopic.set(card.topicId, []);
      cardsByTopic.get(card.topicId).push(card);
    }
  }
  let events = state.events;
  for (const id of dag.order) {
    const current = progress[id];
    let next = current.state;
    if (next === 'S0' && !guards(dag, progress, id).locked.length) next = 'S1';
    if (mastered(current)) {
      const cards = cardsByTopic.get(id) ?? [];
      if (cards.some(card => timestamp(card.dueAt) <= nowMs)) next = 'S6';
      else if (cards.some(card => card.repetitions > 0)) next = 'S5';
      else next = 'S4';
    }
    if (next !== current.state) {
      progress[id] = {...current, state: next};
      events = [...events, {topicId: id, from: current.state, to: next, kind: 'automatic', at: now}];
    }
  }
  return {...state, progress, events};
}

function cardContent(description, kind, evidence) {
  const source = 'Referência do currículo — ' + description;
  const mechanics = {
    statement: ['Enuncie a propriedade e explicite domínio e hipóteses.',
      'Confira o enunciado completo, domínio, hipóteses e a ordem dos quantificadores.'],
    counterexample: ['Remova uma hipótese necessária e produza um contraexemplo justificado.',
      'Identifique a hipótese removida, confirme as demais e mostre a falha da conclusão. Se não for necessária, justifique.'],
    proofIdea: ['Reconstrua a ideia-chave da prova ou deduza a propriedade a partir das definições.',
      'Compare os passos com sua evidência de validação e declare onde usa cada hipótese.']
  };
  const [front, back] = mechanics[kind];
  return {frontLatex: source + '\n\n' + front,
    backLatex: back + '\n\nEvidência registrada — ' + evidence};
}

function starterCards(topic, proof, completed, now, renderCard = cardContent) {
  const obligations = [
    ...topic.subtopics.map(sub => ({...sub, evidence: completed[sub.id].evidence})),
    {id: proof.criterionId, description: topic.criteria.find(c => c.id === proof.criterionId).description,
      evidence: proof.evidence}
  ];
  const cards = {};
  for (const source of obligations) {
    for (const kind of ['statement', 'counterexample', 'proofIdea']) {
      const id = source.id + ':' + kind;
      cards[id] = {id, topicId: topic.id, sourceId: source.id, kind,
        ...renderCard(source.description, kind, source.evidence),
        scheduler: FSRS_VERSION, createdAt: now, lastReview: null,
        dueAt: new Date(timestamp(now) + DAY_MS).toISOString(),
        stability: null, difficulty: null, repetitions: 0, lapses: 0};
    }
  }
  return cards;
}

const nonBlank = value => typeof value === 'string' && value.trim().length > 0;

export function applyStudyEvent(dag, original, topicId, action, now) {
  const state = refreshLearning(dag, original, now);
  const topic = dag.byId.get(topicId);
  if (!topic) throw new Error('Macrotema desconhecido: ' + topicId);
  const current = state.progress[topicId];
  const guard = advancementGuard(dag, state.progress, topicId);
  if (!guard.allowed) throw new Error('Avanço bloqueado em ' + topicId + ': ' +
    [...guard.locked, ...guard.overdue, ...(guard.crossBlocked ? guard.crossPending : [])].join(', '));

  let next;
  let cards = state.cards;
  switch (action.kind) {
    case 'completeSubtopic': {
      if (!topic.subtopics.some(s => s.id === action.subtopicId) || !nonBlank(action.evidence)) {
        throw new Error('Subtema ou evidência inválida');
      }
      next = {...current, subtopics: {...current.subtopics,
        [action.subtopicId]: {evidence: action.evidence, at: now}}};
      break;
    }
    case 'completeTheory':
      if (current.state !== 'S1' || !nonBlank(action.notes)) throw new Error('Teoria exige fichamento e estado S1');
      next = {...current, state: 'S2', theory: {notes: action.notes, at: now}};
      break;
    case 'passPractice': {
      const {correct, total, evidence} = action;
      if (current.state !== 'S2' || !Number.isSafeInteger(correct) || !Number.isSafeInteger(total) ||
          total <= 0 || correct > total || correct / total < 0.8 || !nonBlank(evidence)) {
        throw new Error('Fixação exige estado S2, evidência e pelo menos 80% de acertos');
      }
      next = {...current, state: 'S3', practice: {correct, total, evidence, at: now}};
      break;
    }
    case 'validateCriterion': {
      const criterion = topic.criteria.find(c => c.id === action.criterionId);
      if (current.state !== 'S3' || !criterion || !nonBlank(action.evidence) ||
          action.approved !== true || (criterion.kind === 'mandatory' && action.withoutConsultation !== true)) {
        throw new Error('Evidência de DoD insuficiente');
      }
      const validation = {criterionId: criterion.id, approved: true, evidence: action.evidence, at: now,
        withoutConsultation: criterion.kind === 'mandatory' ? true : null};
      next = {...current, criteria: {...current.criteria, [criterion.id]: validation}};
      break;
    }
    case 'validateProof': {
      const complete = topic.subtopics.every(sub => current.subtopics[sub.id]);
      const approved = topic.criteria.every(c => current.criteria[c.id]?.approved &&
        (c.kind !== 'mandatory' || current.criteria[c.id].withoutConsultation));
      if (current.state !== 'S3' || !complete || !approved) {
        throw new Error('S4 exige todos os subtemas, critérios obrigatórios sem consulta e Capstone aprovado');
      }
      next = {...current, state: 'S4', masteredAt: now};
      const proof = topic.criteria.find(c => c.kind === 'mandatory');
      cards = {...cards, ...starterCards(topic, current.criteria[proof.id], current.subtopics, now, dag.cardContent)};
      break;
    }
    default: throw new Error('Ação de estudo desconhecida: ' + action.kind);
  }

  return refreshLearning(dag, {...state, cards,
    progress: {...state.progress, [topicId]: next},
    events: [...state.events, {topicId, from: current.state, to: next.state, kind: action.kind,
      entityId: action.subtopicId ?? action.criterionId ?? null, at: now}]}, now);
}

export function reviewCard(dag, state, cardId, grade, now) {
  const card = state.cards[cardId];
  if (!card || !mastered(state.progress[card.topicId])) throw new Error('Cartão indisponível');
  const updated = rateCard(card, grade, now);
  const event = {cardId, topicId: card.topicId, grade, at: now,
    previousDueAt: card.dueAt, dueAt: updated.dueAt, stability: updated.stability, difficulty: updated.difficulty};
  return refreshLearning(dag, {...state, cards: {...state.cards, [cardId]: updated},
    reviews: [...state.reviews, event]}, now);
}
