"use client"
import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    topProducts: [],
    recentOrders: [],
    salesChart: [],
    revenueChart: []
  })

  useEffect(() => {
    // Simulate data fetching based on time range
    const mockData = {
      '7d': {
        totalRevenue: 12547.50,
        totalOrders: 23,
        totalCustomers: 18,
        averageOrderValue: 545.11,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        customersGrowth: 15.2,
        topProducts: [
          { name: 'Aquarium Filter Pro', sales: 8, revenue: 719.92, growth: 25.0 },
          { name: 'LED Aquarium Light', sales: 5, revenue: 749.95, growth: 15.0 },
          { name: 'Premium Fish Food', sales: 12, revenue: 299.88, growth: 8.0 },
          { name: 'Water Conditioner', sales: 15, revenue: 194.85, growth: 5.0 }
        ],
        salesChart: [
          { date: '2024-01-14', sales: 12 },
          { date: '2024-01-15', sales: 8 },
          { date: '2024-01-16', sales: 15 },
          { date: '2024-01-17', sales: 10 },
          { date: '2024-01-18', sales: 18 },
          { date: '2024-01-19', sales: 14 },
          { date: '2024-01-20', sales: 16 }
        ],
        revenueChart: [
          { date: '2024-01-14', revenue: 1250.00 },
          { date: '2024-01-15', revenue: 890.50 },
          { date: '2024-01-16', revenue: 1875.25 },
          { date: '2024-01-17', revenue: 1125.75 },
          { date: '2024-01-18', revenue: 2250.00 },
          { date: '2024-01-19', revenue: 1680.50 },
          { date: '2024-01-20', revenue: 1875.50 }
        ]
      },
      '30d': {
        totalRevenue: 45678.90,
        totalOrders: 89,
        totalCustomers: 67,
        averageOrderValue: 512.12,
        revenueGrowth: 18.7,
        ordersGrowth: 12.4,
        customersGrowth: 22.1,
        topProducts: [
          { name: 'Aquarium Filter Pro', sales: 32, revenue: 2879.68, growth: 18.5 },
          { name: 'LED Aquarium Light', sales: 18, revenue: 2699.82, growth: 12.3 },
          { name: 'Premium Fish Food', sales: 45, revenue: 1124.55, growth: 8.7 },
          { name: 'Water Conditioner', sales: 52, revenue: 675.48, growth: 5.2 }
        ],
        salesChart: [
          { date: '2024-01-01', sales: 15 },
          { date: '2024-01-05', sales: 22 },
          { date: '2024-01-10', sales: 18 },
          { date: '2024-01-15', sales: 25 },
          { date: '2024-01-20', sales: 20 },
          { date: '2024-01-25', sales: 28 },
          { date: '2024-01-30', sales: 24 }
        ],
        revenueChart: [
          { date: '2024-01-01', revenue: 1875.00 },
          { date: '2024-01-05', revenue: 2750.00 },
          { date: '2024-01-10', revenue: 2250.00 },
          { date: '2024-01-15', revenue: 3125.00 },
          { date: '2024-01-20', revenue: 2500.00 },
          { date: '2024-01-25', revenue: 3500.00 },
          { date: '2024-01-30', revenue: 3000.00 }
        ]
      },
      '90d': {
        totalRevenue: 125678.45,
        totalOrders: 234,
        totalCustomers: 189,
        averageOrderValue: 537.09,
        revenueGrowth: 25.3,
        ordersGrowth: 18.7,
        customersGrowth: 31.2,
        topProducts: [
          { name: 'Aquarium Filter Pro', sales: 78, revenue: 7019.22, growth: 22.1 },
          { name: 'LED Aquarium Light', sales: 45, revenue: 6749.55, growth: 18.9 },
          { name: 'Premium Fish Food', sales: 112, revenue: 2799.12, growth: 15.3 },
          { name: 'Water Conditioner', sales: 128, revenue: 1662.72, growth: 12.7 }
        ],
        salesChart: [
          { date: '2024-01-01', sales: 45 },
          { date: '2024-01-15', sales: 52 },
          { date: '2024-01-30', sales: 48 },
          { date: '2024-02-15', sales: 61 },
          { date: '2024-02-28', sales: 55 },
          { date: '2024-03-15', sales: 68 },
          { date: '2024-03-30', sales: 62 }
        ],
        revenueChart: [
          { date: '2024-01-01', revenue: 5625.00 },
          { date: '2024-01-15', revenue: 6500.00 },
          { date: '2024-01-30', revenue: 6000.00 },
          { date: '2024-02-15', revenue: 7625.00 },
          { date: '2024-02-28', revenue: 6875.00 },
          { date: '2024-03-15', revenue: 8500.00 },
          { date: '2024-03-30', revenue: 7750.00 }
        ]
      }
    }

    setAnalytics(mockData[timeRange])
  }, [timeRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getGrowthIcon = (value) => {
    return value > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const getGrowthColor = (value) => {
    return value > 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Analytics</h1>
          <p className="text-gray-600 mt-2">Track your business performance and growth</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(analytics.revenueGrowth)}`}>
                {getGrowthIcon(analytics.revenueGrowth)}
                <span className="text-sm ml-1">{formatPercentage(analytics.revenueGrowth)}</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(analytics.ordersGrowth)}`}>
                {getGrowthIcon(analytics.ordersGrowth)}
                <span className="text-sm ml-1">{formatPercentage(analytics.ordersGrowth)}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(analytics.customersGrowth)}`}>
                {getGrowthIcon(analytics.customersGrowth)}
                <span className="text-sm ml-1">{formatPercentage(analytics.customersGrowth)}</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageOrderValue)}</p>
              <div className="flex items-center mt-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm ml-1">Per order</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Revenue</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.revenueChart.map((point, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                  style={{
                    height: `${(point.revenue / Math.max(...analytics.revenueChart.map(p => p.revenue))) * 200}px`
                  }}
                ></div>
                <span className="text-xs text-gray-600">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Orders</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.salesChart.map((point, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className="bg-green-500 rounded-t w-8 transition-all duration-300 hover:bg-green-600"
                  style={{
                    height: `${(point.sales / Math.max(...analytics.salesChart.map(p => p.sales))) * 200}px`
                  }}
                ></div>
                <span className="text-xs text-gray-600">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                  <div className={`flex items-center text-sm ${getGrowthColor(product.growth)}`}>
                    {getGrowthIcon(product.growth)}
                    <span className="ml-1">{formatPercentage(product.growth)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Best Selling Day</p>
              <p className="text-2xl font-bold">Monday</p>
              <p className="text-blue-100 text-sm">Most orders placed</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Peak Hour</p>
              <p className="text-2xl font-bold">2-4 PM</p>
              <p className="text-green-100 text-sm">Highest activity</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Conversion Rate</p>
              <p className="text-2xl font-bold">12.5%</p>
              <p className="text-purple-100 text-sm">Visitor to customer</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
