import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { contentFiles, expressionProblems, formatError, loadContentPacks, parseFrontMatter, parseLesson,
  validateAgainst } from '../packages/content-schema/index.mjs';

const root = new URL('../', import.meta.url).pathname;
const fixtures = join(root, 'test/fixtures/content');
const adr = readFileSync(join(root, 'docs/adr/ADR-003-content-pack.md'), 'utf8');

// Copia as fixtures para um diretório temporário, aplica a mutação e devolve os erros formatados.
function errorsAfter(mutate) {
  const dir = mkdtempSync(join(tmpdir(), 'content-pack-'));
  try {
    cpSync(fixtures, dir, {recursive:true});
    mutate(dir);
    return loadContentPacks(dir).errors.map(formatError);
  } finally {
    rmSync(dir, {recursive:true, force:true});
  }
}
const editJson = (dir, path, change) => {
  const file = join(dir, path);
  const data = JSON.parse(readFileSync(file, 'utf8'));
  change(data);
  writeFileSync(file, JSON.stringify(data, null, 2));
};
const editText = (dir, path, change) => {
  const file = join(dir, path);
  writeFileSync(file, change(readFileSync(file, 'utf8')));
};
function expectError(errors, file, fragment) {
  assert.ok(errors.some(error => error.startsWith('content/' + file) && error.includes(fragment)),
    'esperado erro em ' + file + ' contendo "' + fragment + '"; recebido:\n' + errors.join('\n'));
}

test('exemplos JSON do ADR-003 validam contra os schemas', () => {
  const blocks = [...adr.matchAll(/```json\n([\s\S]*?)\n```/gu)].map(match => JSON.parse(match[1]));
  const exercises = blocks.filter(block => block.id?.startsWith('EXE-'));
  assert.deepEqual([...new Set(exercises.map(exercise => exercise.type))].sort(),
    ['cloze', 'code', 'expression', 'multiple-choice', 'numeric', 'ordering', 'rubric', 'short-text']);
  for (const exercise of exercises) {
    const node = exercise.id.replace(/^EXE-([A-Z]+)-(\d+\.\d+)-\d+$/u, 'DOM-$1:$2');
    const set = {kind:'TellusExerciseSetV1', schemaVersion:'1.0.0', node, exercises:[exercise]};
    assert.deepEqual(validateAgainst('exercise.schema.json', set), [], exercise.id);
  }
  for (const set of blocks.filter(block => block.kind === 'TellusCardSetV1')) {
    assert.deepEqual(validateAgainst('card.schema.json', set), []);
  }
  const pair = blocks.find(block => block.id === 'CAR-LANG-4.1-001');
  assert.deepEqual(validateAgainst('card.schema.json', {kind:'TellusCardSetV1', schemaVersion:'1.0.0', node:'DOM-LANG:4.1', cards:[pair]}), []);
  assert.deepEqual(validateAgainst('pack.schema.json', blocks.find(block => block.kind === 'TellusContentPackV1')), []);
  for (const source of blocks.filter(block => block.ref)) {
    const card = {...pair, sources:[source]};
    assert.deepEqual(validateAgainst('card.schema.json', {kind:'TellusCardSetV1', schemaVersion:'1.0.0', node:'DOM-LANG:4.1', cards:[card]}), []);
  }
});

test('lição de exemplo do ADR-003 valida e tem os quatro blocos', () => {
  const text = adr.match(/```markdown\n([\s\S]*?)\n```/u)[1];
  const lesson = parseLesson(text);
  assert.deepEqual(lesson.problems, []);
  assert.deepEqual(validateAgainst('lesson.schema.json', lesson.meta), []);
  assert.deepEqual(lesson.blocks.map(block => block.name), ['explicacao', 'exemplo', 'figura', 'verificacao']);
  assert.equal(lesson.blocks[3].attrs.exercicio, 'EXE-MATH-1.1-001');
  assert.deepEqual(lesson.meta.provenance, {authors:['claude'], aiAssisted:true});
});

test('pack de fixtures (exemplos do ADR) monta sem erros, um pacote por domínio', () => {
  const {errors, bundles} = loadContentPacks(fixtures);
  assert.deepEqual(errors.map(formatError), []);
  assert.deepEqual(bundles.map(bundle => bundle.slug), ['humanities', 'languages', 'mathematics', 'physics', 'programming']);
  const math = bundles.find(bundle => bundle.slug === 'mathematics');
  assert.equal(math.kind, 'TellusContentBundleV1');
  assert.equal(math.nodes['DOM-MATH:1.1'].lessons[0].id, 'LIC-MATH-1.1-01');
  assert.match(math.nodes['DOM-MATH:1.1'].lessons[0].body, /^:::explicacao/u);
  assert.equal(math.nodes['DOM-MATH:1.2'].exercises[0].type, 'expression');
});

test('contentFiles gera índice e um arquivo por domínio; sem content/ só o índice vazio', () => {
  const files = contentFiles(fixtures);
  assert.deepEqual(files.map(file => file.path), ['content/index.json', 'content/humanities.json',
    'content/languages.json', 'content/mathematics.json', 'content/physics.json', 'content/programming.json']);
  const index = JSON.parse(files[0].contents);
  assert.equal(index.packs.find(pack => pack.slug === 'languages').nodes.length, 2);
  for (const file of files.slice(1)) assert.equal(JSON.parse(file.contents).kind, 'TellusContentBundleV1');
  const empty = contentFiles(join(fixtures, 'inexistente'));
  assert.deepEqual(JSON.parse(empty[0].contents).packs, []);
  assert.equal(empty.length, 1);
});

test('build grava content/index.json fora do carregamento inicial', () => {
  const dist = join(root, 'dist');
  assert.ok(existsSync(join(dist, 'content/index.json')), 'execute npm test (que roda o build) antes');
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /content\//u);
});

test('schema: tipo de exercício, campos de answer e critério', () => {
  let errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { delete set.exercises[0].answer.tolerance; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'exercises[0].answer — campo obrigatório ausente: tolerance');
  errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].type = 'numerico'; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'exercises[0].type — valor "numerico" fora dos aceitos');
  errors = errorsAfter(dir => editJson(dir, 'mathematics/1.2/exercicios.json', set => { delete set.exercises[0].targets.criterion; }));
  expectError(errors, 'mathematics/1.2/exercicios.json', 'exercises[0].targets — campo obrigatório ausente: criterion');
  errors = errorsAfter(dir => editJson(dir, 'mathematics/1.1/exercicios.json', set => { set.exercises[0].sorte = 1; }));
  expectError(errors, 'mathematics/1.1/exercicios.json', 'campo não permitido: sorte');
  errors = errorsAfter(dir => editJson(dir, 'mathematics/1.1/exercicios.json', set => { set.exercises[0].hints = []; }));
  expectError(errors, 'mathematics/1.1/exercicios.json', 'exercises[0].hints — lista vazia');
});

test('coerência: opções, ordem, lacunas, variáveis e expressões', () => {
  let errors = errorsAfter(dir => editJson(dir, 'mathematics/1.1/exercicios.json', set => { set.exercises[0].answer.correct = ['z']; }));
  expectError(errors, 'mathematics/1.1/exercicios.json', 'opção correta inexistente: z');
  errors = errorsAfter(dir => editJson(dir, 'mathematics/1.1/exercicios.json', set => { set.exercises[0].commonErrors[0].match = 'a'; }));
  expectError(errors, 'mathematics/1.1/exercicios.json', 'erro comum aponta para uma opção correta');
  errors = errorsAfter(dir => editJson(dir, 'programming/1.3/exercicios.json', set => { set.exercises[0].answer.order.pop(); }));
  expectError(errors, 'programming/1.3/exercicios.json', 'order deve ser uma permutação');
  errors = errorsAfter(dir => editJson(dir, 'languages/1.1/exercicios.json', set => { set.exercises[0].prompt += ' [[b3]]'; }));
  expectError(errors, 'languages/1.1/exercicios.json', 'lacuna [[b3]] sem resposta');
  errors = errorsAfter(dir => editJson(dir, 'mathematics/1.2/exercicios.json', set => { set.exercises[0].prompt += ' {{m}}'; }));
  expectError(errors, 'mathematics/1.2/exercicios.json', 'variável {{m}} usada sem estar em params ou derived');
  errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].derived.t = 'sqrt(2 * h / g)'; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'derived.t — expressão inválida: nome não declarado: g');
  errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].commonErrors[0].difficulty = 'DIF-MATH-03'; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'etiqueta DIF-MATH-03 não é do domínio PHYS');
  errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].attemptsValidFrom = 2; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'attemptsValidFrom maior que revision');
});

test('coerência: IDs, diretórios, nós do pack e fontes', () => {
  let errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].id = 'EXE-PHYS-1.3-001'; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'não pertence ao macrotema 1.2');
  errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].targets.subtopics = ['1.3:sub:1']; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'subtema 1.3:sub:1 é de outro macrotema');
  errors = errorsAfter(dir => editJson(dir, 'physics/pack.json', pack => { pack.nodes.push('DOM-PHYS:9.9'); }));
  expectError(errors, 'physics/pack.json', 'nó DOM-PHYS:9.9 listado sem diretório 9.9/');
  errors = errorsAfter(dir => editJson(dir, 'physics/pack.json', pack => { pack.domainId = 'DOM-ENG'; }));
  expectError(errors, 'physics/pack.json', 'não corresponde ao slug physics');
  errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].sources[0].excerpt = true; }));
  expectError(errors, 'physics/1.2/exercicios.json', 'trecho de terceiros exige uma fonte FON-*');
  errors = errorsAfter(dir => editJson(dir, 'physics/1.2/exercicios.json', set => { set.exercises[0].sources.push({ref:'FON-0099', locator:'p. 1', excerpt:true}); }));
  expectError(errors, 'physics/1.2/exercicios.json', 'fonte FON-0099 ausente de content/sources/registry.json');
  errors = errorsAfter(dir => writeFileSync(join(dir, 'physics/1.2/notas.txt'), 'x'));
  expectError(errors, 'physics/1.2/notas.txt', 'arquivo inesperado');
  errors = errorsAfter(dir => editText(dir, 'physics/1.2/exercicios.json', text => text.replace('{', '{,')));
  expectError(errors, 'physics/1.2/exercicios.json', 'JSON inválido');
});

test('lições e cartões: front matter, blocos e referências', () => {
  const lesson = 'mathematics/1.1/licao-01-operacoes-entre-conjuntos.md';
  let errors = errorsAfter(dir => editText(dir, lesson, text => text.replace('review: pending\n', '')));
  expectError(errors, lesson, 'front matter: campo obrigatório ausente: review');
  errors = errorsAfter(dir => editText(dir, lesson, text => text.replace('  - 1.1:sub:3', '\t- 1.1:sub:3')));
  expectError(errors, lesson + ':10', 'use espaços, não tabulação');
  errors = errorsAfter(dir => editText(dir, lesson, text => text.replace(':::exemplo', ':::exercicio')));
  expectError(errors, lesson, 'bloco desconhecido: :::exercicio');
  errors = errorsAfter(dir => editText(dir, lesson, text => text.replace('venn-tres-conjuntos.svg', 'outra.svg')));
  expectError(errors, lesson, 'figura inexistente: figuras/outra.svg');
  errors = errorsAfter(dir => editJson(dir, 'mathematics/1.1/exercicios.json', set => { set.exercises[0].role = 'practice'; }));
  expectError(errors, lesson, 'verificação rápida exige exercício com role "check"');
  errors = errorsAfter(dir => editText(dir, lesson, text => text.replace('id: LIC-MATH-1.1-01', 'id: LIC-MATH-1.1-02')));
  expectError(errors, lesson, 'número da lição (02) diferente do nome do arquivo (01)');
  errors = errorsAfter(dir => editJson(dir, 'languages/4.1/cartoes.json', set => { delete set.cards[0].lesson; }));
  expectError(errors, 'languages/4.1/cartoes.json', 'campo obrigatório ausente: lesson');
  errors = errorsAfter(dir => editJson(dir, 'languages/4.1/cartoes.json', set => { set.cards[0].lesson = 'LIC-LANG-4.1-09'; }));
  expectError(errors, 'languages/4.1/cartoes.json', 'lição LIC-LANG-4.1-09 não existe neste macrotema');
  errors = errorsAfter(dir => editJson(dir, 'languages/4.1/cartoes.json', set => { set.cards[0].directions = ['recognition', 'recognition']; }));
  expectError(errors, 'languages/4.1/cartoes.json', 'item repetido');
});

test('front matter: subconjunto de YAML aceito e construções recusadas', () => {
  assert.deepEqual(parseFrontMatter([
    'titulo: "Aspas: com dois pontos"', "outro: 'it''s'", 'n: 12', 'x: 1.5', 'ok: true',
    'curta: [a, "b, c", 3]', 'lista:', '  - um', '  - dois', 'mapas:', '  - ref: BIB-MATH-01',
    '    locator: Caps. I–III', 'plano:', '  authors: [claude]', '  aiAssisted: false'
  ]), {titulo:'Aspas: com dois pontos', outro:"it's", n:12, x:1.5, ok:true, curta:['a', 'b, c', 3],
    lista:['um', 'dois'], mapas:[{ref:'BIB-MATH-01', locator:'Caps. I–III'}], plano:{authors:['claude'], aiAssisted:false}});
  for (const [lines, fragment] of [
    [['a: |'], 'não suportada'], [['a: &ancora x'], 'não suportada'], [['a: x # nota'], 'comentário no fim'],
    [['a: b: c'], 'use aspas'], [['a:'], 'chave sem valor'], [['a: 1', 'a: 2'], 'chave repetida'],
    [['a:', '  - x', '  b: y'], 'campo fora de um item'], [['a:', '  - x', '    - y'], 'indentação inconsistente']
  ]) {
    assert.throws(() => parseFrontMatter(lines), error => error.message.includes(fragment), lines.join(' | '));
  }
});

test('expressões de derived: gramática fechada', () => {
  const names = new Set(['h', 'n']);
  assert.deepEqual(expressionProblems('sqrt(2 * h / 9.8)', names), []);
  assert.deepEqual(expressionProblems('-n + max(h, 3) ^ 2', names), []);
  assert.deepEqual(expressionProblems('h +', names), ['expressão termina sem operando']);
  assert.deepEqual(expressionProblems('(h', names), ['"(" sem ")" correspondente']);
  assert.ok(expressionProblems('h; n', names).includes('símbolo não permitido: ;'));
  assert.equal(expressionProblems('eval(h)', names)[0], 'nome não declarado: eval');
  assert.deepEqual(expressionProblems('h n', names), ['falta operador antes de n']);
});
