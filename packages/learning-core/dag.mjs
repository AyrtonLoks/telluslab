export const topicOrder = (a, b) => {
  const numericId = /^\d+\.\d+$/;
  const leftNumeric = numericId.test(a);
  const rightNumeric = numericId.test(b);
  if (leftNumeric && rightNumeric) {
    const [al, an] = a.split('.').map(Number);
    const [bl, bn] = b.split('.').map(Number);
    return al - bl || an - bn;
  }
  if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1;
  return a === b ? 0 : a < b ? -1 : 1;
};

export const mastered = progress => ['S4', 'S5', 'S6'].includes(progress?.state);

export function createDag(topics) {
  const byId = new Map(topics.map(topic => [topic.id, topic]));
  if (byId.size !== topics.length) throw new Error('Macrotema duplicado');
  const dependents = new Map(topics.map(({id}) => [id, []]));
  for (const topic of topics) {
    if (new Set(topic.prerequisites).size !== topic.prerequisites.length) {
      throw new Error('Pré-requisito duplicado em ' + topic.id);
    }
    for (const parent of topic.prerequisites) {
      if (!byId.has(parent)) throw new Error(topic.id + ' referencia nó ausente ' + parent);
      dependents.get(parent).push(topic.id);
    }
  }
  const order = [];
  const done = new Set();
  const stack = new Set();
  function visit(id) {
    if (stack.has(id)) {
      const path = [...stack];
      throw new Error('Ciclo: ' + [...path.slice(path.indexOf(id)), id].join(' → '));
    }
    if (done.has(id)) return;
    stack.add(id);
    [...byId.get(id).prerequisites].sort(topicOrder).forEach(visit);
    stack.delete(id);
    done.add(id);
    order.push(id);
  }
  [...byId.keys()].sort(topicOrder).forEach(visit);
  return {byId, dependents, order};
}

export function ancestors(dag, targets) {
  const seen = new Set();
  function walk(id) {
    const topic = dag.byId.get(id);
    if (!topic) throw new Error('Macrotema desconhecido: ' + id);
    for (const parent of topic.prerequisites) {
      if (!seen.has(parent)) {
        seen.add(parent);
        walk(parent);
      }
    }
  }
  targets.forEach(walk);
  return dag.order.filter(id => seen.has(id));
}

const edgesOf = (dag, ids) => {
  const included = new Set(ids);
  return ids.flatMap(id => dag.byId.get(id).prerequisites
    .filter(parent => included.has(parent)).map(parent => ({from: parent, to: id})));
};

export function targetsFor(catalog, target) {
  if (target.kind === 'topic' && catalog.topics.some(t => t.id === target.id)) return [target.id];
  if (target.kind === 'book' && catalog.books.some(b => b.id === target.id)) {
    return catalog.topics.filter(t => t.bibliography.some(b => b.bookId === target.id)).map(t => t.id);
  }
  throw new Error('Alvo desconhecido: ' + target.id);
}

export function pendingPath(catalog, dag, progress, target) {
  const targets = targetsFor(catalog, target);
  const pendingTargets = targets.filter(id => !mastered(progress[id]));
  const prerequisites = ancestors(dag, pendingTargets).filter(id => !mastered(progress[id]));
  const wanted = new Set([...pendingTargets, ...prerequisites]);
  const order = dag.order.filter(id => wanted.has(id));
  const crossOrder = dag.cross ? [...new Set(pendingTargets.flatMap(id => dag.cross.ancestors(id)))]
    .filter(dag.cross.isPending) : [];
  return {targets, pendingTargets, prerequisites, order, edges: edgesOf(dag, order), ...(dag.cross && {crossOrder})};
}

export function trackView(dag, trackId) {
  const primary = dag.order.filter(id => dag.byId.get(id).trackId === trackId);
  const external = new Set(primary.flatMap(id => dag.byId.get(id).prerequisites)
    .filter(id => dag.byId.get(id).trackId !== trackId));
  const included = new Set([...primary, ...external]);
  const order = dag.order.filter(id => included.has(id));
  return {nodes: order.map(id => ({...dag.byId.get(id), external: external.has(id)})),
    edges: edgesOf(dag, order).filter(edge => !external.has(edge.to))};
}
