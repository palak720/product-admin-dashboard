"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0); // Retry dabane par +1

  useEffect(() => {
    let ignore = false; // cleanup ke baad purana response state set na kare

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getProducts({ limit: 10, skip: 0 });
        if (!ignore) setProducts(data.products);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  if (loading) return <Loader text="Loading products..." />;
  if (error) {
    return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
  }
  if (products.length === 0) {
    return <p className="text-center py-16 text-gray-500">No products found.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Products</h1>

      {/* Desktop: table (md se upar dikhta hai) */}
      <ProductTable products={products} />

      {/* Mobile: cards (md se neeche dikhte hain) */}
      <div className="md:hidden space-y-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}