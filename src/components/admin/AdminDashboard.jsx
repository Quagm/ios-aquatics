"use client"
import { useState, useEffect } from 'react'
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Eye,
  Clock,
  BarChart3,
  ArrowRight,
  Activity,
  Target,
  Zap
} from 'lucide-react'
import { fetchProducts, fetchOrders, getSalesAnalytics } from '@/lib/queries'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingInquiries: 0,
    recentOrders: [],
    topProducts: []
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [products, orders, analytics] = await Promise.all([
          fetchProducts({ includeInactive: true }).catch(() => []),
          fetchOrders().catch(() => []),
          getSalesAnalytics('30d').catch(() => ({ topProducts: [] }))
        ])

        let pendingInquiries = 0
        try {
          const res = await fetch('/api/inquiries', { method: 'GET', credentials: 'include' })
          const data = await res.json()
          if (Array.isArray(data)) {
            pendingInquiries = data.filter(i => i.status === 'accepted' || i.status === 'in_progress').length
          }
        } catch { }

        let totalUsers = 0
        try {
          const usersRes = await fetch('/api/users/count', { method: 'GET', credentials: 'include' })
          const usersData = await usersRes.json()
          if (usersData && typeof usersData.count === 'number') {
            totalUsers = usersData.count
          }
        } catch { }

        const totalRevenue = (orders || [])
          .filter(o => String(o.status || '').toLowerCase() !== 'cancelled')
          .reduce((sum, o) => sum + (o.total || 0), 0)

        const recentOrders = (orders || [])
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(o => ({
            id: o.id,
            customer: o.customer?.name || o.customer?.email || 'Customer',
            amount: o.total || 0,
            status: o.status || 'processing'
          }))

        if (!mounted) return
        setStats({
          totalUsers,
          totalOrders: (orders || []).length,
          totalProducts: (products || []).length,
          totalRevenue,
          pendingInquiries,
          recentOrders,
          topProducts: analytics.topProducts || []
        })
      } catch { }
    }
    load()
    return () => { mounted = false }
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      description: 'Active customers'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
      description: 'All time'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      description: 'In inventory'
    },
    {
      title: 'Total Revenue',
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-500/10 to-yellow-600/10',
      description: 'All time'
    },
    {
      title: 'Pending Inquiries',
      value: stats.pendingInquiries.toLocaleString(),
      icon: MessageSquare,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-500/10 to-red-600/10',
      description: 'Needs attention'
    },
    {
      title: 'Growth Rate',
      value: '—',
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-500/10 to-indigo-600/10',
      description: 'Coming soon'
    }
  ]

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-12">
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="glass-effect rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105" style={{ padding: '1rem' }}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${stat.changeType === 'positive'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ml-6" style={{ marginBottom: '3rem' }}>
        {}
        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-6 border-b border-white/10" style={{ padding: '1.25rem' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Orders
              </h3>
              <button
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 group"
                onClick={() => window.location.assign('/admin/order-management')}
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="p-6" style={{ padding: '1.25rem' }}>
            <div className="space-y-4">
              {stats.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-white/5 last:border-b-0 group hover:bg-white/5 rounded-lg px-3 -mx-3 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingCart className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{order.id}</p>
                      <p className="text-sm text-slate-400">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-lg">₱{order.amount}</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-6 border-b border-white/10" style={{ padding: '1.25rem' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Top Products
              </h3>
              <button
                className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 group"
                onClick={() => window.location.assign('/admin/inventory-management')}
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="p-6" style={{ padding: '1.25rem' }}>
            <div className="space-y-4">
              {stats.topProducts.length === 0 && (
                <div className="text-slate-300 text-sm">No top products yet.</div>
              )}
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-white/5 last:border-b-0 group hover:bg-white/5 rounded-lg px-3 -mx-3 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{product.name}</p>
                      <p className="text-sm text-slate-400">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-lg mb-1">
                      {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP'
                      }).format(product.revenue)}
                    </p>
                    <div className="w-20 h-2 bg-slate-700 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.topProducts.length > 0 && Math.max(...stats.topProducts.map(p => p.sales)) > 0 
                            ? (product.sales / Math.max(...stats.topProducts.map(p => p.sales))) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 ml-6" style={{ padding: '2rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            className="group glass-effect rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => window.location.assign('/admin/inventory-management')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Add Product</h4>
              <p className="text-sm text-slate-400">Add new inventory items</p>
            </div>
          </button>

          <button
            className="group glass-effect rounded-xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => window.location.assign('/admin/inquiry-management')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">View Inquiries</h4>
              <p className="text-sm text-slate-400">Manage customer inquiries</p>
            </div>
          </button>

          <button
            className="group glass-effect rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => window.location.assign('/admin/order-management')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Process Orders</h4>
              <p className="text-sm text-slate-400">Manage order fulfillment</p>
            </div>
          </button>

          <button
            className="group glass-effect rounded-xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => window.location.assign('/admin/sales-analytics')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">View Reports</h4>
              <p className="text-sm text-slate-400">Analyze sales data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
