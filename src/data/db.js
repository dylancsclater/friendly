import Dexie from 'dexie';

// The single seam between the app and storage. Every screen goes through these
// functions and never touches Dexie directly. To host this later, swap the
// INSIDES of these functions to call a server (fetch) — the signatures and
// return shapes stay the same, so no screen needs to change.
//
// All functions are async on purpose: IndexedDB is fast, but a future server
// is not — keeping these async now means swapping in `fetch` later requires no
// changes to the calling screens.

export const db = new Dexie('friendlyPOS');

db.version(1).stores({
  // '++id' = auto-incrementing primary key. Other listed fields are indexes.
  products: '++id, sortOrder',
  settings: 'key',
});

// ---- Products -------------------------------------------------------------

export async function getProducts() {
  return db.products.orderBy('sortOrder').toArray();
}

export async function addProduct({ title, description, priceCents, imageBlob }) {
  const sortOrder = await db.products.count();
  return db.products.add({ title, description, priceCents, imageBlob, sortOrder });
}

export async function updateProduct(id, changes) {
  return db.products.update(id, changes);
}

export async function deleteProduct(id) {
  return db.products.delete(id);
}

// ---- Settings (teacher PIN, sound on/off, etc.) ---------------------------

const DEFAULT_SETTINGS = {
  teacherPin: '1234', // teacher should change this in Settings
  soundOn: true,
};

export async function getSetting(key) {
  const row = await db.settings.get(key);
  return row ? row.value : DEFAULT_SETTINGS[key];
}

export async function setSetting(key, value) {
  return db.settings.put({ key, value });
}
