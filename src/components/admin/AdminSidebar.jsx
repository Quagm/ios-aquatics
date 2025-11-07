"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings,
  Waves,
  ArrowLeft
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, badge: null },
  { name: 'Inquiry Management', href: '/admin/inquiry-management', icon: MessageSquare, badge: null },
  { name: 'Inquiry History', href: '/admin/inquiry-history', icon: MessageSquare, badge: null },
  { name: 'Inventory Management', href: '/admin/inventory-management', icon: Package, badge: null },
  { name: 'Order Management', href: '/admin/order-management', icon: ShoppingCart, badge: null },
  { name: 'Order History', href: '/admin/order-history', icon: Package, badge: null },
  { name: 'Sales & Analytics', href: '/admin/sales-analytics', icon: BarChart3, badge: null },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-44 glass-effect border-r border-white/10 h-screen sticky top-0 backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-center">
          <Link href="/#home" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors text-base w-full justify-center">
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
      
      <nav className="mt-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 mb-1.5 ${
                isActive ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white border border-blue-500/30' : ''
              }`}
            >
              <div className="flex items-center">
                <Icon className={`w-4 h-4 mr-2 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      
    </div>
  )
}
