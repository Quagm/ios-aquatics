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
  
  // Reflect inventory: derive stock availability from products.stock
  const stock = typeof product?.stock === 'number' ? product.stock : undefined
  const hasFiniteStock = typeof stock === 'number'
  const stockCount = hasFiniteStock ? stock : undefined
  const inStock = hasFiniteStock ? stock > 0 : true
  const canAdd = inStock && (!hasFiniteStock || qty <= stockCount)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
        <p className="text-lg text-white/70 mb-4">{product.category}</p>
        
        <div className="flex items-center space-x-5 mb-6">
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

      {/* stock status */}
      <div className="flex items-center space-x-3 mb-6">
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

      {/* quantity & add to cart */}
      <div className="space-y-4">
        <div className="flex items-center space-x-5">
          <label className="font-medium text-white text-base">Quantity:</label>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-14 text-center text-white text-base font-medium" aria-live="polite">{qty}</span>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg"
              onClick={() => setQty((q) => hasFiniteStock ? Math.min(stockCount, q + 1) : q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        {hasFiniteStock && qty >= stockCount && (
          <p className="text-sm text-white/60">Max quantity reached.</p>
        )}
        
        <div className="flex space-x-3">
          <button
            className="flex-1 bg-[#6c47ff] text-white py-3.5 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={async () => {
              if (isAdding) return
              if (!isLoaded) return
              if (!isSignedIn) {
                alert('Please log in to add items to your cart.')
                return
              }
              if (!canAdd) return
              setIsAdding(true)
              addItem({ id: product.id, name: product.name, price: product.price, image: product.image, stockCount: hasFiniteStock ? stockCount : undefined }, qty)
              setTimeout(() => setIsAdding(false), 1000)
            }}
            disabled={isAdding || !isLoaded || !canAdd}
          >
            {isAdding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* description */}
      {description && (
        <div className="mt-12">
          <p className="text-white/80 leading-relaxed text-lg whitespace-pre-line">{description}</p>
        </div>
      )}
    </div>
  )
}
