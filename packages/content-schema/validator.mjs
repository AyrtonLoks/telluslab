// Validador do subconjunto de JSON Schema 2020-12 usado pelos schemas do Content Pack.
// Palavras-chave: $ref, type, const, enum, minLength, maxLength, pattern, minimum, maximum,
// minItems, maxItems, uniqueItems, items, required, properties, additionalProperties,
// propertyNames, minProperties, allOf, anyOf, if/then/else.
// Cada palavra-chave só se aplica ao tipo de valor a que se refere, como na especificação.

import common from './common.schema.json' with {type:'json'};
import pack from './pack.schema.json' with {type:'json'};
import lesson from './lesson.schema.json' with {type:'json'};
import exercise from './exercise.schema.json' with {type:'json'};
import card from './card.schema.json' with {type:'json'};
import source from './source.schema.json' with {type:'json'};

export const SCHEMAS = Object.freeze({
  'common.schema.json': common, 'pack.schema.json': pack, 'lesson.schema.json': lesson,
  'exercise.schema.json': exercise, 'card.schema.json': card, 'source.schema.json': source
});

const KNOWN = new Set(['$schema', '$id', '$defs', 'title', 'description', '$ref', 'type', 'const', 'enum',
  'minLength', 'maxLength', 'pattern', 'minimum', 'maximum', 'minItems', 'maxItems', 'uniqueItems', 'items',
  'required', 'properties', 'additionalProperties', 'propertyNames', 'minProperties', 'allOf', 'anyOf',
  'if', 'then', 'else']);

const typeOf = value => value === null ? 'null' : Array.isArray(value) ? 'array'
  : Number.isInteger(value) ? 'integer' : typeof value;
const matchesType = (value, type) => type === typeOf(value) || (type === 'number' && typeof value === 'number' &&
  Number.isFinite(value));
const TYPE_NAMES = {string:'texto', number:'número', integer:'inteiro', boolean:'booleano', object:'objeto',
  array:'lista', null:'nulo'};
const show = value => JSON.stringify(value);

export function formatPath(path) {
  if (!path.length) return '(raiz)';
  return path.map((part, index) => typeof part === 'number' ? '[' + part + ']'
    : /^[A-Za-z_$][\w$-]*$/u.test(part) ? (index ? '.' : '') + part : '[' + show(part) + ']').join('');
}

function resolve(ref, file) {
  const [target, pointer = ''] = ref.split('#');
  const schemaFile = target || file;
  const document = SCHEMAS[schemaFile];
  if (!document) throw new Error('Schema desconhecido em $ref: ' + ref);
  const node = pointer.split('/').filter(Boolean).reduce((current, key) => current?.[key], document);
  if (!node) throw new Error('Referência inexistente: ' + ref);
  return {schema:node, file:schemaFile};
}

function check(value, schema, file, path, errors) {
  for (const key of Object.keys(schema)) {
    if (!KNOWN.has(key)) throw new Error('Palavra-chave de schema não suportada: ' + key);
  }
  const fail = message => errors.push({path:[...path], message});
  if (schema.$ref) {
    const target = resolve(schema.$ref, file);
    check(value, target.schema, target.file, path, errors);
  }
  if (schema.type !== undefined) {
    const types = [schema.type].flat();
    if (!types.some(type => matchesType(value, type))) {
      fail('esperado ' + types.map(type => TYPE_NAMES[type]).join(' ou ') + ', encontrado ' + TYPE_NAMES[typeOf(value)]);
      return;
    }
  }
  if (Object.hasOwn(schema, 'const') && show(value) !== show(schema.const)) {
    fail('esperado ' + show(schema.const) + ', encontrado ' + show(value));
  }
  if (schema.enum && !schema.enum.some(option => show(option) === show(value))) {
    fail('valor ' + show(value) + ' fora dos aceitos: ' + schema.enum.map(show).join(', '));
  }
  if (typeof value === 'string') {
    const length = [...value].length;
    if (schema.minLength !== undefined && length < schema.minLength) {
      fail(schema.minLength === 1 ? 'texto vazio' : 'texto com menos de ' + schema.minLength + ' caracteres');
    }
    if (schema.maxLength !== undefined && length > schema.maxLength) fail('texto com mais de ' + schema.maxLength + ' caracteres');
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) {
      fail('formato inválido: ' + show(value) + ' não segue ' + schema.pattern);
    }
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) fail('valor ' + value + ' menor que o mínimo ' + schema.minimum);
    if (schema.maximum !== undefined && value > schema.maximum) fail('valor ' + value + ' maior que o máximo ' + schema.maximum);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      fail(schema.minItems === 1 ? 'lista vazia' : 'lista com menos de ' + schema.minItems + ' itens');
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) fail('lista com mais de ' + schema.maxItems + ' itens');
    if (schema.uniqueItems) {
      const seen = new Map();
      value.forEach((item, index) => {
        const keyOf = show(item);
        if (seen.has(keyOf)) fail('item repetido nas posições ' + seen.get(keyOf) + ' e ' + index + ': ' + keyOf);
        else seen.set(keyOf, index);
      });
    }
    if (schema.items) value.forEach((item, index) => check(item, schema.items, file, [...path, index], errors));
  }
  if (typeOf(value) === 'object') {
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) fail('campo obrigatório ausente: ' + key);
    }
    if (schema.minProperties !== undefined && Object.keys(value).length < schema.minProperties) {
      fail(schema.minProperties === 1 ? 'objeto vazio' : 'objeto com menos de ' + schema.minProperties + ' campos');
    }
    for (const [key, item] of Object.entries(value)) {
      if (schema.propertyNames) {
        const nameErrors = [];
        check(key, schema.propertyNames, file, [...path, key], nameErrors);
        if (nameErrors.length) fail('nome de campo inválido: ' + show(key));
      }
      if (schema.properties && Object.hasOwn(schema.properties, key)) {
        check(item, schema.properties[key], file, [...path, key], errors);
      } else if (schema.additionalProperties === false) {
        fail('campo não permitido: ' + key);
      } else if (typeof schema.additionalProperties === 'object') {
        check(item, schema.additionalProperties, file, [...path, key], errors);
      }
    }
  }
  for (const rule of schema.allOf ?? []) check(value, rule, file, path, errors);
  if (schema.anyOf) {
    const attempts = schema.anyOf.map(rule => {
      const branch = [];
      check(value, rule, file, path, branch);
      return branch;
    });
    if (!attempts.some(branch => !branch.length)) {
      const closest = attempts.reduce((best, branch) => branch.length < best.length ? branch : best);
      fail('não corresponde a nenhuma das formas aceitas; a mais próxima falha em: ' +
        closest.map(error => formatPath(error.path) + ' (' + error.message + ')').join('; '));
    }
  }
  if (schema.if) {
    const probe = [];
    check(value, schema.if, file, path, probe);
    const branch = probe.length ? schema.else : schema.then;
    if (branch) check(value, branch, file, path, errors);
  }
}

// Devolve a lista de erros ({path, message}); lista vazia significa documento válido.
export function validateAgainst(schemaFile, value) {
  const schema = SCHEMAS[schemaFile];
  if (!schema) throw new Error('Schema desconhecido: ' + schemaFile);
  const errors = [];
  check(value, schema, schemaFile, [], errors);
  return errors;
}
