export const DAY_MS = 86_400_000;
export const FSRS_VERSION = 'FSRS-5';
export const PAIRED_CARD_KINDS = Object.freeze(['recognition', 'production']);
export const DEFAULT_WEIGHTS = Object.freeze([
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046,
  1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698,
  0.2315, 2.9898, 0.51655, 0.6621
]);
const FACTOR = 19 / 81;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function timestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)) {
    throw new Error('Instante esperado em ISO UTC com milissegundos');
  }
  const ms = Date.parse(value);
  if (!Number.isFinite(ms) || new Date(ms).toISOString() !== value) throw new Error('Instante inválido');
  return ms;
}

export function retrievability(elapsedDays, stability) {
  if (!Number.isFinite(elapsedDays) || elapsedDays < 0 || !Number.isFinite(stability) || stability <= 0) {
    throw new Error('Estado de memória inválido');
  }
  return (1 + FACTOR * elapsedDays / stability) ** -0.5;
}

export function newReviewCard({id, topicId, sourceId, kind, frontLatex, backLatex}, now) {
  return {id, topicId, sourceId, kind, frontLatex, backLatex,
    scheduler:FSRS_VERSION, createdAt:now, lastReview:null,
    dueAt:new Date(timestamp(now) + DAY_MS).toISOString(),
    stability:null, difficulty:null, repetitions:0, lapses:0};
}

export function rateCard(card, grade, now, retention = 0.90) {
  const nowMs = timestamp(now);
  if (![1, 2, 3, 4].includes(grade)) throw new Error('Nota FSRS inválida');
  if (!(retention > 0 && retention < 1)) throw new Error('Retenção inválida');
  if (nowMs < timestamp(card.createdAt) || card.lastReview === now) throw new Error('Revisão duplicada ou anterior ao cartão');
  const w = DEFAULT_WEIGHTS;
  const d0 = g => w[4] - Math.expm1(w[5] * (g - 1));
  let stability = w[grade - 1];
  let difficulty = d0(grade);
  if (card.lastReview !== null) {
    const elapsedDays = Math.floor((nowMs - timestamp(card.lastReview)) / DAY_MS);
    const previousS = card.stability;
    const previousD = card.difficulty;
    const r = retrievability(elapsedDays, previousS);
    if (!Number.isFinite(previousD) || previousD < 1 || previousD > 10) throw new Error('Dificuldade inválida');
    const delta = -w[6] * (grade - 3) * (10 - previousD) / 9;
    difficulty = w[7] * d0(4) + (1 - w[7]) * (previousD + delta);
    if (elapsedDays === 0) {
      stability = previousS * Math.exp(w[17] * (grade - 3 + w[18]));
    } else if (grade === 1) {
      const lapse = w[11] * previousD ** -w[12] * ((previousS + 1) ** w[13] - 1) * Math.exp(w[14] * (1 - r));
      stability = Math.min(lapse, previousS * Math.exp(-w[17] * w[18]));
    } else {
      const hard = grade === 2 ? w[15] : 1;
      const easy = grade === 4 ? w[16] : 1;
      stability = previousS * (1 + Math.exp(w[8]) * (11 - previousD) * previousS ** -w[9] *
        Math.expm1(w[10] * (1 - r)) * hard * easy);
    }
  }
  stability = clamp(stability, 0.01, 36500);
  difficulty = clamp(difficulty, 1, 10);
  const reviewDays = clamp(Math.round(stability * (retention ** -2 - 1) / FACTOR), 1, 36500);
  const intervalMs = grade === 1 ? 10 * 60_000 : reviewDays * DAY_MS;
  return {...card, stability, difficulty, lastReview: now,
    dueAt: new Date(nowMs + intervalMs).toISOString(),
    repetitions: card.repetitions + 1, lapses: card.lapses + Number(card.lastReview !== null && grade === 1)};
}
