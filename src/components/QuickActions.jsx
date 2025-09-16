import Link from "next/link"

export default function QuickActions() {
  return (
    <div className="mt-16 pt-8 border-t border-white/30">
      <h2 className="text-xl font-semibold text-white mb-8 text-center">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/cart-page" className="p-6 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-center bg-white/5">
          <div className="text-3xl mb-3">🛒</div>
          <span className="text-sm font-medium text-white">View Cart</span>
        </Link>
        <Link href="/store-page" className="p-6 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-center bg-white/5">
          <div className="text-3xl mb-3">❤️</div>
          <span className="text-sm font-medium text-white">Wishlist</span>
        </Link>
        <button className="p-6 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-center bg-white/5">
          <div className="text-3xl mb-3">📍</div>
          <span className="text-sm font-medium text-white">Addresses</span>
        </button>
        <button className="p-6 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-center bg-white/5">
          <div className="text-3xl mb-3">⚙️</div>
          <span className="text-sm font-medium text-white">Settings</span>
        </button>
      </div>
    </div>
  )
}
