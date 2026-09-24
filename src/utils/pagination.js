export function getPageNumbers(current, totalPages) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // pehla, aakhri, aur current ke aas-paas ka ek page
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    }
  }

  const result = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) result.push("..."); // beech mein gap hai
    result.push(p);
    prev = p;
  }
  return result;
}