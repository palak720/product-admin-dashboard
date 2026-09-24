import api from "@/lib/axios";

// q ho toh GET /products/search?q=..., warna GET /products
// signal: AbortController ka signal, request cancel karne ke liye
export async function getProducts({ limit = 10, skip = 0, q = "", signal } = {}) {
  const url = q ? "/products/search" : "/products";
  const params = q ? { q, limit, skip } : { limit, skip };

  const { data } = await api.get(url, { params, signal });
  return data;
}