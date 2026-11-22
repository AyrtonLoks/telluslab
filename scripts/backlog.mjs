import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const agentes = ['claude', 'codex', 'antigravity'];
const statusValidos = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'DONE', 'CANCELLED'];
const prioridades = ['Alta', 'Média', 'Baixa'];
const camposObrigatorios = [
  'Status', 'Responsável', 'Revisor', 'Branch', 'Worktree', 'Prioridade',
  'Área', 'Tamanho', 'Depende de', 'Grupos', 'Afinidade sugerida',
];
const secoesObrigatorias = ['Contexto', 'O que fazer', 'Critérios de aceite', 'Como verificar', 'Log'];
const semValor = '—';

function linhasMarkdown(texto) {
  let cerca;
  return texto.split(/\r?\n/).map((linha, indice) => {
    const marcador = linha.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    const dentroDaCerca = Boolean(cerca);
    if (marcador && !cerca) {
      cerca = marcador[1];
    } else if (marcador && marcador[1][0] === cerca[0] && marcador[1].length >= cerca.length
        && !marcador[2].trim()) {
      cerca = undefined;
    }
    return { texto: linha.trim(), numero: indice + 1, codigo: Boolean(marcador) || dentroDaCerca };
  });
}

function lerBacklog(texto) {
  const grupos = new Set();
  const tarefas = [];
  let tabelaDeGrupos = false;
  let tarefa;

  for (const linha of linhasMarkdown(texto)) {
    if (linha.codigo) continue;

    if (/^#{1,3}\s/.test(linha.texto)) {
      tabelaDeGrupos = /^### 1\.6(?:\s|$)/.test(linha.texto);
      tarefa = undefined;
      if (/^### L[A-Z](?:\d|\S*\s+·)/.test(linha.texto)) {
        tarefa = { cabecalho: linha, campos: new Map(), secoes: new Map(), secoesDuplicadas: [] };
        tarefas.push(tarefa);
      }
      continue;
    }

    if (tabelaDeGrupos) {
      const primeiraColuna = linha.texto.match(/^\|\s*([^|]+)\|/);
      for (const grupo of primeiraColuna?.[1].match(/\bG-[A-Z0-9]+(?:-[A-Z0-9]+)*\b/g) ?? []) {
        grupos.add(grupo);
      }
    }

    if (!tarefa || !linha.texto || /^-{3,}$/.test(linha.texto)) continue;
    const secao = linha.texto.match(/^\*\*(.+)\*\*$/)?.[1];
    if (secoesObrigatorias.includes(secao)) {
      tarefa.secaoAtual = secao;
      if (tarefa.secoes.has(secao)) tarefa.secoesDuplicadas.push({ linha, secao });
      else tarefa.secoes.set(secao, { cabecalho: linha, linhas: [] });
    } else if (tarefa.secaoAtual) {
      tarefa.secoes.get(tarefa.secaoAtual).linhas.push(linha);
    } else {
      const campo = linha.texto.match(/^-\s+\*\*(.+?)\*\*:\s*(.*)$/);
      if (campo) {
        if (!tarefa.campos.has(campo[1])) tarefa.campos.set(campo[1], []);
        tarefa.campos.get(campo[1]).push({ valor: campo[2], numero: linha.numero });
      }
    }
  }
  return { grupos, tarefas };
}

function lista(valor) {
  return !valor || valor === semValor ? [] : valor.split(',').map(item => item.trim());
}

function validarBacklog(texto) {
  const { grupos, tarefas } = lerBacklog(texto);
  const erros = [];
  const porId = new Map();
  const porAgente = new Map();
  const emAndamentoPorGrupo = new Map();
  const erro = (numero, motivo) => erros.push({ numero, motivo });

  if (!grupos.size) erro(1, 'nenhum grupo declarado na seção 1.6');
  if (!tarefas.length) erro(1, 'nenhuma tarefa encontrada');

  for (const tarefa of tarefas) {
    const { cabecalho, campos, secoes } = tarefa;
    const titulo = cabecalho.texto.match(/^### (L[CTD]\d{2}) · (.+)$/);
    tarefa.id = titulo?.[1] ?? cabecalho.texto.slice(4);
    tarefa.titulo = titulo?.[2];
    const id = tarefa.id;
    const erroNaTarefa = motivo => erro(cabecalho.numero, id + ' — ' + motivo);
    const erroNoCampo = (nome, motivo) =>
      erro(campos.get(nome)[0].numero, id + ' — ' + motivo);
    const valor = nome => campos.get(nome)?.[0].valor;

    if (!titulo) erroNaTarefa('cabeçalho deve seguir o formato ### <ID> · <título>');
    else if (porId.has(id)) erroNaTarefa('ID duplicado (primeira ocorrência na linha ' + porId.get(id).cabecalho.numero + ')');
    else porId.set(id, tarefa);

    for (const nome of camposObrigatorios) {
      const entradas = campos.get(nome);
      if (!entradas) {
        erroNaTarefa('campo obrigatório ausente: ' + nome);
        continue;
      }
      for (const [indice, entrada] of entradas.entries()) {
        if (indice) erro(entrada.numero, id + ' — campo duplicado: ' + nome);
        if (!entrada.valor) erro(entrada.numero, id + ' — campo vazio: ' + nome);
      }
    }

    for (const nome of secoesObrigatorias) {
      const secao = secoes.get(nome);
      if (!secao) erroNaTarefa('seção obrigatória ausente: ' + nome);
      else if (!secao.linhas.length && nome === 'Log') {
        erro(secao.cabecalho.numero, id + ' — Log sem entradas');
      }
    }
    for (const { linha, secao } of tarefa.secoesDuplicadas) {
      erro(linha.numero, id + ' — seção duplicada: ' + secao);
    }

    for (const linha of secoes.get('Log')?.linhas ?? []) {
      if (!/^-\s+\d{4}-\d{2}-\d{2} · [^\s·]+ · (?:TODO|IN_PROGRESS|BLOCKED|REVIEW(?:-OK|-AJUSTE)?|DONE|CANCELLED) · \S/.test(linha.texto)) {
        erro(linha.numero, id + ' — entrada de Log inválida (esperado AAAA-MM-DD · responsável · status · nota)');
      }
    }

    for (const [nome, validos] of [
      ['Status', statusValidos], ['Tamanho', ['P', 'M', 'G', 'GG']], ['Prioridade', prioridades],
    ]) {
      if (valor(nome) && !validos.includes(valor(nome))) {
        erroNoCampo(nome, nome + ' inválido: ' + valor(nome));
      }
    }
    tarefa.status = valor('Status');
    tarefa.prioridade = valor('Prioridade');
    tarefa.afinidade = valor('Afinidade sugerida')?.toLowerCase();
    tarefa.dependencias = lista(valor('Depende de'));
    tarefa.grupos = new Set(lista(valor('Grupos')));
    if (tarefa.status === 'TODO' && valor('Tamanho') === 'GG') {
      erroNoCampo('Tamanho', 'tarefas TODO não podem ter tamanho GG');
    }
    for (const grupo of tarefa.grupos) {
      if (!grupos.has(grupo)) erroNoCampo('Grupos', 'grupo desconhecido: ' + (grupo || '(vazio)'));
    }

    if (tarefa.status !== 'IN_PROGRESS') continue;
    tarefa.responsavel = valor('Responsável')?.toLowerCase();
    if (tarefa.responsavel === semValor) {
      erroNoCampo('Responsável', 'tarefa IN_PROGRESS precisa de um responsável');
    } else if (tarefa.responsavel) {
      const anterior = porAgente.get(tarefa.responsavel);
      if (anterior) erroNoCampo('Responsável', 'limite de WIP de ' + tarefa.responsavel + ' excedido (' + anterior.id + ' e ' + id + ')');
      else porAgente.set(tarefa.responsavel, tarefa);
    }
    for (const grupo of tarefa.grupos) {
      if (!grupos.has(grupo)) continue;
      const anteriores = emAndamentoPorGrupo.get(grupo) ?? [];
      for (const anterior of anteriores) {
        erroNoCampo('Grupos', 'conflito em ' + grupo + ' entre ' + anterior.id + ' e ' + id + ' (ambas IN_PROGRESS)');
      }
      anteriores.push(tarefa);
      emAndamentoPorGrupo.set(grupo, anteriores);
    }
  }

  for (const tarefa of tarefas) {
    for (const id of tarefa.dependencias) {
      const linha = tarefa.campos.get('Depende de')[0].numero;
      if (!porId.has(id)) erro(linha, tarefa.id + ' — dependência inexistente: ' + (id || '(vazia)'));
      else if (id === tarefa.id) erro(linha, tarefa.id + ' — dependência da própria tarefa');
    }
  }
  erros.sort((a, b) => a.numero - b.numero);
  return { tarefas, porId, porAgente, erros };
}

function listarTarefas({ tarefas, porId, porAgente }, agente) {
  const disponiveis = [];
  const indisponiveis = [];
  const wip = porAgente.get(agente);
  const ativas = tarefas.filter(tarefa => ['IN_PROGRESS', 'BLOCKED'].includes(tarefa.status));

  for (const tarefa of tarefas) {
    const motivos = [];
    if (tarefa.status !== 'TODO') {
      motivos.push('status ' + tarefa.status);
    } else {
      if (wip) motivos.push('limite de WIP: ' + wip.id + ' já está IN_PROGRESS com ' + agente);
      for (const id of tarefa.dependencias) {
        const { status } = porId.get(id);
        if (!['REVIEW', 'DONE'].includes(status)) motivos.push('dependência ' + id + ' em ' + status);
      }
      for (const ativa of ativas) {
        const gruposEmComum = [...tarefa.grupos].filter(grupo => ativa.grupos.has(grupo));
        if (gruposEmComum.length) {
          motivos.push('conflito em ' + gruposEmComum.join(', ') + ' com ' + ativa.id + ' (' + ativa.status + ')');
        }
      }
    }
    if (motivos.length) indisponiveis.push({ tarefa, motivos });
    else disponiveis.push(tarefa);
  }

  disponiveis.sort((a, b) =>
    prioridades.indexOf(a.prioridade) - prioridades.indexOf(b.prioridade)
    || Number(b.afinidade === agente) - Number(a.afinidade === agente));

  console.log('Tarefas disponíveis para ' + agente);
  if (!disponiveis.length) console.log('Nenhuma.');
  for (const tarefa of disponiveis) {
    console.log('- ' + tarefa.id + ' · ' + tarefa.titulo + ' (' + tarefa.prioridade + ')');
  }

  if (indisponiveis.length) {
    console.log('\nTarefas indisponíveis');
    for (const { tarefa, motivos } of indisponiveis) {
      console.log('- ' + tarefa.id + ' · ' + tarefa.titulo + ' — ' + motivos.join('; '));
    }
  }
}

function executar([comando, ...args]) {
  if (!['lint', 'next'].includes(comando)) throw new Error('comando esperado: lint ou next');
  const options = { file: { type: 'string' } };
  if (comando === 'next') options.agent = { type: 'string' };
  const { values } = parseArgs({ args, options });
  const agente = values.agent?.toLowerCase();
  if (comando === 'next' && !agentes.includes(agente)) {
    throw new Error('informe --agent claude, codex ou antigravity');
  }

  const fonte = values.file ?? 'origin/main:docs/BACKLOG.md';
  const texto = values.file === undefined
    ? execFileSync('git', ['show', fonte], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    : readFileSync(fonte, 'utf8');
  const backlog = validarBacklog(texto);
  if (backlog.erros.length) {
    for (const { numero, motivo } of backlog.erros) console.error(fonte + ':' + numero + ': ' + motivo);
    process.exitCode = 1;
  } else if (comando === 'next') {
    listarTarefas(backlog, agente);
  } else {
    console.log('Backlog válido (' + backlog.tarefas.length + ' tarefas).');
  }
}

try {
  executar(process.argv.slice(2));
} catch (erro) {
  console.error('Erro ao consultar o backlog: ' + erro.message);
  process.exitCode = 1;
}
