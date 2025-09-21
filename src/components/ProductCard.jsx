"use client"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/CartContext"
import { Eye, Plus } from 'lucide-react'

export default function ProductCard({ product, showAddToCart = true }) {
  const { addItem } = useCart()
  return (
    <Link href={`/product-page?id=${product.id}`} className="block group">
      <div className="glass-effect rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/10 cursor-pointer group-hover:scale-105 group-hover:border-white/30 group-hover:shadow-blue-500/20">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-3">
            {product.category && (
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                {product.category}
              </span>
            )}
          </div>
          <h3 className="font-bold text-white mb-3 text-lg line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-400">
                ₱{product.price}
              </span>
              <span className="text-sm text-slate-400 line-through opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ₱{Math.round(product.price * 1.2)}
              </span>
            </div>
            {showAddToCart && (
              <button 
                className="group/btn w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-500/20"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Add to Cart
                  <Plus className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
