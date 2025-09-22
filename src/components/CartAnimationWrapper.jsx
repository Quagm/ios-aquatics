"use client"
import { useCart } from "@/components/CartContext"
import CartAnimation from "./CartAnimation"

export default function CartAnimationWrapper() {
  const { animationState, clearAnimation } = useCart()

  return (
    <CartAnimation
      isVisible={animationState.isVisible}
      product={animationState.product}
      onComplete={clearAnimation}
    />
  )
}
