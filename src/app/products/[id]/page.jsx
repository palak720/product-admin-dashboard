"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { getProductById } from "@/services/productService";
import { parseId } from "@/utils/params";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ImageGallery from "@/components/ImageGallery";
import ReviewList from "@/components/ReviewList";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseId(params.id); // number ya null

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMissing, setIsMissing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (id === null) return; // galat id, API call nahi

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

  // Back: pichla list page (filters ke saath), direct link khola ho toh /products
  function handleBack() {
    if (window.history.length > 1) router.back();
    else router.push("/products");
  }

  // Hooks ke baad hi: galat ya missing id -> not-found.jsx dikhta hai
  if (id === null || isMissing) notFound();

  if (loading) return <Loader text="Loading product..." />;
  if (error) {
    return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
  }
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="space-y-6">
      <button onClick={handleBack} className="text-sm text-blue-600 hover:underline">
        ← Back to products
      </button>

      <div className="grid gap-6 md:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-sm text-gray-500 capitalize">
            {product.category}
            {product.brand ? ` · ${product.brand}` : ""}
          </p>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-green-700 bg-green-50 px-2 py-0.5 rounded">
                {product.discountPercentage}% off
              </span>
            )}
          </div>

          <p className="text-sm">⭐ {product.rating} / 5</p>

          <p className={`text-sm ${inStock ? "text-green-700" : "text-red-600"}`}>
            {inStock ? `In stock (${product.stock} left)` : "Out of stock"}
          </p>

          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Reviews ({product.reviews?.length ?? 0})
        </h2>
        <ReviewList reviews={product.reviews} />
      </section>
    </div>
  );
}