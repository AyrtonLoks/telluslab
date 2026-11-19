const AREA_ID = /^[a-z][a-z0-9-]{0,63}$/;

export function createAreaRegistry(areas) {
  const registered = new Map();
  for (const area of areas) {
    if (!AREA_ID.test(area?.id ?? '') || registered.has(area.id) ||
        typeof area.catalog?.catalogId !== 'string' || !Array.isArray(area.catalog?.topics)) {
      throw new Error('Área curricular inválida ou duplicada');
    }
    registered.set(area.id, area);
  }
  return Object.freeze({
    get: id => registered.get(id)
  });
}

