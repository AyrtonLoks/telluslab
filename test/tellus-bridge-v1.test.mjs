import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  applyStudyEvent, createDomainPacks, createLearningState, interdisciplinaryPath, planSession, reviewCard
} from '../packages/learning-core/index.mjs';
import {
  labUrl, parseLabLink, parsePediaLink, pediaUrl, projection, readSnapshot, validateManifest, validateRegistry, validateSnapshot
} from '../packages/tellus-bridge/index.mjs';
import { buildBridgeSnapshot } from '../apps/web/src/bridge-snapshot.mjs';

const json = path => JSON.parse(readFileSync(new URL('../dist/' + path + '.json', import.meta.url), 'utf8'));
const registry = json('bridge/registry');
const manifest = json('bridge/manifest');
const packs = createDomainPacks(registry.domains.map(({id,slug}) =>
  ({id,catalog:json('data/' + (slug === 'mathematics' ? 'catalogo' : slug))})));
const seed = () => ({prerequisiteMode:'flexible',
  domains:Object.fromEntries([...packs.domains].map(([id,{dag}]) => [id,{state:createLearningState(dag)}]))});
const now = '2026-11-19T00:00:00.000Z';

test('inventário integral e namespaces resolvem os DAGs locais e o global', () => {
  assert.equal(validateRegistry(registry).domains.length, 8);
  assert.equal(packs.dag.order.length, 299);
  assert.equal(registry.domains.flatMap(d => d.books).length, 197);
  assert.deepEqual(json('domains/languages/catalog'),json('data/languages'));
  assert.equal(registry.domains[0].books[0].id, 'BIB-MATH-01');
  assert.equal(validateManifest(manifest,registry).links.length, 31);
  for (const mutate of [
    r => r.domains[0].nodes[0].crossPrerequisites.push('DOM-LIT:1.1'),
    r => r.domains[0].nodes[0].prerequisites.push(r.domains[0].nodes[0].id),
    r => r.domains[0].nodes[0].bookIds.push('BIB-MATH-99'),
    r => r.domains[0].nodes[0].complexity = 6,
    r => r.domains[0].nodes[0].crossPrerequisites.push('DOM-LIT:9.9')
  ]) {
    const bad = structuredClone(registry);
    mutate(bad);
    assert.throws(() => validateRegistry(bad));
  }
  const bad = structuredClone(manifest);
  bad.links[0].target = '//external.test';
  assert.throws(() => validateManifest(bad,registry), /schema/);
});

test('caminho por obra e por macrotema respeita a ordem global e a opção interdisciplinar', () => {
  const states = Object.fromEntries(Object.entries(seed().domains).map(([id,value]) => [id,value.state]));
  const positions = new Map(packs.dag.order.map((id,index) => [id.replace('::', ':'),index]));
  assert(interdisciplinaryPath(packs,states,'DOM-MATH',{kind:'book',id:'BIB-MATH-01'},true).length);
  for (const target of [{kind:'topic',id:'DOM-LIT:1.1'}, {kind:'book',id:'BIB-LIT-01'}]) {
    const local = interdisciplinaryPath(packs,states,'DOM-LIT',target,false);
    const combined = interdisciplinaryPath(packs,states,'DOM-LIT',target,true);
    assert(local.length && local.every(id => id.startsWith('DOM-LIT:') && combined.includes(id)));
    assert(combined.some(id => id.startsWith('DOM-HUM:')));
    assert(combined.every((id,index) => !index || positions.get(combined[index-1]) < positions.get(id)));
  }
});

test('snapshot reflete sessão, transições e agendamento FSRS-5 sem duplicar a sessão', () => {
  const workspace = seed();
  const {dag} = packs.domains.get('DOM-MATH');
  const math = workspace.domains['DOM-MATH'];
  const topic = dag.byId.get('1.1');
  math.state = planSession(dag,math.state,{id:'session',now,minutes:60,preferredTopicId:'1.1'}).state;
  function apply(event) { math.state = applyStudyEvent(dag,math.state,'1.1',event,now); }
  apply({kind:'completeTheory', notes:'Fichamento'});
  apply({kind:'passPractice',correct:9,total:10,evidence:'Exercícios'});
  for (const sub of topic.subtopics) apply({kind:'completeSubtopic',subtopicId:sub.id,evidence:'Revisado'});
  for (const criterion of topic.criteria) apply({kind:'validateCriterion',criterionId:criterion.id,
    withoutConsultation:true,approved:true,evidence:'Aprovado'});
  apply({kind:'validateProof'});
  const id='DOM-MATH:1.1';
  assert.equal(buildBridgeSnapshot(registry,packs,workspace,now).proficiency[id].state,'S4');
  const later = '2026-11-21T00:00:00.000Z';
  const overdue = buildBridgeSnapshot(registry,packs,workspace,later);
  assert.equal(overdue.proficiency[id].state,'S6');
  assert.equal(overdue.proficiency[id].sessions,1);
  assert.equal(overdue.summary.global.completed,topic.complexity);
  assert.equal(overdue.overdue[0].nodeId,id);
  assert.deepEqual(readSnapshot(JSON.stringify(overdue),registry),overdue);
  const tampered = structuredClone(overdue);
  tampered.summary.global.completed++;
  assert.throws(() => validateSnapshot(tampered,registry), /resumo/);
  delete tampered.proficiency[id];
  assert.throws(() => validateSnapshot(tampered,registry), /cobertura/);
  for (const card of Object.keys(math.state.cards)) math.state = reviewCard(dag,math.state,card,3,later);
  const reviewed = buildBridgeSnapshot(registry,packs,workspace,later);
  assert.equal(reviewed.proficiency[id].state,'S5');
  assert.equal(reviewed.proficiency[id].stability,3.173);
  assert.equal(reviewed.proficiency[id].nextReviewAt,'2026-11-24T00:00:00.000Z');
  assert.deepEqual(reviewed.overdue,[]);
  assert.deepEqual(projection({...reviewed,backup:{}}),reviewed);
});

test('links preservam o nó qualificado e validam o contexto nos dois sentidos', () => {
  const link = manifest.links.find(row => row.entityId === 'observatory:COSMOS');
  const origin = {slug:'physics',nodeId:'DOM-PHYS:6.5'};
  const lab = new URL(labUrl('http://localhost:4175', {...origin,entityId:link.entityId}));
  assert.equal(lab.pathname,'/lab');
  assert.equal(parseLabLink(lab.search,registry,manifest).nodeId,origin.nodeId);
  const pedia = new URL(pediaUrl('http://localhost:3000',link,origin));
  assert.deepEqual(parsePediaLink(pedia.search,registry,manifest),{link,origin});
  assert.throws(() => parseLabLink('domain=physics&node=DOM-ENG:6.1',registry,manifest), /nó inválido/);
  assert.throws(() => parseLabLink(lab.search+'&node=DOM-PHYS:6.5',registry,manifest), /repetido/);
  assert.throws(() => parsePediaLink(pedia.search.replace('physics','engineering'),registry,manifest), /origem/);
  assert.equal(parseLabLink('domain=languages&track=TRL-LANG-JP',registry,manifest).trackId,'TRL-LANG-JP');
});
