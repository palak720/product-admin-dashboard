import api from "@/lib/axios";

// Priority: search > category > all products
// Sort teeno ke saath lag sakta hai
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
  return data;
}

// GET /products/categories
export async function getCategories() {
  const { data } = await api.get("/products/categories");
  // API objects deti hai ({ slug, name, url }). Purane version mein plain strings the.
  // Dono handle karte hain.
  return data.map((c) =>
    typeof c === "string" ? { slug: c, name: c } : { slug: c.slug, name: c.name }
  );
}
// GET /products/{id}
// Galat id par API 404 deti hai, jo Axios interceptor error.status = 404 bana deta hai
export async function getProductById(id, { signal } = {}) {
  const { data } = await api.get(`/products/${id}`, { signal });
  return data;
}