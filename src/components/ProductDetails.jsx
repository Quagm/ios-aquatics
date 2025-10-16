"use client"
import { useState } from 'react'
import { useCart } from "@/components/CartContext"
import { useUser } from '@clerk/nextjs'

export default function ProductDetails({ product }) {
  const { addItem } = useCart()
  const { isSignedIn, isLoaded } = useUser()
  const [qty, setQty] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const features = Array.isArray(product?.features) ? product.features : []
  const description = product?.description || ''
  const inStock = typeof product?.inStock === 'boolean' ? product.inStock : true
  const stockCount = typeof product?.stockCount === 'number' ? product.stockCount : undefined
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-3">{product.name}</h1>
        <p className="text-xl text-white/70 mb-6">{product.category}</p>
        
        <div className="flex items-center space-x-6 mb-8">
          <span className="text-4xl font-bold text-[#6c47ff]">₱{product.price}</span>
          {product.originalPrice && (
            <span className="text-2xl text-gray-500 line-through">₱{product.originalPrice}</span>
          )}
          {product.originalPrice && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Save ₱{(product.originalPrice - product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div>
        {description && (
          <p className="text-white/80 leading-relaxed mb-8 text-lg">{description}</p>
        )}
        
        {features.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Key Features:</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-white/80 text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-3 mb-8">
        {inStock ? (
          <>
            <span className="w-4 h-4 bg-green-400 rounded-full"></span>
            <span className="text-green-300 font-medium text-lg">In Stock{stockCount != null ? ` (${stockCount} available)` : ''}</span>
          </>
        ) : (
          <>
            <span className="w-4 h-4 bg-red-400 rounded-full"></span>
            <span className="text-red-300 font-medium text-lg">Out of Stock</span>
          </>
        )}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-6">
        <div className="flex items-center space-x-6">
          <label className="font-medium text-white text-lg">Quantity:</label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-16 text-center text-white text-lg font-medium" aria-live="polite">{qty}</span>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            className="flex-1 bg-[#6c47ff] text-white py-4 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={async () => {
              if (isAdding) return
              if (!isLoaded) return
              if (!isSignedIn) {
                alert('Please log in to add items to your cart.')
                return
              }
              setIsAdding(true)
              addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, qty)
              setTimeout(() => setIsAdding(false), 1000)
            }}
            disabled={isAdding || !isLoaded}
          >
            {isAdding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
