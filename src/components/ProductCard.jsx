"use client"
import Image from "next/image"
import Link from "next/link"

export default function ProductCard({ product, showAddToCart = true }) {
  return (
    <Link href={`/product-page?id=${product.id}`} className="block">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-white/20 cursor-pointer">
        <div className="aspect-square relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-white mb-2 text-lg">{product.name}</h3>
          {product.category && (
            <p className="text-sm text-white/70 mb-4">{product.category}</p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-[#6c47ff]">${product.price}</span>
            {showAddToCart && (
              <button 
                className="bg-[#6c47ff] text-white px-6 py-2 rounded-full text-sm hover:bg-[#5a3ae6] transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to cart functionality would go here
                }}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
