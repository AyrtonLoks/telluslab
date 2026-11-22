import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const manifest = read('dist/bridge/manifest.json');
const registry = read('dist/bridge/registry.json');
const published = read('test/fixtures/bridge/manifest-publicado.json').links;

test('manifesto gerado mantém todos os vínculos e macrotemas já publicados', () => {
  const generated = new Map(manifest.links.map(link => [link.entityId, new Set(link.nodeIds)]));
  const missing = [];
  for (const [entityId, nodeIds] of Object.entries(published)) {
    const nodes = generated.get(entityId);
    if (!nodes) missing.push(entityId + ' (vínculo inteiro)');
    else for (const nodeId of nodeIds) if (!nodes.has(nodeId)) missing.push(entityId + ' → ' + nodeId);
  }
  assert.deepEqual(missing, [], 'o gerador perdeu vínculos publicados');
});

test('manifesto gerado cobre todos os macrotemas do registro', () => {
  const covered = new Set(manifest.links.flatMap(link => link.nodeIds));
  const uncovered = registry.domains.flatMap(domain => domain.nodes.map(node => node.id)).filter(id => !covered.has(id));
  assert.deepEqual(uncovered, []);
});

test('bookIds de cada vínculo continuam derivados dos macrotemas', () => {
  const books = new Map(registry.domains.flatMap(domain => domain.nodes.map(node => [node.id, node.bookIds])));
  for (const link of manifest.links) {
    assert.deepEqual(link.bookIds, [...new Set(link.nodeIds.flatMap(id => books.get(id)))], link.entityId);
  }
});
