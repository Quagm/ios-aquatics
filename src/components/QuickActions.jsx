import Link from "next/link"
import { ShoppingCart, Heart, MapPin, Settings } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="mt-16 pt-8 border-t border-white/20">
      <h2 className="text-2xl font-bold text-white mb-10 text-center">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/cart-page" 
          className="p-6 rounded-lg border border-white/20 bg-white/5 
                     hover:bg-white/10 transition-all text-center flex flex-col items-center"
        >
          <ShoppingCart className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-sm font-medium text-white">View Cart</span>
        </Link>

        <Link 
          href="/store-page" 
          className="p-6 rounded-lg border border-white/20 bg-white/5 
                     hover:bg-white/10 transition-all text-center flex flex-col items-center"
        >
          <Heart className="w-8 h-8 text-red-400 mb-2" />
          <span className="text-sm font-medium text-white">Wishlist</span>
        </Link>

        <button 
          className="p-6 rounded-lg border border-white/20 bg-white/5 
                     hover:bg-white/10 transition-all text-center flex flex-col items-center"
        >
          <MapPin className="w-8 h-8 text-green-400 mb-2" />
          <span className="text-sm font-medium text-white">Addresses</span>
        </button>

        <button 
          className="p-6 rounded-lg border border-white/20 bg-white/5 
                     hover:bg-white/10 transition-all text-center flex flex-col items-center"
        >
          <Settings className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-sm font-medium text-white">Settings</span>
        </button>
      </div>
    </div>
  )
}
