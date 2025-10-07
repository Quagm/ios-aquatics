"use client"
import { useEffect, useState } from 'react'
import { fetchOrders } from '@/lib/queries'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const accRaw = typeof window !== 'undefined' ? window.localStorage.getItem('account-info') : null
        const acc = accRaw ? JSON.parse(accRaw) : null
        const email = acc?.email || ''
        const data = await fetchOrders()
        const mine = (data || [])
          .filter(o => (o.customer?.email || '').toLowerCase() === (email || '').toLowerCase())
          .map(o => ({
            id: o.id,
            date: (o.created_at || '').split('T')[0],
            items: (o.order_items || []).map(i => (i.products?.name || 'Item') + (i.quantity ? ` x${i.quantity}` : '') ).join(', '),
            total: o.total || 0,
            status: o.status || 'processing'
          }))
        if (!mounted) return
        setOrders(mine)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-white border-b border-white/30 pb-3">Recent Orders</h2>

      {!loading && orders.length === 0 && (
        <div className="text-slate-300 text-sm">No orders yet.</div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-white/30 rounded-lg p-6 bg-white/5">
            <div className="flex justify-between items-start mb-3">
              <span className="font-medium text-white">Order #{order.id}</span>
              <span className="text-sm text-white/70">{order.date}</span>
            </div>
            <p className="text-sm text-white/70 mb-3">{order.items}</p>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#6c47ff]">₱{order.total.toFixed(2)}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${String(order.status).toLowerCase() === 'completed' || String(order.status).toLowerCase() === 'delivered' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
