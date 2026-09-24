import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded-lg p-3 flex gap-3">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-20 w-20 object-cover rounded bg-gray-100"
      />
      <div className="flex-1 text-sm space-y-1">
        <Link
          href={`/products/${product.id}`}
          className="font-medium hover:underline"
        >
          {product.title}
        </Link>
        <p className="text-gray-500 capitalize">{product.category}</p>
        <p>
          <span className="font-semibold">${product.price}</span>
          <span className="text-gray-500"> · ⭐ {product.rating}</span>
        </p>
        <p className="text-gray-500">Stock: {product.stock}</p>
      </div>
    </div>
  );
}