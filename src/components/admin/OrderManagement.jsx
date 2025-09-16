"use client"
import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Simulate data fetching
    const mockOrders = [
      {
        id: 'ORD-001',
        customer: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 234-567-8900'
        },
        items: [
          { name: 'Aquarium Filter Pro', quantity: 1, price: 89.99 },
          { name: 'Fish Food', quantity: 2, price: 24.99 }
        ],
        total: 139.97,
        status: 'processing',
        paymentStatus: 'paid',
        shippingAddress: '123 Main St, City, State 12345',
        orderDate: '2024-01-20',
        estimatedDelivery: '2024-01-25',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-002',
        customer: {
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1 234-567-8901'
        },
        items: [
          { name: 'LED Aquarium Light', quantity: 1, price: 149.99 }
        ],
        total: 149.99,
        status: 'shipped',
        paymentStatus: 'paid',
        shippingAddress: '456 Oak Ave, City, State 12345',
        orderDate: '2024-01-19',
        estimatedDelivery: '2024-01-24',
        trackingNumber: 'TRK987654321'
      },
      {
        id: 'ORD-003',
        customer: {
          name: 'Mike Johnson',
          email: 'mike.j@email.com',
          phone: '+1 234-567-8902'
        },
        items: [
          { name: 'Water Conditioner', quantity: 3, price: 12.99 },
          { name: 'Aquarium Decorations', quantity: 1, price: 45.99 }
        ],
        total: 84.96,
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress: '789 Pine St, City, State 12345',
        orderDate: '2024-01-18',
        estimatedDelivery: '2024-01-23',
        trackingNumber: 'TRK456789123'
      },
      {
        id: 'ORD-004',
        customer: {
          name: 'Sarah Wilson',
          email: 'sarah.w@email.com',
          phone: '+1 234-567-8903'
        },
        items: [
          { name: 'Premium Fish Food', quantity: 1, price: 34.99 }
        ],
        total: 34.99,
        status: 'cancelled',
        paymentStatus: 'refunded',
        shippingAddress: '321 Elm St, City, State 12345',
        orderDate: '2024-01-17',
        estimatedDelivery: '2024-01-22',
        trackingNumber: null
      }
    ]
    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

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
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      )
    )
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
      delivered: filteredOrders.filter(o => o.status === 'delivered').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
    }
    return stats
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">Manage customer orders and track fulfillment</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shipped}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${getTotalRevenue().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Orders ({filteredOrders.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.paymentStatus}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.items.length} items</div>
                    <div className="text-sm text-gray-500">
                      {order.items.map(item => item.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-600 hover:text-green-900"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Order Details - {order.id}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">Customer Name</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer.email}</p>
                  <p className="text-sm text-gray-600">Email Address</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer.phone}</p>
                  <p className="text-sm text-gray-600">Phone Number</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.orderDate}</p>
                  <p className="text-sm text-gray-600">Order Date</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">Total</p>
                <p className="text-lg font-bold text-blue-600">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900">{order.shippingAddress}</p>
              {order.trackingNumber && (
                <p className="text-sm text-gray-600 mt-2">
                  Tracking Number: {order.trackingNumber}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Estimated Delivery: {order.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h4>
            <div className="flex items-center space-x-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
