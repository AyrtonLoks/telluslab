import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from '../../packages/curriculum-mathematics/parse.mjs';
import { createDomainPacks, ECON_DOMAIN, HUM_DOMAIN, MATH_DOMAIN, PHYS_DOMAIN, PROG_DOMAIN } from '../../packages/learning-core/domain-packs.mjs';
import { HUMANITIES_DIFFICULTIES, HUMANITIES_MODALITIES } from './profile.mjs';

const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
const format = {
  bookPrefix:'BIB-HUM-', bookCount:53, trackPrefix:'TRL-HUM-', trackCount:6, levelCount:8,
  crossDomains:[MATH_DOMAIN, ECON_DOMAIN, PROG_DOMAIN, PHYS_DOMAIN],
  roles:['Fonte Primária', 'Síntese/Referência', 'Método/Heurística', 'Prática Relacional'],
  modalities:HUMANITIES_MODALITIES, mandatoryLabel:'Conceitos/Teses Obrigatórios'
};

export function parseHumanitiesSpecification(markdown, manifest, mathematics, economics, programming, physics) {
  const parsed = parseSpecification(markdown, {...manifest, format});
  const source = {documentId:manifest.documentId, revisionId:manifest.revisionId,
    url:manifest.sourceUrl, sha256:digest(markdown.replace(/\r\n/g, '\n'))};
  const content = {domainId:HUM_DOMAIN, slug:'humanities', version:'1.0.0', difficulties:HUMANITIES_DIFFICULTIES, ...parsed};
  const catalog = {schemaVersion:1, catalogId:'sha256:' + digest(JSON.stringify(content)), source, ...content};
  createDomainPacks([
    {id:MATH_DOMAIN, catalog:mathematics}, {id:ECON_DOMAIN, catalog:economics},
    {id:PROG_DOMAIN, catalog:programming}, {id:PHYS_DOMAIN, catalog:physics}, {id:HUM_DOMAIN, catalog}
  ]);
  return catalog;
}

export function humanitiesSeed(mathematics, economics, programming, physics) {
  return parseHumanitiesSpecification(read('especificacao.md'), JSON.parse(read('source-manifest.json')),
    mathematics, economics, programming, physics);
}
