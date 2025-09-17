
"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs"

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-[#051C29]/95 to-[#0a2a3a]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <Image 
              src="/logo-aquatics.jpg" 
              alt="Web iOS Aquatics Logo" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-white">IOS Aquatics</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white/80 hover:text-white transition-colors font-medium px-3 py-2 rounded-md hover:bg-white/10"
            >
              Home
            </Link>
            <Link 
              href="/store-page" 
              className="text-white/80 hover:text-white transition-colors font-medium px-3 py-2 rounded-md hover:bg-white/10"
            >
              Store
            </Link>
            <Link 
              href="/inquiry-form" 
              className="text-white/80 hover:text-white transition-colors font-medium px-3 py-2 rounded-md hover:bg-white/10"
            >
              Contact
            </Link>
            <Link 
              href="/cart-page" 
              className="text-white/80 hover:text-white transition-colors font-medium px-3 py-2 rounded-md hover:bg-white/10"
            >
              Cart
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="text-white/80 hover:text-white transition-colors font-medium px-4 py-2 rounded-md hover:bg-white/10">
                  Login
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-lg font-medium px-6 py-2 hover:bg-[#5a3ae6] transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/account-page" 
                className="text-white/80 hover:text-white transition-colors font-medium px-3 py-2 rounded-md hover:bg-white/10"
              >
                Account
              </Link>
              <Link 
                href="/admin" 
                className="text-white/80 hover:text-white transition-colors font-medium px-3 py-2 rounded-md hover:bg-white/10"
              >
                Admin
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`bg-white h-0.5 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`bg-white h-0.5 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`bg-white h-0.5 w-6 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible max-h-96" : "opacity-0 invisible max-h-0"} overflow-hidden`}>
          <div className="px-4 py-6 space-y-4 border-t border-white/10">
            <Link 
              href="/" 
              className="block text-white/80 hover:text-white transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/store-page" 
              className="block text-white/80 hover:text-white transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Store
            </Link>
            <Link 
              href="/inquiry-form" 
              className="block text-white/80 hover:text-white transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/cart-page" 
              className="block text-white/80 hover:text-white transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart
            </Link>
            <div className="pt-4 border-t border-white/10 space-y-4">
              <SignedOut>
                <SignInButton>
                  <button className="w-full text-left text-white/80 hover:text-white transition-colors font-medium py-2">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="w-full bg-[#6c47ff] text-white rounded-lg font-medium py-3 px-4 hover:bg-[#5a3ae6] transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/account-page" 
                  className="block text-white/80 hover:text-white transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <Link 
                  href="/admin" 
                  className="block text-white/80 hover:text-white transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <div className="flex justify-center">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}