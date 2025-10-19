"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useUser } from "@clerk/nextjs"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [animationState, setAnimationState] = useState({
    isVisible: false,
    product: null
  })
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return
    // When signed out, keep cart empty and do not load persisted items
    if (!user) {
      setItems([])
      return
    }
    try {
      const key = `cart-items:${user.id}`
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setItems(parsed)
          return
        }
      }
      // One-time migration from legacy anonymous key if present
      const legacy = typeof window !== 'undefined' ? window.localStorage.getItem('cart-items') : null
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy)
        if (Array.isArray(parsedLegacy)) {
          setItems(parsedLegacy)
          // persist under user key and remove legacy
          window.localStorage.setItem(key, JSON.stringify(parsedLegacy))
          window.localStorage.removeItem('cart-items')
        }
      }
    } catch {}
  }, [user, isLoaded])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && isLoaded && user) {
        const key = `cart-items:${user.id}`
        window.localStorage.setItem(key, JSON.stringify(items))
      }
    } catch {}
  }, [items, user, isLoaded])

  const addItem = (product, quantity = 1) => {
    if (!user) return
    setItems(prev => {
      const index = prev.findIndex(p => p.id === product.id)
      if (index !== -1) {
        const copy = [...prev]
        const effectiveStock = typeof copy[index].stockCount === 'number' ? copy[index].stockCount : (typeof product.stockCount === 'number' ? product.stockCount : undefined)
        const nextQty = copy[index].quantity + quantity
        copy[index] = { 
          ...copy[index], 
          // keep existing stockCount if present, else store from product if provided
          stockCount: typeof copy[index].stockCount === 'number' ? copy[index].stockCount : product.stockCount,
          quantity: typeof effectiveStock === 'number' ? Math.min(effectiveStock, nextQty) : nextQty 
        }
        return copy
      }
      // New item; if stockCount provided, cap initial quantity
      const cappedQty = typeof product.stockCount === 'number' ? Math.min(product.stockCount, quantity) : quantity
      return [...prev, { ...product, quantity: cappedQty }]
    })

    setAnimationState({
      isVisible: true,
      product: product
    })
  }

  const clearAnimation = () => {
    setAnimationState({
      isVisible: false,
      product: null
    })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(p => p.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setItems(prev => prev.map(p => {
      if (p.id !== id) return p
      const minQty = 1
      const capped = typeof p.stockCount === 'number' ? Math.min(p.stockCount, Math.max(minQty, quantity)) : Math.max(minQty, quantity)
      return { ...p, quantity: capped }
    }))
  }

  const clearCart = () => setItems([])

  const subtotal = useMemo(() => items.reduce((t, i) => t + i.price * i.quantity, 0), [items])

  const value = useMemo(() => ({ 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal,
    animationState,
    clearAnimation
  }), [items, subtotal, animationState])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}


