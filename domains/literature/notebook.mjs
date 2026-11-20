import { timestamp } from '../../packages/learning-core/fsrs.mjs';

export const readingFields = Object.freeze({
  excerpt:'Excerto',
  author:'Autoria da edição (SOBRENOME, Prenome)',
  surname:'Sobrenome para a citação',
  year:'Ano da edição',
  locator:'Página, canto, verso ou seção',
  place:'Local de publicação',
  publisher:'Editora',
  edition:'Edição (opcional)',
  scansion:'Escansão (opcional)',
  analysis:'Anotações de leitura',
  characters:'Mapa de personagens (opcional)'
});
export const optionalReadingFields = Object.freeze(['edition','scansion','characters']);

export function readingEntry(catalog, {id, bookId, at, ...fields}) {
  if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(id) ||
      !catalog.books.some(book => book.id === bookId)) throw new Error('Anotação ou obra inválida.');
  timestamp(at);
  const data = {};
  for (const [key, label] of Object.entries(readingFields)) {
    const value = fields[key] ?? '';
    if (typeof value !== 'string' || (!optionalReadingFields.includes(key) && !value.trim())) {
      throw new Error('Preencha o campo ' + label + '.');
    }
    data[key] = ['excerpt', 'scansion', 'analysis', 'characters'].includes(key)
      ? value.replace(/\r\n?/g, '\n') : value.trim();
  }
  if (!/^\d{4}[a-z]?$/u.test(data.year)) throw new Error('Informe o ano da edição com quatro dígitos.');
  return {id, bookId, at, ...data};
}

export function restoreReadingNotebook(catalog, notes) {
  if (notes === undefined) return {};
  if (!notes || typeof notes !== 'object' || Array.isArray(notes)) throw new Error('Caderno de leitura inválido.');
  return Object.fromEntries(Object.entries(notes).map(([id, note]) => {
    if (id !== note?.id) throw new Error('Identificador da anotação inválido.');
    return [id, readingEntry(catalog, note)];
  }));
}

export function readingCitation(note) {
  return '(' + [note.surname, note.year, note.locator].join(', ') + ')';
}
