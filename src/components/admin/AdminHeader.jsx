"use client"
import { UserButton } from '@clerk/nextjs'
import { Bell, Search, Menu, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="glass-effect border-b border-white/10 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-300">Manage your aquatics store</p>
            </div>
            {/* Back to HomePage */}
            <Link href="/#home" className="hidden md:inline-flex items-center gap-2 px-3 py-2 glass-effect rounded-lg border border-white/20 text-white/90 hover:bg-white/20 transition-colors ml-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to HomePage</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Back to Homepage (mobile) */}
            <Link href="/#home" className="md:hidden inline-flex items-center gap-2 px-3 py-2 glass-effect rounded-lg border border-white/20 text-white/90 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            {/* Search bar removed as requested */}
            
            
            <div className="glass-effect rounded-xl p-1">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}bell
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
