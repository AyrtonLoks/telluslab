import { readingFields, optionalReadingFields, readingCitation } from '../../../domains/literature/notebook.mjs';
import { btn, esc, math } from './ui.mjs';

const multiline = new Set(['excerpt', 'scansion', 'analysis', 'characters']);
const example = {author:'Ex.: CAMÕES, Luís de', surname:'Ex.: Camões', year:'Ex.: 2019', locator:'Ex.: p. 27 ou canto I, est. 3'};
const supplementary = ['edition','place','publisher','year'];

export function readingForm(book, note) {
  const field = key => {
    const attr = ' class="control" name="'+key+'"'+(optionalReadingFields.includes(key)?'':' required');
    const control = multiline.has(key)
      ? '<textarea'+attr+'>\n'+esc(note?.[key])+'</textarea>'
      : '<input'+attr+' value="'+esc(note?.[key])+'" placeholder="'+esc(example[key])+'">';
    return '<label class="field"><span>'+esc(readingFields[key])+'</span>'+control+'</label>';
  };
  return '<form id="reading-form" class="stack" data-book="'+esc(book.id)+'" data-id="'+esc(note?.id)+'" data-at="'+esc(note?.at)+'">'+
    '<p>'+esc(book.title)+'</p>'+field('excerpt')+
    '<fieldset class="folder stack"><legend>Dados bibliográficos</legend>'+field('author')+
    '<div class="grid-two">'+field('surname')+field('locator')+
    supplementary.map(field).join('')+'</div></fieldset>'+
    field('scansion')+field('analysis')+field('characters')+
    '<button class="btn primary" type="submit">Salvar anotação</button></form>';
}

export function notebookPanel(book, notebook) {
  const entries=Object.values(notebook??{}).filter(note=>note.bookId===book.id)
    .sort((a,b)=>b.at.localeCompare(a.at));
  const edit=(text,note)=>btn('reading-note',text,note?'':'plus',note?'clear':'tinted',
    'data-book="'+esc(book.id)+'" data-id="'+esc(note?.id)+'"');
  return '<section class="card pad area"><div class="row between wrap"><h2>Caderno de close reading</h2>'+
    edit('Adicionar anotação')+'</div>'+
    (entries.length?entries.map(note=>
      '<article class="folder area stack"><div class="row between wrap"><h3>'+esc(note.locator)+'</h3>'+
      edit('Editar anotação',note)+'</div><blockquote class="reading-excerpt">'+esc(note.excerpt)+'</blockquote>'+
      '<p class="small">'+esc(readingCitation(note))+'</p>'+
      '<p class="small">'+esc(note.author)+'. <cite>'+esc(book.title)+'</cite>. '+
      (note.edition?esc(note.edition.replace(/\.$/u,''))+'. ':'')+
      esc(note.place)+': '+esc(note.publisher)+', '+esc(note.year)+'.</p>'+
      (note.scansion?'<div><h4>Escansão</h4><pre class="verse">\n'+esc(note.scansion)+'</pre></div>':'')+
      '<div><h4>Anotações de leitura</h4>'+math(note.analysis)+'</div>'+
      (note.characters?'<div><h4>Mapa de personagens</h4>'+math(note.characters)+'</div>':'')+'</article>'
    ).join(''):'<p class="small area">Registre excertos com a localização na edição que você leu.</p>')+'</section>';
}
