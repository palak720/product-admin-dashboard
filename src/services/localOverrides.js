const ADDED_KEY = "localAddedProducts";
const EDITED_KEY = "localEditedProducts";
const DELETED_KEY = "localDeletedIds";

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

// ---- Added products (newest first) ----
export function getAddedProducts() {
  return read(ADDED_KEY, []);
}

export function addLocalProduct(product) {
  const list = getAddedProducts();
  // Real ids se takraav na ho, isliye negative fake id
  const fakeId = -(Date.now());
  const withId = { ...product, id: fakeId };
  write(ADDED_KEY, [withId, ...list]);
  return withId;
}

// ---- Edited products (id -> changes) ----
export function getEditedProducts() {
  return read(EDITED_KEY, {});
}

export function setEditedProduct(id, changes) {
  const map = getEditedProducts();
  map[id] = { ...map[id], ...changes };
  write(EDITED_KEY, map);
}

// ---- Deleted ids ----
export function getDeletedIds() {
  return read(DELETED_KEY, []);
}

export function addDeletedId(id) {
  const ids = getDeletedIds();
  if (!ids.includes(id)) write(DELETED_KEY, [...ids, id]);
}

// Ek product par saare local changes apply karo (edit + delete-check ke liye)
export function applyOverridesToProduct(product) {
  if (!product) return product;
  const edited = getEditedProducts();
  const changes = edited[product.id];
  return changes ? { ...product, ...changes } : product;
}

// Ek list par: delete hue hata do, edited apply karo
export function applyOverridesToList(products) {
  const deleted = getDeletedIds();
  const edited = getEditedProducts();
  return products
    .filter((p) => !deleted.includes(p.id))
    .map((p) => (edited[p.id] ? { ...p, ...edited[p.id] } : p));
}

export function isLocallyDeleted(id) {
  return getDeletedIds().includes(id);
}