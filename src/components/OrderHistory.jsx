"use client"
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { fetchOrders } from '@/lib/queries'

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
  const [error, setError] = useState("")
  const { user, isLoaded } = useUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress

  useEffect(() => {
    if (!isLoaded) return
    let mounted = true
    const load = async () => {
      try {
        if (mounted) setError("")
        const email = userEmail || ''
        if (!email) {
          if (mounted) setLoading(false)
          return
        }
        const data = await fetchOrders()
        const mine = (data || [])
          .filter(o => {
            const orderEmail = (o.customer_email || o.customer?.email || '').toLowerCase()
            return orderEmail === email.toLowerCase()
          })
          .map(o => ({
            id: o.id,
            date: (o.created_at || '').split('T')[0],
            items: (o.order_items || []).map(i => (i.products?.name || 'Item') + (i.quantity ? ` x${i.quantity}` : '') ).join(', '),
            total: o.total || 0,
            status: normalizeOrderStatus(o.status || 'processing')
          }))
        if (!mounted) return
        setOrders(mine)
      } catch (err) {
        if (!mounted) return
        console.error('Failed to load orders', err)
        setError(err?.message || 'Failed to load orders. Please try again later.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [isLoaded, userEmail])

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-white border-b border-white/30 pb-3">Recent Orders</h2>

      {error && (
        <div className="text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

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
              <span className={`text-sm px-3 py-1 rounded-full ${normalizeOrderStatus(order.status) === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
