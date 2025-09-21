import Link from "next/link"
import { ShoppingCart, ArrowRight } from 'lucide-react'

export default function EmptyCart() {
  return (
    <div className="text-center py-20">
      <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto border border-white/10">
        <div className="mb-8 animate-bounce">
          <ShoppingCart className="w-20 h-20 text-blue-400 mx-auto" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-6">
          Your cart is empty
        </h2>
        <p className="text-slate-300 mb-10 text-lg leading-relaxed">
          Discover our amazing collection of aquatic products and start building your underwater paradise!
        </p>
        <Link 
          href="/store-page"
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  )
}
