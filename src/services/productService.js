import api from "@/lib/axios";
import {
  getAddedProducts,
  addLocalProduct,
  setEditedProduct,
  addDeletedId,
  applyOverridesToProduct,
  applyOverridesToList,
} from "@/services/localOverrides";

// Priority: search > category > all products. Sort teeno ke saath lag sakta hai.
export async function getProducts({
  limit = 10,
  skip = 0,
  q = "",
  category = "",
  sortBy,
  order,
  signal,
} = {}) {
  let url = "/products";
  if (q) url = "/products/search";
  else if (category) url = `/products/category/${encodeURIComponent(category)}`;

  const params = { limit, skip };
  if (q) params.q = q;
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const { data } = await api.get(url, { params, signal });

  // Sirf page 1 par, bina search/category/sort ke: locally added products upar dikhao
  const showLocalAdded = skip === 0 && !q && !category && !sortBy;
  const added = showLocalAdded ? getAddedProducts() : [];

  const merged = applyOverridesToList([...added, ...data.products]);

  return {
    ...data,
    products: merged,
    total: data.total + added.length,
  };
}

export async function getProductById(id, { signal } = {}) {
  // Negative id matlab locally-added product, DummyJSON ke paas hai hi nahi
  if (id < 0) {
    const local = getAddedProducts().find((p) => p.id === id);
    if (!local) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    return local;
  }

  const { data } = await api.get(`/products/${id}`, { signal });
  return applyOverridesToProduct(data);
}

// POST /products/add — DummyJSON asli id ke saath response deta hai, save nahi karta
export async function createProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  return addLocalProduct({ ...payload, ...data, images: payload.images, thumbnail: payload.images?.[0] });
}

// PUT /products/{id} — response aata hai, lekin save nahi hota, isliye khud overlay karte hain
export async function updateProduct(id, payload) {
  if (id < 0) {
    // Locally-added product ko edit karna: added list mein hi update karo
    const added = getAddedProducts().map((p) => (p.id === id ? { ...p, ...payload } : p));
    if (typeof window !== "undefined") {
      sessionStorage.setItem("localAddedProducts", JSON.stringify(added));
    }
    return { ...payload, id };
  }

  const { data } = await api.put(`/products/${id}`, payload);
  setEditedProduct(id, { ...payload, ...data });
  return applyOverridesToProduct({ ...payload, id });
}

// DELETE /products/{id}
export async function deleteProduct(id) {
  if (id < 0) {
    const added = getAddedProducts().filter((p) => p.id !== id);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("localAddedProducts", JSON.stringify(added));
    }
    return;
  }
  await api.delete(`/products/${id}`);
  addDeletedId(id);
}

// GET /products/categories
export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data.map((c) =>
    typeof c === "string" ? { slug: c, name: c } : { slug: c.slug, name: c.name }
  );
}