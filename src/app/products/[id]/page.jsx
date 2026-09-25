"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { getProductById, deleteProduct } from "@/services/productService";
import { parseId } from "@/utils/params";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ImageGallery from "@/components/ImageGallery";
import ReviewList from "@/components/ReviewList";
import ConfirmDialog from "@/components/ConfirmDialog"; // NEW

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseId(params.id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMissing, setIsMissing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false); // NEW
  const [deleting, setDeleting] = useState(false); // NEW
  const [deleteError, setDeleteError] = useState(""); // NEW

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

  function handleBack() {
    if (window.history.length > 1) router.back();
    else router.push("/products");
  }

  // NEW: delete confirm
  async function handleConfirmDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteProduct(id);
      router.push("/products");
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  }

  if (id === null || isMissing) notFound();

  if (loading) return <Loader text="Loading product..." />;
  if (error) {
    return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
  }
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="space-y-6">
      {/* NEW: top row with Back + Edit/Delete */}
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="text-sm text-blue-600 hover:underline">
          ← Back to products
        </button>
        <div className="flex gap-2">
          <Link
            href={`/products/${id}/edit`}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-100"
          >
            Edit
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            className="text-sm border border-red-300 text-red-600 rounded px-3 py-1.5 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {deleteError && (
        <div role="alert" className="bg-red-50 text-red-700 text-sm p-3 rounded">
          {deleteError}
        </div>
      )}

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

      {/* NEW: confirm popup */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this product?"
        message={`"${product.title}" will be removed from the list. This cannot be undone.`}
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}