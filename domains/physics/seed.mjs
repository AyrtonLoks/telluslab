import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from '../../packages/curriculum-mathematics/parse.mjs';
import { createDomainPacks, MATH_DOMAIN, PHYS_DOMAIN, PROG_DOMAIN } from '../../packages/learning-core/domain-packs.mjs';
import { PHYSICS_DIFFICULTIES, PHYSICS_MODALITIES } from './profile.mjs';

const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
const format = {
  bookPrefix:'BIB-PHYS-', bookCount:7, trackPrefix:'TRL-PHYS-', trackCount:6, levelCount:7,
  crossDomains:[MATH_DOMAIN, PROG_DOMAIN],
  roles:['Intuição/Clássico', 'Ciclo Básico/Analítico', 'Tratado/Avançado', 'Óptica Aplicada/Avaliação'],
  modalities:PHYSICS_MODALITIES, mandatoryLabel:'Conceitos/Leis Obrigatórios'
};

export function parsePhysicsSpecification(markdown, manifest, mathematics, programming) {
  const parsed = parseSpecification(markdown, {...manifest, format});
  const source = {documentId:manifest.documentId, revisionId:manifest.revisionId,
    url:manifest.sourceUrl, sha256:digest(markdown.replace(/\r\n/g, '\n'))};
  const content = {domainId:PHYS_DOMAIN, slug:'physics', version:'1.0.0', difficulties:PHYSICS_DIFFICULTIES, ...parsed};
  const catalog = {schemaVersion:1, catalogId:'sha256:' + digest(JSON.stringify(content)), source, ...content};
  createDomainPacks([
    {id:MATH_DOMAIN, catalog:mathematics}, {id:PROG_DOMAIN, catalog:programming}, {id:PHYS_DOMAIN, catalog}
  ]);
  return catalog;
}

export function physicsSeed(mathematics, programming) {
  return parsePhysicsSpecification(read('especificacao.md'), JSON.parse(read('source-manifest.json')),
    mathematics, programming);
}
