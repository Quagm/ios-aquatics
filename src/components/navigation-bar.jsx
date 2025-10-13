"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/CartContext"

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { items, animationState } = useCart()
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ]

  const handleSmoothScroll = (e, href) => {
    e.preventDefault()
    
    // If we're not on the home page, navigate to home first
    if (window.location.pathname !== '/') {
      window.location.href = `/${href}`
      return
    }
    
    // If we're on the home page, scroll to the section
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logo-aquatics.jpg"
            alt="IOS Aquatics Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h2
            className={`text-xl font-bold transition-colors ${
              isScrolled ? "text-slate-800" : "text-white"
            }`}
          >
            IOS Aquatics
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleSmoothScroll(e, href)}
              className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                isScrolled
                  ? "text-slate-700 hover:text-slate-900 hover:bg-white/10"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </a>
          ))}
          <Link
            href="/store-page"
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isScrolled
                ? "text-slate-700 hover:text-slate-900 hover:bg-white/10"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Store
          </Link>
          <Link
            href="/cart-page"
            className={`relative px-4 py-2 rounded-md font-medium transition-colors ${
              isScrolled
                ? "text-slate-700 hover:text-slate-900 hover:bg-white/10"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${
                animationState.isVisible ? 'animate-cart-bounce' : ''
              }`} />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold transition-all duration-300 ${
                  animationState.isVisible ? 'animate-cart-pulse' : ''
                }`}>
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>

          {/* Auth Buttons */}
          <div className="ml-2">
            <SignedOut>
              <SignInButton>
                <button
                  className={`px-6 py-3 rounded-md font-medium text-sm transition-all ${
                    isScrolled
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  }`}
                >
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link
                  href="/account-page"
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isScrolled
                      ? "text-slate-700 hover:text-slate-900 hover:bg-white/10"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Account
                </Link>
                <Link
                  href="/admin"
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isScrolled
                      ? "text-slate-700 hover:text-slate-900 hover:bg-white/10"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Admin
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              isScrolled ? "bg-slate-800" : "bg-white"
            } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              isScrolled ? "bg-slate-800" : "bg-white"
            } ${isMobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 transition-all duration-300 ${
              isScrolled ? "bg-slate-800" : "bg-white"
            } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-200 transition-all duration-300 z-40 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                handleSmoothScroll(e, href)
                setIsMobileMenuOpen(false)
              }}
              className="block py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {label}
            </a>
          ))}
          <Link
            href="/store-page"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Store
          </Link>
          <Link
            href="/cart-page"
            onClick={() => setIsMobileMenuOpen(false)}
            className="relative block py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${
                animationState.isVisible ? 'animate-cart-bounce' : ''
              }`} />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className={`bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold transition-all duration-300 ${
                  animationState.isVisible ? 'animate-cart-pulse' : ''
                }`}>
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>

          <div className="pt-4 border-t border-slate-200">
            <SignedOut>
              <SignInButton>
                <button className="w-full rounded-md bg-blue-600 py-3 px-4 font-medium text-white hover:bg-blue-700 transition-colors">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="space-y-2">
                <Link
                  href="/account-page"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Account
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Admin
                </Link>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}