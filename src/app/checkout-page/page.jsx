"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/footer"
import Image from "next/image"
import OrderSummary from "@/components/OrderSummary"
import { useCart } from "@/components/CartContext"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createOrder } from "@/lib/queries"

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")
  // Customer fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState('gcash')

  // Shared input styles matching dark glassmorphism card
  const inputClass = "w-full px-4 py-3 bg-white/5 text-white placeholder-white/60 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"

  const shipping = 0
  const tax = 0
  const total = subtotal

  const handlePlaceOrder = async (e) => {
    e?.preventDefault?.()
    // Guard: prevent placing orders with empty cart
    if (!items || items.length === 0) {
      setError("Your cart is empty. Please add items before placing an order.")
      return
    }

    setPlacing(true)
    setError("")
    try {
      // Collect customer data from form inputs
      const customer = {
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        address,
        city,
        province,
        postal_code: postalCode,
      }
      const order = await createOrder({
        customer,
        items,
        totals: { subtotal, shipping, tax, total }
      })

      // Create PayMongo payment link (amount in centavos)
      const cents = Math.max(1, Math.round(total * 100))
      const resp = await fetch('/api/paymongo/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cents,
          description: `Order ${order?.id || ''}`.trim(),
          email,
          name: `${firstName} ${lastName}`.trim(),
          orderId: order?.id,
          paymentMethod,
        })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to create payment link')
      const url = data?.checkout_url
      if (!url) throw new Error('Payment link missing checkout URL')

      // Redirect to PayMongo to complete payment
      window.location.href = url
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
              <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-8">
                  Shipping Information
                </h2>
                
                <form className="space-y-6" onSubmit={handlePlaceOrder}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        First Name
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Address
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        City
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        Province
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder="e.g., Metro Manila"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g., 1747"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className={inputClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+63 912 345 6789"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-8">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gcash')}
                      className={`w-full px-4 py-3 rounded-md border transition ${paymentMethod === 'gcash' ? 'border-blue-400 bg-blue-500/10 text-white' : 'border-white/30 text-white/80 hover:border-white/50 hover:bg-white/10'}`}
                    >
                      GCash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full px-4 py-3 rounded-md border transition ${paymentMethod === 'card' ? 'border-blue-400 bg-blue-500/10 text-white' : 'border-white/30 text-white/80 hover:border-white/50 hover:bg-white/10'}`}
                    >
                      Credit/Debit Card
                    </button>
                  </div>
                  <p className="text-sm text-white/70">
                    You will be redirected to PayMongo to securely complete your {paymentMethod === 'gcash' ? 'GCash' : 'Card'} payment.
                  </p>
                </div>
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
