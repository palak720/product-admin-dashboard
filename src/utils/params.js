export const PAGE_SIZES = [10, 20, 50];
export const DEFAULT_LIMIT = 10;

// "3" -> 3, lekin "abc", "-2", "0", "2.5", null -> 1
export function parsePage(value) {
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1 ? n : 1;
}

// Sirf 10, 20, 50 allowed. Baaki sab -> 10
export function parseLimit(value) {
  const n = Number(value);
  return PAGE_SIZES.includes(n) ? n : DEFAULT_LIMIT;
}

// URL mein sort ek hi value hai, jaise ?sort=price-asc
export const SORT_OPTIONS = [
  { value: "", label: "Sort: Default" },
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", order: "asc" },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", order: "desc" },
  { value: "rating-desc", label: "Rating: High to Low", sortBy: "rating", order: "desc" },
  { value: "rating-asc", label: "Rating: Low to High", sortBy: "rating", order: "asc" },
  { value: "title-asc", label: "Title: A to Z", sortBy: "title", order: "asc" },
  { value: "title-desc", label: "Title: Z to A", sortBy: "title", order: "desc" },
];

// Galat sort value (?sort=abc) -> "" (default)
export function parseSort(value) {
  return SORT_OPTIONS.some((o) => o.value === value) ? value : "";
}

// "price-asc" -> { sortBy: "price", order: "asc" }, default -> {}
export function getSortParams(value) {
  const option = SORT_OPTIONS.find((o) => o.value === value);
  if (!option || !option.sortBy) return {};
  return { sortBy: option.sortBy, order: option.order };
}

// "5" -> 5, lekin "abc", "0", "-1", "1.5", "1e3" -> null
export function parseId(value) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1 ? n : null;
}