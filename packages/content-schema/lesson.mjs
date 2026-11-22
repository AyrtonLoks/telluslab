// Leitura do corpo de uma lição: blocos ::: do ADR-003 (seção 6.1).

import { FrontMatterError, splitFrontMatter } from './front-matter.mjs';

export const LESSON_BLOCKS = Object.freeze({
  explicacao: {required:[], optional:[]},
  exemplo: {required:[], optional:[]},
  figura: {required:['src', 'alt', 'atribuicao'], optional:[]},
  verificacao: {required:['exercicio'], optional:[]}
});

const OPEN = /^:::([a-z]+)(.*)$/u;
const ATTRIBUTE = /\s*([a-z]+)="([^"]*)"/uy;

function attributes(raw, line, problems) {
  const result = {};
  ATTRIBUTE.lastIndex = 0;
  let rest = raw;
  while (rest.trim().length) {
    ATTRIBUTE.lastIndex = 0;
    const match = ATTRIBUTE.exec(rest);
    if (!match) {
      problems.push({line, message:'atributo mal formado: ' + rest.trim() + ' (use nome="valor")'});
      break;
    }
    if (Object.hasOwn(result, match[1])) problems.push({line, message:'atributo repetido: ' + match[1]});
    result[match[1]] = match[2];
    rest = rest.slice(match[0].length);
  }
  return result;
}

// Devolve {blocks, problems}; cada bloco tem {name, attrs, line, content}.
export function parseLessonBody(body, firstLine = 1) {
  const blocks = [];
  const problems = [];
  let open = null;
  let fence = null;
  body.split('\n').forEach((raw, index) => {
    const line = firstLine + index;
    const text = raw.trimEnd();
    const fenceMark = text.match(/^ {0,3}(`{3,}|~{3,})/u);
    if (fenceMark) {
      if (!fence) fence = fenceMark[1];
      else if (fenceMark[1][0] === fence[0] && fenceMark[1].length >= fence.length) fence = null;
    }
    if (fence || fenceMark) {
      if (open) open.content.push(raw);
      return;
    }
    if (text === ':::') {
      if (!open) problems.push({line, message:'":::" de fechamento sem bloco aberto'});
      else {
        blocks.push({...open, content:open.content.join('\n').trim()});
        open = null;
      }
      return;
    }
    const start = text.match(OPEN);
    if (start) {
      if (open) {
        problems.push({line, message:'bloco :::' + start[1] + ' aberto dentro de :::' + open.name + ' (aberto na linha ' + open.line + ')'});
        return;
      }
      const spec = LESSON_BLOCKS[start[1]];
      if (!spec) {
        problems.push({line, message:'bloco desconhecido: :::' + start[1] + ' (aceitos: ' + Object.keys(LESSON_BLOCKS).join(', ') + ')'});
      }
      const attrs = attributes(start[2], line, problems);
      for (const name of spec?.required ?? []) {
        if (!attrs[name]?.trim()) problems.push({line, message:'bloco :::' + start[1] + ' exige o atributo ' + name});
      }
      for (const name of Object.keys(attrs)) {
        if (spec && !spec.required.includes(name) && !spec.optional.includes(name)) {
          problems.push({line, message:'atributo não aceito em :::' + start[1] + ': ' + name});
        }
      }
      open = {name:start[1], attrs, line, content:[]};
      return;
    }
    if (open) open.content.push(raw);
  });
  if (fence) problems.push({line:firstLine, message:'bloco de código sem fechamento'});
  if (open) problems.push({line:open.line, message:'bloco :::' + open.name + ' sem ":::" de fechamento'});
  return {blocks, problems};
}

// Lê um arquivo de lição inteiro. Erros de front matter viram problemas com linha.
export function parseLesson(text) {
  try {
    const {data, body, bodyLine} = splitFrontMatter(text);
    const {blocks, problems} = parseLessonBody(body, bodyLine);
    return {meta:data, body:body.trim(), blocks, problems};
  } catch (error) {
    if (error instanceof FrontMatterError) return {meta:null, body:'', blocks:[], problems:[{line:error.line, message:error.message.replace(/^linha \d+: /u, '')}]};
    throw error;
  }
}
