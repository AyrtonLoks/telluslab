import katex from 'katex';

const paths = {
  home:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  graph:'<circle cx="5" cy="12" r="2.5"/><circle cx="18" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m7.4 10.8 8.3-4.5m-8.3 6.9 8.3 4.5"/>',
  book:'<path d="M4 19V5a2 2 0 0 1 2-2h13v17H6a2 2 0 1 1 0-4h13M8 7h7m-7 4h7"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h1m6 0h1"/>',
  practice:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M9 2h6m-3 3v3m0 5 3-2"/>',
  history:'<path d="M3 4v16h18M7 16l4-5 4 2 5-7"/><circle cx="20" cy="6" r="1"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-8 9 8 5 8-5m-16 4 8 5 8-5"/>',
  settings:'<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="2.5" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="2.5" fill="currentColor" stroke="none"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', check:'<path d="m5 12 4 4L19 6"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
  repeat:'<path d="M4 9a7 7 0 0 1 13-3l2 3m0-5v5h-5M20 15a7 7 0 0 1-13 3l-2-3m0 5v-5h5"/>',
  left:'<path d="m15 6-6 6 6 6"/>', right:'<path d="m9 6 6 6-6 6"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>', menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
  upload:'<path d="M12 15V3m-4 4 4-4 4 4M4 16v4h16v-4"/>',
  external:'<path d="M13 4h7v7m0-7-9 9M9 6H5v13h13v-4"/>',
  play:'<path d="m7 4 13 8-13 8z"/>', pause:'<path d="M9 5v14m6-14v14"/>',
  bulb:'<path d="M9 18h6m-5 3h4M8 15a6 6 0 1 1 8 0l-1 1H9z"/>',
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>'
};
export const icon = (name, extra = '') => '<svg class="icon '+extra+'" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+(paths[name] ?? '')+'</svg>';
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
export const math = text => '<div class="math-copy" data-math="'+esc(text)+'"></div>';
export const draftMarkup = (text, format) => format === 'code'
  ? '<div class="math-copy" data-code="'+esc(text)+'"></div>' : math(text);

const vendors = new Map();
function loadVendor(name, path) {
  if (!vendors.has(name)) vendors.set(name, new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(path, import.meta.url);
    script.onload = () => resolve(globalThis[name]);
    script.onerror = () => reject(new Error('Falha ao carregar ' + name));
    document.head.append(script);
  }));
  return vendors.get(name);
}

let diagramSequence = 0;
let diagrams;
function mermaidApi() {
  diagrams ??= loadVendor('mermaid', './vendor/mermaid/mermaid.min.js').then(api => {
    api.initialize({startOnLoad:false, securityLevel:'strict', htmlLabels:false, suppressErrorRendering:true});
    return api;
  });
  return diagrams;
}

async function paintDiagram(pre, source, language) {
  const format = language === 'svg' ? 'SVG' : 'Mermaid';
  try {
    let svg = source;
    if (language === 'mermaid') {
      const api = await mermaidApi();
      if (!pre.isConnected) return;
      ({svg} = await api.render('tellus-diagram-' + ++diagramSequence, source));
    }
    if (!pre.isConnected) return;
    const image = document.createElement('img');
    image.className = 'technical-diagram';
    image.alt = 'Diagrama ' + format;
    // Render SVG as an image so document markup stays outside the page DOM.
    const url = URL.createObjectURL(new Blob([svg], {type:'image/svg+xml'}));
    image.src = url;
    try {
      await image.decode();
      if (!pre.isConnected) return;
      pre.before(image);
      const details = document.createElement('details');
      const label = document.createElement('summary');
      label.textContent = 'Código do diagrama';
      details.append(label);
      pre.replaceWith(details);
      details.append(pre);
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    if (!pre.isConnected) return;
    const message = document.createElement('p');
    message.className = 'notice warning';
    message.textContent = 'Não foi possível renderizar este diagrama ' + format + '.';
    pre.before(message);
  }
}

function codeBlock(parent, source, language) {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = source;
  pre.append(code);
  parent.append(pre);
  if (language === 'mermaid' || language === 'svg') {
    void paintDiagram(pre, source, language);
  } else {
    loadVendor('hljs', './vendor/highlight/highlight.min.js').then(api => {
      if (!code.isConnected) return;
      if (language && !api.getLanguage(language)) return;
      if (language) code.classList.add('language-' + language);
      api.highlightElement(code);
    }).catch(() => {});
  }
}

const symbols = {
  'ℕ':'\\mathbb{N}', 'ℤ':'\\mathbb{Z}', 'ℚ':'\\mathbb{Q}', 'ℝ':'\\mathbb{R}', 'ℂ':'\\mathbb{C}',
  'ℓ':'\\ell','∈':'\\in','∉':'\\notin','⊂':'\\subset','⊆':'\\subseteq','⊃':'\\supset',
  '∪':'\\cup','∩':'\\cap','∖':'\\setminus','∅':'\\varnothing','∀':'\\forall','∃':'\\exists',
  '≤':'\\le','≥':'\\ge','≠':'\\ne','≡':'\\equiv','≈':'\\approx','±':'\\pm','×':'\\times','⋅':'\\cdot',
  '→':'\\to','↦':'\\mapsto','⇒':'\\Rightarrow','⇔':'\\Leftrightarrow','↔':'\\leftrightarrow',
  '∞':'\\infty','∑':'\\sum','∏':'\\prod','∫':'\\int','∂':'\\partial','∇':'\\nabla','√':'\\surd',
  '∧':'\\wedge','∨':'\\vee','¬':'\\neg','⊕':'\\oplus','⊗':'\\otimes','∘':'\\circ','∥':'\\parallel',
  'α':'\\alpha','β':'\\beta','γ':'\\gamma','δ':'\\delta','ε':'\\varepsilon','θ':'\\theta',
  'λ':'\\lambda','μ':'\\mu','ν':'\\nu','π':'\\pi','ρ':'\\rho','σ':'\\sigma','τ':'\\tau','φ':'\\varphi',
  'ω':'\\omega','Δ':'\\Delta','Σ':'\\Sigma','Ω':'\\Omega','Λ':'\\Lambda','η':'\\eta','κ':'\\kappa','χ':'\\chi','ξ':'\\xi',
  '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9',
  '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','ⁿ':'n','ᵏ':'k'
};
const texSymbols = Object.fromEntries(Object.entries(symbols).map(([key,val]) =>
  [key, /^\\/.test(val) || val.length === 1 ? val : '\\'+val]));
const supers = '⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿᵏ';
const subs = '₀₁₂₃₄₅₆₇₈₉';
const mathChar = Object.keys(symbols).join('');
const tokenRe = new RegExp('[A-Za-z0-9'+mathChar+']*['+mathChar+'][A-Za-z0-9'+mathChar+']*','gu');
const subRe = new RegExp('(['+supers+']+)|(['+subs+']+)|(['+mathChar+'])','gu');

function unicodeMath(token) {
  return token.replace(subRe, (_,sup,sub,symbol) => {
    if (symbol) return texSymbols[symbol]+' ';
    return (sup ? '^{' : '_{') + [...(sup ?? sub)].map(s => symbols[s]).join('') + '}';
  }).replace(/(^|\s)(?=[_^])/g,'$1{}');
}

function formula(parent, tex, source, display = false) {
  const span = document.createElement('span');
  parent.append(span);
  try {
    katex.render(tex, span, {displayMode:display, throwOnError:false, trust:false, strict:'ignore', maxExpand:500,maxSize:25});
  } catch {
    span.className = 'katex-fallback';
    span.textContent = source;
  }
}

function inline(parent, content, textDomain) {
  const parts = content.split(/(\$\$[\s\S]+?\$\$|(?<!\\)\$[^$\n]+?(?<!\\)\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]|\x60[^\x60\n]+\x60|\*\*[^*]+\*\*|(?<![\w*\\])\*[^*\s](?:[^*\n]*?[^*\s])?\*(?![\w*]))/);
  for (let i=0; i<parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    if (i%2) {
      const pair = part.startsWith('$$') || part.startsWith('\\');
      if (part[0] === '$' || part[0] === '\\') formula(parent, part.slice(pair?2:1, pair?-2:-1), part, part.startsWith('$$') || part.startsWith('\\['));
      else {
        const bold = part.startsWith('**');
        const node = document.createElement(bold ? 'strong' : part[0] === '*' ? 'em' : 'code');
        node.textContent = bold ? part.slice(2, -2) : part.slice(1, -1);
        parent.append(node);
      }
    } else if (textDomain === 'languages') {
      let last=0;
      for (const match of part.matchAll(/\{([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}々ー]+)\|([\p{Script=Hiragana}\p{Script=Katakana}ー・]+)\}/gu)) {
        parent.append(part.slice(last, match.index));
        const ruby = document.createElement('ruby');
        const reading = document.createElement('rt');
        ruby.lang = 'ja';
        reading.textContent = match[2];
        ruby.append(match[1], reading);
        parent.append(ruby);
        last = match.index + match[0].length;
      }
      parent.append(part.slice(last));
    } else if (textDomain === 'literature') {
      parent.append(part);
    } else {
      let last=0;
      for (const match of part.matchAll(tokenRe)) {
        parent.append(part.slice(last,match.index));
        formula(parent, unicodeMath(match[0]), match[0]);
        last = match.index + match[0].length;
      }
      parent.append(part.slice(last));
    }
  }
}

function tableCells(line) {
  return line.trim().replace(/^\||(?<!\\)\|$/g, '').split(/(?<!\\)\|/).map(cell => cell.trim());
}

function richText(parent, content, textDomain) {
  const lines = content.split(/\r?\n/);
  let start = 0;
  const quotePrefix = /^ {0,3}>(?:[ \t]|$)/;
  for (let i = 0; i < lines.length; i++) {
    if (quotePrefix.test(lines[i])) {
      inline(parent, lines.slice(start, i).join('\n'), textDomain);
      const quote = document.createElement('blockquote');
      const quotedLines = [];
      while (i < lines.length && quotePrefix.test(lines[i])) {
        quotedLines.push(lines[i++].replace(quotePrefix, ''));
      }
      inline(quote, quotedLines.join('\n'), textDomain);
      parent.append(quote);
      start = i;
      i--;
      continue;
    }
    if (i + 1 === lines.length) break;
    if (!lines[i].includes('|')) continue;
    const header = tableCells(lines[i]);
    const divider = tableCells(lines[i + 1]);
    if (header.length < 2 || header.length !== divider.length ||
        !divider.every(cell => /^:?-{3,}:?$/.test(cell))) continue;

    let end = i + 2;
    const rows = [];
    while (end < lines.length && lines[end].includes('|')) {
      const cells = tableCells(lines[end]);
      if (cells.length !== header.length) break;
      rows.push(cells);
      end++;
    }
    if (!rows.length) continue;

    inline(parent, lines.slice(start, i).join('\n'), textDomain);
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrap';
    wrapper.tabIndex = 0;
    const table = document.createElement('table');
    table.className = 'history-table';
    const alignment = divider.map(cell => cell.endsWith(':') ? (cell.startsWith(':') ? 'center' : 'right') : 'left');
    const head = table.createTHead().insertRow();
    for (const [column, title] of header.entries()) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.style.textAlign = alignment[column];
      inline(th, title, textDomain);
      head.append(th);
    }
    const body = table.createTBody();
    for (const cells of rows) {
      const row = body.insertRow();
      for (const [column, cell] of cells.entries()) {
        const element = row.insertCell();
        element.style.textAlign = alignment[column];
        inline(element, cell, textDomain);
      }
    }
    wrapper.append(table);
    parent.append(wrapper);
    start = end;
    i = end - 1;
  }
  inline(parent, lines.slice(start).join('\n'), textDomain);
}

export function paintMath(root = document) {
  for (const el of root.querySelectorAll('[data-math], [data-code]')) {
    if (el.dataset.rendered === String(Boolean(katex))) continue;
    el.dataset.rendered = String(Boolean(katex));
    el.replaceChildren();
    if (el.hasAttribute('data-code')) {
      codeBlock(el, el.dataset.code, '');
      continue;
    }
    const content = el.dataset.math;
    const textDomain = el.closest('[data-text-domain]')?.dataset.textDomain;
    let last = 0;
    for (const match of content.matchAll(/^ {0,3}(\x60{3,}|~{3,})[ \t]*([a-z0-9_+#.-]*)[ \t]*\r?\n([\s\S]*?)^ {0,3}\1[ \t]*(?:\r?\n|$)/gmi)) {
      richText(el, content.slice(last, match.index), textDomain);
      const language = match[2].toLowerCase();
      if (textDomain === 'literature' && ['versos','escansao'].includes(language)) {
        const verse = document.createElement('pre');
        verse.className = 'verse';
        verse.textContent = match[3];
        el.append(verse);
      } else codeBlock(el, match[3], language);
      last = match.index + match[0].length;
    }
    richText(el, content.slice(last), textDomain);
  }
}

export const iso = () => new Date().toISOString();
export const TZ = 'America/Sao_Paulo';
const parts = new Intl.DateTimeFormat('en-CA',{timeZone:TZ, year:'numeric', month:'2-digit', day:'2-digit'});
export const dayKey = (date = new Date()) => parts.format(date);
export const dateFor = (day, time='12:00') => new Date(day+'T'+time+':00-03:00');
export const moveDay = (day, delta) => dayKey(new Date(+dateFor(day)+delta*86_400_000));
export const firstWeekDay = day => moveDay(day, -((dateFor(day).getUTCDay()+6)%7));
export const fmt = (date, options) => new Intl.DateTimeFormat('pt-BR',{timeZone:TZ,...options}).format(new Date(date));
export const duration = seconds => Math.floor(seconds/60)+' min'+(seconds%60?' '+seconds%60+' s':'');
export const percent = n => n == null?'—':Math.round(n*100)+'%';
export const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const badge = (text, cls='') => '<span class="tag '+cls+'">'+esc(text)+'</span>';
export const btn = (action,label, glyph='', cls='', data='') => '<button class="btn '+cls+'" type="button" data-act="'+action+'" '+data+'>'+ (glyph?icon(glyph,'sm'):'')+esc(label)+'</button>';
export const aBtn = (route,label,glyph='',cls='') => '<a class="btn '+cls+'" href="#'+route+'">'+(glyph?icon(glyph,'sm'):'')+esc(label)+'</a>';
