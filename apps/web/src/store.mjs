const DB = 'laboratorio-matematica-v1';
const STORE = 'workspace';
const KEY = 'learning';

export function openStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Feche outras versões abertas do laboratório.'));
  });
}

export function read(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE);
    const req = tx.objectStore(STORE).get(KEY);
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('Leitura interrompida.'));
  });
}

export function change(db, initial, reducer) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.get(KEY);
    let next;
    let failure;
    req.onsuccess = () => {
      try {
        next = reducer(req.result ?? initial);
        store.put(next, KEY);
      } catch (error) {
        failure = error;
        tx.abort();
      }
    };
    tx.oncomplete = () => resolve(next);
    tx.onabort = () => reject(failure ?? tx.error ?? new Error('Alteração interrompida.'));
  });
}
