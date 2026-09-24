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