"use client";

import { useRef, useState } from "react";
import { validateProduct } from "@/utils/validateProduct";

const EMPTY = {
  title: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  thumbnail: "",
};

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save" }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const submittingRef = useRef(false); // double-click guard, Login page jaisa hi

  function handleChange(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validateProduct(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submittingRef.current = true;
    setLoading(true);
    setFormError("");

    try {
      const payload = {
        title: values.title.trim(),
        category: values.category.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        description: values.description.trim(),
        images: values.thumbnail ? [values.thumbnail] : [],
      };
      await onSubmit(payload);
    } catch (err) {
      setFormError(err.message);
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg" noValidate>
      {formError && (
        <div role="alert" className="bg-red-50 text-red-700 text-sm p-3 rounded">
          {formError}
        </div>
      )}

      <Field label="Title" error={errors.title}>
        <input
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </Field>

      <Field label="Category" error={errors.category}>
        <input
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="e.g. smartphones"
          className="w-full border rounded px-3 py-2"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price ($)" error={errors.price}>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </Field>

        <Field label="Stock" error={errors.stock}>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </Field>
      </div>

      <Field label="Thumbnail URL (optional)" error={errors.thumbnail}>
        <input
          value={values.thumbnail}
          onChange={(e) => handleChange("thumbnail", e.target.value)}
          placeholder="https://..."
          className="w-full border rounded px-3 py-2"
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}