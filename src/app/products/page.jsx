
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getProducts, getCategories } from "@/services/productService"; // NEW: getCategories
import { parsePage, parseLimit, parseSort, getSortParams } from "@/utils/params"; // NEW
import useDebounce from "@/hooks/useDebounce";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter"; // NEW
import SortSelect from "@/components/SortSelect"; // NEW

function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL se values padho
  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));
  const q = (searchParams.get("q") ?? "").trim();
  const sort = parseSort(searchParams.get("sort")); // NEW
  // NEW: search aur category ek saath nahi. q ho toh category ignore.
  const category = q ? "" : (searchParams.get("category") ?? "").trim();
  const skip = (page - 1) * limit;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [categories, setCategories] = useState([]); // NEW

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

  // NEW: category chuni -> search saaf, page 1
  function handleCategoryChange(value) {
    setSearchInput("");
    updateParams({ category: value, q: null, page: null });
  }

  // NEW: sort badla -> page 1
  function handleSortChange(value) {
    updateParams({ sort: value, page: null });
  }

  // NEW: categories ek baar laao (dropdown ke liye)
  useEffect(() => {
    let ignore = false;
    getCategories()
      .then((list) => {
        if (!ignore) setCategories(list);
      })
      .catch(() => {
        // dropdown khaali reh jayega, page phir bhi chalega
      });
    return () => {
      ignore = true;
    };
  }, []);

  // NEW: ?category=abc jaisi galat value ho toh URL se hata do
  useEffect(() => {
    if (!category || categories.length === 0) return;
    if (!categories.some((c) => c.slug === category)) {
      updateParams({ category: null, page: null }, { replace: true });
    }
  }, [categories, category, updateParams]);

  // Debounced search -> URL
  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed === q) return;
    const updates = { q: trimmed, page: null };
    if (trimmed) updates.category = null; // NEW: search shuru, category hatao
    updateParams(updates, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Data laao jab page, limit, q, category ya sort badle
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getProducts({
          limit,
          skip,
          q,
          category, // NEW
          ...getSortParams(sort), // NEW: { sortBy, order } ya khaali
          signal: controller.signal,
        });
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
      controller.abort();
    };
  }, [limit, skip, q, category, sort, reloadKey]);

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
        {q
          ? `No products found for "${q}".`
          : category
          ? "No products found in this category."
          : "No products found."}
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
      <h1 className="text-xl font-semibold">Products</h1>

      {/* NEW: toolbar mein search + category + sort */}
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <SearchBar value={searchInput} onChange={setSearchInput} />
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={handleCategoryChange}
        />
        <SortSelect value={sort} onChange={handleSortChange} />
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