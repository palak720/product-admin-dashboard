export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products..."
      aria-label="Search products"
      className="w-full md:w-72 border rounded px-3 py-2 text-sm"
    />
  );
}