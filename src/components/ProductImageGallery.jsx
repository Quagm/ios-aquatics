"use client"
import Image from "next/image"

export default function ProductImageGallery({ product }) {
  return (
    <div className="space-y-6">
      <div className="aspect-square relative bg-white/10 backdrop-blur-md rounded-lg shadow-md overflow-hidden border border-white/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square relative bg-white/10 backdrop-blur-md rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-white/20">
            <Image
              src={product.image}
              alt={`${product.name} ${i}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
