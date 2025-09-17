"use client"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/CartContext"

export default function ProductCard({ product, showAddToCart = true }) {
  const { addItem } = useCart()
  return (
    <Link href={`/product-page?id=${product.id}`} className="block group">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 cursor-pointer group-hover:scale-105 group-hover:border-white/40">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="font-semibold text-white mb-2 text-base sm:text-lg line-clamp-2 group-hover:text-[#6c47ff] transition-colors">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs sm:text-sm text-white/70 mb-4 uppercase tracking-wide">
              {product.category}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span className="text-xl sm:text-2xl font-bold text-[#6c47ff]">
              ₱{product.price}
            </span>
            {showAddToCart && (
              <button 
                className="w-full sm:w-auto bg-[#6c47ff] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm hover:bg-[#5a3ae6] transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)
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
