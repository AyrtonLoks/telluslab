import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseSpecification } from './parse.mjs';

const read = file => readFileSync(new URL('./data/' + file, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');

export function mathematicsSeed() {
  const markdown = read('especificacao.md');
  const manifest = JSON.parse(read('source-manifest.json'));
  const catalog = parseSpecification(markdown, manifest);
  const source = {documentId: manifest.documentId, revisionId: manifest.revisionId, url: manifest.sourceUrl,
    sha256: digest(markdown.replace(/\r\n/g, '\n'))};
  return {schemaVersion: 1, catalogId: 'sha256:' + digest(JSON.stringify(catalog)), source, ...catalog};
}

