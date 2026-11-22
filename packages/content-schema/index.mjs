// Content Pack v1 (ADR-003): validação de um diretório content/<slug>/ e montagem do pacote
// que o build grava em dist/content/<slug>.json. Só roda em Node (build e testes).
//
// Este módulo confere schema e coerência interna do pack. Conferências contra o catálogo
// (nó e subtema existentes, BIB-* e DIF-* do domínio), KaTeX, Mermaid e execução de gabaritos
// ficam no content:lint (LT08).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parseLesson } from './lesson.mjs';
import { formatPath, validateAgainst } from './validator.mjs';

export { formatPath, validateAgainst, SCHEMAS } from './validator.mjs';
export { parseLesson, parseLessonBody, LESSON_BLOCKS } from './lesson.mjs';
export { parseFrontMatter, splitFrontMatter, FrontMatterError } from './front-matter.mjs';

export const SCHEMA_VERSION = '1.0.0';
export const SLUG_CODES = Object.freeze({
  mathematics:'MATH', programming:'PROG', 'economics-finance':'ECON', physics:'PHYS',
  engineering:'ENG', humanities:'HUM', languages:'LANG', literature:'LIT'
});
const LESSON_FILE = /^licao-(\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u;
const NODE_DIR = /^\d+\.\d+$/u;
const FUNCTIONS = new Set(['sqrt', 'abs', 'min', 'max', 'round']);

const posix = path => path.split(sep).join('/');
const isDir = path => statSync(path).isDirectory();

function readJson(path, report) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
    return JSON.parse(text);
  } catch (error) {
    const position = error.message.match(/position (\d+)/u);
    const line = position && text ? text.slice(0, Number(position[1])).split('\n').length : undefined;
    report({line, message:'JSON inválido: ' + error.message});
    return undefined;
  }
}

// Variáveis citadas em {{nome}}, {{nome.campo}} ou {{nome|2}} dentro de qualquer texto do item.
function templateNames(value, found = new Set()) {
  if (typeof value === 'string') {
    for (const [, name] of value.matchAll(/\{\{\s*([A-Za-z][A-Za-z0-9]*)(?:\.[A-Za-z0-9]+)?(?:\|\d+)?\s*\}\}/gu)) found.add(name);
  } else if (Array.isArray(value)) value.forEach(item => templateNames(item, found));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => templateNames(item, found));
  return found;
}

// Gramática aritmética fechada do ADR-003 (6.2.1): números, nomes, + - * / ^, parênteses,
// vírgula de argumentos e as funções sqrt, abs, min, max, round.
export function expressionProblems(expression, names) {
  const problems = [];
  const tokens = expression.match(/\d+(?:\.\d+)?|[A-Za-z][A-Za-z0-9]*|[-+*/^(),]|\S/gu) ?? [];
  let depth = 0;
  let expectOperand = true;
  tokens.forEach((token, index) => {
    if (/^\d/u.test(token) || /^[A-Za-z]/u.test(token)) {
      if (!expectOperand) problems.push('falta operador antes de ' + token);
      if (/^[A-Za-z]/u.test(token)) {
        if (FUNCTIONS.has(token)) {
          if (tokens[index + 1] !== '(') problems.push('função ' + token + ' sem parênteses');
          return;
        }
        if (!names.has(token)) problems.push('nome não declarado: ' + token);
      }
      expectOperand = false;
    } else if (token === '(') {
      if (!expectOperand) problems.push('falta operador antes de "("');
      depth += 1;
    } else if (token === ')') {
      if (expectOperand) problems.push('expressão incompleta antes de ")"');
      depth -= 1;
      if (depth < 0) problems.push('")" sem "(" correspondente');
    } else if (token === ',') {
      if (expectOperand || depth === 0) problems.push('vírgula fora dos argumentos de uma função');
      expectOperand = true;
    } else if ('+-*/^'.includes(token)) {
      if (expectOperand && token !== '-') problems.push('operador ' + token + ' sem operando à esquerda');
      expectOperand = true;
    } else problems.push('símbolo não permitido: ' + token);
  });
  if (!tokens.length) problems.push('expressão vazia');
  else if (expectOperand) problems.push('expressão termina sem operando');
  if (depth > 0) problems.push('"(" sem ")" correspondente');
  return [...new Set(problems)];
}

function checkExercise(exercise, at, issue, domainCode, localNode, exerciseIds) {
  const err = (path, message) => issue({path:[...at, ...path], message});
  const [, code, node] = exercise.id.match(/^EXE-([A-Z]+)-(\d+\.\d+)-/u);
  if (code !== domainCode || node !== localNode) err(['id'], 'ID ' + exercise.id + ' não pertence ao macrotema ' + localNode + ' de ' + domainCode);
  for (const [index, subtopic] of exercise.targets.subtopics.entries()) {
    if (!subtopic.startsWith(localNode + ':')) err(['targets', 'subtopics', index], 'subtema ' + subtopic + ' é de outro macrotema');
  }
  if (exercise.targets.criterion && !exercise.targets.criterion.startsWith(localNode + ':')) {
    err(['targets', 'criterion'], 'critério ' + exercise.targets.criterion + ' é de outro macrotema');
  }
  if (exercise.targets.criterion && exercise.role !== 'criterion') {
    err(['targets', 'criterion'], 'só exercícios com role "criterion" indicam critério');
  }
  if ((exercise.attemptsValidFrom ?? 1) > exercise.revision) {
    err(['attemptsValidFrom'], 'attemptsValidFrom maior que revision');
  }
  for (const [index, error] of (exercise.commonErrors ?? []).entries()) {
    if (!error.difficulty.startsWith('DIF-' + domainCode + '-')) {
      err(['commonErrors', index, 'difficulty'], 'etiqueta ' + error.difficulty + ' não é do domínio ' + domainCode);
    }
  }

  const params = exercise.params ?? {};
  const declared = new Set(Object.keys(params));
  for (const [name, generator] of Object.entries(params)) {
    if (generator.int && generator.int[0] > generator.int[1]) err(['params', name, 'int'], 'intervalo com mínimo maior que o máximo');
    if (generator.pick) {
      const fields = Object.keys(generator.pick[0]).sort().join(',');
      if (generator.pick.some(item => Object.keys(item).sort().join(',') !== fields)) {
        err(['params', name, 'pick'], 'todos os itens de pick devem ter os mesmos campos');
      }
    }
  }
  for (const [name, expression] of Object.entries(exercise.derived ?? {})) {
    if (declared.has(name)) err(['derived', name], 'nome já usado em params: ' + name);
    for (const problem of expressionProblems(expression, declared)) err(['derived', name], 'expressão inválida: ' + problem);
    declared.add(name);
  }
  const { id, revision, status, attemptsValidFrom, type, role, targets, level, params:_, derived, ...texts } = exercise;
  for (const name of templateNames(texts)) {
    if (!declared.has(name)) err([], 'variável {{' + name + '}} usada sem estar em params ou derived');
  }

  const answer = exercise.answer;
  const ids = list => list.map(item => item.id);
  const duplicates = list => list.filter((item, index) => list.indexOf(item) !== index);
  switch (type) {
    case 'multiple-choice': {
      const options = ids(answer.options);
      for (const dup of new Set(duplicates(options))) err(['answer', 'options'], 'opção repetida: ' + dup);
      for (const [index, correct] of answer.correct.entries()) {
        if (!options.includes(correct)) err(['answer', 'correct', index], 'opção correta inexistente: ' + correct);
      }
      if (answer.correct.length === options.length) err(['answer', 'correct'], 'todas as opções estão marcadas como corretas');
      for (const [index, error] of (exercise.commonErrors ?? []).entries()) {
        if (typeof error.match !== 'string' || !options.includes(error.match)) err(['commonErrors', index, 'match'], 'em múltipla escolha, match é o id de uma opção');
        else if (answer.correct.includes(error.match)) err(['commonErrors', index, 'match'], 'erro comum aponta para uma opção correta');
      }
      break;
    }
    case 'numeric':
      if (typeof answer.value === 'string') {
        for (const problem of expressionProblems(answer.value, declared)) err(['answer', 'value'], 'expressão inválida: ' + problem);
      }
      if (answer.acceptUnits && !answer.unit) err(['answer', 'acceptUnits'], 'acceptUnits exige unit');
      if (answer.unit && answer.acceptUnits && !answer.acceptUnits.includes(answer.unit)) {
        err(['answer', 'acceptUnits'], 'acceptUnits deve incluir a unidade ' + answer.unit);
      }
      for (const [index, error] of (exercise.commonErrors ?? []).entries()) {
        if (typeof error.match?.value === 'string') {
          for (const problem of expressionProblems(error.match.value, declared)) err(['commonErrors', index, 'match', 'value'], 'expressão inválida: ' + problem);
        }
      }
      break;
    case 'ordering': {
      const items = ids(answer.items);
      for (const dup of new Set(duplicates(items))) err(['answer', 'items'], 'item repetido: ' + dup);
      if (answer.order.length !== items.length || answer.order.some(item => !items.includes(item))) {
        err(['answer', 'order'], 'order deve ser uma permutação dos ids de items');
      }
      break;
    }
    case 'cloze': {
      const placeholders = [...exercise.prompt.matchAll(/\[\[([a-z0-9]+)\]\]/gu)].map(match => match[1]);
      for (const dup of new Set(duplicates(placeholders))) err(['prompt'], 'lacuna repetida: [[' + dup + ']]');
      const blanks = Object.keys(answer.blanks);
      for (const name of placeholders) if (!blanks.includes(name)) err(['answer', 'blanks'], 'lacuna [[' + name + ']] sem resposta');
      for (const name of blanks) if (!placeholders.includes(name)) err(['answer', 'blanks', name], 'resposta para lacuna inexistente no prompt');
      break;
    }
    case 'code':
      if (!answer.reference.includes(answer.entrypoint)) err(['answer', 'reference'], 'a solução de referência não define ' + answer.entrypoint);
      break;
    case 'rubric': {
      for (const dup of new Set(duplicates(ids(answer.criteria)))) err(['answer', 'criteria'], 'critério repetido: ' + dup);
      if (answer.minWords && answer.maxWords && answer.minWords > answer.maxWords) err(['answer'], 'minWords maior que maxWords');
      break;
    }
    default:
  }
  if (exerciseIds.has(exercise.id)) err(['id'], 'ID repetido no pack: ' + exercise.id);
  exerciseIds.add(exercise.id);
}

function checkSources(sources, at, issue, registry) {
  for (const [index, source] of sources.entries()) {
    if (source.excerpt && !source.ref.startsWith('FON-')) {
      issue({path:[...at, index, 'excerpt'], message:'trecho de terceiros exige uma fonte FON-* do registro com licença (BIB-* é só consulta)'});
    }
    if (source.ref.startsWith('FON-') && !registry.has(source.ref)) {
      issue({path:[...at, index, 'ref'], message:'fonte ' + source.ref + ' ausente de content/sources/registry.json'});
    }
  }
}

// Lê e valida content/sources/registry.json (opcional).
export function loadSourceRegistry(root) {
  const errors = [];
  const file = join(root, 'sources', 'registry.json');
  const entries = new Map();
  if (!existsSync(file)) return {entries, errors};
  const name = posix(relative(root, file));
  const report = issue => errors.push({file:name, ...issue});
  const data = readJson(file, report);
  if (data === undefined) return {entries, errors};
  const problems = validateAgainst('source.schema.json', data);
  problems.forEach(report);
  if (problems.length) return {entries, errors};
  for (const [index, source] of data.sources.entries()) {
    if (entries.has(source.id)) report({path:['sources', index, 'id'], message:'ID repetido: ' + source.id});
    entries.set(source.id, source);
  }
  return {entries, errors};
}

// Valida content/<slug>/. Devolve {errors, bundle}; bundle é null quando há erro.
// Cada erro: {file, line?, path?, message}, com file relativo à raiz de content/.
export function validateContentPack(dir, {root = join(dir, '..'), registry = new Map()} = {}) {
  const errors = [];
  const name = path => posix(relative(root, path));
  const reporter = file => issue => errors.push({file:name(file), ...issue});
  const slug = dir.split(/[\\/]/u).filter(Boolean).at(-1);
  const packFile = join(dir, 'pack.json');
  if (!existsSync(packFile)) {
    errors.push({file:name(dir), message:'pack.json ausente'});
    return {errors, bundle:null};
  }
  const reportPack = reporter(packFile);
  const pack = readJson(packFile, reportPack);
  if (pack === undefined) return {errors, bundle:null};
  const packProblems = validateAgainst('pack.schema.json', pack);
  packProblems.forEach(reportPack);
  if (packProblems.length) return {errors, bundle:null};
  const code = SLUG_CODES[pack.slug];
  if (pack.slug !== slug) reportPack({path:['slug'], message:'slug ' + pack.slug + ' diferente do diretório ' + slug});
  if (pack.domainId !== 'DOM-' + code) reportPack({path:['domainId'], message:pack.domainId + ' não corresponde ao slug ' + pack.slug + ' (esperado DOM-' + code + ')'});

  const entries = readdirSync(dir).sort();
  const dirs = [];
  for (const entry of entries) {
    if (entry === 'pack.json') continue;
    if (NODE_DIR.test(entry) && isDir(join(dir, entry))) dirs.push(entry);
    else errors.push({file:name(join(dir, entry)), message:'item inesperado; um pack só tem pack.json e diretórios <n.n>/'});
  }
  const listed = pack.nodes.map(node => node.split(':')[1]);
  pack.nodes.forEach((node, index) => {
    if (!node.startsWith(pack.domainId + ':')) reportPack({path:['nodes', index], message:'nó ' + node + ' é de outro domínio'});
    else if (!dirs.includes(node.split(':')[1])) reportPack({path:['nodes', index], message:'nó ' + node + ' listado sem diretório ' + node.split(':')[1] + '/'});
  });
  for (const local of dirs) {
    if (!listed.includes(local)) errors.push({file:name(join(dir, local)), message:'diretório sem entrada em pack.json → nodes'});
  }

  const lessonIds = new Set();
  const exerciseIds = new Set();
  const cardIds = new Set();
  const nodes = {};
  const usedSources = new Set();
  for (const local of dirs) {
    const nodeDir = join(dir, local);
    const nodeId = pack.domainId + ':' + local;
    const lessons = [];
    let exercises = [];
    let cards = [];
    const pendingChecks = [];
    for (const entry of readdirSync(nodeDir).sort()) {
      const file = join(nodeDir, entry);
      const report = reporter(file);
      if (entry === 'figuras' && isDir(file)) continue;
      if (entry === 'exercicios.json') {
        const set = readJson(file, report);
        if (set === undefined) continue;
        const problems = validateAgainst('exercise.schema.json', set);
        problems.forEach(report);
        if (problems.length) continue;
        if (set.node !== nodeId) report({path:['node'], message:'node ' + set.node + ' diferente do diretório (' + nodeId + ')'});
        set.exercises.forEach((exercise, index) => {
          checkExercise(exercise, ['exercises', index], report, code, local, exerciseIds);
          checkSources(exercise.sources, ['exercises', index, 'sources'], report, registry);
          exercise.sources.forEach(source => usedSources.add(source.ref));
        });
        exercises = set.exercises;
        continue;
      }
      if (entry === 'cartoes.json') {
        const set = readJson(file, report);
        if (set === undefined) continue;
        const problems = validateAgainst('card.schema.json', set);
        problems.forEach(report);
        if (problems.length) continue;
        if (set.node !== nodeId) report({path:['node'], message:'node ' + set.node + ' diferente do diretório (' + nodeId + ')'});
        set.cards.forEach((card, index) => {
          const [, cardCode, cardNode] = card.id.match(/^CAR-([A-Z]+)-(\d+\.\d+)-/u);
          if (cardCode !== code || cardNode !== local) report({path:['cards', index, 'id'], message:'ID ' + card.id + ' não pertence ao macrotema ' + local + ' de ' + code});
          if (cardIds.has(card.id)) report({path:['cards', index, 'id'], message:'ID repetido no pack: ' + card.id});
          cardIds.add(card.id);
          checkSources(card.sources, ['cards', index, 'sources'], report, registry);
          card.sources.forEach(source => usedSources.add(source.ref));
          if (card.lesson) pendingChecks.push(() => {
            if (!lessons.some(lesson => lesson.id === card.lesson)) report({path:['cards', index, 'lesson'], message:'lição ' + card.lesson + ' não existe neste macrotema'});
          });
        });
        cards = set.cards;
        continue;
      }
      const lessonName = entry.match(LESSON_FILE);
      if (!lessonName) {
        report({message:'arquivo inesperado; aceitos: licao-NN-<slug>.md, exercicios.json, cartoes.json e figuras/'});
        continue;
      }
      const {meta, body, blocks, problems} = parseLesson(readFileSync(file, 'utf8'));
      problems.forEach(problem => report(problem));
      if (!meta) continue;
      const schemaProblems = validateAgainst('lesson.schema.json', meta).map(problem => ({...problem, message:'front matter: ' + problem.message}));
      schemaProblems.forEach(report);
      if (schemaProblems.length) continue;
      const [, lessonCode, lessonNode, lessonNumber] = meta.id.match(/^LIC-([A-Z]+)-(\d+\.\d+)-(\d{2})$/u);
      if (lessonCode !== code || lessonNode !== local) report({path:['id'], message:'ID ' + meta.id + ' não pertence ao macrotema ' + local + ' de ' + code});
      if (lessonNumber !== lessonName[1]) report({path:['id'], message:'número da lição (' + lessonNumber + ') diferente do nome do arquivo (' + lessonName[1] + ')'});
      if (meta.node !== nodeId) report({path:['node'], message:'node ' + meta.node + ' diferente do diretório (' + nodeId + ')'});
      meta.covers.forEach((subtopic, index) => {
        if (!subtopic.startsWith(local + ':')) report({path:['covers', index], message:'subtema ' + subtopic + ' é de outro macrotema'});
      });
      if (lessonIds.has(meta.id)) report({path:['id'], message:'ID repetido no pack: ' + meta.id});
      lessonIds.add(meta.id);
      checkSources(meta.sources, ['sources'], report, registry);
      meta.sources.forEach(source => usedSources.add(source.ref));
      for (const block of blocks) {
        if (block.name === 'figura' && block.attrs.src) {
          const src = block.attrs.src;
          if (!/^figuras\/[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/u.test(src)) {
            report({line:block.line, message:'figura deve ser figuras/<nome>.svg: ' + src});
          } else if (!existsSync(join(nodeDir, ...src.split('/')))) {
            report({line:block.line, message:'figura inexistente: ' + src});
          }
        }
        if (block.name === 'verificacao' && block.attrs.exercicio) {
          pendingChecks.push(() => {
            const target = exercises.find(exercise => exercise.id === block.attrs.exercicio);
            if (!target) report({line:block.line, message:'verificação aponta para exercício inexistente neste macrotema: ' + block.attrs.exercicio});
            else if (target.role !== 'check') report({line:block.line, message:'verificação rápida exige exercício com role "check": ' + target.id});
          });
        }
      }
      lessons.push({...meta, body});
    }
    pendingChecks.forEach(run => run());
    if (!lessons.length && !exercises.length && !cards.length) {
      errors.push({file:name(nodeDir), message:'macrotema sem lição, exercício ou cartão'});
    }
    nodes[nodeId] = {lessons, exercises, cards};
  }

  if (errors.length) return {errors, bundle:null};
  const sources = [...usedSources].filter(ref => registry.has(ref)).sort().map(ref => registry.get(ref));
  return {errors, bundle:{kind:'TellusContentBundleV1', schemaVersion:SCHEMA_VERSION, domainId:pack.domainId,
    slug:pack.slug, version:pack.version, defaultLicense:pack.defaultLicense, sources, nodes}};
}

// Valida content/ inteiro. Devolve {errors, bundles}; bundles só é preenchido sem erros.
export function loadContentPacks(root) {
  if (!existsSync(root)) return {errors:[], bundles:[]};
  const {entries:registry, errors} = loadSourceRegistry(root);
  const bundles = [];
  for (const entry of readdirSync(root).sort()) {
    const path = join(root, entry);
    if (entry === 'sources' && isDir(path)) continue;
    if (!Object.hasOwn(SLUG_CODES, entry) || !isDir(path)) {
      errors.push({file:entry, message:'item inesperado em content/; aceitos: sources/ e os slugs dos 8 domínios'});
      continue;
    }
    const result = validateContentPack(path, {root, registry});
    errors.push(...result.errors);
    if (result.bundle) bundles.push(result.bundle);
  }
  return {errors, bundles:errors.length ? [] : bundles};
}

// Arquivos que o build grava em dist/: um JSON por domínio, carregado sob demanda, e um índice
// pequeno. Nada disso entra no index.html: o carregamento inicial não muda.
export function contentFiles(root) {
  const {errors, bundles} = loadContentPacks(root);
  if (errors.length) {
    throw new Error('Content Pack inválido:\n' + errors.map(formatError).join('\n'));
  }
  const files = bundles.map(bundle => ({path:'content/' + bundle.slug + '.json', contents:JSON.stringify(bundle) + '\n'}));
  const index = {kind:'TellusContentIndexV1', schemaVersion:SCHEMA_VERSION, packs:bundles.map(bundle => ({
    slug:bundle.slug, domainId:bundle.domainId, version:bundle.version, file:'content/' + bundle.slug + '.json',
    nodes:Object.keys(bundle.nodes)
  }))};
  return [{path:'content/index.json', contents:JSON.stringify(index, null, 2) + '\n'}, ...files];
}

export function formatError({file, line, path, message}) {
  return 'content/' + file + (line ? ':' + line : '') + (path?.length ? ' · ' + formatPath(path) : '') + ' — ' + message;
}
