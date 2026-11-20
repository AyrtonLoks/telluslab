import { timestamp } from './fsrs.mjs';
import { validDifficulty, diagnose } from './agenda.mjs';
import { challengeBrief } from './sessions.mjs';
import { advancementGuard } from './fsm.mjs';

const hasText = value => typeof value === 'string' && value.trim().length > 0;
const hasList = value => Array.isArray(value) && value.length > 0 && value.every(hasText);
const fieldsHaveText = (object, keys) => object && keys.every(key => hasText(object[key]));
export function registerChallenge(dag, state, options, authored, required) {
  const brief = challengeBrief(dag, state, options);
  const allowed = new Set(brief.allowedTopicIds);
  if (!Array.isArray(required) || !required.length || !required.every(hasText)) {
    throw new Error('Regras de testes ausentes para a modalidade.');
  }
  if (!fieldsHaveText(authored, ['title', 'statement']) || !hasList(authored.requirements) ||
      !Array.isArray(authored.hypotheses) || !authored.hypotheses.every(hasText) ||
      !Array.isArray(authored.assumedTopicIds) || !authored.assumedTopicIds.every(id => allowed.has(id)) ||
      !Array.isArray(authored.examples) || !authored.examples.length ||
      !authored.examples.every(ex => fieldsHaveText(ex, ['input', 'expected'])) ||
      !Array.isArray(authored.tests) || !authored.tests.every(test =>
        fieldsHaveText(test, ['scenario', 'expected']) && required.includes(test.kind)) ||
      !required.every(kind => authored.tests.some(test => test.kind === kind))) {
    throw new Error('Enunciado, exemplos, hipóteses, lemas ou testes inválidos');
  }
  const {recentDifficulties, curriculum, ...contract} = brief;
  const challenge = {...contract, title: authored.title, statement: authored.statement,
    requirements: [...authored.requirements], hypotheses: [...authored.hypotheses],
    assumedTopicIds: [...new Set(authored.assumedTopicIds)],
    examples: authored.examples.map(({input, expected}) => ({input, expected})),
    tests: authored.tests.map(({kind, scenario, expected}) => ({kind, scenario, expected}))};
  return {state: {...state, challenges: {...state.challenges, [challenge.id]: challenge}}, challenge};
}

export function updateTimer(state, challengeId, action, now) {
  const nowMs = timestamp(now);
  const current = state.timers[challengeId];
  if (!state.challenges[challengeId]) throw new Error('Desafio desconhecido');
  if (current && now < current.updatedAt) throw new Error('Relógio regressivo');
  let timer;
  if (action === 'start' && !current) {
    timer = {challengeId, startedAt: now, runningSince: now, updatedAt: now, elapsedMs: 0};
  } else if (action === 'resume' && current?.runningSince === null) {
    timer = {...current, runningSince: now, updatedAt: now};
  } else if (action === 'pause' && current?.runningSince) {
    timer = {...current, runningSince: null, updatedAt: now,
      elapsedMs: current.elapsedMs + nowMs - timestamp(current.runningSince)};
  } else throw new Error('Transição inválida do cronômetro');
  return {...state, timers: {...state.timers, [challengeId]: timer}};
}

export function submitAttempt(dag, state, {id, challengeId, draft, draftFormat, difficulty, now}) {
  const end = timestamp(now);
  const challenge = state.challenges[challengeId];
  const timer = state.timers[challengeId];
  if (!id || state.attempts[id] || !challenge || !timer || now < timer.updatedAt || !hasText(draft) ||
      !['latex', 'code'].includes(draftFormat) ||
      !validDifficulty(dag.difficulties, difficulty)) {
    throw new Error('Tentativa exige cronômetro, rascunho em LaTeX/código e dificuldade');
  }
  if (dag.cross && challenge.topicIds.some(topicId =>
    advancementGuard(dag, state.progress, topicId).crossBlocked)) {
    throw new Error('Revise os pré-requisitos cruzados antes de enviar a tentativa.');
  }
  const elapsedMs = timer.elapsedMs + (timer.runningSince ? end - timestamp(timer.runningSince) : 0);
  if (!(elapsedMs > 0)) throw new Error('Tempo cronometrado deve ser positivo');
  const attempt = {id, challengeId, topicIds: [...challenge.topicIds], startedAt: timer.startedAt,
    submittedAt: now, elapsedMs, draft: dag.preserveDraftWhitespace ? draft : draft.trim(), draftFormat, difficulty};
  const timers = {...state.timers};
  delete timers[challengeId];
  return {attempt, state: {...state, timers, agenda: diagnose(dag, state, attempt),
    attempts: {...state.attempts, [id]: attempt}}};
}

export function requireAttempt(state, challengeId, attemptId) {
  const attempt = state.attempts[attemptId];
  const challenge = state.challenges[challengeId];
  if (!challenge || attempt?.challengeId !== challengeId) throw new Error('Envie uma tentativa para liberar o acesso');
  return {challenge, attempt};
}

export function recordSolution(state, challengeId, attemptId, response) {
  requireAttempt(state, challengeId, attemptId);
  if (!hasText(response?.commentedSolution)) throw new Error('Solução comentada inválida');
  return {...state, materials: {...state.materials, [challengeId]: {challengeId,
    createdFromAttemptId: attemptId, commentedSolution: response.commentedSolution}}};
}

export function readSolution(state, challengeId, attemptId) {
  requireAttempt(state, challengeId, attemptId);
  return state.materials[challengeId]?.commentedSolution ?? null;
}

export function recordFeedback(state, challengeId, attemptId, response, now) {
  const {attempt} = requireAttempt(state, challengeId, attemptId);
  timestamp(now);
  if (now < attempt.submittedAt || !['needsRevision', 'coherent', 'insufficientEvidence'].includes(response?.assessment) ||
      !hasList(response.questions) || !Array.isArray(response.checks) ||
      !response.checks.every(check => fieldsHaveText(check, ['category', 'excerpt', 'observation']))) {
    throw new Error('Feedback socrático inválido');
  }
  const feedback = {attemptId, at: now, assessment: response.assessment, questions: [...response.questions],
    checks: response.checks.map(({category, excerpt, observation}) => ({category, excerpt, observation}))};
  return {...state, feedback: {...state.feedback, [attemptId]: feedback}};
}

export function readFeedback(state, challengeId, attemptId) {
  requireAttempt(state, challengeId, attemptId);
  return state.feedback[attemptId] ?? null;
}
