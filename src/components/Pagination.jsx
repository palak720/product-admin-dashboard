import { getPageNumbers } from "@/utils/pagination";
import { PAGE_SIZES } from "@/utils/params";

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm">
      <p className="text-gray-600">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="border rounded px-3 py-1.5 disabled:opacity-40"
        >
          Previous
        </button>

        {getPageNumbers(page, totalPages).map((item, i) =>
          item === "..." ? (
            <span key={`dots-${i}`} className="px-2">…</span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`border rounded px-3 py-1.5 ${
                item === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="border rounded px-3 py-1.5 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <label className="flex items-center gap-2">
        Per page
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border rounded px-2 py-1.5"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  );
}