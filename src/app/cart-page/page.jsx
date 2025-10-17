"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import CartItem from "@/components/CartItem"
import OrderSummary from "@/components/OrderSummary"
import EmptyCart from "@/components/EmptyCart"
import { useCart } from "@/components/CartContext"
import { ShoppingCart } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  // Shipping and tax removed from cart calculations
  const shipping = 0
  const tax = 0
  const total = subtotal

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId) => {
    removeItem(itemId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 page-section">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-6">
              <ShoppingCart className="w-4 h-4" />
              Shopping Cart
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              <span className="gradient-text">Your</span> Cart
            </h1>
          </div>
          
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary 
                  items={items}
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
