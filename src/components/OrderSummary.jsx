import Link from "next/link"

export default function OrderSummary({ items, subtotal, shipping, tax, total, showCheckoutButton = true }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-8 sticky top-4 border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-8">
        Order Summary
      </h2>
      
      <div className="space-y-6 mb-8">
        <div className="flex justify-between">
          <span className="text-white/70 text-lg">Subtotal</span>
          <span className="font-medium text-white text-lg">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70 text-lg">Shipping</span>
          <span className="font-medium text-white text-lg">
            ${shipping.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70 text-lg">Tax</span>
          <span className="font-medium text-white text-lg">
            ${tax.toFixed(2)}
          </span>
        </div>
        
        <div className="border-t border-white/30 pt-6">
          <div className="flex justify-between text-xl font-bold">
            <span className="text-white">Total</span>
            <span className="text-[#6c47ff]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {showCheckoutButton && (
        <div className="space-y-4">
          <Link
            href="/checkout-page"
            className="w-full bg-[#6c47ff] text-white py-4 rounded-full font-medium text-center block hover:bg-[#5a3ae6] transition-colors"
          >
            Proceed to Checkout
          </Link>
          
          <Link
            href="/store-page"
            className="w-full bg-gray-200 text-gray-700 py-4 rounded-full font-medium text-center block hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-white/70">
          Free shipping on orders over $50
        </p>
      </div>
    </div>
  )
}
