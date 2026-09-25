"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { getProductById, updateProduct } from "@/services/productService";
import { parseId } from "@/utils/params";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseId(params.id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMissing, setIsMissing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (id === null) return;
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      setIsMissing(false);
      try {
        const data = await getProductById(id, { signal: controller.signal });
        if (!ignore) setProduct(data);
      } catch (err) {
        if (ignore) return;
        if (err.status === 404) setIsMissing(true);
        else setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id, reloadKey]);

  if (id === null || isMissing) notFound();
  if (loading) return <Loader text="Loading product..." />;
  if (error) {
    return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
  }
  if (!product) return null;

  async function handleUpdate(payload) {
    await updateProduct(id, payload);
    router.push(`/products/${id}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Product</h1>
      <ProductForm
        initialValues={{
          title: product.title,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          description: product.description,
          thumbnail: product.thumbnail ?? "",
        }}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  );
}