"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import CartItem from "@/components/CartItem"
import OrderSummary from "@/components/OrderSummary"
import EmptyCart from "@/components/EmptyCart"
import { useCart } from "@/components/CartContext"

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  const shipping = items.length > 0 ? 10.00 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

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
      <div className="flex-1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-12 text-center">
            Shopping Cart
          </h1>
          
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
