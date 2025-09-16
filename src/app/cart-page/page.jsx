"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import CartItem from "@/components/CartItem"
import OrderSummary from "@/components/OrderSummary"
import EmptyCart from "@/components/EmptyCart"

export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      name: "Tropical Fish - Neon Tetra",
      price: 25.00,
      quantity: 2,
      image: "/logo-aquatics.jpg"
    },
    {
      id: 2,
      name: "Aquarium Filter",
      price: 45.00,
      quantity: 1,
      image: "/logo-aquatics.jpg"
    },
    {
      id: 3,
      name: "Aquatic Plants Bundle",
      price: 35.00,
      quantity: 1,
      image: "/logo-aquatics.jpg"
    }
  ]

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = 10.00
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleQuantityChange = (itemId, newQuantity) => {
    // Handle quantity change logic here
    console.log(`Item ${itemId} quantity changed to ${newQuantity}`)
  }

  const handleRemoveItem = (itemId) => {
    // Handle item removal logic here
    console.log(`Item ${itemId} removed`)
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
          
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
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
                  items={cartItems}
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
