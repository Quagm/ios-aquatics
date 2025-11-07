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

export default function CheckoutPage() {
  const { items, subtotal, clearCart, updateQuantity, removeItem } = useCart()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")

  const [account, setAccount] = useState(null)

  const loadAccountInfo = async () => {
    try {
      const res = await fetch('/api/account', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === 'object' && data !== null) {
          const hasAnyData = Object.values(data).some(v => v && String(v).trim())
          if (hasAnyData) {
            console.log('[checkout] Account info loaded:', data)
            setAccount(data)
            return
          } else {
            console.log('[checkout] Account info is empty')
          }
        } else {
          console.log('[checkout] No account data found')
        }
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('[checkout] Failed to load account info:', res.status, errorData)
      }
      setAccount(null)
    } catch (err) {
      console.error('[checkout] Failed to load account info:', err)
        setAccount(null)
      }
    }

  useEffect(() => {
    loadAccountInfo()
  }, [])

  const shipping = 0
  const tax = 0
  const total = subtotal

  const handlePlaceOrder = async (e) => {
    e?.preventDefault?.()

    if (!items || items.length === 0) {
      setError("Your cart is empty. Please add items before placing an order.")
      return
    }

    let accountData = account
    if (!accountData) {
      try {
        const res = await fetch('/api/account', {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          if (data && typeof data === 'object' && data !== null) {
            const hasAnyData = Object.values(data).some(v => v && String(v).trim())
            if (hasAnyData) {
              accountData = data
              setAccount(data)
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch account info during checkout:', err)
      }
    }

    if (!accountData) {
      setError("Please complete your account information first. Redirecting to Account page...")
      setTimeout(() => router.push('/account-page'), 2000)
      return
    }

    const name = String(accountData.name || '').trim()
    const email = String(accountData.email || '').trim()
    const phone = String(accountData.phone || '').trim()
    const address = String(accountData.address || '').trim()
    const city = String(accountData.city || '').trim()
    const province = String(accountData.province || '').trim()
    const postal = String(accountData.postal || '').trim()
    
    if (!name || !email || !phone || !address || !city || !province || !postal) {
      setError("Please complete all customer information fields.")
      return
    }
    
    console.log('[checkout] Using account data for order:', accountData)

    setPlacing(true)
    setError("")
    try {
      const stockCheckRes = await fetch('/api/products/check-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      
      if (!stockCheckRes.ok) {
        const stockError = await stockCheckRes.json()
        throw new Error(stockError?.error || 'Stock validation failed')
      }

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
      console.log('[checkout] Creating order with customer data:', customer)
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
        customer,
        items,
        totals: { subtotal, shipping, tax, total }
      })
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        throw new Error(orderData?.error || 'Failed to create order')
      }
      const order = orderData

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

        })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to create payment link')
      const url = data?.checkout_url
      if (!url) throw new Error('Payment link missing checkout URL')

      try { clearCart?.() } catch {}
      window.location.href = url
    } catch (err) {
      setError(err.message || "Failed to place order")
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavigationBar />
      
      <div className="flex-1 w-full pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 lg:pb-12">
          <div className="flex">
            <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
            <div className="flex-1">
          <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16 lg:mb-20 bg-white/5 rounded-3xl border border-white/10 px-10 sm:px-14 lg:px-16 py-14 sm:py-18 lg:py-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="gradient-text">Checkout</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Review your order and complete your purchase
            </p>
          </div>
              <div className="h-4 sm:h-6 lg:h-8 w-full"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8 sm:mt-10 lg:mt-12">
            <div className="flex flex-col gap-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-10 sm:p-12 lg:p-14 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-10">Your Cart</h2>
                {items.length === 0 ? (
                  <EmptyCart />
                ) : (
                  <div className="space-y-8">
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

            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg sticky top-4 border border-white/20 checkout-container-spacing">
                <div className="h-4 sm:h-6 lg:h-8"></div>
                <div className="px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-white mb-10">
                  Order Summary
                </h2>
                {error && <p className="text-red-300 mb-8">{error}</p>}
                
                <div className="space-y-6 mb-12">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-5 p-4 bg-white/5 rounded-xl">
                      <div className="w-20 h-20 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white mb-1">{item.name}</p>
                        <p className="text-sm text-white/70">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-white">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 mb-12">
                  <div className="bg-white/5 rounded-xl p-8 sm:p-10 border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Customer Information</h3>
                      <a
                        href="/account-page"
                        className="px-4 py-2 rounded-md text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        Edit
                      </a>
                    </div>
                    {!account ? (
                      <div className="text-sm text-white/70">
                        <p className="mb-4">No account information found. Please complete your account information first.</p>
                        <a
                          href="/account-page"
                          className="inline-block px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Go to Account Page
                        </a>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">Name</p>
                          <p className="font-medium text-white">{account.name || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">Email</p>
                          <p className="font-medium text-white break-all">{account.email || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">Phone</p>
                          <p className="font-medium text-white">{account.phone || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">Address</p>
                          <p className="font-medium text-white">{account.address || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">City</p>
                          <p className="font-medium text-white">{account.city || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">Province</p>
                          <p className="font-medium text-white">{account.province || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">Postal Code</p>
                          <p className="font-medium text-white">{account.postal || '—'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-xl p-8 sm:p-10 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-6">Payment</h3>
                    <p className="text-sm text-white/70">You will choose GCash or Card on the PayMongo page after you click Checkout.</p>
                  </div>
                </div>
                
                <div className="space-y-5 mb-12 border-t border-white/30 pt-10">
                  <div className="flex justify-between py-2">
                    <span className="text-white/70 text-lg">Subtotal</span>
                    <span className="font-medium text-white text-lg">₱{subtotal.toFixed(2)}</span>
                  </div>
                  
                  
                  
                  <div className="border-t border-white/30 pt-6">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#6c47ff]">₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 py-6 px-8 mt-6" onClick={handlePlaceOrder} disabled={placing || items.length === 0}>
                  {placing ? "Processing..." : "Checkout"}
                </button>
              </div>
                <div className="h-4 sm:h-6 lg:h-8"></div>
            </div>
            </div>
              </div>
            </div>
            <div className="w-4 sm:w-6 lg:w-8 flex-shrink-0"></div>
          </div>
        </div>
      </div>
      
      <Footer className="mt-20 sm:mt-24" />
    </div>
  )
}
