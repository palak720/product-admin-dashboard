"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "@/services/productService";

export default function NewProductPage() {
  const router = useRouter();

  async function handleCreate(payload) {
    const created = await createProduct(payload);
    router.push(`/products/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Add Product</h1>
      <ProductForm onSubmit={handleCreate} submitLabel="Create Product" />
    </div>
  );
}