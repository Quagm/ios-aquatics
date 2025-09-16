"use client"
import { useCart } from "@/components/CartContext"

export default function ProductDetails({ product }) {
  const { addItem } = useCart()
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
        <p className="text-white/80 leading-relaxed mb-8 text-lg">{product.description}</p>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Key Features:</h3>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white/80 text-lg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-3 mb-8">
        {product.inStock ? (
          <>
            <span className="w-4 h-4 bg-green-400 rounded-full"></span>
            <span className="text-green-300 font-medium text-lg">In Stock ({product.stockCount} available)</span>
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
            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg">
              -
            </button>
            <span className="w-16 text-center text-white text-lg font-medium">1</span>
            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg">
              +
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button className="flex-1 bg-[#6c47ff] text-white py-4 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors text-lg" onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)}>
            Add to Cart
          </button>
          <button className="px-8 py-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-2xl">
            w
          </button>
        </div>
      </div>
    </div>
  )
}
