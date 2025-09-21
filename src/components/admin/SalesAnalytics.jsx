"use client"
import { useState, useEffect } from 'react'
import { getSalesAnalytics } from '@/lib/queries'
import { 
  TrendingUp, 
  TrendingDown, 
  PhilippinePeso, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3,
  Activity,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    ordersByStatus: {},
    topProducts: [],
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    totalCustomers: 0,
    salesData: [],
    revenueData: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Simulate data fetching with sample data
        const sampleData = {
          totalRevenue: 125000,
          totalOrders: 89,
          averageOrderValue: 1404,
          totalCustomers: 1247,
          revenueGrowth: 15.2,
          ordersGrowth: 8.5,
          customersGrowth: 12.3,
          ordersByStatus: {
            'Processing': 12,
            'Shipped': 25,
            'Delivered': 45,
            'Cancelled': 7
          },
          topProducts: [
            { name: 'Aquarium Filter', sales: 45, revenue: 2250 },
            { name: 'Fish Food Premium', sales: 78, revenue: 1560 },
            { name: 'Water Conditioner', sales: 32, revenue: 960 },
            { name: 'LED Light Strip', sales: 28, revenue: 1400 },
            { name: 'Aquarium Heater', sales: 22, revenue: 1100 }
          ],
          salesData: [12, 19, 15, 25, 22, 18, 30, 28, 35, 32, 28, 40],
          revenueData: [15000, 22000, 18000, 30000, 25000, 20000, 35000, 32000, 40000, 38000, 32000, 45000]
        }
        
        setAnalytics(sampleData)
      } catch (err) {
        setError(err.message || 'Failed to load analytics')
        console.error('Analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  // Chart data configuration
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₱)',
        data: analytics.revenueData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Orders',
        data: analytics.salesData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y1',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Revenue: ${formatCurrency(context.parsed.y)}`
            } else {
              return `Orders: ${context.parsed.y}`
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value) {
            return formatCurrency(value)
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-effect rounded-2xl p-8 border border-red-500/20 max-w-md mx-auto">
            <p className="text-red-400 text-lg font-semibold">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          <BarChart3 className="w-4 h-4" />
          Sales & Analytics
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Business</span> Performance
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Track your aquatics store performance with detailed analytics and insights.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
          >
            <option value="7d" className="bg-slate-800">Last 7 days</option>
            <option value="30d" className="bg-slate-800">Last 30 days</option>
            <option value="90d" className="bg-slate-800">Last 90 days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
          onClick={() => {
            const rows = [
              ['Metric','Value'],
              ['Total Revenue', String(analytics.totalRevenue)],
              ['Total Orders', String(analytics.totalOrders)],
              ['Total Customers', String(analytics.totalCustomers)],
              ['Average Order Value', String(analytics.averageOrderValue)],
              ['Revenue Growth %', String(analytics.revenueGrowth)],
              ['Orders Growth %', String(analytics.ordersGrowth)],
              ['Customers Growth %', String(analytics.customersGrowth)],
            ]
            const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `analytics-report.csv`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
              <PhilippinePeso className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <ArrowUp className="w-4 h-4" />
              {analytics.revenueGrowth}%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white mb-2">{formatCurrency(analytics.totalRevenue)}</p>
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
              <ArrowUp className="w-4 h-4" />
              {analytics.ordersGrowth}%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white mb-2">{analytics.totalOrders}</p>
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-purple-400 text-sm font-semibold">
              <ArrowUp className="w-4 h-4" />
              {analytics.customersGrowth}%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-white mb-2">{analytics.totalCustomers.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Active users</p>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              +5.2%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-white mb-2">{formatCurrency(analytics.averageOrderValue)}</p>
            <p className="text-xs text-slate-500">Per transaction</p>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              Revenue & Orders Trend
            </h3>
            <p className="text-slate-400 mt-1">Monthly performance overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Orders</span>
            </div>
          </div>
        </div>
        <div className="h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders by Status */}
        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 p-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-green-400" />
            Orders by Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-4 glass-effect rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
                <p className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">{count}</p>
                <p className="text-sm text-slate-400 capitalize font-medium">{status}</p>
                <div className={`w-full h-1 rounded-full mt-2 ${
                  status === 'Delivered' ? 'bg-green-500' :
                  status === 'Shipped' ? 'bg-blue-500' :
                  status === 'Processing' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Top Performing Products
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product, index) => (
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
                      <p className="font-bold text-white text-lg">{formatCurrency(product.revenue)}</p>
                      <div className="w-20 h-2 bg-slate-700 rounded-full mt-1">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${(product.sales / 78) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-500">No product sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
