import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from '../../packages/curriculum-mathematics/parse.mjs';
import { createDomainPacks, HUM_DOMAIN, LANG_DOMAIN, MATH_DOMAIN, PROG_DOMAIN } from '../../packages/learning-core/domain-packs.mjs';
import { LANGUAGE_DIFFICULTIES, LANGUAGE_MODALITIES } from './profile.mjs';

const format = {
  bookPrefix:'BIB-LANG-', bookCount:6, trackIds:['TRL-LANG-EN', 'TRL-LANG-JP', 'TRL-LANG-PT'], levelCount:5,
  crossDomains:[HUM_DOMAIN, MATH_DOMAIN, PROG_DOMAIN],
  roles:['Gramática Progressiva', 'Lexicografia/Consulta', 'Escrita e Ideogramas'],
  modalities:LANGUAGE_MODALITIES, mandatoryLabel:'Conceitos/Regras Obrigatórios',
  modalityRepairs:{'1.1':{
    original:'|---|---|Transformação], [Produção Escrita e Estilo]',
    corrected:'Modalidades de Prática: [Drill Gramatical e Transformação], [Produção Escrita e Estilo]'
  }}
};

export function languageSeed(dependencies) {
  const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
  const markdown = read('especificacao.md');
  const manifest = JSON.parse(read('source-manifest.json'));
  const parsed = parseSpecification(markdown, {...manifest, format});
  const tracks = new Map(parsed.topics.map(topic => [topic.id, topic.trackId]));
  for (const topic of parsed.topics) {
    if (topic.prerequisites.some(id => tracks.get(id) !== topic.trackId)) {
      throw new Error('Pré-requisito entre trilhas de Idiomas em ' + topic.id);
    }
  }
  const digest = value => createHash('sha256').update(value).digest('hex');
  const content = {domainId:LANG_DOMAIN, slug:'languages', version:'1.0.0',
    difficulties:LANGUAGE_DIFFICULTIES, ...parsed};
  const source = {documentId:manifest.documentId, revisionId:manifest.revisionId,
    url:manifest.sourceUrl, sha256:digest(markdown.replace(/\r\n/g, '\n'))};
  const catalog = {schemaVersion:1, catalogId:'sha256:' + digest(JSON.stringify(content)), source, ...content};
  createDomainPacks([...dependencies, {id:LANG_DOMAIN, catalog}]);
  return catalog;
}
