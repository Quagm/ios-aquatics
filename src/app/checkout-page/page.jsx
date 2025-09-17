"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import Image from "next/image"
import OrderSummary from "@/components/OrderSummary"
import { useCart } from "@/components/CartContext"
import { useState } from "react"
import { createOrder } from "@/lib/queries"

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")

  const shipping = items.length > 0 ? 10.00 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handlePlaceOrder = async (e) => {
    e?.preventDefault?.()
    setPlacing(true)
    setError("")
    try {
      // Collect minimal fake customer data from form fields later if needed
      const customer = {
        name: "Guest",
        email: "guest@example.com",
        phone: "",
        address: "",
      }
      await createOrder({
        customer,
        items,
        totals: { subtotal, shipping, tax, total }
      })
      clearCart()
      alert("Order placed successfully!")
    } catch (err) {
      setError(err.message || "Failed to place order")
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] flex flex-col">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-12 text-center">
            Checkout
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div className="space-y-12">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                  Shipping Information
                </h2>
                
                <form className="space-y-6" onSubmit={handlePlaceOrder}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Province
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Metro Manila"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1747"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+63 912 345 6789"
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                  Payment Information
                </h2>
                
                <form className="space-y-6" onSubmit={handlePlaceOrder}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-8 sticky top-4 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-8">
                  Order Summary
                </h2>
                {error && <p className="text-red-300 mb-4">{error}</p>}
                
                {/* Order Items */}
                <div className="space-y-6 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-white/70">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-white">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-4 mb-8 border-t border-white/30 pt-6">
                  <div className="flex justify-between">
                    <span className="text-white/70 text-lg">Subtotal</span>
                    <span className="font-medium text-white text-lg">₱{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70 text-lg">Shipping</span>
                    <span className="font-medium text-white text-lg">₱{shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70 text-lg">Tax</span>
                    <span className="font-medium text-white text-lg">₱{tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-white/30 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#6c47ff]">₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Place Order Button */}
                <button className="w-full bg-[#6c47ff] text-white py-4 rounded-full font-medium hover:bg-[#5a3ae6] transition-colors mb-6 disabled:opacity-60 disabled:cursor-not-allowed" onClick={handlePlaceOrder} disabled={placing || items.length === 0}>
                  {placing ? "Placing..." : "Place Order"}
                </button>
                
                <p className="text-sm text-white/70 text-center">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
