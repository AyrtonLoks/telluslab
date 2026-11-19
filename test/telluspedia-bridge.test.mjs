import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createAreaRegistry, createDag, createLearningState, exportSnapshot, importSnapshot,
  registerChallenge } from '../packages/learning-core/index.mjs';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { createTellusPediaBridge } from '../packages/telluspedia-bridge/index.mjs';

const catalog = mathematicsSeed();
const registry = createAreaRegistry([{id:'matematica',catalog}]);
const bridge = createTellusPediaBridge(registry);
const at = '2026-11-19T23:00:00.000Z';

test('catálogo gerado mantém a identidade e os bytes do catálogo da Etapa 2', async () => {
  const bytes = await readFile(new URL('../dist/data/catalogo.json',import.meta.url));
  const digest = createHash('sha256').update(bytes).digest('hex');
  assert.equal(digest,'3c5593bddb35d87af822fa53d8a5d1e0da76c258b404ff32d12d057afa281021');
});

test('ponte interpreta contexto de tópico e recusa contexto inválido', () => {
  assert.deepEqual(bridge.parseLaunch('?area=matematica&topic=1.1'), {areaId:'matematica',topicId:'1.1'});
  assert.deepEqual(bridge.parseLaunch('area=matematica'), {areaId:'matematica',topicId:null});
  assert.throws(()=>bridge.parseLaunch('area=fisica'), /Área desconhecida/);
  assert.throws(()=>bridge.parseLaunch('area=matematica&topic=88'), /Tópico desconhecido/);
  assert.throws(()=>bridge.parseLaunch('area=matematica&area=fisica'), /Parâmetro repetido/);
});

test('envelope preserva o snapshot legado e valida área, versão e catálogo', () => {
  const state = createLearningState(createDag(catalog.topics));
  const snapshot = JSON.parse(exportSnapshot(state,catalog,at));
  snapshot.workspace = {drafts:{},authored:{}};
  const envelope = bridge.wrapSnapshot('matematica',snapshot);
  const restored = bridge.unwrapSnapshot(JSON.parse(JSON.stringify(envelope)),'matematica');
  assert.deepEqual(restored.snapshot,snapshot);
  assert.deepEqual(importSnapshot(JSON.stringify(restored.snapshot),catalog),state);
  assert.throws(()=>bridge.unwrapSnapshot(envelope,'fisica'), /outra área/);
  assert.throws(()=>bridge.unwrapSnapshot({...envelope,version:2}), /incompatível/);
  assert.throws(()=>bridge.unwrapSnapshot({...envelope,snapshot:{...snapshot,catalogId:'outro'}}), /catálogo/);
});

test('novo currículo pode usar IDs e modalidade próprios sem o perfil matemático', () => {
  const topics = [
    {id:'mecanica-forcas',title:'Forças',prerequisites:['mecanica-vetores'],trackId:'base',
      complexity:1,subtopics:[],criteria:[],bibliography:[],modalities:['Experimento']},
    {id:'mecanica-vetores',title:'Vetores',prerequisites:[],trackId:'base',
      complexity:1,subtopics:[],criteria:[],bibliography:[],modalities:['Experimento']}
  ];
  const dag = createDag(topics);
  assert.deepEqual(dag.order,['mecanica-vetores','mecanica-forcas']);
  const physicsCatalog = {catalogId:'test-fisica',topics};
  const localBridge = createTellusPediaBridge(createAreaRegistry([{id:'fisica',catalog:physicsCatalog}]));
  assert.deepEqual(localBridge.parseLaunch('area=fisica&topic=mecanica-vetores'),
    {areaId:'fisica',topicId:'mecanica-vetores'});
  const options = {id:'experimento',now:at,minutes:45,topicIds:['mecanica-vetores'],modality:'Experimento'};
  const content = {title:'Escala',statement:'Compare a direção de dois vetores.',requirements:['Registre a medição.'],
    hypotheses:[],assumedTopicIds:[],examples:[{input:'forças paralelas',expected:'ângulo zero'}],
    tests:[{kind:'controle',scenario:'use a mesma direção',expected:'zero'}]};
  assert.equal(registerChallenge(dag,createLearningState(dag),options,content,['controle']).challenge.modality,'Experimento');
});

