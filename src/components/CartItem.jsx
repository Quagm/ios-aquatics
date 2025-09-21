"use client"
import Image from "next/image"

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="glass-effect rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 relative rounded-xl overflow-hidden border border-white/20 group-hover:border-white/30 transition-colors">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-white mb-2 text-lg group-hover:text-blue-300 transition-colors">
            {item.name}
          </h3>
          <p className="text-xl font-bold text-blue-400">
            ₱{item.price}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="w-10 h-10 rounded-xl border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg transition-all duration-300 hover:scale-105 hover:border-white/50"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center text-white text-lg font-semibold bg-white/5 rounded-lg py-2">
            {item.quantity}
          </span>
          <button 
            className="w-10 h-10 rounded-xl border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg transition-all duration-300 hover:scale-105 hover:border-white/50"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-white mb-3">
            ₱{(item.price * item.quantity).toFixed(2)}
          </p>
          <button 
            className="text-red-400 text-sm hover:text-red-300 font-medium transition-colors duration-300 hover:underline"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
