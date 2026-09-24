"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/services/productService";
import { parsePage, parseLimit } from "@/utils/params";
import useDebounce from "@/hooks/useDebounce"; // NEW
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar"; // NEW

function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL se values padho
  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));
  const q = (searchParams.get("q") ?? "").trim(); // NEW
  const skip = (page - 1) * limit;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // NEW: input ki apni state (har key par badalti hai), URL nahi
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 500);

  const totalPages = Math.max(1, Math.ceil(total / limit));

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
    updateParams({ page: newPage === 1 ? null : newPage });
  }

  function handleLimitChange(newLimit) {
    updateParams({ limit: newLimit === 10 ? null : newLimit, page: null });
  }

  // NEW: debounced value badle toh URL update karo, aur page 1 par jao
  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed === q) return; // URL mein pehle se wahi hai, kuch mat karo
    // replace: har search term history mein na bhare
    updateParams({ q: trimmed, page: null }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Data laao jab page, limit ya q badle
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController(); // NEW

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getProducts({
          limit,
          skip,
          q,
          signal: controller.signal, // NEW
        });
        if (!ignore) {
          setProducts(data.products);
          setTotal(data.total);
        }
      } catch (err) {
        // NEW: cancel hui request ka error dikhana nahi hai
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    // NEW: q/page/limit badalne par purani request cancel + purana result ignore
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [limit, skip, q, reloadKey]);

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
    content = (
      <p className="text-center py-16 text-gray-500">
        {q ? `No products found for "${q}".` : "No products found."}
      </p>
    );
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
      {/* NEW: title ke saath search bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <SearchBar value={searchInput} onChange={setSearchInput} />
      </div>

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

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader text="Loading products..." />}>
      <ProductList />
    </Suspense>
  );
}