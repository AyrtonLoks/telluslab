import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from '../../packages/curriculum-mathematics/parse.mjs';
import { createDomainPacks, ENG_DOMAIN, MATH_DOMAIN, PHYS_DOMAIN, PROG_DOMAIN } from '../../packages/learning-core/domain-packs.mjs';
import { ENGINEERING_DIFFICULTIES, ENGINEERING_MODALITIES } from './profile.mjs';

const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
const format = {
  bookPrefix:'BIB-ENG-', bookCount:5, trackPrefix:'TRL-ENG-', trackCount:5, levelCount:7,
  crossDomains:[MATH_DOMAIN, PHYS_DOMAIN, PROG_DOMAIN],
  roles:['Handbook/Referência', 'Sistemas/Industrial', 'Fabricação/Oficina', 'Projeto Optomecânico'],
  modalities:ENGINEERING_MODALITIES, mandatoryLabel:'Conceitos/Critérios Obrigatórios',
  modalityRepairs:{
    '1.1':{
      original:'|---|---|Projeto], [Normas, Metrologia e Falhas]',
      corrected:'Modalidades de Prática: [Dimensionamento e Projeto], [Normas, Metrologia e Falhas]'
    }
  }
};

export function parseEngineeringSpecification(markdown, manifest, mathematics, physics, programming) {
  const parsed = parseSpecification(markdown, {...manifest, format});
  const source = {documentId:manifest.documentId, revisionId:manifest.revisionId,
    url:manifest.sourceUrl, sha256:digest(markdown.replace(/\r\n/g, '\n'))};
  const content = {domainId:ENG_DOMAIN, slug:'engineering', version:'1.0.0', difficulties:ENGINEERING_DIFFICULTIES, ...parsed};
  const catalog = {schemaVersion:1, catalogId:'sha256:' + digest(JSON.stringify(content)), source, ...content};
  createDomainPacks([
    {id:MATH_DOMAIN, catalog:mathematics}, {id:PROG_DOMAIN, catalog:programming},
    {id:PHYS_DOMAIN, catalog:physics}, {id:ENG_DOMAIN, catalog}
  ]);
  return catalog;
}

export function engineeringSeed(mathematics, physics, programming) {
  return parseEngineeringSpecification(read('especificacao.md'), JSON.parse(read('source-manifest.json')),
    mathematics, physics, programming);
}
