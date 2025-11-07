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

  const resolveStockCount = (item) => {
    if (!item) return undefined
    if (typeof item.stockCount === 'number') return item.stockCount
    if (typeof item.stock === 'number') return item.stock
    return undefined
  }

  const addItem = (product, quantity = 1) => {
    if (!user) return false
    let didAdd = false
    setItems((prev) => {
      const index = prev.findIndex((p) => p.id === product.id)
      const requestedQty = Math.max(1, quantity)
      const incomingStock = resolveStockCount(product)

      if (index !== -1) {
        const copy = [...prev]
        const currentItem = copy[index]
        const effectiveStock = resolveStockCount(currentItem) ?? incomingStock

        if (typeof effectiveStock === 'number' && currentItem.quantity >= effectiveStock) {
          return prev
        }

        const nextQty = currentItem.quantity + requestedQty
        const cappedQty = typeof effectiveStock === 'number' ? Math.min(effectiveStock, nextQty) : nextQty

        if (cappedQty === currentItem.quantity) {
          return prev
        }

        copy[index] = {
          ...currentItem,
          stockCount: typeof currentItem.stockCount === 'number' ? currentItem.stockCount : incomingStock,
          quantity: cappedQty,
        }
        didAdd = true
        return copy
      }

      const cappedQty = typeof incomingStock === 'number' ? Math.min(incomingStock, requestedQty) : requestedQty
      if (cappedQty <= 0) {
        return prev
      }
      didAdd = true
      return [
        ...prev,
        {
          ...product,
          stockCount: incomingStock,
          quantity: cappedQty,
        },
      ]
    })

    if (didAdd) {
      setAnimationState({
        isVisible: true,
        product: product,
      })
    }

    return didAdd
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


