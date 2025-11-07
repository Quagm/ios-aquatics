"use client"
import NavigationBar from "@/components/navigation-bar"
import Footer from "@/components/Footer"
import CartItem from "@/components/CartItem"
import OrderSummary from "@/components/OrderSummary"
import EmptyCart from "@/components/EmptyCart"
import { useCart } from "@/components/CartContext"
import { ShoppingCart } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const router = useRouter()

  useEffect(() => {
    router.replace('/checkout-page')
  }, [router])

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
      <NavigationBar />
      
      <div className="flex-1 page-section">
        <div className="page-container text-center text-white/80">
          Redirecting to checkout...
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
