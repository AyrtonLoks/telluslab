import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { Script } from 'node:vm';
import katex from 'katex';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';
import { formatPath, loadContentPacks, splitFrontMatter } from '../packages/content-schema/index.mjs';
import { bridgeCatalog } from './bridge-catalog.mjs';
import { loadCatalogs } from './catalogs.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const markdownTokens = /^ {0,3}(\x60{3,}|~{3,})([^\n]*)\n|(\x60+)[^\n]*?\3(?!\x60)|(?<!\\)\$\$([\s\S]+?)(?<!\\)\$\$|(?<![\\$])\$([^$\n]+?)(?<!\\)\$(?!\$)|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/gmu;
const verificadoresPendentes = new Map([['numeric', 'LT10'], ['expression', 'LT11'], ['code', 'LD04']]);
const lineAt = (text, offset) => text.slice(0, offset).split('\n').length;

function lerLocalizadores(root) {
  const documentos = new Map();
  return file => {
    if (documentos.has(file)) return documentos.get(file);
    const path = join(root, file);
    const text = existsSync(path) && statSync(path).isFile() ? readFileSync(path, 'utf8') : '';
    const tree = file.endsWith('.json') ? parseTree(text) : undefined;
    const lines = text.split(/\r?\n/u);
    const fimMetadados = lines.indexOf('---', 1);
    const doc = {
      text,
      line(path = []) {
        if (tree) {
          for (let length = path.length; length > 0; length--) {
            const node = findNodeAtLocation(tree, path.slice(0, length));
            if (node) return lineAt(text, node.offset);
          }
        }
        if (fimMetadados > 0 && path.length) {
          const chave = lines.findIndex((line, index) => index > 0 && index < fimMetadados && line.startsWith(path[0] + ':'));
          if (chave !== -1) return chave + 1;
        }
        return 1;
      }
    };
    documentos.set(file, doc);
    return doc;
  };
}

async function criarParserMermaid() {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('', {runScripts:'outside-only'});
  const { window } = dom;
  try {
    // O bundle distribuído ao Lab já reúne as dependências e espera uma DOM para sanitizar rótulos.
    const arquivo = join(require.resolve('mermaid/package.json'), '..', 'dist', 'mermaid.min.js');
    const script = new Script(readFileSync(arquivo, 'utf8'), {filename:arquivo});
    script.runInContext(dom.getInternalVMContext());
    const api = window.mermaid;
    api.initialize({startOnLoad:false, securityLevel:'strict'});
    return { parse: texto => api.parse(texto), close: () => window.close() };
  } catch (error) {
    window.close();
    throw error;
  }
}

export async function verificarConteudo(root, domains) {
  const documento = lerLocalizadores(root);
  const { errors, bundles } = loadContentPacks(root);
  const issues = errors.map(issue => ({level:'erro', ...issue, line:issue.line ?? documento(issue.file).line(issue.path)}));
  const coverage = [];
  if (errors.length) return {issues, coverage};
  let mermaid;

  function verificarLatex(tex, displayMode, report, line, path) {
    try {
      katex.renderToString(tex.replace(/\{\{\s*[\w.]+(?:\|\d+)?\s*\}\}/gu, '1'),
        {displayMode, throwOnError:true, trust:false, strict:'ignore', maxExpand:500, maxSize:25});
    } catch (error) {
      report({line, path, message:'LaTeX inválido: ' + error.message});
    }
  }

  async function verificarMarkdown(text, report, path, firstLine, markdown = false) {
    const tokens = new RegExp(markdownTokens);
    for (let token = tokens.exec(text); token; token = tokens.exec(text)) {
      const [, fence, info, inlineCode, display, inline, parens, brackets] = token;
      const line = firstLine + lineAt(text, token.index) - 1;
      if (fence) {
        const start = tokens.lastIndex;
        const ending = new RegExp('^ {0,3}' + fence[0] + '{' + fence.length + ',}[ \\t]*(?:\\n|$)', 'gmu');
        ending.lastIndex = start;
        const end = ending.exec(text);
        tokens.lastIndex = end ? ending.lastIndex : text.length;
        if (info.trim().split(/\s+/u)[0] === 'mermaid') {
          if (!end) {
            report({line, path, message:'bloco Mermaid sem fechamento'});
            continue;
          }
          mermaid ??= await criarParserMermaid();
          try {
            const diagram = text.slice(start, end.index);
            if (!diagram.trim()) throw new Error('diagrama vazio');
            await mermaid.parse(diagram);
          } catch (error) {
            report({line, path, message:'Mermaid inválido: ' + error.message});
          }
        }
        continue;
      }
      if (inlineCode) continue;
      const tex = display ?? inline ?? parens ?? brackets;
      verificarLatex(tex, display !== undefined || brackets !== undefined, report, markdown ? line : undefined, path);
    }
  }

  async function verificarTextos(value, path, report, skip = () => false) {
    if (skip(path)) return;
    if (typeof value === 'string') {
      await verificarMarkdown(value, report, path, 1);
    } else if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        await verificarTextos(value[key], [...path, Array.isArray(value) ? Number(key) : key], report, skip);
      }
    }
  }

  function conferirItem(item, path, report, livros) {
    if (item.review === 'pending') report({path:[...path, 'review'], level:'aviso', message:item.id + ' aguarda revisão humana'});
    for (const [index, {ref}] of (item.sources ?? []).entries()) {
      if (ref.startsWith('BIB-') && !livros.has(ref)) {
        report({path:[...path, 'sources', index, 'ref'], message:'referência bibliográfica inexistente neste domínio: ' + ref});
      }
    }
  }

  const reportar = file => ({level = 'erro', line, path, message}) => {
    issues.push({file, level, line:line ?? documento(file).line(path), path, message});
  };
  const porDominio = new Map(bundles.map(bundle => [bundle.domainId, bundle.nodes]));
  try {
    for (const domain of domains) {
      const nodes = porDominio.get(domain.id) ?? {};
      const macrotemas = new Set(domain.nodes.map(node => node.id));
      const livros = new Set(domain.books.map(book => book.id));
      const counts = {slug:domain.slug, total:macrotemas.size, lessons:0, exercises:0, cards:0};
      const packFile = domain.slug + '/pack.json';
      const manifest = porDominio.has(domain.id) ? JSON.parse(documento(packFile).text) : null;
      for (const [node, {lessons, exercises, cards}] of Object.entries(nodes)) {
        if (!macrotemas.has(node)) {
          reportar(packFile)({path:['nodes', manifest.nodes.indexOf(node)], message:'macrotema inexistente no catálogo: ' + node});
        } else {
          counts.lessons += Number(lessons.length > 0);
          counts.exercises += Number(exercises.length > 0);
          counts.cards += Number(cards.length > 0);
        }
        const dir = domain.slug + '/' + node.split(':')[1];
        for (const file of readdirSync(join(root, dir)).filter(file => file.endsWith('.md')).sort()) {
          const path = dir + '/' + file;
          const { data, body, bodyLine } = splitFrontMatter(documento(path).text.replace(/\r\n/gu, '\n'));
          const report = reportar(path);
          conferirItem(data, [], report, livros);
          await verificarTextos(data, [], report);
          await verificarMarkdown(body, report, [], bodyLine, true);
        }
        const reportExercise = reportar(dir + '/exercicios.json');
        for (const [index, exercise] of exercises.entries()) {
          const path = ['exercises', index];
          conferirItem(exercise, path, reportExercise, livros);
          await verificarTextos(exercise, path, reportExercise, field => exercise.type === 'code' && field[2] === 'answer');
          if (exercise.type === 'expression') {
            verificarLatex(exercise.answer.expected, false, reportExercise, undefined, [...path, 'answer', 'expected']);
            for (const [i, {match}] of (exercise.commonErrors ?? []).entries()) {
              if (typeof match === 'string') verificarLatex(match, false, reportExercise, undefined, [...path, 'commonErrors', i, 'match']);
            }
          }
          if (verificadoresPendentes.has(exercise.type)) {
            reportExercise({path:[...path, 'answer'], level:'aviso',
              message:exercise.id + ' está com gabarito sem conferência automática; verificador pendente em ' + verificadoresPendentes.get(exercise.type)});
          }
        }
        const reportCard = reportar(dir + '/cartoes.json');
        for (const [index, card] of cards.entries()) {
          const path = ['cards', index];
          conferirItem(card, path, reportCard, livros);
          await verificarTextos(card, path, reportCard);
        }
      }
      coverage.push(counts);
    }
  } finally {
    mermaid?.close();
  }
  return {issues, coverage};
}

async function main() {
  const { values } = parseArgs({options:{root:{type:'string'}, coverage:{type:'boolean'}}});
  const root = values.root ? resolve(values.root) : join(repo, 'content');
  if (values.root && (!existsSync(root) || !statSync(root).isDirectory())) throw new Error('diretório de conteúdo inexistente: ' + root);
  const { registry } = bridgeCatalog(loadCatalogs());
  const { issues, coverage } = await verificarConteudo(root, registry.domains);
  const base = relative(process.cwd(), root).split(sep).join('/');
  for (const {file, line, path, message, level} of issues) {
    const field = path?.length ? ' · ' + formatPath(path) : '';
    console.error(base + '/' + file + ':' + line + ' · ' + level + field + ' — ' + message.replace(/\s*\n\s*/gu, ' '));
  }
  const erros = issues.filter(issue => issue.level === 'erro').length;
  if (erros) process.exitCode = 1;
  else if (values.coverage) {
    console.log('Domínio | Macrotemas | Com lição | Com exercícios | Com cartões');
    for (const {slug, total, lessons, exercises, cards} of coverage) {
      console.log([slug, total, lessons, exercises, cards].join(' | '));
    }
  } else console.log('Content Packs: 0 erro(s), ' + issues.length + ' aviso(s).');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
