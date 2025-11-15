"use client"

import { useEffect, useState, useMemo } from 'react'
import { fetchOrders, deleteOrderById } from '@/lib/queries'
import { Package, CheckCircle, Calendar, DollarSign, AlertCircle, Trash2, X, Filter } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'
import { supabase } from '@/supabaseClient'

const normalizeOrderStatus = (status) => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'delivered') return 'completed'
  if (normalized === 'cancel') return 'cancelled'
  return normalized
}

const getOrderStatusLabel = (status) => {
  const normalized = normalizeOrderStatus(status)
  switch (normalized) {
    case 'processing':
      return 'Processing'
    case 'shipped':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return normalized ? normalized.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Unknown'
  }
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const { push } = useToast()

  useEffect(() => {
    let mounted = true
    fetchOrders()
      .then((data) => {
        if (!mounted) return
        const completed = (data || [])
          .filter(o => {
            const status = normalizeOrderStatus(o.status)
            return status === 'completed' || status === 'cancelled'
          })
          .map((o) => {
            const snapshot = o.customer_snapshot || {}
            const customer = o.customer || {}
            return {
              id: o.id,
              items: (o.order_items || []).map(i => ({
                name: i.products?.name || 'Unknown Product',
                quantity: i.quantity,
                price: i.price,
              })),
              total: o.total,
              status: normalizeOrderStatus(o.status),
              orderDate: o.created_at?.split('T')[0],
              createdAt: o.created_at,
              customer: { ...snapshot, ...customer }
            }
          })
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.orderDate || 0)
            const dateB = new Date(b.createdAt || b.orderDate || 0)
            return dateB - dateA
          })
        setOrders(completed)
        if (completed.length === 0) {
          push({ title: 'No archived orders', description: 'No completed or cancelled orders found.', variant: 'default' })
        }
      })
      .catch((e) => {
        push({ title: 'Load failed', description: e?.message || 'Could not load order history', variant: 'error' })
      })
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('orders_history_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        try {
          const data = await fetchOrders()
          const archived = (data || [])
            .filter(o => {
              const status = normalizeOrderStatus(o.status)
              return status === 'completed' || status === 'cancelled'
            })
            .map((o) => {
              const snapshot = o.customer_snapshot || {}
              const customer = o.customer || {}
              return {
                id: o.id,
                items: (o.order_items || []).map(i => ({ name: i.products?.name || 'Unknown Product', quantity: i.quantity, price: i.price })),
                total: o.total,
                status: normalizeOrderStatus(o.status),
                orderDate: o.created_at?.split('T')[0],
                createdAt: o.created_at,
                customer: { ...snapshot, ...customer }
              }
            })
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.orderDate || 0)
              const dateB = new Date(b.createdAt || b.orderDate || 0)
              return dateB - dateA
            })
          setOrders(archived)
        } catch {}
      })
      .subscribe()
    return () => {
      try { supabase.removeChannel(channel) } catch {}
    }
  }, [])

  const filteredOrders = useMemo(() => {
    let filtered = orders
    
    if (selectedDate) {
      filtered = filtered.filter(order => order.orderDate === selectedDate)
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus)
    }
    
    return filtered
  }, [orders, selectedDate, selectedStatus])

  const totalRevenue = filteredOrders.reduce((sum, o) => {
    if (normalizeOrderStatus(o.status) === 'cancelled') {
      return sum
    }
    return sum + (o.total || 0)
  }, 0)

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this order? This action cannot be undone.')
    if (!confirmed) return

    try {
      await deleteOrderById(orderId)

      setOrders(orders.filter(o => o.id !== orderId))
      push({ title: 'Order deleted', description: `Order ${orderId} has been permanently deleted.`, variant: 'success' })
    } catch (e) {
      push({ title: 'Delete failed', description: e?.message || 'Could not delete order', variant: 'error' })
    }
  }

  return (
    <div className="space-y-8 py-8 sm:py-12 lg:py-16 px-6 sm:px-8 lg:px-12">
      {}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          <Package className="w-4 h-4" />
          Order History
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Order</span> History
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Archived orders that have been completed or cancelled.</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-effect rounded-2xl border border-white/10" style={{ padding: '1rem' }}>
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Archived Orders</p>
              <p className="text-2xl font-bold text-white">{filteredOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-effect rounded-2xl border border-white/10" style={{ padding: '1rem' }}>
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Revenue (Completed)</p>
              <p className="text-2xl font-bold text-white">₱{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="flex justify-start mb-6">
        <div className="glass-effect rounded-xl border border-white/10 inline-flex flex-col" style={{ padding: '1rem' }}>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-300" />
            <h3 className="text-base font-semibold text-white">Filters</h3>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-300">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-300">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="completed" className="bg-slate-800">Completed</option>
                <option value="cancelled" className="bg-slate-800">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {}
      <div>
        <div className="px-1 py-2">
          <h3 className="text-lg font-semibold text-white">Archived Orders ({filteredOrders.length})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="glass-effect rounded-2xl border border-white/10 hover:border-white/20 transition-all" style={{ padding: '1.25rem' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">#{order.id}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'cancelled' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'cancelled' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="ml-1">{getOrderStatusLabel(order.status)}</span>
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">{order.orderDate}</p>
                </div>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
                  title="Delete Order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-white text-sm font-medium">{order.items.length} items</p>
                <p className="text-slate-300 text-sm line-clamp-2">{order.items.map(i => i.name).join(', ')}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-white font-semibold">₱{order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
          {(!loading && filteredOrders.length === 0) && (
            <div className="col-span-full text-center text-slate-300 py-12 border border-dashed border-white/20 rounded-xl">
              {selectedDate ? `No orders found for ${selectedDate}.` : 'No archived orders yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
