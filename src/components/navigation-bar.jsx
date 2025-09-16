
import Image from "next/image"
import Link from "next/link"
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs"

export default function NavigationBar() {
  return (
    <nav className="sticky top-0 left-0 w-full flex justify-between items-center py-4 px-6 shadow-lg z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      {/* Logo + Title */}
      <div className="flex items-center space-x-3">
        <Image 
          src="/logo-aquatics.jpg" 
          alt="Web iOS Aquatics Logo" 
          width={48} 
          height={48} 
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold text-white">IOS Aquatics</h1>
      </div>

      {/* Links + Auth */}
      <div className="flex items-center gap-8">
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            href="/store-page" 
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Store
          </Link>
          <Link 
            href="/inquiry-form" 
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Contact
          </Link>
          <Link 
            href="/cart-page" 
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Cart
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 cursor-pointer hover:bg-[#5a3ae6] transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/account-page" 
              className="text-white/80 hover:text-white transition-colors font-medium mr-4"
            >
              Account
            </Link>
            <Link 
              href="/admin" 
              className="text-white/80 hover:text-white transition-colors font-medium mr-4"
            >
              Admin
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}