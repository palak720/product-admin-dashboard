import Link from "next/link";

export default function ProductTable({ products }) {
  return (
    <div className="hidden md:block overflow-x-auto bg-white border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="h-12 w-12 object-cover rounded bg-gray-100"
                />
              </td>
              <td className="p-3 font-medium">
                <Link href={`/products/${p.id}`} className="hover:underline">
                  {p.title}
                </Link>
              </td>
              <td className="p-3 capitalize">{p.category}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.rating}</td>
              <td className="p-3">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}