"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings,
  Waves
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, badge: null },
  { name: 'Inquiry Management', href: '/admin/inquiry-management', icon: MessageSquare, badge: '12' },
  { name: 'Account Management', href: '/admin/account-management', icon: Users, badge: null },
  { name: 'Inventory Management', href: '/admin/inventory-management', icon: Package, badge: null },
  { name: 'Order Management', href: '/admin/order-management', icon: ShoppingCart, badge: '5' },
  { name: 'Sales & Analytics', href: '/admin/sales-analytics', icon: BarChart3, badge: null },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 glass-effect border-r border-white/10 h-screen sticky top-0 backdrop-blur-sm">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-slate-400">IOS Aquatics</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 mb-2 ${
                isActive ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white border border-blue-500/30' : ''
              }`}
            >
              <div className="flex items-center">
                <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span className="font-medium">{item.name}</span>
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

      <div className="absolute bottom-6 left-4 right-4">
        <div className="glass-effect rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Settings</p>
              <p className="text-xs text-slate-400">System configuration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
