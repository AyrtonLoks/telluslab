import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  createDomainPacks, createAreaRegistry, createLearningState, advancementGuard, applyStudyEvent,
  diagnose, challengeBrief, updateTimer, submitAttempt, reviewCard, exportSnapshot, importSnapshot,
  MATH_DOMAIN, LANG_DOMAIN, LIT_DOMAIN
} from '../packages/learning-core/index.mjs';
import { createTellusPediaBridge } from '../packages/telluspedia-bridge/index.mjs';
import { languageSeed } from '../domains/languages/seed.mjs';
import { literatureSeed } from '../domains/literature/seed.mjs';
import * as languages from '../domains/languages/profile.mjs';
import * as literature from '../domains/literature/profile.mjs';
import { readingEntry, readingCitation, restoreReadingNotebook } from '../domains/literature/notebook.mjs';

const readCatalog = slug => JSON.parse(readFileSync(new URL('../dist/data/' + slug + '.json', import.meta.url), 'utf8'));
const dependencies = ['catalogo','programming','economics-finance','physics','engineering','humanities'].map(slug => {
  const catalog = readCatalog(slug);
  return {id:catalog.domainId ?? MATH_DOMAIN, catalog};
});
const language = {id:LANG_DOMAIN, catalog:languageSeed(dependencies), profile:languages};
const literary = {id:LIT_DOMAIN, catalog:literatureSeed([...dependencies, language]), profile:literature};
const packs = createDomainPacks([...dependencies, language, literary]);
const now = '2026-11-19T00:00:00.000Z';
const later = '2026-11-19T00:08:00.000Z';
const initial = Object.fromEntries([...packs.domains].map(([id, {dag}]) => [id, createLearningState(dag)]));
const scope = (id, mode = 'flexible') => packs.scope(id, initial, mode, now);
const launchBridge = createTellusPediaBridge(createAreaRegistry([language, literary].map(({id,catalog}) =>
  ({id:catalog.slug, catalog, dag:scope(id)}))));

test('os novos catálogos são determinísticos e têm pré-requisitos resolvidos na ordem conjunta', () => {
  for (const [pack, counts] of [[language, [13,6,3]],[literary, [16,26,4]]]) {
    const {catalog} = pack;
    assert.deepEqual(readCatalog(catalog.slug), catalog);
    assert.deepEqual([catalog.topics.length,catalog.books.length,catalog.tracks.length], counts);
    assert.deepEqual(Object.keys(catalog.difficulties), Array.from({length:6}, (_, i) =>
      'DIF-' + pack.id.slice(4) + '-0' + (i+1)));
    assert.equal(catalog.sanitizations[0].topicId,'1.1');
    assert.equal(catalog.sanitizations.length,1);
  }
  const positions = new Map(packs.dag.order.map((id, index) => [id,index]));
  for (const [id, dagTopic] of packs.dag.byId) {
    assert(dagTopic.prerequisites.every(parent => positions.get(parent) < positions.get(id)));
  }
  const langDag = scope(LANG_DOMAIN);
  assert(language.catalog.topics.every(topic =>
    topic.prerequisites.every(parent => langDag.byId.get(parent).trackId === topic.trackId)));
  assert.deepEqual(langDag.byId.get('3.3').crossPrerequisites,['DOM-MATH::2.1','DOM-PROG::8.1']);
  assert.deepEqual(scope(LIT_DOMAIN).byId.get('1.1').crossPrerequisites,['DOM-HUM::2.1','DOM-LANG::5.1']);
  assert.equal(advancementGuard(scope(LANG_DOMAIN,'strict'),initial[LANG_DOMAIN].progress,'4.1').crossBlocked,true);
  assert.equal(advancementGuard(scope(LIT_DOMAIN,'strict'),initial[LIT_DOMAIN].progress,'1.1').crossBlocked,true);
  const missing = structuredClone(language.catalog);
  missing.topics[0].crossPrerequisites = ['DOM-HUM::0.0'];
  assert.throws(() => createDomainPacks([...dependencies, {...language,catalog:missing}]), /cruzado inválido/);
});

test('Kanji passa por S4, gera pares independentes e restaura as duas direções pela ponte', () => {
  const dag = scope(LANG_DOMAIN);
  const topic = dag.byId.get('4.1');
  let state = initial[LANG_DOMAIN];
  const study = action => { state = applyStudyEvent(dag,state,topic.id,action,now); };
  study({kind:'completeTheory',notes:'Escrita e radicais'});
  study({kind:'passPractice',correct:9,total:10,evidence:'Ditado'});
  for (const subtopic of topic.subtopics) {
    study({kind:'completeSubtopic',subtopicId:subtopic.id,evidence:'Traçado e leituras anotadas'});
  }
  for (const criterion of topic.criteria) {
    study({kind:'validateCriterion',criterionId:criterion.id,evidence:'Evidência',approved:true,withoutConsultation:true});
  }
  study({kind:'validateProof'});
  const id = topic.subtopics[0].id;
  assert.match(state.cards[id+':statement'].frontLatex,/木/u);
  assert.match(state.cards[id+':counterexample'].frontLatex,/árvore/u);
  state = languages.addLanguagePair(dag,state,{id:'test',topicId:topic.id,term:'川',meaning:'rio',notes:'カワ',now});
  const pair = ['recognition','production'].map(kind => 'pair:test:' + kind);
  assert.match(state.cards[pair[0]].frontLatex,/川/u);
  assert.match(state.cards[pair[1]].frontLatex,/rio/u);
  const rated = reviewCard(dag,state,pair[0],3,later);
  assert.equal(rated.cards[pair[0]].repetitions,1);
  assert.equal(rated.cards[pair[1]].repetitions,0);
  assert.throws(() => languages.addLanguagePair(dag,state,{id:'test',topicId:topic.id,term:'川',meaning:'rio',now}),/já cadastrado/);
  const snapshot = JSON.parse(exportSnapshot(rated,language.catalog,later,dag));
  assert.deepEqual(launchBridge.parseLaunch('domain=languages&topic=4.1'), {areaId:'languages',topicId:'4.1'});
  const restored = launchBridge.unwrapSnapshot(launchBridge.wrapSnapshot('languages',snapshot),'languages').snapshot;
  assert.deepEqual(restored.state,rated);
  delete snapshot.state.cards[pair[1]];
  assert.throws(() => importSnapshot(JSON.stringify(snapshot),language.catalog,dag),/par de cartões/);
});

test('Literatura preserva verso e escansão e impede aprovar um resumo de enredo', () => {
  const draft = '  Excerto:\n  Primeiro verso\n    Segundo verso\nCitação: (Camões, 2019, canto I)\n' +
    'Forma: A expressão “Primeiro verso” abre uma gradação na sintaxe.\n' +
    'Voz: O autor compõe um narrador que assume voz coletiva.';
  const dag = scope(LIT_DOMAIN);
  const topic = dag.byId.get('1.1');
  const options = {id:'lit', block:'standalone',sessionId:null,now,scheduledAt:now,minutes:60,
    topicIds:[topic.id],modality:topic.modalities[0]};
  const brief = challengeBrief(dag,initial[LIT_DOMAIN],options);
  const authored = literature.makeLocalChallenge(brief);
  let {state,challenge} = literature.registerChallenge(dag,initial[LIT_DOMAIN],options,authored);
  assert.throws(() => literature.socraticMessages(state,challenge.id,'attempt',literary.catalog),/Envie uma tentativa/);
  state = updateTimer(state,challenge.id,'start',now);
  const result = submitAttempt(dag,state,{id:'attempt',challengeId:challenge.id,draft,draftFormat:'latex',difficulty:'DIF-LIT-01',now:later});
  assert.equal(result.attempt.draft,draft);
  assert(result.state.agenda['micro:1.1:DOM-LANG::5.1']);
  assert(result.state.agenda['micro:1.1:DOM-HUM::2.1']);
  const summary = 'O herói parte em viagem e depois volta para casa.';
  assert.equal(literature.localFeedback({draft:summary},challenge).assessment,'needsRevision');
  assert.throws(() => literature.validateCriterion({kind:'capstone'},summary),/excerto/);
  assert.throws(() => literature.validateFeedback({draft:summary},challenge,{assessment:'coherent'}),/excerto/);
  assert.match(literature.assessDraft(draft.replace(/Voz:.*/, 'Voz: A voz acompanha todos os fatos.')),/distinga/);
  const parts = ['Primeiro verso','A expressão “Primeiro verso” abre uma gradação na sintaxe.','O autor compõe um narrador que assume voz coletiva.'];
  const feedback = {assessment:'coherent',questions:authored.tests.map(rule => rule.scenario),
    checks:authored.tests.map(({kind}, i) => ({category:kind,excerpt:parts[i],observation:'Evidência analisada'}))};
  assert.doesNotThrow(() => literature.validateFeedback(result.attempt,challenge,feedback));
  const entry = readingEntry(literary.catalog,{id:'note',bookId:'BIB-LIT-01',at:now,author:'CAMÕES, Luís de',
    surname:'Camões',year:'2019',locator:'canto I',place:'Lisboa',publisher:'Editora',analysis:parts[1],
    excerpt:'\n  Primeiro verso\n    Segundo verso',scansion:'pri/mei/ro\nse/gun/do'});
  const snapshot = JSON.parse(exportSnapshot(result.state,literary.catalog,later,dag));
  snapshot.workspace = {closeReading:{[entry.id]:entry}};
  assert.deepEqual(launchBridge.parseLaunch('domain=literature&topic=6.2'), {areaId:'literature',topicId:'6.2'});
  const restored = launchBridge.unwrapSnapshot(launchBridge.wrapSnapshot('literature',snapshot)).snapshot;
  assert.deepEqual(restoreReadingNotebook(literary.catalog,restored.workspace.closeReading),{note:entry});
  assert.equal(readingCitation(entry),'(Camões, 2019, canto I)');
  assert.throws(() => restoreReadingNotebook(literary.catalog,{note:{...entry,bookId:'BIB-LANG-01'}}),/inválida/);
});

test('DIF-LANG-03 sugere micro-revisões locais na primeira ocorrência', () => {
  const dag = scope(LANG_DOMAIN);
  const agenda = diagnose(dag,initial[LANG_DOMAIN],{id:'first',topicIds:['2.2'],submittedAt:now,difficulty:'DIF-LANG-03'});
  assert(agenda['micro:2.2:2.1']);
  assert(!Object.values(agenda).some(item => item.topicId.includes('::')));
});
