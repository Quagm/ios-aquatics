"use client"
import { useState, useEffect } from 'react'
import { getSalesAnalytics, fetchOrders } from '@/lib/queries'
import * as XLSX from 'xlsx'
import * as XLSXStyle from 'xlsx-js-style'
import { 
  TrendingUp, 
  TrendingDown, 
  PhilippinePeso, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
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
  const [chartPeriod, setChartPeriod] = useState('monthly')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [dailyOrders, setDailyOrders] = useState([])
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
    revenueData: [],
    chartLabels: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError('')

        const analyticsData = await getSalesAnalytics(timeRange)

        if (chartPeriod === 'daily') {
          try {
            const allOrders = await fetchOrders()
            const [year, month] = selectedMonth.split('-').map(Number)
            const selectedMonthIndex = month - 1
            
            const monthOrders = allOrders.filter(order => {
              const orderDate = new Date(order.created_at)
              return orderDate.getMonth() === selectedMonthIndex && 
                     orderDate.getFullYear() === year &&
                     String(order.status || '').toLowerCase() !== 'cancelled'
            })
            
            setDailyOrders(monthOrders)
          } catch (err) {
            console.warn('Failed to fetch daily orders:', err)
            setDailyOrders([])
          }
        }

        let totalCustomers = 0
        let customersGrowth = 0
        try {
          const usersRes = await fetch('/api/users/count', { method: 'GET', credentials: 'include' })
          const usersData = await usersRes.json()
          if (usersData && typeof usersData.count === 'number') {
            totalCustomers = usersData.count

            customersGrowth = 0
          }
        } catch (err) {
          console.warn('Failed to fetch customer count:', err)
        }

        setAnalytics({
          ...analyticsData,
          totalCustomers,
          customersGrowth
        })
      } catch (err) {
        setError(err.message || 'Failed to load analytics')
        console.error('Analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange, chartPeriod, selectedMonth])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const aggregateChartData = (labels, revenueData, salesData, period, orders = [], monthSelection = '') => {
    if (period === 'daily') {
      const [year, month] = monthSelection.split('-').map(Number)
      const selectedMonthIndex = month - 1
      const daysInMonth = new Date(year, selectedMonthIndex + 1, 0).getDate()
      
      const dailyData = {}
      
      for (let day = 1; day <= daysInMonth; day++) {
        dailyData[day] = { revenue: 0, orders: 0 }
      }
      
      orders.forEach(order => {
        const orderDate = new Date(order.created_at)
        if (orderDate.getMonth() === selectedMonthIndex && orderDate.getFullYear() === year) {
          const day = orderDate.getDate()
          if (dailyData[day]) {
            dailyData[day].orders += 1
            dailyData[day].revenue += parseFloat(order.total || 0)
          }
        }
      })
      
      const sortedDays = Object.keys(dailyData).map(Number).sort((a, b) => a - b)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return {
        labels: sortedDays.map(day => `${monthNames[selectedMonthIndex]} ${day}`),
        revenueData: sortedDays.map(day => dailyData[day].revenue),
        salesData: sortedDays.map(day => dailyData[day].orders)
      }
    }
    
    if (!labels || labels.length === 0) return { labels: [], revenueData: [], salesData: [] }
    
    if (period === 'monthly') {
      return { labels, revenueData, salesData }
    }

    const aggregated = {}
    const periodLabels = []

    labels.forEach((label, index) => {
      const date = new Date(label)
      if (isNaN(date.getTime())) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthIndex = monthNames.findIndex(m => label.startsWith(m))
        if (monthIndex !== -1) {
          const now = new Date()
          const monthsBack = labels.length - 1 - index
          date.setFullYear(now.getFullYear(), now.getMonth() - monthsBack, 1)
        }
      }

      let periodKey = ''
      let periodLabel = ''

      if (period === 'quarterly') {
        const quarter = Math.floor(date.getMonth() / 3) + 1
        periodKey = `${date.getFullYear()}-Q${quarter}`
        periodLabel = `Q${quarter} ${date.getFullYear()}`
      } else if (period === 'semi-annually') {
        const half = date.getMonth() < 6 ? 'H1' : 'H2'
        periodKey = `${date.getFullYear()}-${half}`
        periodLabel = `${half} ${date.getFullYear()}`
      } else if (period === 'annual') {
        periodKey = String(date.getFullYear())
        periodLabel = String(date.getFullYear())
      }

      if (!aggregated[periodKey]) {
        aggregated[periodKey] = { revenue: 0, orders: 0, label: periodLabel }
        periodLabels.push(periodKey)
      }

      aggregated[periodKey].revenue += revenueData[index] || 0
      aggregated[periodKey].orders += salesData[index] || 0
    })

    const sortedKeys = periodLabels.sort()
    return {
      labels: sortedKeys.map(key => aggregated[key].label),
      revenueData: sortedKeys.map(key => aggregated[key].revenue),
      salesData: sortedKeys.map(key => aggregated[key].orders)
    }
  }

  const aggregatedChart = aggregateChartData(
    analytics.chartLabels || [],
    analytics.revenueData || [],
    analytics.salesData || [],
    chartPeriod,
    chartPeriod === 'daily' ? dailyOrders : [],
    chartPeriod === 'daily' ? selectedMonth : ''
  )

  const chartData = {
    labels: aggregatedChart.labels.length > 0 
      ? aggregatedChart.labels 
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₱)',
        data: aggregatedChart.revenueData.length > 0 
          ? aggregatedChart.revenueData 
          : Array(12).fill(0),
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
        data: aggregatedChart.salesData.length > 0 
          ? aggregatedChart.salesData 
          : Array(12).fill(0),
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
    <div className="py-8 sm:py-12 lg:py-16 px-6 sm:px-8 lg:px-12 admin-container-spacing">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Sales and Analytics</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4">
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
          >
            <option value="7d" className="bg-slate-800">Last 7 days</option>
            <option value="30d" className="bg-slate-800">Last 30 days</option>
            <option value="90d" className="bg-slate-800">Last 90 days</option>
          </select>
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-500/20"
            onClick={async () => {
              try {
                const wb = XLSX.utils.book_new()
                const reportDate = new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })
                const periodLabel = timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'
                
                const now = new Date()
                let startDate = new Date()
                if (timeRange === '7d') {
                  startDate.setDate(now.getDate() - 7)
                } else if (timeRange === '30d') {
                  startDate.setDate(now.getDate() - 30)
                } else if (timeRange === '90d') {
                  startDate.setDate(now.getDate() - 90)
                }
                
                const allOrders = await fetchOrders()
                
                const filteredOrders = allOrders.filter(order => {
                  const orderDate = new Date(order.created_at)
                  const isInDateRange = orderDate >= startDate && orderDate <= now
                  const status = String(order.status || '').toLowerCase().trim()
                  const isCompleted = status === 'completed' || 
                                     status === 'delivered' || 
                                     status === 'delivered (completed)' ||
                                     (status.includes('completed') && !status.includes('cancelled'))
                  return isInDateRange && isCompleted
                })
                
                const allOrdersInRange = allOrders.filter(order => {
                  const orderDate = new Date(order.created_at)
                  return orderDate >= startDate && orderDate <= now
                })
                
                const revenueByStatus = {
                  Processing: { count: 0, revenue: 0 },
                  Shipped: { count: 0, revenue: 0 },
                  Completed: { count: 0, revenue: 0 },
                  Cancelled: { count: 0, revenue: 0 }
                }
                
                allOrdersInRange.forEach(order => {
                  const status = String(order.status || '').toLowerCase().trim()
                  const total = order.total || 0
                  
                  if (status === 'processing') {
                    revenueByStatus.Processing.count++
                    revenueByStatus.Processing.revenue += total
                  } else if (status === 'shipped' || status === 'in progress') {
                    revenueByStatus.Shipped.count++
                    revenueByStatus.Shipped.revenue += total
                  } else if (status === 'completed' || status === 'delivered' || status.includes('completed')) {
                    revenueByStatus.Completed.count++
                    revenueByStatus.Completed.revenue += total
                  } else if (status === 'cancelled' || status.includes('cancel')) {
                    revenueByStatus.Cancelled.count++
                    revenueByStatus.Cancelled.revenue += total
                  }
                })
                
                const chartPeriodLabel = chartPeriod === 'daily' ? 'Daily' :
                                        chartPeriod === 'monthly' ? 'Monthly' :
                                        chartPeriod === 'quarterly' ? 'Quarterly' :
                                        chartPeriod === 'semi-annually' ? 'Semi-Annual' : 'Annual'
                
                const dateRangeStr = `${startDate.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })} to ${now.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}`
                
                const summaryData = [
                  ['Sales Analytics Report'],
                  [''],
                  ['Report Information'],
                  ['Report Generated:', reportDate],
                  ['Date Range:', dateRangeStr],
                  ['Time Period Filter:', periodLabel],
                  ['Chart Period:', chartPeriodLabel],
                  [''],
                  ['Summary Metrics'],
                  [''],
                  ['Metric', 'Value'],
                  ['Total Revenue', formatCurrency(analytics.totalRevenue)],
                  ['Total Orders', analytics.totalOrders],
                  ['Average Order Value', formatCurrency(analytics.averageOrderValue)],
                  [''],
                  ['Revenue & Orders Trend'],
                  [''],
                  ['Period', 'Revenue', 'Orders'],
                ]
                
                if (aggregatedChart.labels && aggregatedChart.labels.length > 0) {
                  aggregatedChart.labels.forEach((label, index) => {
                    summaryData.push([
                      label,
                      formatCurrency(aggregatedChart.revenueData[index] || 0),
                      aggregatedChart.salesData[index] || 0
                    ])
                  })
                }
                
                summaryData.push([''])
                summaryData.push(['Orders by Status'])
                summaryData.push([''])
                summaryData.push(['Status', 'Count'])
                summaryData.push(['Processing', analytics.ordersByStatus?.Processing || 0])
                summaryData.push(['Shipped', analytics.ordersByStatus?.Shipped || 0])
                summaryData.push(['Completed', analytics.ordersByStatus?.Delivered || analytics.ordersByStatus?.Completed || 0])
                summaryData.push(['Cancelled', analytics.ordersByStatus?.Cancelled || 0])
                summaryData.push([''])
                summaryData.push(['Revenue by Status'])
                summaryData.push([''])
                summaryData.push(['Status', 'Order Count', 'Total Revenue', 'Average Revenue per Order'])
                summaryData.push(['Processing', revenueByStatus.Processing.count, formatCurrency(revenueByStatus.Processing.revenue), formatCurrency(revenueByStatus.Processing.count > 0 ? revenueByStatus.Processing.revenue / revenueByStatus.Processing.count : 0)])
                summaryData.push(['Shipped', revenueByStatus.Shipped.count, formatCurrency(revenueByStatus.Shipped.revenue), formatCurrency(revenueByStatus.Shipped.count > 0 ? revenueByStatus.Shipped.revenue / revenueByStatus.Shipped.count : 0)])
                summaryData.push(['Completed', revenueByStatus.Completed.count, formatCurrency(revenueByStatus.Completed.revenue), formatCurrency(revenueByStatus.Completed.count > 0 ? revenueByStatus.Completed.revenue / revenueByStatus.Completed.count : 0)])
                summaryData.push(['Cancelled', revenueByStatus.Cancelled.count, formatCurrency(revenueByStatus.Cancelled.revenue), formatCurrency(revenueByStatus.Cancelled.count > 0 ? revenueByStatus.Cancelled.revenue / revenueByStatus.Cancelled.count : 0)])
                summaryData.push([''])
                summaryData.push(['Order Value Distribution'])
                summaryData.push([''])
                summaryData.push(['Value Range', 'Order Count', 'Total Revenue'])
                
                const valueRanges = [
                  { min: 0, max: 500, label: '₱0 - ₱500' },
                  { min: 500, max: 1000, label: '₱500 - ₱1,000' },
                  { min: 1000, max: 2000, label: '₱1,000 - ₱2,000' },
                  { min: 2000, max: 5000, label: '₱2,000 - ₱5,000' },
                  { min: 5000, max: Infinity, label: '₱5,000+' }
                ]
                
                valueRanges.forEach(range => {
                  const ordersInRange = filteredOrders.filter(order => {
                    const total = order.total || 0
                    return total >= range.min && total < range.max
                  })
                  const count = ordersInRange.length
                  const revenue = ordersInRange.reduce((sum, o) => sum + (o.total || 0), 0)
                  summaryData.push([range.label, count, formatCurrency(revenue)])
                })
                
                summaryData.push([''])
                summaryData.push(['Top Orders'])
                summaryData.push([''])
                summaryData.push(['Order ID', 'Total Spent', 'Products Ordered'])
                
                const ordersWithProducts = filteredOrders.map(order => {
                  const orderId = order.id || 'Unknown'
                  
                  const orderItems = order.order_items || []
                  const products = orderItems.map(item => {
                    const productName = item.products?.name || 
                                       item.product?.name || 
                                       item.product_name ||
                                       'Unknown Product'
                    const quantity = Number(item.quantity) || 0
                    return `${productName} (x${quantity})`
                  }).join(', ') || 'No items'
                  
                  return {
                    id: orderId,
                    total: order.total || 0,
                    products: products
                  }
                })
                
                const topOrders = ordersWithProducts
                  .sort((a, b) => b.total - a.total) // Sort by total spent
                  .slice(0, 10)
                
                topOrders.forEach(order => {
                  summaryData.push([
                    order.id,
                    formatCurrency(order.total),
                    order.products
                  ])
                })
                
                const ordersData = [
                  ['Completed Orders List'],
                  [''],
                  ['Date Range:', dateRangeStr],
                  ['Total Orders:', filteredOrders.length],
                  [''],
                  ['Order ID', 'Date', 'Customer Name', 'Email', 'Status', 'Product Name', 'Quantity', 'Unit Price', 'Subtotal', 'Order Total']
                ]
                
                if (filteredOrders && filteredOrders.length > 0) {
                  filteredOrders.forEach((order, orderIndex) => {
                    const customerName = order.customer_snapshot?.name || 
                                       (order.customer_snapshot?.first_name && order.customer_snapshot?.last_name 
                                         ? `${order.customer_snapshot.first_name} ${order.customer_snapshot.last_name}` 
                                         : 'N/A')
                    const email = order.customer_email || order.customer_snapshot?.email || 'N/A'
                    const orderDate = new Date(order.created_at).toLocaleDateString('en-PH', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    const status = order.status || 'N/A'
                    const orderTotal = formatCurrency(order.total || 0)
                    
                    const orderItems = order.order_items || []
                    
                    if (orderItems && orderItems.length > 0) {
                      orderItems.forEach((item, itemIndex) => {
                        const productName = item.products?.name || 
                                          item.product?.name || 
                                          item.product_name ||
                                          'Unknown Product'
                        const quantity = Number(item.quantity) || 0
                        const unitPrice = Number(item.price) || 0
                        const subtotal = quantity * unitPrice
                        
                        ordersData.push([
                          itemIndex === 0 ? order.id : '',
                          itemIndex === 0 ? orderDate : '',
                          itemIndex === 0 ? customerName : '',
                          itemIndex === 0 ? email : '',
                          itemIndex === 0 ? status : '',
                          productName,
                          quantity,
                          formatCurrency(unitPrice),
                          formatCurrency(subtotal),
                          itemIndex === 0 ? orderTotal : ''
                        ])
                      })
                    } else {
                      ordersData.push([
                        order.id,
                        orderDate,
                        customerName,
                        email,
                        status,
                        'No items',
                        0,
                        formatCurrency(0),
                        formatCurrency(0),
                        orderTotal
                      ])
                    }
                    
                    ordersData.push(['', '', '', '', '', '', '', '', '', ''])
                  })
                } else {
                  ordersData.push(['', '', '', '', '', 'No completed orders found in this period', '', '', '', ''])
                }
                
                const calculateColumnWidths = (data) => {
                  const widths = []
                  if (!data || data.length === 0) return widths
                  
                  const numCols = Math.max(...data.map(row => row ? row.length : 0))
                  
                  for (let col = 0; col < numCols; col++) {
                    let maxLength = 10
                    for (let row = 0; row < data.length; row++) {
                      if (data[row] && data[row][col] !== undefined && data[row][col] !== null) {
                        const cellValue = String(data[row][col])
                        maxLength = Math.max(maxLength, cellValue.length)
                      }
                    }
                    widths.push({ wch: Math.min(maxLength + 2, 50) })
                  }
                  return widths
                }
                
                const addBorders = (ws, data) => {
                  if (!ws || !data || data.length === 0) return ws
                  
                  try {
                    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
                    const borderStyle = {
                      top: { style: 'thin', color: { rgb: '000000' } },
                      bottom: { style: 'thin', color: { rgb: '000000' } },
                      left: { style: 'thin', color: { rgb: '000000' } },
                      right: { style: 'thin', color: { rgb: '000000' } }
                    }
                    
                    for (let R = 0; R <= range.e.r; R++) {
                      for (let C = 0; C <= range.e.c; C++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
                        
                        if (data[R] && data[R][C] !== undefined && data[R][C] !== null && String(data[R][C]).trim() !== '') {
                          if (!ws[cellAddress]) {
                            ws[cellAddress] = { t: 's', v: String(data[R][C]) }
                          }
                          
                          if (!ws[cellAddress].s) {
                            ws[cellAddress].s = {}
                          }
                          ws[cellAddress].s.border = borderStyle
                        }
                      }
                    }
                  } catch (error) {
                    console.warn('[Export] Border styling failed, continuing without borders:', error)
                  }
                  return ws
                }
                
                const ordersWs = XLSX.utils.aoa_to_sheet(ordersData)
                ordersWs['!cols'] = calculateColumnWidths(ordersData)
                
                const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
                summaryWs['!cols'] = calculateColumnWidths(summaryData)
                XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')
                
                XLSX.utils.book_append_sheet(wb, ordersWs, 'Orders')
                
                let productsWs = null
                let productsData = null
                
                if (analytics.topProducts && analytics.topProducts.length > 0) {
                  productsData = [
                    ['Top Performing Products'],
                    [''],
                    ['Date Range:', dateRangeStr],
                    ['Total Products Listed:', analytics.topProducts.length],
                    [''],
                    ['Rank', 'Product Name', 'Sales Count', 'Revenue'],
                    ['', '', '', '']
                  ]
                  
                  analytics.topProducts.forEach((product, index) => {
                    productsData.push([
                      index + 1,
                      product.name,
                      product.sales,
                      formatCurrency(product.revenue)
                    ])
                  })
                  
                  productsData.push(['', '', '', ''])
                  productsData.push(['', 'Total', analytics.topProducts.reduce((sum, p) => sum + p.sales, 0), formatCurrency(analytics.topProducts.reduce((sum, p) => sum + p.revenue, 0))])
                  
                  productsWs = XLSX.utils.aoa_to_sheet(productsData)
                  productsWs['!cols'] = calculateColumnWidths(productsData)
                  XLSX.utils.book_append_sheet(wb, productsWs, 'Top Products')
                }
                
                let trendWs = null
                let trendData = null
                
                if (aggregatedChart.labels && aggregatedChart.labels.length > 0) {
                  trendData = [
                    ['Sales Trend Data'],
                    [''],
                    ['Chart Period:', chartPeriodLabel],
                    ['Date Range:', dateRangeStr],
                    ['Total Periods:', aggregatedChart.labels.length],
                    [''],
                    ['Period', 'Revenue', 'Orders'],
                    ['', '', '']
                  ]
                  
                  aggregatedChart.labels.forEach((label, index) => {
                    trendData.push([
                      label,
                      formatCurrency(aggregatedChart.revenueData[index] || 0),
                      aggregatedChart.salesData[index] || 0
                    ])
                  })
                  
                  trendData.push(['', '', ''])
                  trendData.push(['Total', 
                    formatCurrency(aggregatedChart.revenueData.reduce((sum, val) => sum + (val || 0), 0)),
                    aggregatedChart.salesData.reduce((sum, val) => sum + (val || 0), 0)
                  ])
                  
                  trendWs = XLSX.utils.aoa_to_sheet(trendData)
                  trendWs['!cols'] = calculateColumnWidths(trendData)
                  XLSX.utils.book_append_sheet(wb, trendWs, 'Sales Trend')
                }
                
                try {
                  addBorders(summaryWs, summaryData)
                  addBorders(ordersWs, ordersData)
                  if (productsWs && productsData) {
                    addBorders(productsWs, productsData)
                  }
                  if (trendWs && trendData) {
                    addBorders(trendWs, trendData)
                  }
                } catch (borderError) {
                  console.warn('[Export] Could not add borders, continuing:', borderError)
                }
                
                const fileName = `sales-report-${timeRange}-${new Date().toISOString().split('T')[0]}.xlsx`
                
                try {
                  if (typeof XLSXStyle !== 'undefined' && XLSXStyle.writeFile) {
                    XLSXStyle.writeFile(wb, fileName)
                  } else {
                    XLSX.writeFile(wb, fileName)
                  }
                } catch (styleError) {
                  console.warn('[Export] xlsx-js-style failed, using regular xlsx:', styleError)
                  XLSX.writeFile(wb, fileName)
                }
              } catch (error) {
                console.error('[Export] Export failed:', error)
                alert(`Failed to export report: ${error.message || 'Unknown error'}. Please try again.`)
              }
            }}
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
              <PhilippinePeso className="w-6 h-6 text-white" />
            </div>
            {analytics.revenueGrowth < 100 && (
              <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                {analytics.revenueGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.abs(analytics.revenueGrowth)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white mb-2">{formatCurrency(analytics.totalRevenue)}</p>
            <p className="text-xs text-slate-500 mt-1">
              {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </p>
          </div>
        </div>

        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            {analytics.ordersGrowth < 100 && (
              <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                {analytics.ordersGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.abs(analytics.ordersGrowth)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white mb-2">{analytics.totalOrders}</p>
            <p className="text-xs text-slate-500 mt-1">
              {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </p>
          </div>
        </div>

        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105" style={{ padding: '1.25rem' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-white mb-2">{formatCurrency(analytics.averageOrderValue)}</p>
            <p className="text-xs text-slate-500 mt-1">Per transaction</p>
          </div>
        </div>
      </div>

      {}
      <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300" style={{ padding: '2rem' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 mb-1">
              <Activity className="w-6 h-6 text-blue-400" />
              Revenue & Orders Trend
            </h3>
            <p className="text-slate-400 mt-1">
              {chartPeriod === 'daily' ? 'Daily' :
               chartPeriod === 'monthly' ? 'Monthly' : 
               chartPeriod === 'quarterly' ? 'Quarterly' : 
               chartPeriod === 'semi-annually' ? 'Semi-Annual' : 
               'Annual'} performance overview
            </p>
          </div>
          <div className="flex items-center gap-4">
            {chartPeriod === 'daily' && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                {(() => {
                  const now = new Date()
                  const months = []
                  for (let i = 11; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    const year = date.getFullYear()
                    const month = date.getMonth() + 1
                    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    const value = `${year}-${String(month).padStart(2, '0')}`
                    months.push(
                      <option key={value} value={value} className="bg-slate-800">
                        {monthName}
                      </option>
                    )
                  }
                  return months
                })()}
              </select>
            )}
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              <option value="daily" className="bg-slate-800">Daily</option>
              <option value="monthly" className="bg-slate-800">Monthly</option>
              <option value="quarterly" className="bg-slate-800">Quarterly</option>
              <option value="semi-annually" className="bg-slate-800">Semi-Annual</option>
              <option value="annual" className="bg-slate-800">Annual</option>
            </select>
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
        <div className="h-96 mt-2">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-slate-400 leading-relaxed">
            {chartPeriod === 'daily' 
              ? 'Daily revenue and order trends for the selected month.'
              : chartPeriod === 'monthly'
              ? 'Monthly revenue and order trends over the past 12 months.'
              : chartPeriod === 'quarterly'
              ? 'Quarterly revenue and order trends grouped into three-month periods.'
              : chartPeriod === 'semi-annually'
              ? 'Semi-annual revenue and order trends across six-month periods.'
              : 'Annual revenue and order trends over multiple years.'
            }
          </p>
        </div>
        {aggregatedChart.labels.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-4">
            <h4 className="text-sm font-semibold text-white mb-3">
              {chartPeriod === 'daily' ? 'Daily' :
               chartPeriod === 'monthly' ? 'Monthly' : 
               chartPeriod === 'quarterly' ? 'Quarterly' : 
               chartPeriod === 'semi-annually' ? 'Semi-Annual' : 
               'Annual'} Breakdown
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-300">Period</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-300">Revenue</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-300">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedChart.labels.map((label, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 px-3 text-xs text-white">{label}</td>
                      <td className="py-2 px-3 text-xs text-white text-right font-medium">{formatCurrency(aggregatedChart.revenueData[index] || 0)}</td>
                      <td className="py-2 px-3 text-xs text-white text-right font-medium">{aggregatedChart.salesData[index] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300" style={{ padding: '2rem' }}>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-400" />
            Orders by Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-4 glass-effect rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
                <p className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">{count}</p>
                <p className="text-sm text-slate-400 capitalize font-medium mb-1">{status}</p>
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

        <div className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="p-6 border-b border-white/10" style={{ padding: '1.25rem' }}>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-purple-400" />
              Top Performing Products
            </h3>
          </div>
          <div className="p-6" style={{ padding: '1.25rem' }}>
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
                      <p className="font-bold text-white text-lg mb-1">{formatCurrency(product.revenue)}</p>
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
                  <p className="text-slate-500 text-base">No product sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
