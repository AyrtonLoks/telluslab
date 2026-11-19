import { importSnapshot } from '../learning-core/snapshot.mjs';

export const BRIDGE_FORMAT = 'telluslab.snapshot';
export const BRIDGE_VERSION = 1;
export const MAX_SNAPSHOT_BYTES = 10 * 1024 * 1024;

export function createTellusPediaBridge(registry) {
  function resolve(areaId, topicId = null) {
    const area = registry.get(areaId);
    if (!area) throw new Error('Área desconhecida: ' + (areaId || ''));
    if (topicId !== null && !area.catalog.topics.some(topic => topic.id === topicId)) {
      throw new Error('Tópico desconhecido nesta área: ' + topicId);
    }
    return {area, topicId};
  }

  function parseLaunch(search) {
    const params = new URLSearchParams(search);
    for (const key of ['area','domain','topic']) {
      if (params.getAll(key).length > 1) throw new Error('Parâmetro repetido: ' + key);
    }
    if (params.has('area') && params.has('domain') && params.get('area') !== params.get('domain')) {
      throw new Error('Área e domínio incompatíveis.');
    }
    const areaId = params.get('area') ?? params.get('domain');
    const {topicId} = resolve(areaId, params.has('topic') ? params.get('topic') : null);
    return {areaId, topicId};
  }

  function readSnapshot(areaId, snapshot) {
    const {area} = resolve(areaId);
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
      throw new Error('Snapshot ausente ou inválido.');
    }
    const payload = JSON.stringify(snapshot);
    if (new TextEncoder().encode(payload).byteLength > MAX_SNAPSHOT_BYTES) {
      throw new Error('O snapshot excede 10 MiB.');
    }
    importSnapshot(payload, area.catalog, area.dag);
    return snapshot;
  }

  function wrapSnapshot(areaId, snapshot) {
    const validated = readSnapshot(areaId, snapshot);
    return {format:BRIDGE_FORMAT,version:BRIDGE_VERSION,areaId,snapshot:validated};
  }

  function unwrapSnapshot(envelope, expectedAreaId) {
    if (envelope?.format !== BRIDGE_FORMAT || envelope.version !== BRIDGE_VERSION) {
      throw new Error('Formato ou versão do envelope TellusLab incompatível.');
    }
    if (expectedAreaId !== undefined && expectedAreaId !== envelope.areaId) {
      throw new Error('O snapshot pertence a outra área.');
    }
    return {areaId:envelope.areaId,snapshot:readSnapshot(envelope.areaId,envelope.snapshot)};
  }

  return Object.freeze({parseLaunch, wrapSnapshot, unwrapSnapshot});
}

