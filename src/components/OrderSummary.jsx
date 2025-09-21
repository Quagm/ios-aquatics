import Link from "next/link"
import { FileText, ArrowRight, ShoppingCart, Truck } from 'lucide-react'

export default function OrderSummary({ items, subtotal, shipping, tax, total, showCheckoutButton = true }) {
  return (
    <div className="glass-effect rounded-2xl shadow-xl p-8 sticky top-4 border border-white/10 hover:border-white/20 transition-all duration-300">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <FileText className="w-6 h-6" />
        Order Summary
      </h2>
      
      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-center py-2">
          <span className="text-slate-300 text-lg">Subtotal</span>
          <span className="font-semibold text-white text-lg">
            ₱{subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-slate-300 text-lg">Shipping</span>
          <span className="font-semibold text-white text-lg">
            ₱{shipping.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-slate-300 text-lg">Tax</span>
          <span className="font-semibold text-white text-lg">
            ₱{tax.toFixed(2)}
          </span>
        </div>
        
        <div className="border-t border-white/20 pt-6">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span className="text-white">Total</span>
            <span className="text-blue-400">₱{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {showCheckoutButton && (
        <div className="space-y-4">
          <Link
            href="/checkout-page"
            className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold text-center block hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
          >
            <span className="flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
          
          <Link
            href="/store-page"
            className="group w-full glass-effect text-white py-4 rounded-2xl font-semibold text-center block hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/30"
          >
            <span className="flex items-center justify-center gap-2">
              Continue Shopping
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <div className="glass-effect rounded-xl p-4 border border-green-500/20">
          <p className="text-sm text-green-300 font-medium">
            <Truck className="w-4 h-4 inline mr-2" />
            Free shipping on orders over ₱50
          </p>
        </div>
      </div>
    </div>
  )
}
