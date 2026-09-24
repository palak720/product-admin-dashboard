"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/services/productService";
import { parsePage, parseLimit } from "@/utils/params";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

export default function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL se values padho (safe parse ke saath)
  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));
  const skip = (page - 1) * limit;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // URL badalne ka ek hi function. Aage search/filter/sort bhi isi se honge.
  const updateParams = useCallback(
    (updates, { replace = false } = {}) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (replace) router.replace(url);
      else router.push(url);
    },
    [searchParams, pathname, router]
  );

  function handlePageChange(newPage) {
    updateParams({ page: newPage === 1 ? null : newPage }); // page 1 default hai, URL saaf rakho
  }

  function handleLimitChange(newLimit) {
    // page size badalne par page 1 par wapas
    updateParams({ limit: newLimit === 10 ? null : newLimit, page: null });
  }

  // Data laao jab page ya limit badle
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getProducts({ limit, skip });
        if (!ignore) {
          setProducts(data.products);
          setTotal(data.total);
        }
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
  }, [limit, skip, reloadKey]);

  // ?page=999 jaisa out-of-range page: aakhri valid page par bhejo
  useEffect(() => {
    if (!loading && !error && total > 0 && page > totalPages) {
      updateParams(
        { page: totalPages === 1 ? null : totalPages },
        { replace: true }
      );
    }
  }, [loading, error, total, page, totalPages, updateParams]);

  const outOfRange = !loading && !error && total > 0 && page > totalPages;

  let content;
  if (loading || outOfRange) {
    content = <Loader text="Loading products..." />;
  } else if (error) {
    content = (
      <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
    );
  } else if (products.length === 0) {
    content = <p className="text-center py-16 text-gray-500">No products found.</p>;
  } else {
    content = (
      <>
        <ProductTable products={products} />
        <div className="md:hidden space-y-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Products</h1>
      {content}
      {!error && total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}