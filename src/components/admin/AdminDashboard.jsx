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
  BarChart3
} from 'lucide-react'

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
    // Simulate data fetching
    setStats({
      totalUsers: 1247,
      totalOrders: 89,
      totalProducts: 156,
      totalRevenue: 45678,
      pendingInquiries: 12,
      recentOrders: [
        { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'Processing' },
        { id: 'ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'Shipped' },
        { id: 'ORD-003', customer: 'Mike Johnson', amount: 89.99, status: 'Delivered' },
      ],
      topProducts: [
        { name: 'Aquarium Filter', sales: 45, revenue: 2250 },
        { name: 'Fish Food', sales: 78, revenue: 1560 },
        { name: 'Water Conditioner', sales: 32, revenue: 960 },
      ]
    })
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+15%'
    },
    {
      title: 'Pending Inquiries',
      value: stats.pendingInquiries.toLocaleString(),
      icon: MessageSquare,
      color: 'bg-red-500',
      change: '-3%'
    },
    {
      title: 'Growth Rate',
      value: '23%',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+2%'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium">
              View All Orders
            </button>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium">
              View All Products
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Add Product
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
            View Inquiries
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="w-5 h-5 mr-2 text-purple-600" />
            Process Orders
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-5 h-5 mr-2 text-yellow-600" />
            View Reports
          </button>
        </div>
      </div>
    </div>
  )
}
