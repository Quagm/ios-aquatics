"use client"
import Image from "next/image"

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6 border border-white/20">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 relative">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-2 text-lg">
            {item.name}
          </h3>
          <p className="text-xl font-bold text-[#6c47ff]">
            ₱{item.price}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            -
          </button>
          <span className="w-12 text-center text-white text-lg font-medium">
            {item.quantity}
          </span>
          <button 
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white text-lg"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-white mb-2">
            ₱{(item.price * item.quantity).toFixed(2)}
          </p>
          <button 
            className="text-red-400 text-sm hover:text-red-300 font-medium"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
