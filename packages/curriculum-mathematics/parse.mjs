import { createDag } from '../learning-core/dag.mjs';

export const MODALITIES = ['Cálculo/Algébrico', 'Demonstração Formal', 'Implementação Computacional'];
const ROLES = ['Intuição/Cálculo', 'Rigor/Prova', 'Algorítmica', 'Aplicação/Referência'];
const listPrefix = /^\s*(?:[-+*]|\d+[.)])\s+/;
const metadata = /^Trilha: (TRL-0[0-4])\s*\|\s*Complexidade: ([1-5])\/5\s*\|\s*Pré-requisitos Diretos:\s*(.+)$/;
const sectionOf = /^([1-9])\.\s+[A-ZÀ-Ú]/u;
const headingOf = /^\s{0,3}#{1,6}\s+/;
const rootPrerequisites = '3.9, 5.9, 9.11';
const fixedPrerequisites = '3.9, 5.9, 9.9, 9.10';

function clean(line) {
  return line.replace(/^\s*>\s*/,'').replace(/^\s*[-+*]\s+/, '').replace(headingOf, '').trim()
    .replace(/^\*\*(.+?)\*\*(?=\s|:|$)/u, '$1').replace(/^(?:\\)(?=\[)/, '');
}

function requireMatch(line, re, label) {
  const match = line?.text.match(re);
  if (!match) throw new Error(label + ' — linha ' + (line?.number ?? 'EOF') + ': ' + (line?.text ?? ''));
  return match;
}

function assertSequence(actual, expected, label) {
  if (actual.length !== expected.length || !expected.every(id => actual.includes(id))) {
    throw new Error(label + ': ausentes [' + expected.filter(id => !actual.includes(id)).join(', ') +
      ']; recebidos ' + actual.length + ', esperados ' + expected.length);
  }
}

export function parseSpecification(markdown, {expectedTopicIds, expectedSubtopicCount} = {}) {
  const lines = markdown.replace(/^\uFEFF/, '').split(/\r\n|\n|\r/)
    .map((raw, index) => ({raw, text: clean(raw), number: index + 1}))
    .filter(line => line.text && !/^(?:---+|___+|\*\*\*+)$/.test(line.text));
  const sections = new Map();
  let section;
  for (const line of lines) {
    const found = line.text.match(sectionOf);
    if (found && (headingOf.test(line.raw) || !listPrefix.test(line.raw))) {
      section = Number(found[1]);
      if (sections.has(section)) throw new Error('Seção duplicada: ' + section);
      sections.set(section, []);
    } else if (section) sections.get(section).push(line);
  }
  for (const number of [1, 2, 3]) {
    if (!sections.has(number)) throw new Error('Seção ausente: ' + number);
  }

  const tracks = sections.get(1).filter(({text}) => text.startsWith('TRL-')).map(line => {
    const [, id, title, description] = requireMatch(line, /^(TRL-0\d) \((.+?)\):\s*(.+)$/, 'Trilha');
    return {id, title, description, sourceLine: line.number};
  });
  const requirements = sections.get(1).filter(({text}) => /^RN?F-/.test(text)).map(line => {
    const [, id, title, description] = requireMatch(line, /^(RN?F-\d\d) \((.+?)\):\s*(.+)$/, 'Requisito');
    return {id, title, description, sourceLine: line.number};
  });
  assertSequence(tracks.map(t => t.id), Array.from({length: 5}, (_, i) => 'TRL-0' + i), 'Trilhas');
  assertSequence(requirements.map(r => r.id), [
    ...Array.from({length: 7}, (_, i) => 'RF-0' + (i + 1)), 'RNF-01', 'RNF-02', 'RNF-03'
  ], 'Requisitos');

  const books = [];
  let category;
  for (const line of sections.get(2)) {
    const label = line.text.match(/^(2\.\d+)\.\s+(.+)$/);
    if (label) {
      category = {id: label[1], title: label[2]};
      continue;
    }
    const [, id, title, authorsText] = requireMatch(line, /^(BIB-\d\d):\s*(.+?)\s+—\s+(.+)$/, 'Obra');
    if (!category) throw new Error('Obra sem categoria: ' + id);
    books.push({id, title, authorsText, authors: authorsText.split(/,\s+/), category, sourceLine: line.number});
  }
  assertSequence(books.map(b => b.id), Array.from({length: 40}, (_, i) =>
    'BIB-' + String(i + 1).padStart(2, '0')), 'Catálogo bibliográfico');

  const topics = [];
  const levels = [];
  const sanitizations = [];
  let level;
  let body;
  for (const line of sections.get(3)) {
    const levelHeading = line.text.match(/^NÍVEL (\d+):\s*(.+)$/);
    const topicHeading = line.text.match(/^Macrotema (\d+\.\d+):\s*(.+)$/);
    if (levelHeading || topicHeading) {
      if (body) topics.push(parseTopic(body, level, sanitizations));
      if (levelHeading) {
        level = Number(levelHeading[1]);
        levels.push({id: level, title: levelHeading[2], sourceLine: line.number});
      }
      body = topicHeading ? [line] : undefined;
    } else if (body) body.push(line);
    else throw new Error('Taxonomia inesperada, linha ' + line.number + ': ' + line.text);
  }
  if (body) topics.push(parseTopic(body, level, sanitizations));
  assertSequence(levels.map(l => l.id), [1, 2, 3, 4, 5, 6, 7, 8, 9], 'Níveis');
  if (expectedTopicIds) assertSequence(topics.map(t => t.id), expectedTopicIds, 'Macrotemas');
  if (expectedSubtopicCount !== undefined &&
      topics.reduce((n, topic) => n + topic.subtopics.length, 0) !== expectedSubtopicCount) {
    throw new Error('Quantidade de subtemas diverge da revisão da fonte');
  }
  if (!topics.some(t => t.id === '9.11')) throw new Error('Macrotema 9.11 ausente');
  const bookIds = new Set(books.map(book => book.id));
  for (const topic of topics) {
    for (const ref of topic.bibliography) {
      if (!bookIds.has(ref.bookId)) throw new Error(topic.id + ' referencia obra ausente ' + ref.bookId);
    }
  }
  createDag(topics);
  return {tracks, requirements, levels, books, topics, sanitizations};
}

function parseTopic(block, level, sanitizations) {
  const [heading, meta, modes, refs, subsHeader] = block;
  const [, id, title] = requireMatch(heading, /^Macrotema (\d+\.\d+):\s*(.+)$/, 'Macrotema');
  if (Number(id.split('.')[0]) !== level) throw new Error('Nível incorreto: ' + id);
  const [, trackId, complexity, original] = requireMatch(meta, metadata, 'Metadados de ' + id);
  let prerequisiteText = original;
  if (id === '9.11' && original === rootPrerequisites) {
    prerequisiteText = fixedPrerequisites;
    sanitizations.push({topicId: id, sourceLine: meta.number, original, corrected: prerequisiteText});
  }
  if (id === '9.11' && prerequisiteText !== fixedPrerequisites) {
    throw new Error('Pré-requisitos inesperados em 9.11: ' + original);
  }
  const prerequisites = /^Nenhum$/i.test(prerequisiteText) ? [] : prerequisiteText.split(/,\s*/);
  if (prerequisites.some(p => !/^\d+\.\d+$/.test(p))) throw new Error('Pré-requisito inválido: ' + id);

  const [, modeText] = requireMatch(modes, /^Modalidades de Prática:\s*(.+)$/, 'Modalidades de ' + id);
  const modalities = modeText.split(/,\s*/).map(m => m.replace(/\\/g, '').replace(/^\[|\]$/g, ''));
  if (new Set(modalities).size !== modalities.length || modalities.some(m => !MODALITIES.includes(m))) {
    throw new Error('Modalidades inválidas: ' + id);
  }
  const [, refText] = requireMatch(refs, /^Bibliografia e Capítulos:\s*(.+)$/, 'Bibliografia de ' + id);
  const bibliography = refText.split(/;\s*(?=BIB-)/).map((ref, index) => {
    const match = ref.replace(/\\(?=[\[\]])/g, '').match(/^(BIB-\d\d)\s+\[([^\]]+)\]\s+\((.+)\)$/);
    if (!match || !ROLES.includes(match[2])) throw new Error('Vínculo bibliográfico inválido em ' + id + ': ' + ref);
    return {id: id + ':bib:' + (index + 1), bookId: match[1], role: match[2], chapters: match[3],
      sourceLine: refs.number};
  });

  requireMatch(subsHeader, /^Subtemas:$/, 'Subtemas de ' + id);
  const dodIndex = block.findIndex(({text}, index) => index > 4 && /^Critérios de Aceite \(DoD\):$/.test(text));
  if (dodIndex < 6) throw new Error('Subtemas ou DoD ausentes: ' + id);
  const subtopics = block.slice(5, dodIndex).map((line, index) => ({
    id: id + ':sub:' + (index + 1), description: line.text, sourceLine: line.number
  }));
  const criteria = block.slice(dodIndex + 1).map(line => {
    const [, label, description] = requireMatch(line,
      /^(Conceitos\/Teoremas Obrigatórios|Problema-Marco):\s*(.+)$/, 'DoD de ' + id);
    const kind = label === 'Problema-Marco' ? 'capstone' : 'mandatory';
    return {id: id + ':dod:' + kind, kind, description, sourceLine: line.number};
  });
  assertSequence(criteria.map(c => c.kind), ['mandatory', 'capstone'], 'DoD de ' + id);
  return {id, level, trackId, title, complexity: Number(complexity), prerequisites,
    modalities, bibliography, subtopics, criteria, sourceLine: heading.number};
}

