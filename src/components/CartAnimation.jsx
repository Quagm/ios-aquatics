"use client"
import { useEffect, useState } from 'react'
import { CheckCircle, ShoppingCart } from 'lucide-react'

export default function CartAnimation({ isVisible, product, onComplete }) {
  const [showToast, setShowToast] = useState(false)
  const [showFlyingItem, setShowFlyingItem] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // show
      setShowFlyingItem(true)
      
      // toast
      const toastTimer = setTimeout(() => {
        setShowToast(true)
      }, 300)

      // hide animation
      const hideTimer = setTimeout(() => {
        setShowFlyingItem(false)
        setShowToast(false)
        onComplete?.()
      }, 2000)

      return () => {
        clearTimeout(toastTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <>
      {/* animation*/}
      {showFlyingItem && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-fly-to-cart">
              <div className="w-16 h-16 bg-white rounded-xl shadow-2xl flex items-center justify-center border-2 border-blue-500">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="glass-effect rounded-2xl p-4 border border-green-500/30 bg-green-500/10 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Added to Cart!</p>
                <p className="text-green-300 text-xs">{product?.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
