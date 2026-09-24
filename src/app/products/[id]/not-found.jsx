import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="text-center py-16 space-y-4">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-gray-500">
        The product you are looking for does not exist.
      </p>
      <Link
        href="/products"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to products
      </Link>
    </div>
  );
}