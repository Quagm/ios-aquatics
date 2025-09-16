import Link from "next/link"

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="text-2xl font-semibold text-white mb-4">
        Your cart is empty
      </h2>
      <p className="text-white/70 mb-8 text-lg">
        Add some products to get started!
      </p>
      <Link 
        href="/store-page"
        className="bg-[#6c47ff] text-white px-8 py-3 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
