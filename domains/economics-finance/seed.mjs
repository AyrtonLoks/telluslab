import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from '../../packages/curriculum-mathematics/parse.mjs';
import { createDomainPacks, ECON_DOMAIN, MATH_DOMAIN, PROG_DOMAIN } from '../../packages/learning-core/domain-packs.mjs';
import { ECONOMICS_DIFFICULTIES, ECONOMICS_MODALITIES } from './profile.mjs';

const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
const format = {
  bookPrefix:'BIB-ECON-', bookCount:19, trackPrefix:'TRL-ECON-', levelCount:8, crossDomains:[MATH_DOMAIN, PROG_DOMAIN],
  roles:['Currículo/Prática', 'Mercado/Institucional', 'Quantitativo/Modelagem', 'Teoria/Epistemologia'],
  modalities:ECONOMICS_MODALITIES, mandatoryLabel:'Conceitos/Princípios Obrigatórios'
};

export function parseEconomicsSpecification(markdown, manifest, mathematics, programming) {
  const parsed = parseSpecification(markdown, {...manifest, format});
  const source = {documentId:manifest.documentId, revisionId:manifest.revisionId,
    url:manifest.sourceUrl, sha256:digest(markdown.replace(/\r\n/g, '\n'))};
  const content = {domainId:ECON_DOMAIN, slug:'economics-finance', version:'1.0.0',
    difficulties:ECONOMICS_DIFFICULTIES, ...parsed};
  const catalog = {schemaVersion:1, catalogId:'sha256:' + digest(JSON.stringify(content)), source, ...content};
  createDomainPacks([{id:MATH_DOMAIN,catalog:mathematics}, {id:PROG_DOMAIN,catalog:programming}, {id:ECON_DOMAIN,catalog}]);
  return catalog;
}

export function economicsSeed(mathematics, programming) {
  return parseEconomicsSpecification(read('especificacao.md'), JSON.parse(read('source-manifest.json')),
    mathematics, programming);
}
