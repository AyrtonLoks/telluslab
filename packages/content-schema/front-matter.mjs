// Parser do subconjunto de YAML aceito no front matter das lições (ADR-003, seção 9.1).
//
// Aceito:
//   chave: escalar
//   chave: [escalar, escalar]          lista curta de escalares
//   chave:                             lista em bloco de escalares
//     - escalar
//   chave:                             lista em bloco de mapas planos
//     - k: escalar
//       k2: escalar
//   chave:                             mapa plano (um nível)
//     k: escalar
//     k2: [escalar, escalar]
//   # comentário de linha inteira
//
// Escalares: "texto" (com \" \\ \n), 'texto' ('' escapa '), true, false, inteiros, decimais
// e texto simples. Qualquer outra construção (âncoras, blocos | e >, aninhamento mais profundo,
// tabulação na indentação) é recusada com o número da linha.

export class FrontMatterError extends Error {
  constructor(message, line) {
    super('linha ' + line + ': ' + message);
    this.line = line;
  }
}

const KEY = /^([A-Za-z][A-Za-z0-9_-]*):(?:\s+(.*)|)$/u;

function scalar(raw, line) {
  const text = raw.trim();
  if (!text.length) throw new FrontMatterError('valor vazio', line);
  if (text.startsWith('"')) {
    if (!/^"(?:[^"\\]|\\.)*"$/u.test(text)) throw new FrontMatterError('texto entre aspas duplas mal fechado', line);
    return text.slice(1, -1).replace(/\\(.)/gu, (_, char) => {
      if (char === 'n') return '\n';
      if (char === '"' || char === '\\') return char;
      throw new FrontMatterError('escape não suportado: \\' + char, line);
    });
  }
  if (text.startsWith("'")) {
    if (!/^'(?:[^']|'')*'$/u.test(text)) throw new FrontMatterError('texto entre aspas simples mal fechado', line);
    return text.slice(1, -1).replace(/''/gu, "'");
  }
  if (/^[&*!|>@`]/u.test(text) || text === '~' || text === 'null') {
    throw new FrontMatterError('construção de YAML não suportada: ' + text, line);
  }
  if (/\s#/u.test(text)) throw new FrontMatterError('comentário no fim da linha não é suportado; use aspas', line);
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (/^-?(?:0|[1-9]\d*)$/u.test(text)) return Number(text);
  if (/^-?(?:0|[1-9]\d*)\.\d+$/u.test(text)) return Number(text);
  if (/^[[{]/u.test(text)) throw new FrontMatterError('lista ou mapa curto inválido aqui: ' + text, line);
  if (/: /u.test(text)) throw new FrontMatterError('use aspas em texto que contém ": "', line);
  return text;
}

function flowList(raw, line) {
  const inner = raw.trim().slice(1, -1).trim();
  if (!inner.length) return [];
  const items = [];
  let current = '';
  let quote = null;
  for (let index = 0; index < inner.length; index += 1) {
    const char = inner[index];
    if (quote) {
      current += char;
      if (char === '\\' && quote === '"') { current += inner[index + 1] ?? ''; index += 1; }
      else if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === ',') {
      items.push(scalar(current, line));
      current = '';
    } else if (char === '[' || char === ']' || char === '{' || char === '}') {
      throw new FrontMatterError('lista curta aninhada não é suportada', line);
    } else current += char;
  }
  if (quote) throw new FrontMatterError('aspas não fechadas na lista', line);
  items.push(scalar(current, line));
  return items;
}

function value(raw, line) {
  const text = raw.trim();
  if (text.startsWith('[')) {
    if (!text.endsWith(']')) throw new FrontMatterError('lista curta mal fechada', line);
    return flowList(text, line);
  }
  return scalar(text, line);
}

// Separa front matter e corpo. Devolve {data, body, bodyLine}, em que bodyLine é a linha
// (base 1) do arquivo onde o corpo começa.
export function splitFrontMatter(text) {
  const lines = text.replace(/^﻿/u, '').split(/\r?\n/u);
  if (lines[0] !== '---') throw new FrontMatterError('o arquivo deve começar com uma linha "---"', 1);
  const end = lines.indexOf('---', 1);
  if (end === -1) throw new FrontMatterError('front matter sem a linha "---" de fechamento', 1);
  return {data:parseFrontMatter(lines.slice(1, end), 2), body:lines.slice(end + 1).join('\n'), bodyLine:end + 2};
}

export function parseFrontMatter(lines, firstLine = 1) {
  const data = {};
  let open = null;
  const finish = () => {
    if (open && open.value === undefined) throw new FrontMatterError('chave sem valor: ' + open.key, open.line);
    open = null;
  };
  lines.forEach((raw, index) => {
    const line = firstLine + index;
    if (/\t/u.test(raw.match(/^\s*/u)[0])) throw new FrontMatterError('use espaços, não tabulação, na indentação', line);
    if (!raw.trim() || /^\s*#/u.test(raw)) return;
    const indent = raw.match(/^ */u)[0].length;
    const text = raw.trim();

    if (indent === 0) {
      finish();
      const match = text.match(KEY);
      if (!match) throw new FrontMatterError('esperado "chave: valor"', line);
      const [, key, rest] = match;
      if (Object.hasOwn(data, key)) throw new FrontMatterError('chave repetida: ' + key, line);
      if (rest !== undefined && rest.trim().length) {
        data[key] = value(rest, line);
      } else {
        open = {key, line, value:undefined, itemIndent:null, mapIndent:null};
      }
      return;
    }

    if (!open) throw new FrontMatterError('linha indentada sem chave aberta acima', line);
    if (text.startsWith('- ') || text === '-') {
      if (open.value !== undefined && !Array.isArray(open.value)) {
        throw new FrontMatterError('mistura de lista e mapa em ' + open.key, line);
      }
      if (open.itemIndent === null) open.itemIndent = indent;
      if (indent !== open.itemIndent) throw new FrontMatterError('indentação inconsistente na lista ' + open.key, line);
      open.value ??= [];
      data[open.key] = open.value;
      const item = text.slice(1).trim();
      const pair = item.match(KEY);
      if (pair && pair[2] !== undefined && !/^["']/u.test(item)) {
        const entry = {[pair[1]]:value(pair[2], line)};
        open.value.push(entry);
        open.mapIndent = indent + 2;
      } else {
        if (open.value.some(existing => typeof existing === 'object' && existing !== null && !Array.isArray(existing))) {
          throw new FrontMatterError('lista mistura mapas e escalares em ' + open.key, line);
        }
        open.value.push(value(item, line));
        open.mapIndent = null;
      }
      return;
    }

    const pair = text.match(KEY);
    if (!pair || pair[2] === undefined) throw new FrontMatterError('esperado "chave: valor" com valor na mesma linha', line);
    if (Array.isArray(open.value)) {
      const last = open.value.at(-1);
      if (open.mapIndent === null || indent !== open.mapIndent || typeof last !== 'object') {
        throw new FrontMatterError('campo fora de um item de lista em ' + open.key, line);
      }
      if (Object.hasOwn(last, pair[1])) throw new FrontMatterError('chave repetida no item: ' + pair[1], line);
      last[pair[1]] = value(pair[2], line);
      return;
    }
    if (open.itemIndent === null) open.itemIndent = indent;
    if (indent !== open.itemIndent) throw new FrontMatterError('indentação inconsistente em ' + open.key, line);
    open.value ??= {};
    data[open.key] = open.value;
    if (Object.hasOwn(open.value, pair[1])) throw new FrontMatterError('chave repetida em ' + open.key + ': ' + pair[1], line);
    open.value[pair[1]] = value(pair[2], line);
  });
  finish();
  return data;
}
