"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [animationState, setAnimationState] = useState({
    isVisible: false,
    product: null
  })

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('cart-items') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cart-items', JSON.stringify(items))
      }
    } catch {}
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const index = prev.findIndex(p => p.id === product.id)
      if (index !== -1) {
        const copy = [...prev]
        copy[index] = { ...copy[index], quantity: copy[index].quantity + quantity }
        return copy
      }
      return [...prev, { ...product, quantity }]
    })

    // Trigger animation
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
    setItems(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p))
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


