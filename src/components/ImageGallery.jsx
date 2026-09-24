"use client";

import { useState } from "react";

export default function ImageGallery({ images, title }) {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[selected]}
          alt={`${title} - image ${selected + 1}`}
          className="h-full w-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setSelected(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-16 w-16 shrink-0 rounded border-2 bg-gray-100 overflow-hidden ${
                i === selected ? "border-blue-600" : "border-transparent"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}