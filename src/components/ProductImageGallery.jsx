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
    </div>
  )
}
