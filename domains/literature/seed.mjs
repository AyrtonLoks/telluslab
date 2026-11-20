import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from '../../packages/curriculum-mathematics/parse.mjs';
import { createDomainPacks, HUM_DOMAIN, LANG_DOMAIN, LIT_DOMAIN } from '../../packages/learning-core/domain-packs.mjs';
import { LITERATURE_DIFFICULTIES, LITERATURE_MODALITIES } from './profile.mjs';

const format = {
  bookPrefix:'BIB-LIT-', bookCount:26, trackPrefix:'TRL-LIT-', trackCount:4, levelCount:6,
  crossDomains:[HUM_DOMAIN, LANG_DOMAIN],
  roles:['Obra Épica/Poética', 'Romance/Novela', 'Conto/Narrativa Curta', 'Dramaturgia'],
  modalities:LITERATURE_MODALITIES, mandatoryLabel:'Conceitos/Estruturas Obrigatórios',
  modalityRepairs:{'1.1':{
    original:'|---|---|Histórico-Estética]',
    corrected:'Modalidades de Prática: [Close Reading e Análise Formal], [Contextualização Histórico-Estética]'
  }}
};

export function literatureSeed(dependencies) {
  const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
  const markdown = read('especificacao.md');
  const manifest = JSON.parse(read('source-manifest.json'));
  const digest = value => createHash('sha256').update(value).digest('hex');
  const content = {domainId:LIT_DOMAIN, slug:'literature', version:'1.0.0',
    difficulties:LITERATURE_DIFFICULTIES, ...parseSpecification(markdown, {...manifest, format})};
  const source = {documentId:manifest.documentId, revisionId:manifest.revisionId,
    url:manifest.sourceUrl, sha256:digest(markdown.replace(/\r\n/g, '\n'))};
  const catalog = {schemaVersion:1, catalogId:'sha256:' + digest(JSON.stringify(content)), source, ...content};
  createDomainPacks([...dependencies, {id:LIT_DOMAIN, catalog}]);
  return catalog;
}
