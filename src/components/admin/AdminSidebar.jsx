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
  Settings
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Inquiry Management', href: '/admin/inquiry-management', icon: MessageSquare },
  { name: 'Account Management', href: '/admin/account-management', icon: Users },
  { name: 'Inventory Management', href: '/admin/inventory-management', icon: Package },
  { name: 'Order Management', href: '/admin/order-management', icon: ShoppingCart },
  { name: 'Sales & Analytics', href: '/admin/sales-analytics', icon: BarChart3 },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
