import { advancementGuard, refreshLearning, canonicalDiagnosis } from '../../../packages/learning-core/index.mjs';
import { VERSION, summarize } from '../../../packages/tellus-bridge/index.mjs';

export function buildBridgeSnapshot(registry, packs, workspace, now, backup) {
  const proficiency = {};
  const overdue = [];
  const suggestions = [];
  const states = Object.fromEntries(Object.entries(workspace.domains).map(([id, value]) => [id,value.state]));
  for (const domain of registry.domains) {
    const dag = packs.scope(domain.id, states, workspace.prerequisiteMode, now);
    const state = refreshLearning(dag, states[domain.id], now);
    const cardsByTopic = new Map();
    const sessionCounts = new Map();
    const latestAttempts = new Map();
    for (const card of Object.values(state.cards)) {
      if (!cardsByTopic.has(card.topicId)) cardsByTopic.set(card.topicId, []);
      cardsByTopic.get(card.topicId).push(card);
    }
    for (const session of Object.values(state.sessions)) {
      const ids = new Set(session.blocks.flatMap(block => block.topicIds ?? block.slots.flatMap(slot => slot.topicIds)));
      for (const id of ids) sessionCounts.set(id, (sessionCounts.get(id) ?? 0) + 1);
    }
    for (const attempt of Object.values(state.attempts)) {
      for (const id of attempt.topicIds) {
        if (!latestAttempts.has(id) || latestAttempts.get(id).submittedAt < attempt.submittedAt) {
          latestAttempts.set(id, attempt);
        }
      }
    }
    for (const node of domain.nodes) {
      const id = node.id.split(':')[1];
      const cards = (cardsByTopic.get(id) ?? []).sort((a,b) => Date.parse(a.dueAt) - Date.parse(b.dueAt) || a.id.localeCompare(b.id));
      const next = cards[0];
      const status = state.progress[id].state;
      const diagnosis = canonicalDiagnosis(latestAttempts.get(id)?.difficulty);
      const nextReviewAt = next ? new Date(next.dueAt).toISOString() : null;
      proficiency[node.id] = {state:status, stability:next?.stability ?? null, difficulty:next?.difficulty ?? null,
        nextReviewAt, sessions:sessionCounts.get(id) ?? 0,
        lastDiagnosis:Object.hasOwn(domain.difficulties, diagnosis) ? diagnosis : null};
      if (status === 'S6') overdue.push({nodeId:node.id,dueAt:nextReviewAt,
        cards:cards.filter(card => Date.parse(card.dueAt) <= Date.parse(now)).length});
    }
    const next = dag.order.filter(id => advancementGuard(dag, state.progress, id).allowed)
      .sort((a,b) => state.progress[b].state.localeCompare(state.progress[a].state))[0];
    if (next) suggestions.push({nodeId:domain.id + ':' + next,reason:'advance'});
  }
  overdue.sort((a,b) => a.dueAt.localeCompare(b.dueAt) || a.nodeId.localeCompare(b.nodeId));
  return {kind:'TellusLabSnapshotV1',schemaVersion:VERSION,exportedAt:now,sourceApp:'telluslab',
    summary:summarize(registry, proficiency),proficiency,overdue,
    suggestions:[...overdue.slice(0,8).map(({nodeId}) => ({nodeId,reason:'review'})),...suggestions],
    ...(backup && {backup})};
}
