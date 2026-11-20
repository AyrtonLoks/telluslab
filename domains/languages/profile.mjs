import { createTextPractice } from '../../packages/learning-core/text-practice.mjs';
import { newReviewCard, PAIRED_CARD_KINDS } from '../../packages/learning-core/fsrs.mjs';
import { mastered } from '../../packages/learning-core/dag.mjs';
import { advancementGuard, refreshLearning } from '../../packages/learning-core/fsm.mjs';

const rules = {
  'Drill Gramatical e Transformação':{
    kind:'grammar', scenario:'Que mudança de tempo, aspecto ou regência a transformação exige?',
    expected:'Compare a frase inicial e a reescrita e justifique a mudança gramatical no contexto.'
  },
  'Produção Escrita e Estilo':{
    kind:'register', scenario:'Qual escolha de registro atende ao público e ao propósito do texto?',
    expected:'Identifique público e propósito. Compare os registros formal e informal e revise coesão e possíveis decalques do português.'
  },
  'Escrita e Reconhecimento de Kanji':{
    kind:'kanji', scenario:'Qual é o radical e o que muda na leitura entre o kanji isolado e o composto?',
    expected:'Demonstre a ordem dos traços e o significado, distinga as leituras on e kun e dê exemplos em compostos.'
  },
  'Leitura Técnica e Precisão Lexical':{
    kind:'lexicon', scenario:'Que pista no contexto sustenta a tradução ou a escolha lexical?',
    expected:'Justifique o sentido e o registro. Identifique falsos cognatos e contraste a interferência previsível do português.'
  }
};

export const LANGUAGE_MODALITIES = Object.freeze(Object.keys(rules));
export const LANGUAGE_DIFFICULTIES = Object.freeze({
  'DIF-LANG-01':'Lacuna em Pré-requisito Gramatical ou Radical Base',
  'DIF-LANG-02':'Interferência do Português / Falso Cognato / Tradução Literal',
  'DIF-LANG-03':'Confusão de Tempo/Aspecto Verbal ou Regência Preposicional',
  'DIF-LANG-04':'Inadequação de Registro Formal vs. Informal / Coesão',
  'DIF-LANG-05':'Confusão Visual de Kanji / Ordem de Traços / Leitura On vs. Kun',
  'DIF-LANG-06':'Estouro de Tempo > 75 min'
});

export const {localAuthoringMode, makeLocalChallenge, explainLocally, localFeedback, generationMessages,
  registerChallenge, solutionMessages, socraticMessages, validateFeedback} = createTextPractice({
  label:'Idiomas',
  guidance:'Apresente a produção e justifique a escolha linguística com exemplos.',
  rendering:'Preserve Unicode e IPA. Use {漢字|かんじ} para furigana e tabelas Markdown para comparar antes e depois.',
  rubric:modality => [rules[modality]]
});
export const preserveDraftWhitespace = true;
export const validateSnapshotFeedback = validateFeedback;

const starterPairs = {
  '3.3':[
    'actually',
    'na verdade / de fato',
    'IPA /ˈæk.tʃu.ə.li/. Para “atualmente”, use currently.'
  ],
  '4.1':[
    '木',
    'árvore / madeira',
    'Radical 木. On モク・ボク. Kun き・こ. Compostos {木材|もくざい} e {木刀|ぼくとう}.'
  ],
  '4.2':[
    '山',
    'montanha',
    'Radical 山. On サン. Kun やま. Compostos {火山|かざん} e {登山|とざん}.'
  ],
  '4.3':[
    '食',
    'comer / alimento',
    'Radical 食. On ショク・ジキ. Kun たべる・くう. Compostos {食事|しょくじ} e {食堂|しょくどう}.'
  ]
};

export const pairedTopic = topicId => Object.hasOwn(starterPairs, topicId);
export const pairedTopics = (dag, state) => dag.order.filter(id => pairedTopic(id) &&
  mastered(state.progress[id]) && !advancementGuard(dag, state.progress, id).crossBlocked);

export const TECHNICAL_DOMAINS = Object.freeze(['DOM-MATH', 'DOM-PROG', 'DOM-ECON', 'DOM-PHYS', 'DOM-ENG']);

export function addLanguagePair(dag, state, {id, topicId, term, meaning, notes = '', sourceRef = null, now}) {
  state = refreshLearning(dag, state, now);
  if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/u.test(id) ||
      !pairedTopics(dag, state).includes(topicId) ||
      ![term, meaning].every(value => typeof value === 'string' && value.trim()) ||
      term.trim() === meaning.trim() || typeof notes !== 'string') {
    throw new Error('Informe termo e significado distintos para um macrotema validado.');
  }
  if (sourceRef !== null && (topicId !== '3.3' || !TECHNICAL_DOMAINS.includes(dag.cross?.reference(sourceRef)?.domainId))) {
    throw new Error('Referência técnica inválida.');
  }
  const sourceId = 'pair:' + id;
  const pair = [term.trim(), meaning.trim(), notes.trim()];
  const topic = dag.byId.get(topicId);
  const cards = {...state.cards};
  for (const kind of PAIRED_CARD_KINDS) {
    const cardId = sourceId + ':' + kind;
    if (Object.hasOwn(cards, cardId)) throw new Error('Par de cartões já cadastrado.');
    cards[cardId] = {...newReviewCard({id:cardId, topicId, sourceId, kind,
      ...pairContent(topic, pair, kind === 'recognition')}, now), sourceRef};
  }
  return {...state, cards};
}

function pairedEvidence(evidence) {
  const match = evidence.match(/^Termo:[ \t]*(.+)\r?\nSignificado:[ \t]*(.+)(?:\r?\n([\s\S]+))?$/u);
  if (!match) return null;
  const [term, meaning, notes] = match.slice(1).map(value => value?.trim());
  return term && meaning && term !== meaning ? [term, meaning, notes] : null;
}

function pairContent(topic, pair, recognition) {
  const [term, meaning, notes] = pair;
  const japanese = topic.trackId === 'TRL-LANG-JP';
  const prompt = recognition ? (japanese ? 'Recupere o significado e as leituras.' : 'Recupere o sentido em português.') :
    (japanese ? 'Escreva o kanji correspondente.' : 'Recupere a forma em inglês.');
  const front = recognition ? term : meaning;
  const back = recognition ? meaning : term;
  return {frontLatex:prompt + '\n\n' + front, backLatex:back + (notes ? '\n\n' + notes : '')};
}

export function cardContent(description, kind, evidence, {topic, source}) {
  const pair = pairedTopic(topic.id) && (pairedEvidence(evidence) ||
    (source.id === topic.subtopics[0].id && starterPairs[topic.id]));
  if (pair && kind !== 'proofIdea') return pairContent(topic, pair, kind === 'statement');
  const prompts = {statement:'Recupere a regra ou o conceito e dê um exemplo.',
    counterexample:'Produza um erro típico e explique como corrigi-lo.',
    proofIdea:'Justifique uma escolha de escrita, leitura ou registro.'};
  return {frontLatex:description + '\n\n' + prompts[kind], backLatex:evidence};
}

export function cardLabel(card) {
  if (card.kind === 'recognition') return 'Reconhecimento';
  if (card.kind === 'production') return 'Produção';
  if (pairedTopic(card.topicId) && card.frontLatex.startsWith('Recupere o ')) return 'Reconhecimento';
  if (pairedTopic(card.topicId) && /^(?:Escreva o kanji correspondente|Recupere a forma em inglês)\./.test(card.frontLatex)) return 'Produção';
  return {statement:'Regra ou conceito', counterexample:'Contraste e correção', proofIdea:'Justificativa'}[card.kind];
}
