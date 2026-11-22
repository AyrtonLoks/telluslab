import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { bridgeCatalog } from '../scripts/bridge-catalog.mjs';
import { loadCatalogs } from '../scripts/catalogs.mjs';
import { verificarConteudo } from '../scripts/content-lint.mjs';

const fixtures = new URL('./fixtures/content/', import.meta.url);
const { domains } = bridgeCatalog(loadCatalogs()).registry;
const math = 'mathematics/1.1';
const licao = math + '/licao-01-operacoes-entre-conjuntos.md';
const exercicios = math + '/exercicios.json';
const registry = 'sources/registry.json';
const fence = '\x60'.repeat(3);

function copiar(t) {
  const root = mkdtempSync(join(tmpdir(), 'telluslab-lt08-'));
  t.after(() => rmSync(root, {recursive:true, force:true}));
  cpSync(fixtures, root, {recursive:true});
  return root;
}

function editar(root, file, transformar) {
  const absolute = join(root, file);
  writeFileSync(absolute, transformar(readFileSync(absolute, 'utf8')), 'utf8');
}

function editarJson(root, file, alterar) {
  editar(root, file, text => {
    const data = JSON.parse(text);
    alterar(data);
    return JSON.stringify(data, null, 2) + '\n';
  });
}

function esperar(issues, file, motivo, level = 'erro') {
  const issue = issues.find(item => item.file === file && item.level === level && motivo.test(item.message));
  assert.ok(issue, JSON.stringify(issues, null, 2));
  assert.ok(Number.isInteger(issue.line) && issue.line > 1);
  return issue;
}

test('aceita exemplos do ADR e conta macrotemas por domínio e tipo de material', async t => {
  const root = copiar(t);
  const {issues, coverage} = await verificarConteudo(root, domains);
  assert.ok(issues.length > 0);
  assert.ok(issues.every(item => item.level === 'aviso'));
  esperar(issues, licao, /aguarda revisão humana/u, 'aviso');
  for (const tarefa of ['LT10', 'LT11', 'LD04']) {
    assert.equal(issues.filter(item => item.message.includes('verificador pendente em ' + tarefa)).length, 1);
  }
  assert.deepEqual(coverage.find(item => item.slug === 'mathematics'), {
    slug:'mathematics', total:88, lessons:1, exercises:2, cards:1
  });
  assert.deepEqual(coverage.find(item => item.slug === 'literature'), {
    slug:'literature', total:16, lessons:0, exercises:0, cards:0
  });
  editar(root, licao, text => text.replace(/^review: pending/mu, 'review: ok').replace(/^  aiAssisted: true/mu, '  aiAssisted: false'));
  const revisado = await verificarConteudo(root, domains);
  assert.ok(!revisado.issues.some(item => item.file === licao));
});

test('informa linha para schema inválido e IDs repetidos', async t => {
  const root = copiar(t);
  editarJson(root, exercicios, data => {
    data.exercises.push(data.exercises[0]);
  });
  const duplicado = await verificarConteudo(root, domains);
  esperar(duplicado.issues, exercicios, /ID repetido/u);
  editarJson(root, exercicios, data => {
    data.exercises.pop();
    data.exercises[0].revision = 0;
  });
  const invalido = await verificarConteudo(root, domains);
  const issue = esperar(invalido.issues, exercicios, /mínimo|menor/u);
  assert.deepEqual(issue.path, ['exercises', 0, 'revision']);
});

test('exige macrotema no catálogo e confere BIB e licenças do registro', async t => {
  const root = copiar(t);
  renameSync(join(root, 'programming/1.3'), join(root, 'programming/99.1'));
  editar(root, 'programming/pack.json', text => text.replace('DOM-PROG:1.3', 'DOM-PROG:99.1'));
  editar(root, 'programming/99.1/exercicios.json', text => text.replaceAll('1.3', '99.1'));
  editarJson(root, exercicios, data => {
    data.exercises[0].sources[0].ref = 'BIB-MATH-99';
  });
  const referencias = await verificarConteudo(root, domains);
  esperar(referencias.issues, 'programming/pack.json', /macrotema inexistente.*DOM-PROG:99\.1/u);
  esperar(referencias.issues, exercicios, /referência bibliográfica inexistente.*BIB-MATH-99/u);
  editarJson(root, registry, data => {
    delete data.sources[0].license;
  });
  const semLicenca = await verificarConteudo(root, domains);
  esperar(semLicenca.issues, registry, /license/u);
});

test('usa KaTeX e Mermaid e ignora fórmulas em blocos de código', async t => {
  const root = copiar(t);
  const formulas = '$x^2$ ' + '\x60' + '$\\inexistente$' + '\x60';
  const codigo = fence + 'js\nconst texto = "$\\inexistente$";\n' + fence;
  const diagram = fence + 'mermaid\nflowchart LR\nA --> B\n' + fence;
  editar(root, licao, text => text + '\n' + [formulas, codigo, diagram].join('\n\n') + '\n');
  const valido = await verificarConteudo(root, domains);
  assert.ok(valido.issues.every(item => item.level === 'aviso'), JSON.stringify(valido.issues));
  editar(root, licao, text => text.replace('$x^2$', '$\\inexistente$').replace('A --> B', 'A --> ['));
  const invalido = await verificarConteudo(root, domains);
  const formula = esperar(invalido.issues, licao, /LaTeX inválido/u);
  const mermaid = esperar(invalido.issues, licao, /Mermaid inválido/u);
  assert.ok(formula.line < mermaid.line);
  assert.equal(invalido.issues.filter(item => item.level === 'erro').length, 2);
});
