"use client"
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { fetchOrders, updateOrderStatus as updateOrderStatusDb } from '@/lib/queries'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { push } = useToast()

  const normalize = (data) => (data || []).map((o) => ({
    id: o.id,
    items: (o.order_items || []).map((i) => ({ 
      name: i.products?.name || 'Unknown Product', 
      quantity: i.quantity, 
      price: i.price 
    })),
    total: o.total,
    status: o.status,
    orderDate: o.created_at?.split('T')[0],
    customer: o.customer || {}
  }))

  const loadOrders = async () => {
    try {
      const data = await fetchOrders()
      const normalized = normalize(data)
      setOrders(normalized)
      setFilteredOrders(normalized)
    } catch (e) {
      push({ title: 'Load failed', description: e?.message || 'Could not load orders', variant: 'error' })
    }
  }

  useEffect(() => {
    let isMounted = true
    loadOrders().catch(() => {})
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Always exclude completed/delivered orders from the active management view (case-insensitive)
    filtered = filtered.filter(order => {
      const s = String(order.status || '').toLowerCase()
      return s !== 'completed' && s !== 'delivered'
    })

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (dateFilter !== 'all') {
      const today = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => order.orderDate === today.toISOString().split('T')[0])
          break
        case 'week':
          filterDate.setDate(today.getDate() - 7)
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate)
          break
        case 'month':
          filterDate.setMonth(today.getMonth() - 1)
          filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate)
          break
      }
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, dateFilter, orders])

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const updateOrderStatus = async (id, newStatus) => {
    try {
      // Confirm when archiving-like statuses
      if ((newStatus || '').toLowerCase() === 'completed' || (newStatus || '').toLowerCase() === 'delivered') {
        const ok = window.confirm('Mark this order as finished? It will be moved to Order History and removed from active orders.')
        if (!ok) return
      }
      const updated = await updateOrderStatusDb(id, newStatus)
      // Refetch to ensure both active and history views reflect the change
      await loadOrders()
      const us = String(updated?.status || '').toLowerCase()
      // Debug/visibility toast
      push({ title: 'Status updated', description: `Order ${id} new status: ${updated?.status}`, variant: 'default' })
      if (us === 'completed' || us === 'delivered') {
        push({ title: 'Order archived', description: `Order ${id} moved to history.`, variant: 'success' })
      } else {
        push({ title: 'Order updated', description: `Order ${id} set to ${updated?.status}.`, variant: 'success' })
      }
    } catch (e) {
      push({ title: 'Update failed', description: e?.message || 'Could not update order status', variant: 'error' })
    }
  }

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.total, 0)
  }

  const getOrderStats = () => {
    const stats = {
      total: filteredOrders.length,
      processing: filteredOrders.filter(o => o.status === 'processing').length,
      shipped: filteredOrders.filter(o => o.status === 'shipped').length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
    }
    return stats
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-8 ml-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          <Package className="w-4 h-4" />
          Order Management
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Order</span> Management
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Manage customer orders and track fulfillment for your aquatics store.</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Processing</p>
              <p className="text-2xl font-bold text-white">{stats.processing}</p>
            </div>
          </div>
        </div>
        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Shipped</p>
              <p className="text-2xl font-bold text-white">{stats.shipped}</p>
            </div>
          </div>
        </div>
        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Revenue</p>
              <p className="text-2xl font-bold text-white">₱{getTotalRevenue().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Orders ({filteredOrders.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-white/10">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{order.items.length} items</div>
                    <div className="text-sm text-slate-300">
                      {order.items.map(item => item.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    ₱{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-300 hover:text-blue-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-300 hover:text-green-200"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  )
}

// Order Detail Modal Component
function OrderDetailModal({ order, onClose, onUpdateStatus }) {
  const [newStatus, setNewStatus] = useState(order.status)

  const handleStatusUpdate = () => {
    onUpdateStatus(order.id, newStatus)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Order Details - {order.id}</h3>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Order Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Order Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-slate-300" />
                <div>
                  <p className="font-medium text-white">{order.orderDate}</p>
                  <p className="text-sm text-slate-300">Order Date</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-slate-300" />
                <div>
                  <p className="font-medium text-white">{order.id}</p>
                  <p className="text-sm text-slate-300">Order ID</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          {order.customer && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="font-medium text-white">{order.customer.name || `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-medium text-white">{order.customer.email || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="font-medium text-white">{order.customer.phone || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Address</p>
                  <p className="font-medium text-white">{order.customer.address || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">City</p>
                  <p className="font-medium text-white">{order.customer.city || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Province</p>
                  <p className="font-medium text-white">{order.customer.province || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Postal Code</p>
                  <p className="font-medium text-white">{order.customer.postal_code || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-300">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-white">₱{item.price.toFixed(2)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                <p className="text-lg font-semibold text-white">Total</p>
                <p className="text-lg font-bold text-blue-400">₱{order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>


          {/* Status Update */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Update Status</h4>
            <div className="flex items-center space-x-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
