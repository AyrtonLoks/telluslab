import { ancestors, createDag, mastered } from './dag.mjs';
import { refreshLearning } from './fsm.mjs';

export const MATH_DOMAIN = 'DOM-MATH';
export const PROG_DOMAIN = 'DOM-PROG';
export const ECON_DOMAIN = 'DOM-ECON';
export const CROSS_MODES = Object.freeze(['flexible', 'strict']);
const domainPattern = /^DOM-[A-Z][A-Z0-9-]*$/;

export function qualify(domainId, id) {
  if (!domainPattern.test(domainId) || typeof id !== 'string' || !id || id.includes('::')) {
    throw new Error('Identificador curricular inválido: ' + domainId + ' / ' + id);
  }
  return domainId + '::' + id;
}

export function createDomainPacks(packs) {
  const domains = new Map();
  const references = new Map();
  for (const pack of packs) {
    const {id, catalog} = pack;
    if (!domainPattern.test(id) || domains.has(id) || !catalog?.catalogId ||
        (catalog.domainId !== undefined && catalog.domainId !== id)) {
      throw new Error('Domain Pack inválido ou duplicado: ' + id);
    }
    domains.set(id, {...pack, dag:createDag(catalog.topics)});
    for (const topic of catalog.topics) {
      const ref = qualify(id, topic.id);
      references.set(ref, {domainId:id, topicId:topic.id, title:topic.title});
    }
  }

  const qualified = [...domains.values()].flatMap(({id, catalog}) => catalog.topics.map(topic => {
    const ref = qualify(id, topic.id);
    const cross = topic.crossPrerequisites ?? [];
    if (!Array.isArray(cross) || cross.some(parent => !references.has(parent) ||
        references.get(parent).domainId === id)) {
      throw new Error('Pré-requisito cruzado inválido em ' + ref);
    }
    const owned = item => ({...item, id:qualify(id, item.id)});
    return {...topic, id:ref, domainId:id, trackId:qualify(id, topic.trackId),
      prerequisites:[...topic.prerequisites.map(parent => qualify(id, parent)), ...cross],
      subtopics:topic.subtopics.map(owned), criteria:topic.criteria.map(owned),
      bibliography:topic.bibliography.map(item => ({...owned(item), bookId:qualify(id, item.bookId)}))};
  }));
  const dag = createDag(qualified);
  const crossAncestors = new Map(qualified.map(({id}) => [
    id, ancestors(dag, [id]).filter(ref => references.get(ref).domainId !== references.get(id).domainId)
  ]));

  function scope(domainId, states, mode, now) {
    if (!CROSS_MODES.includes(mode)) throw new Error('Modo de pré-requisitos inválido');
    const pack = domains.get(domainId);
    if (!pack) throw new Error('Domínio curricular desconhecido: ' + domainId);
    const external = new Map([...domains.values()].filter(({id}) => id !== domainId).map(({id, dag}) =>
      [id, states[id] && refreshLearning(dag, states[id], now).progress]));
    const progress = ref => {
      const target = references.get(ref);
      return external.get(target?.domainId)?.[target?.topicId];
    };
    const isPending = ref => {
      const item = progress(ref);
      return !mastered(item) || item.state === 'S6';
    };
    return {...pack.dag, difficulties:pack.catalog.difficulties, cardContent:pack.profile?.cardContent, cross: {
      mode,
      reference: ref => references.get(ref),
      progress,
      isPending,
      ancestors: topicId => crossAncestors.get(qualify(domainId, topicId)),
      pending: topicId => (pack.dag.byId.get(topicId).crossPrerequisites ?? []).filter(isPending)
    }};
  }
  return {domains, dag, references, scope};
}
