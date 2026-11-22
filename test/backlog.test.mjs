import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/backlog.mjs', import.meta.url));

function tarefa(id, campos = {}) {
  const valores = {
    Status: 'TODO',
    Responsável: '—',
    Revisor: '—',
    Branch: '—',
    Worktree: '—',
    Prioridade: 'Alta',
    Área: 'Processo',
    Tamanho: 'M',
    'Depende de': '—',
    Grupos: 'G-CORE',
    'Afinidade sugerida': 'Codex',
    ...campos,
  };
  return [
    '### ' + id + ' · Tarefa de exemplo',
    ...Object.entries(valores).map(([nome, valor]) => '- **' + nome + '**: ' + valor),
    '',
    '**Contexto**',
    'Contexto da tarefa.',
    '**O que fazer**',
    'Escopo delimitado.',
    '**Critérios de aceite**',
    '- [ ] Critério verificável.',
    '**Como verificar**',
    'Execute a verificação.',
    '**Log**',
    '- 2026-11-22 · codex · ' + valores.Status + ' · entrada de exemplo',
  ].join('\n');
}

function backlog(...tarefas) {
  return [
    '## 1. Protocolo',
    '### 1.6 Grupos de conflito',
    '| Grupo | Arquivos ou área |',
    '| --- | --- |',
    '| `G-CORE`, `G-BUILD` | Código e infraestrutura |',
    '| `G-DOCS` | Documentação, com referência a G-EXTERNO |',
    '### 1.9 Formato de tarefa',
    '```md',
    '### LT01 · Este exemplo deve ser ignorado',
    '```',
    '## 4. Tarefas',
    '### Horizonte L0 · Fundação',
    ...tarefas,
    '### Fechamento do L1',
    '---',
    '## 7. Log geral',
    '- Registro do backlog fora do Log de tarefa.',
  ].join('\n\n');
}

function consultar(t, texto, comando, ...args) {
  const diretorio = mkdtempSync(join(tmpdir(), 'telluslab-backlog-'));
  t.after(() => rmSync(diretorio, { recursive: true, force: true }));
  const arquivo = join(diretorio, 'Backlog de exemplo.md');
  writeFileSync(arquivo, texto);
  const resultado = spawnSync(process.execPath, [script, comando, '--file', arquivo, ...args], { encoding: 'utf8' });
  assert.ifError(resultado.error);
  return resultado;
}

test('aceita CRLF, grupos da mesma célula e registros de revisão cruzada', t => {
  const texto = backlog(
    tarefa('LT01', { Status: 'DONE', Tamanho: 'GG' }).concat('\n- 2026-11-22 · claude · REVIEW-OK · revisada'),
    tarefa('LT02', { 'Depende de': 'LT01', Grupos: 'G-CORE, G-BUILD' }),
  ).replaceAll('\n', '\r\n');
  const { status, stdout, stderr } = consultar(t, texto, 'lint');
  assert.equal(status, 0, stderr);
  assert.match(stdout, /Backlog válido \(2 tarefas\)/);
});

test('relata erros de formato e referências com suas linhas', t => {
  const texto = backlog(
    tarefa('LT01', { Status: 'PRONTO', Tamanho: 'X' }),
    tarefa('LT01', { Tamanho: 'GG', 'Depende de': 'LD99', Grupos: 'G-EXTERNO' })
      .replace('- **Branch**: —\n', '')
      .replace('**Como verificar**\n', '')
      .replace('2026-11-22 · codex · TODO · entrada de exemplo', '22/11/2026 · codex · TODO'),
    tarefa('LTXX'),
  );
  const { status, stderr } = consultar(t, texto, 'lint');
  assert.equal(status, 1);
  const erros = stderr.trim().split(/\r?\n/);
  const linhas = texto.split('\n');
  for (const [linha, motivo] of [
    ['- **Status**: PRONTO', 'Status inválido'],
    ['- **Tamanho**: X', 'Tamanho inválido'],
    ['### LT01 · Tarefa de exemplo', 'ID duplicado'],
    ['### LT01 · Tarefa de exemplo', 'campo obrigatório ausente: Branch'],
    ['### LT01 · Tarefa de exemplo', 'seção obrigatória ausente: Como verificar'],
    ['- **Tamanho**: GG', 'tarefas TODO não podem ter tamanho GG'],
    ['- **Depende de**: LD99', 'dependência inexistente: LD99'],
    ['- **Grupos**: G-EXTERNO', 'grupo desconhecido: G-EXTERNO'],
    ['- 22/11/2026 · codex · TODO', 'entrada de Log inválida'],
    ['### LTXX · Tarefa de exemplo', 'cabeçalho deve seguir o formato'],
  ]) {
    assert.ok(
      erros.some(erro => erro.includes(':' + (linhas.lastIndexOf(linha) + 1) + ': ') && erro.includes(motivo)),
      'Esperava ' + motivo + ' em ' + linha + '\n' + stderr,
    );
  }
});

test('rejeita WIP duplicado e conflitos de grupo entre tarefas em andamento', t => {
  const texto = backlog(
    tarefa('LT01', { Status: 'IN_PROGRESS', Responsável: 'codex', Grupos: 'G-CORE, G-BUILD' }),
    tarefa('LT02', { Status: 'IN_PROGRESS', Responsável: 'codex', Grupos: 'G-DOCS' }),
    tarefa('LT03', { Status: 'IN_PROGRESS', Responsável: 'claude' }),
  );
  const { status, stderr } = consultar(t, texto, 'lint');
  assert.equal(status, 1);
  assert.match(stderr, /LT02 — limite de WIP de codex excedido \(LT01 e LT02\)/);
  assert.match(stderr, /LT03 — conflito em G-CORE entre LT01 e LT03/);
  const proximo = consultar(t, texto, 'next', '--agent', 'codex');
  assert.equal(proximo.status, 1);
  assert.equal(proximo.stdout, '');
});

test('ordena por prioridade e afinidade e explica dependências e conflitos', t => {
  const texto = backlog(
    tarefa('LT01', { Status: 'REVIEW' }),
    tarefa('LT02', { Status: 'DONE' }),
    tarefa('LT03', { Status: 'BLOCKED', Grupos: 'G-BUILD' }),
    tarefa('LT04', { Status: 'IN_PROGRESS', Responsável: 'claude', Grupos: 'G-DOCS' }),
    tarefa('LT05', { Prioridade: 'Média' }),
    tarefa('LT06', { 'Afinidade sugerida': 'Claude' }),
    tarefa('LT07', { 'Depende de': 'LT01, LT02' }),
    tarefa('LT08', { Grupos: 'G-CORE, G-BUILD, G-DOCS', 'Depende de': 'LT05, LT03' }),
  );
  const { status, stdout, stderr } = consultar(t, texto, 'next', '--agent', 'codex');
  assert.equal(status, 0, stderr);
  const [disponiveis, indisponiveis] = stdout.split('Tarefas indisponíveis');
  assert.deepEqual(disponiveis.match(/LT\d{2}/g), ['LT07', 'LT06', 'LT05']);
  assert.match(indisponiveis, /LT08 .*dependência LT05 em TODO.*dependência LT03 em BLOCKED/);
  assert.match(indisponiveis, /conflito em G-BUILD com LT03 \(BLOCKED\)/);
  assert.match(indisponiveis, /conflito em G-DOCS com LT04 \(IN_PROGRESS\)/);
});

test('impede novas reivindicações enquanto o agente tem uma tarefa em andamento', t => {
  const texto = backlog(
    tarefa('LT01', { Status: 'IN_PROGRESS', Responsável: 'codex', Grupos: 'G-DOCS' }),
    tarefa('LT02'),
  );
  const { status, stdout, stderr } = consultar(t, texto, 'next', '--agent', 'codex');
  assert.equal(status, 0, stderr);
  assert.match(stdout, /Tarefas disponíveis para codex\r?\nNenhuma\./);
  assert.match(stdout, /LT02 .*limite de WIP: LT01 já está IN_PROGRESS com codex/);
});
