import Link from "next/link"
import { ShoppingCart, MapPin } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="mt-16 pt-8 border-t border-white/20">
      <h2 className="text-2xl font-bold text-white mb-10 text-center">
        Quick Actions
      </h2>

      <div className="flex justify-center gap-6">
        <Link 
          href="/cart-page" 
          className="p-6 rounded-lg border border-white/20 bg-white/5 
                     hover:bg-white/10 transition-all text-center flex flex-col items-center"
        >
          <ShoppingCart className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-sm font-medium text-white">View Cart</span>
        </Link>

        <button 
          className="p-6 rounded-lg border border-white/20 bg-white/5 
                     hover:bg-white/10 transition-all text-center flex flex-col items-center"
        >
          <MapPin className="w-8 h-8 text-green-400 mb-2" />
          <span className="text-sm font-medium text-white">Addresses</span>
        </button>
      </div>
    </div>
  )
}
