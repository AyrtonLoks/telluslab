import { createTextPractice } from '../../packages/learning-core/text-practice.mjs';

const modalityRules = {
  'Close Reading e Análise Formal':null,
  'Contextualização Histórico-Estética':{
    kind:'context', scenario:'Que aspecto da época ajuda a explicar esta escolha formal?',
    expected:'Relacione o contexto histórico à forma, com evidência da passagem e atenção a anacronismos.'
  },
  'Análise Comparativa e Crítica':{
    kind:'comparison', scenario:'Qual critério comum permite comparar as passagens e o que a diferença produz?',
    expected:'Compare o mesmo recurso em passagens localizadas de cada obra e explique os efeitos distintos.'
  },
  'Ensaio Crítico Literário':{
    kind:'argument', scenario:'Que leitura alternativa da passagem colocaria sua tese em dúvida?',
    expected:'Formule uma tese interpretativa e teste-a contra uma leitura alternativa sustentada pelo texto.'
  }
};
export const LITERATURE_MODALITIES = Object.freeze(Object.keys(modalityRules));
export const LITERATURE_DIFFICULTIES = Object.freeze({
  'DIF-LIT-01':'Lacuna em Pré-requisito Estético, Histórico ou DOM-HUM',
  'DIF-LIT-02':'Resumo de Enredo no Lugar de Análise Formal/Crítica',
  'DIF-LIT-03':'Confusão entre Autor Real e Narrador / Eu Lírico',
  'DIF-LIT-04':'Anacronismo ou Leitura Descolada da Forma',
  'DIF-LIT-05':'Falta de Evidência Textual / Análise Impresionista',
  'DIF-LIT-06':'Estouro de Tempo > 75 min'
});

const checks = [
  {kind:'evidence', scenario:'Qual palavra, verso ou construção da passagem sustenta sua leitura?',
    expected:'Transcreva a passagem em Excerto e identifique-a em Citação com autor, ano e página ou outra localização.'},
  {kind:'form', scenario:'Como o recurso formal altera o efeito da passagem e sustenta sua interpretação?',
    expected:'Em Forma, cite entre aspas uma palavra ou expressão do excerto e explique o efeito do recurso formal. Preserve versos e registre a escansão quando pertinente.'},
  {kind:'voice', scenario:'Quem fala nesta passagem? Que sinal textual distingue essa voz de quem escreveu a obra?',
    expected:'Em Voz, identifique autor e narrador, eu lírico ou personagem e explique a distinção com base na passagem.'}
];
const guidance = 'Use seções Excerto:, Citação:, Forma: e Voz:. A aprovação exige análise formal ancorada na passagem e distinção entre autor e a voz do texto.';

function draftSections(draft) {
  const headings = [...draft.matchAll(/^[ \t]*(Excerto|Citação|Forma|Voz):[ \t]*/gmu)];
  const sections = new Map(headings.map((match, i) => [
    match[1], draft.slice(match.index + match[0].length, headings[i + 1]?.index).trim()
  ]));
  return headings.length === sections.size ? sections : null;
}

export function assessDraft(draft) {
  const sections = draftSections(draft);
  if (!sections) return 'Use cada seção da análise uma única vez.';
  const excerpt = sections.get('Excerto');
  if (!excerpt || !/\p{L},\s*(?:\d{4}[a-z]?|\[s\.\s*d\.\]),\s*[^()\s]+/iu.test(sections.get('Citação') ?? '')) {
    return 'Inclua um excerto e uma citação com autor, ano e localização (página, verso, canto ou seção).';
  }
  const form = sections.get('Forma') ?? '';
  const voice = sections.get('Voz') ?? '';
  const substantive = value => (value.match(/\p{L}+/gu)?.length ?? 0) >= 5;
  const quoted = [...form.matchAll(/"([^"\n]+)"|“([^”\n]+)”|«([^»\n]+)»/gu)]
    .map(match => (match[1] ?? match[2] ?? match[3]).trim());
  if (!substantive(form) || !quoted.some(detail => /\p{L}/u.test(detail) && excerpt.includes(detail))) {
    return 'Cite entre aspas um detalhe do excerto e explique como sua forma produz um efeito interpretativo.';
  }
  if (!substantive(voice) || voice === form ||
      !/\bautor(?:a)?\b/iu.test(voice) || !/\b(?:narrador(?:a)?|eu lírico|personagem|voz poética)\b/iu.test(voice)) {
    return 'Identifique e distinga o autor da voz do texto (narrador, eu lírico ou personagem).';
  }
  return null;
}

export function validateCriterion(criterion, evidence) {
  if (criterion.kind !== 'capstone') return;
  const problem = assessDraft(evidence);
  if (problem) throw new Error(problem);
}

export const {localAuthoringMode, makeLocalChallenge, explainLocally, localFeedback, generationMessages,
  registerChallenge, solutionMessages, socraticMessages, validateFeedback:validateReview} = createTextPractice({
  label:'Literatura', guidance, assessDraft,
  rendering:'Preserve as quebras e a escansão dos versos. Use ABNT. Não invente citações, excertos, páginas nem dados de edição. ' +
    'No parecer, fundamente evidence em Excerto e Citação, form em Forma e voice em Voz.',
  rubric:modality => [...checks, ...[modalityRules[modality]].filter(Boolean)]
});
export const preserveDraftWhitespace = true;

export function validateFeedback(attempt, challenge, response) {
  validateReview(attempt, challenge, response);
  if (response?.assessment !== 'coherent') return;
  const sections = draftSections(attempt.draft);
  const evidence = {
    evidence:sections.get('Excerto') + '\n' + sections.get('Citação'),
    form:sections.get('Forma'),
    voice:sections.get('Voz')
  };
  for (const [kind, section] of Object.entries(evidence)) {
    const check = response.checks.find(item => item.category === kind);
    if (!section.includes(check.excerpt.trim())) throw new Error('Fundamente o parecer nas seções correspondentes do rascunho.');
  }
}

export const validateSnapshotFeedback = validateFeedback;

export const cardLabel = card => ({statement:'Conceito literário',counterexample:'Contraste',proofIdea:'Leitura do excerto'})[card.kind];
export function cardContent(description, kind, evidence) {
  const prompts = {statement:'Defina a categoria e identifique-a em uma obra.',
    counterexample:'Contraste com outro recurso ou período e justifique a distinção.',
    proofIdea:'Recupere a passagem e explique como a forma sustenta a leitura.'};
  return {frontLatex:description + '\n\n' + prompts[kind], backLatex:evidence};
}
