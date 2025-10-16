"use client"

import { useEffect, useState } from 'react'
import { fetchOrders } from '@/lib/queries'
import { Package, CheckCircle, Calendar, DollarSign } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { push } = useToast()

  useEffect(() => {
    let mounted = true
    fetchOrders()
      .then((data) => {
        if (!mounted) return
        const completed = (data || [])
          .filter(o => {
            const s = String(o.status || '').toLowerCase()
            return s === 'completed' || s === 'delivered'
          })
          .map((o) => ({
            id: o.id,
            items: (o.order_items || []).map(i => ({
              name: i.products?.name || 'Unknown Product',
              quantity: i.quantity,
              price: i.price,
            })),
            total: o.total,
            status: o.status,
            orderDate: o.created_at?.split('T')[0],
            customer: o.customer || {}
          }))
        setOrders(completed)
        if (completed.length === 0) {
          push({ title: 'No archived orders', description: 'No completed or delivered orders found.', variant: 'default' })
        }
      })
      .catch((e) => {
        push({ title: 'Load failed', description: e?.message || 'Could not load order history', variant: 'error' })
      })
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="space-y-8 ml-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-300 border border-blue-500/20 mb-4">
          <Package className="w-4 h-4" />
          Order History
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="gradient-text">Order</span> History
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">Archived orders that have been completed.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Completed Orders</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-effect rounded-2xl p-6 border border-white/10">
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

      {/* Table */}
      <div className="glass-effect rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Completed Orders ({orders.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-white/10">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{order.items.length} items</div>
                    <div className="text-sm text-slate-300">{order.items.map(i => i.name).join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">₱{order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                      <CheckCircle className="w-4 h-4" />
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.orderDate}</td>
                </tr>
              ))}
              {(!loading && orders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-300">
                    No completed orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
