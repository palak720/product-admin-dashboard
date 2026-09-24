import api from "@/lib/axios";

// GET /products?limit=10&skip=0
// Returns { products, total, skip, limit }
export async function getProducts({ limit = 10, skip = 0 } = {}) {
  const { data } = await api.get("/products", {
    params: { limit, skip },
  });
  return data;
}