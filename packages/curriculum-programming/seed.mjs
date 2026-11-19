import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from '../curriculum-mathematics/parse.mjs';
import { createDomainPacks, MATH_DOMAIN, PROG_DOMAIN } from '../learning-core/domain-packs.mjs';
import { PROGRAMMING_DIFFICULTIES, PROGRAMMING_MODALITIES } from './profile.mjs';

const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
const format = {
  bookPrefix:'BIB-PROG-', bookCount:41, trackPrefix:'TRL-PROG-', crossDomain:MATH_DOMAIN,
  roles:['Intuição/Prática', 'Rigor/Teoria', 'Algorítmica', 'Arquitetura/Trade-offs'],
  modalities:PROGRAMMING_MODALITIES, mandatoryLabel:'Conceitos/Princípios Obrigatórios'
};

export function parseProgrammingSpecification(markdown, manifest, mathematics) {
  const parsed = parseSpecification(markdown, {...manifest, format});
  const source = {documentId:manifest.documentId, revisionId:manifest.revisionId,
    url:manifest.sourceUrl, sha256:digest(markdown.replace(/\r\n/g, '\n'))};
  const content = {domainId:PROG_DOMAIN, slug:'programming', version:'1.0.0',
    difficulties:PROGRAMMING_DIFFICULTIES, ...parsed};
  const catalog = {schemaVersion:1, catalogId:'sha256:' + digest(JSON.stringify(content)), source, ...content};
  createDomainPacks([{id:MATH_DOMAIN,catalog:mathematics}, {id:PROG_DOMAIN,catalog}]);
  return catalog;
}

export function programmingSeed(mathematics) {
  return parseProgrammingSpecification(read('especificacao.md'), JSON.parse(read('source-manifest.json')), mathematics);
}
