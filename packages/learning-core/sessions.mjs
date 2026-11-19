import { ancestors, mastered } from './dag.mjs';
import { advancementGuard, refreshLearning } from './fsm.mjs';
import { timestamp } from './fsrs.mjs';

function budget(minutes) {
  if (!Number.isInteger(minutes) || minutes < 45 || minutes > 75) throw new Error('Duração de 45 a 75 min');
  return minutes * 60;
}

export function planSession(dag, original, {id, now, scheduledAt = now, minutes, preferredTopicId, targetOrder = []}) {
  const seconds = budget(minutes);
  timestamp(scheduledAt);
  if (!id || original.sessions[id]) throw new Error('ID de sessão ausente ou já usado');
  const state = refreshLearning(dag, original, now);
  const {progress} = state;
  const dueCards = Object.values(state.cards).filter(c => c.dueAt <= now && progress[c.topicId].state === 'S6')
    .sort((a,b) => a.dueAt.localeCompare(b.dueAt) || a.id.localeCompare(b.id));
  const eligible = dag.order.filter(t => advancementGuard(dag, progress, t).allowed);
  if (preferredTopicId && !eligible.includes(preferredTopicId)) throw new Error('Macrotema preferido indisponível');
  const history = Object.values(state.attempts).sort((a,b) => b.submittedAt.localeCompare(a.submittedAt));
  const lastAttempted = new Map();
  for (const attempt of history) {
    for (const topicId of attempt.topicIds) if (!lastAttempted.has(topicId)) lastAttempted.set(topicId, attempt.submittedAt);
  }
  const byId = dag.byId;
  const priority = [...new Set(targetOrder.filter(t => eligible.includes(t)))];
  const activeId = preferredTopicId ?? priority[0] ?? [...eligible].sort((a,b) =>
    Number(progress[b].state[1]) - Number(progress[a].state[1]) ||
    (lastAttempted.get(a) ?? '').localeCompare(lastAttempted.get(b) ?? '') ||
    dag.order.indexOf(a) - dag.order.indexOf(b))[0];
  const activeTrack = byId.get(activeId)?.trackId;
  const tracks = [...new Set(dueCards.map(c => byId.get(c.topicId).trackId))];
  tracks.sort((a,b) => Number(a === activeTrack) - Number(b === activeTrack));
  const selectedTracks = tracks.slice(0, 2);
  const reviewSlots = selectedTracks.map((trackId, idx) => {
    const cards = dueCards.filter(c => byId.get(c.topicId).trackId === trackId);
    const secondsPerTrack = Math.floor(seconds * 0.3 / selectedTracks.length);
    const allocation = secondsPerTrack + (idx === 0 ? seconds * 0.3 % selectedTracks.length : 0);
    const scheduled = cards.slice(0, Math.floor(allocation / 120));
    return {trackId, seconds: allocation,
      cardIds: scheduled.map(c => c.id), topicIds: [...new Set(scheduled.map(c => c.topicId))]};
  });
  const validated = dag.order.filter(q => ['S4', 'S5'].includes(progress[q].state) &&
    !advancementGuard(dag, progress, q).crossBlocked);
  const mixedCandidates = [...validated].sort((a,b) =>
    Number(byId.get(a).trackId === activeTrack) - Number(byId.get(b).trackId === activeTrack) ||
    (lastAttempted.get(a) ?? '').localeCompare(lastAttempted.get(b) ?? ''));
  const mixed = activeId ? [activeId] : [];
  for (const candidate of [...mixedCandidates, ...eligible]) {
    if (!mixed.includes(candidate)) mixed.push(candidate);
    if (mixed.length >= 2) break;
  }
  const open = [];
  if (!activeId) open.push({kind: 'advance', reason: 'noEligibleTopic'});
  if (!selectedTracks.length) open.push({kind: 'review', reason: 'noDueCards'});
  if (selectedTracks.length === 1) open.push({kind: 'review', reason: 'onlyOneDueTrack'});
  if (mixed.length < 2) open.push({kind: 'mixed', reason: 'fewerThanTwoEligibleTopics'});
  const session = {id, createdAt: now, scheduledAt, durationSeconds: seconds, open, blocks: [
    {kind: 'advance', seconds: seconds * 0.5, topicIds: activeId ? [activeId] : []},
    {kind: 'review', seconds: seconds * 0.3, slots: reviewSlots},
    {kind: 'mixed', seconds: seconds * 0.2, topicIds: mixed.length === 2 ? mixed : []}
  ]};
  return {state: {...state, sessions: {...state.sessions, [id]: session}}, session};
}

export function challengeBrief(dag, original, options) {
  const {id, sessionId = null, block = 'standalone', now, scheduledAt = now, topicIds, modality} = options;
  timestamp(scheduledAt);
  const state = refreshLearning(dag, original, now);
  if (!id || state.challenges[id] || !Array.isArray(topicIds) || !topicIds.length ||
      new Set(topicIds).size !== topicIds.length) throw new Error('Desafio inválido');
  let durationSeconds;
  if (sessionId === null) {
    if (block !== 'standalone') throw new Error('Bloco sem sessão');
    durationSeconds = budget(options.minutes);
  } else {
    const session = state.sessions[sessionId];
    const slot = session?.blocks.find(b => b.kind === block && b.kind !== 'review');
    if (!slot || slot.topicIds.length !== topicIds.length || !topicIds.every(t => slot.topicIds.includes(t)) ||
        Object.values(state.challenges).some(c => c.sessionId === sessionId && c.block === block)) {
      throw new Error('Escopo de desafio incompatível com sessão');
    }
    durationSeconds = slot.seconds;
  }
  const topics = topicIds.map(t => {
    const topic = dag.byId.get(t);
    const guard = topic && advancementGuard(dag, state.progress, t);
    if (!guard || guard.crossBlocked || (!guard.allowed &&
        (!mastered(state.progress[t]) || state.progress[t].state === 'S6'))) throw new Error('Macrotema indisponível: ' + t);
    return topic;
  });
  if (!topics.some(t => t.modalities.includes(modality))) throw new Error('Modalidade fora do currículo do desafio');
  const allowedTopicIds = [...new Set([...ancestors(dag, topicIds), ...topicIds])]
    .filter(t => ['S4', 'S5'].includes(state.progress[t].state));
  const recentDifficulties = Object.values(state.attempts).filter(a => a.topicIds.some(t => topicIds.includes(t)))
    .sort((a,b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5)
    .map(a => ({difficulty: a.difficulty, elapsedMs: a.elapsedMs}));
  return {id, sessionId, block, createdAt: now, scheduledAt, durationSeconds, topicIds: [...topicIds], modality,
    allowedTopicIds, recentDifficulties, curriculum: topics.map(t => ({id: t.id, title: t.title,
      subtopics: t.subtopics, criteria: t.criteria, bibliography: t.bibliography})),
    licensedCurriculum: allowedTopicIds.map(t => ({id: t, title: dag.byId.get(t).title,
      criteria: dag.byId.get(t).criteria.filter(c => c.kind === 'mandatory')}))};
}

