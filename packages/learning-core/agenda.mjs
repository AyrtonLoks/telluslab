import { ancestors, mastered } from './dag.mjs';
import { timestamp } from './fsrs.mjs';

export const DIFFICULTIES = Object.freeze(['Lacuna em Pré-requisito', 'Heurística Inicial',
  'Erro Algébrico', 'Falha de Rigor/Quantificadores', 'Instabilidade/Bug']);
export const MATH_DIFFICULTIES = Object.freeze(Object.fromEntries([...DIFFICULTIES, 'Validação de casos-limite']
  .map((label,index) => ['DIF-MATH-0' + (index + 1),label])));
export function canonicalDiagnosis(difficulty) {
  const legacy = DIFFICULTIES.indexOf(difficulty);
  return legacy === -1 ? difficulty : 'DIF-MATH-0' + (legacy + 1);
}
export const validDifficulty = (difficulties, difficulty) => difficulties
  ? Object.hasOwn(difficulties, difficulty)
  : DIFFICULTIES.includes(difficulty) || Object.hasOwn(MATH_DIFFICULTIES, difficulty);

export const CROSS_PREREQUISITE_GAP = 'DIF-PROG-01';
export const isCrossPrerequisiteGap = difficulty =>
  [CROSS_PREREQUISITE_GAP, 'DIF-ECON-01', 'DIF-PHYS-01', 'DIF-PHYS-04', 'DIF-ENG-01', 'DIF-HUM-01',
    'DIF-LANG-01', 'DIF-LIT-01'].includes(difficulty);

export function diagnose(dag, state, attempt) {
  const agenda = {...state.agenda};
  const previous = Object.values(state.attempts);
  for (const topicId of attempt.topicIds) {
    const repeated = previous.some(old => old.id !== attempt.id && canonicalDiagnosis(old.difficulty) === canonicalDiagnosis(attempt.difficulty) &&
      old.topicIds.includes(topicId));
    const crossGap = isCrossPrerequisiteGap(attempt.difficulty);
    if (attempt.difficulty !== DIFFICULTIES[0] && attempt.difficulty !== 'DIF-MATH-01' && attempt.difficulty !== 'DIF-LANG-03' && !crossGap && !repeated) continue;
    const cross = crossGap ? dag.cross?.ancestors(topicId) ?? [] : [];
    for (const ancestorId of [...ancestors(dag, [topicId]), ...cross]) {
      const id = 'micro:' + topicId + ':' + ancestorId;
      const item = agenda[id];
      agenda[id] = {id, kind: 'micro', topicId: ancestorId, triggerTopicId: topicId,
        dueAt: item?.completedAt === null && timestamp(item.dueAt) < timestamp(attempt.submittedAt)
          ? item.dueAt : attempt.submittedAt,
        completedAt: null, sourceAttemptIds: [...new Set([...(item?.sourceAttemptIds ?? []), attempt.id])]};
    }
  }
  return agenda;
}

export function completeMicroReview(state, id, now) {
  const item = state.agenda[id];
  if (!item || item.kind !== 'micro' || item.completedAt || timestamp(now) < timestamp(item.dueAt)) {
    throw new Error('Micro-revisão indisponível');
  }
  return {...state, agenda: {...state.agenda, [id]: {...item, completedAt: now}}};
}

export function calendarEvents(state, {start, end}) {
  if (timestamp(start) >= timestamp(end)) throw new Error('Janela de calendário inválida');
  const within = at => at >= start && at < end;
  return [
    ...Object.values(state.sessions).map(s => ({id: s.id, kind: 'session', at: s.scheduledAt, sessionId: s.id})),
    ...Object.values(state.challenges).filter(c => !c.sessionId)
      .map(c => ({id: c.id, kind: 'challenge', at: c.scheduledAt, challengeId: c.id})),
    ...Object.values(state.cards).map(c => ({id: c.id, kind: 'card', at: c.dueAt, topicId: c.topicId})),
    ...Object.values(state.agenda).map(a => ({id: a.id, kind: a.kind, at: a.dueAt, topicId: a.topicId, completedAt: a.completedAt})),
    ...Object.values(state.attempts).map(a => ({id: a.id, kind: 'attempt', at: a.submittedAt, challengeId: a.challengeId})),
    ...state.reviews.map(r => ({id: r.cardId + ':' + r.at, kind: 'review', at: r.at, topicId: r.topicId}))
  ].filter(event => within(event.at)).sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
}

export function weightedProgress(catalog, progress) {
  function measure(topics) {
    const total = topics.reduce((sum, t) => sum + t.complexity, 0);
    const completed = topics.reduce((sum, t) => sum + (mastered(progress[t.id]) ? t.complexity : 0), 0);
    return {completed, total, ratio: total ? completed / total : null};
  }
  return {global: measure(catalog.topics),
    tracks: Object.fromEntries(catalog.tracks.map(t => [t.id, measure(catalog.topics.filter(x => x.trackId === t.id))])),
    books: Object.fromEntries(catalog.books.map(b => [b.id,
      measure(catalog.topics.filter(t => t.bibliography.some(ref => ref.bookId === b.id)))]))};
}

export function performanceHistory(state) {
  const attempts = Object.values(state.attempts).sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  const reviewLog = [...state.reviews].sort((a, b) => a.at.localeCompare(b.at));
  return {attempts: attempts.map(a => ({at: a.submittedAt, challengeId: a.challengeId, topicIds: a.topicIds,
    elapsedMs: a.elapsedMs, difficulty: a.difficulty, assessment: state.feedback[a.id]?.assessment ?? null})),
  reviews: reviewLog.map(r => ({at: r.at, topicId: r.topicId, grade: r.grade})),
  proficiency: [...state.events].filter(e => e.from !== e.to).sort((a, b) => a.at.localeCompare(b.at))};
}
