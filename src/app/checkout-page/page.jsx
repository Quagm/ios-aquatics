"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import Image from "next/image"
import OrderSummary from "@/components/OrderSummary"
import CartItem from "@/components/CartItem"
import EmptyCart from "@/components/EmptyCart"
import { useCart } from "@/components/CartContext"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { createOrder } from "@/lib/queries"

export default function CheckoutPage() {
  const { items, subtotal, clearCart, updateQuantity, removeItem } = useCart()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")
  // Saved account info (name, email, phone, address, city, province, postal)
  const [account, setAccount] = useState(null)

  // Load saved account info from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('account-info') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setAccount(parsed)
      } else {
        setAccount(null)
      }
    } catch {
      setAccount(null)
    }
  }, [])

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

    // Guard: require saved account address
    const name = String(account?.name || '').trim()
    const email = String(account?.email || '').trim()
    const phone = String(account?.phone || '').trim()
    const address = String(account?.address || '').trim()
    const city = String(account?.city || '').trim()
    const province = String(account?.province || '').trim()
    const postal = String(account?.postal || '').trim()
    if (!name || !email || !phone || !address || !city || !province || !postal) {
      setError("Please complete your address in Account first.")
      router.push('/account-page')
      return
    }

    setPlacing(true)
    setError("")
    try {
      // Collect customer data from saved account info
      const [firstName = '', lastName = ''] = name.split(' ')
      const customer = {
        first_name: firstName,
        last_name: lastName,
        name,
        email,
        phone,
        address,
        city,
        province,
        postal_code: postal,
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
          name,
          orderId: order?.id,
          // Do not pass a specific paymentMethod so PayMongo shows selection (card, gcash)
        })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to create payment link')
      const url = data?.checkout_url
      if (!url) throw new Error('Payment link missing checkout URL')

      // Redirect to PayMongo to complete payment
      try { clearCart?.() } catch {}
      window.location.href = url
    } catch (err) {
      setError(err.message || "Failed to place order")
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className="flex-1 w-full" style={{paddingTop: '120px', paddingBottom: '120px'}}>
        <div className="max-w-[1600px] mx-auto w-full" style={{paddingLeft: '24px', paddingRight: '24px'}}>
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center text-center" style={{marginBottom: '80px', padding: '60px 40px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{marginBottom: '24px'}}>
              <span className="gradient-text">Checkout</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Review your order and complete your purchase
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{gap: '48px'}}>
            {/* Left: Cart Review */}
            <div className="flex flex-col" style={{gap: '32px'}}>
              {/* Cart Review */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white" style={{marginBottom: '32px'}}>Your Cart</h2>
                {items.length === 0 ? (
                  <EmptyCart />
                ) : (
                  <div style={{gap: '24px'}}>
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onQuantityChange={(id, qty) => updateQuantity(id, qty)}
                        onRemove={(id) => removeItem(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary + Place Order */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 sticky top-4 border border-white/20">
                <h2 className="text-2xl font-semibold text-white" style={{marginBottom: '32px'}}>
                  Order Summary
                </h2>
                {error && <p className="text-red-300 mb-4">{error}</p>}
                
                {/* Order Items */}
                <div style={{gap: '24px', marginBottom: '32px'}}>
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

                {/* Delivery Address + Payment inside Order Summary */}
                <div style={{gap: '24px', marginBottom: '32px'}}>
                  {/* Delivery Address (read-only from Account) */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">Delivery Address</h3>
                      <a
                        href="/account-page"
                        className="px-3 py-2 rounded-md text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        Edit
                      </a>
                    </div>
                    {!account ? (
                      <p className="text-sm text-white/70">No address found. Please set up your address.</p>
                    ) : (
                      <p className="text-white/90 text-sm leading-relaxed">
                        {(account.address || '').trim()}
                        {account.city ? `, ${account.city}` : ''}
                        {account.province ? `, ${account.province}` : ''}
                        {account.postal ? ` ${account.postal}` : ''}
                      </p>
                    )}
                  </div>

                  {/* Payment Note */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-3">Payment</h3>
                    <p className="text-sm text-white/70">You will choose GCash or Card on the PayMongo page after you click Checkout.</p>
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div style={{gap: '16px', marginBottom: '32px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '24px'}}>
                  <div className="flex justify-between">
                    <span className="text-white/70 text-lg">Subtotal</span>
                    <span className="font-medium text-white text-lg">₱{subtotal.toFixed(2)}</span>
                  </div>
                  
                  
                  
                  <div style={{borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '16px'}}>
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#6c47ff]">₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100" style={{padding: '20px'}} onClick={handlePlaceOrder} disabled={placing || items.length === 0}>
                  {placing ? "Processing..." : "Checkout"}
                </button>
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
