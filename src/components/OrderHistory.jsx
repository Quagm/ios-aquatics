"use client"
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useUser } from '@clerk/nextjs'
import { fetchOrders } from '@/lib/queries'
import { X } from 'lucide-react'

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

const STATUS_STYLES = {
  processing: "bg-blue-500/20 text-blue-200",
  shipped: "bg-purple-500/20 text-purple-200",
  completed: "bg-green-500/20 text-green-200",
  cancelled: "bg-red-500/20 text-red-200"
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
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
            const snapshotEmail = (o.customer_snapshot?.email || '').toLowerCase()
            const orderEmail = (o.customer_email || o.customer?.email || snapshotEmail || '').toLowerCase()
            return orderEmail === email.toLowerCase()
          })
          .map(o => ({
            id: o.id,
            date: o.created_at,
            items: o.order_items || [],
            total: o.total || 0,
            status: normalizeOrderStatus(o.status || 'processing'),
            customer_snapshot: o.customer_snapshot || {}
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateString.split('T')[0]
    }
  }

  const getItemsPreview = (items) => {
    if (!items || items.length === 0) return 'No items'
    const preview = items.slice(0, 2).map(i => {
      const name = i.products?.name || 'Item'
      const qty = i.quantity || 1
      return `${name}${qty > 1 ? ` x${qty}` : ''}`
    }).join(', ')
    return items.length > 2 ? `${preview} +${items.length - 2} more` : preview
  }

  return (
    <>
      {error && (
        <div className="text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-slate-300 text-sm">No orders yet.</div>
      )}

      <div className="space-y-3">
        {orders.map((order) => {
          const statusKey = order.status?.toLowerCase() || 'processing'
          const labelClass = STATUS_STYLES[statusKey] || STATUS_STYLES.processing
          const createdAt = order.date ? new Date(order.date) : null
          
          return (
            <button
              key={order.id}
              type="button"
              className="w-full text-left border border-white/20 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="text-sm sm:text-base font-semibold text-white truncate">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-xs text-white/60 truncate">
                    {getItemsPreview(order.items)}
                  </p>
            </div>
                <div className="flex items-center gap-3 shrink-0">
                  {createdAt && (
                    <span className="text-xs text-white/60 whitespace-nowrap">
                      {formatDate(order.date)}
                    </span>
                  )}
                  <span className={`text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full ${labelClass} whitespace-nowrap`}>
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
          </div>
            </button>
          )
        })}
      </div>

      {selectedOrder && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setSelectedOrder(null)}
          ></div>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/10 pointer-events-auto">
            <div className="sticky top-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-10 border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Order ID:</span>
                      <span className="text-white font-mono">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Date:</span>
                      <span className="text-white">{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[selectedOrder.status?.toLowerCase()] || STATUS_STYLES.processing}`}>
                        {getOrderStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total:</span>
                      <span className="text-[#6c47ff] font-semibold text-lg">₱{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Items</h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.products?.name || 'Unknown Product'}</p>
                            <p className="text-slate-400 text-sm">Quantity: {item.quantity || 1}</p>
                          </div>
                          <p className="text-white font-semibold">₱{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-300">No items found</p>
                    )}
                  </div>
                </div>

                {}
                {selectedOrder.customer_snapshot && Object.keys(selectedOrder.customer_snapshot).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Delivery Address</h3>
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      {selectedOrder.customer_snapshot.name && (
                        <p className="text-white font-medium">{selectedOrder.customer_snapshot.name}</p>
                      )}
                      {selectedOrder.customer_snapshot.email && (
                        <p className="text-slate-300 text-sm">{selectedOrder.customer_snapshot.email}</p>
                      )}
                      {selectedOrder.customer_snapshot.phone && (
                        <p className="text-slate-300 text-sm">{selectedOrder.customer_snapshot.phone}</p>
                      )}
                      {(selectedOrder.customer_snapshot.address || selectedOrder.customer_snapshot.city || selectedOrder.customer_snapshot.province || selectedOrder.customer_snapshot.postal_code) && (
                        <div className="text-slate-300 text-sm mt-2">
                          {selectedOrder.customer_snapshot.address && <p>{selectedOrder.customer_snapshot.address}</p>}
                          {(selectedOrder.customer_snapshot.city || selectedOrder.customer_snapshot.province || selectedOrder.customer_snapshot.postal_code) && (
                            <p>
                              {[selectedOrder.customer_snapshot.city, selectedOrder.customer_snapshot.province, selectedOrder.customer_snapshot.postal_code]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
      </div>
    </div>
        </div>,
        document.body
      )}
    </>
  )
}
