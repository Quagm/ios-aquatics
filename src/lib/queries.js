import { supabase } from "@/supabaseClient"

// Products
export async function fetchProducts({ category } = {}) {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false })
  if (category && category !== "all") query = query.eq("category", category)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()
  if (error) throw error
  return data
}

export async function createProduct(product) {
  const { data, error } = await supabase.from("products").insert(product).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(productId, updates) {
  const { data, error } = await supabase.from("products").update(updates).eq("id", productId).select().single()
  if (error) throw error
  return data
}

export async function deleteProductById(productId) {
  const { error } = await supabase.from("products").delete().eq("id", productId)
  if (error) throw error
}

// Inquiries
export async function fetchInquiries() {
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data || []
}

export async function createInquiry(inquiry) {
  const { data, error } = await supabase.from("inquiries").insert(inquiry).select().single()
  if (error) throw error
  return data
}

export async function deleteInquiryById(inquiryId) {
  const { error } = await supabase.from("inquiries").delete().eq("id", inquiryId)
  if (error) throw error
}

// Update inquiry status
export async function updateInquiryStatus(inquiryId, status) {
  const { data, error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", inquiryId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Orders
export async function fetchOrders() {
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (ordersError) throw new Error(ordersError.message || 'Failed to fetch orders')

  const orderList = orders || []
  if (!orderList.length) return orderList

  const orderIds = orderList.map((order) => order.id).filter(Boolean)
  if (!orderIds.length) {
    return orderList.map((order) => ({
      ...order,
      order_items: []
    }))
  }
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, quantity, price")
    .in("order_id", orderIds)

  if (itemsError) throw new Error(itemsError.message || 'Failed to fetch order items')

  const itemsList = items || []
  const productIds = [...new Set(itemsList.map((item) => item.product_id).filter(Boolean))]
  let productsById = new Map()
  if (productIds.length) {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds)

    if (productsError) throw new Error(productsError.message || 'Failed to fetch product details')

    productsById = new Map((products || []).map((product) => [product.id, product]))
  }

  const itemsByOrder = new Map()
  for (const item of itemsList) {
    const product = item.product_id ? productsById.get(item.product_id) : null
    const list = itemsByOrder.get(item.order_id) || []
    list.push({
      ...item,
      products: product ? { name: product.name } : null
    })
    itemsByOrder.set(item.order_id, list)
  }

  return orderList.map((order) => ({
    ...order,
    order_items: itemsByOrder.get(order.id) || []
  }))
}

export async function createOrder({ customer, items, totals }) {
  const total = totals?.total ?? 0
  const customerEmail = customer?.email || null
  let order = null
  let orderError = null
  const customerSnapshot = customer ? {
    name: customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || null,
    first_name: customer.first_name || null,
    last_name: customer.last_name || null,
    email: customer.email || customerEmail,
    phone: customer.phone || null,
    address: customer.address || null,
    city: customer.city || null,
    province: customer.province || null,
    postal_code: customer.postal_code || customer.postal || null,
  } : null

  const attemptedInserts = [
    { total, status: "processing", customer_email: customerEmail, customer_snapshot: customerSnapshot },
    { total, status: "processing", customer_email: customerEmail },
    { total, status: "processing" }
  ]

  for (const payload of attemptedInserts) {
    if (order) break
    const res = await supabase
      .from("orders")
      .insert(payload)
      .select()
      .single()
    if (!res.error) {
      order = res.data
      break
    }
    const message = String(res.error?.message || '').toLowerCase()
    const isColumnMissing = message.includes('column') && message.includes('customer_snapshot')
    const isEmailMissing = message.includes('column') && message.includes('customer_email')
    if (!(isColumnMissing || isEmailMissing)) {
      orderError = res.error
      break
    }
  }

  if (!order && !orderError) {
    orderError = new Error('Failed to create order')
  }
  if (orderError) throw orderError

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price
  }))
  
  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
  if (itemsError) throw itemsError

  if (order && !order.customer_snapshot && customerSnapshot) {
    order.customer_snapshot = customerSnapshot
  }

  return order
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch('/api/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id: orderId, status })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to update order')
  return data
}

export async function deleteOrderById(orderId) {
  const res = await fetch('/api/orders', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id: orderId })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Failed to delete order')
  return data
}

// Analytics - Simplified function that calculates sales metrics from your database
export async function getSalesAnalytics(timeRange = '30d') {
  // Step 1: Calculate date ranges (current period and previous period for growth comparison)
  const now = new Date()
  let startDate = new Date()
  let previousStartDate = new Date()
  
  if (timeRange === '7d') {
    startDate.setDate(now.getDate() - 7)
    previousStartDate.setDate(now.getDate() - 14)
  } else if (timeRange === '30d') {
    startDate.setDate(now.getDate() - 30)
    previousStartDate.setDate(now.getDate() - 60)
  } else if (timeRange === '90d') {
    startDate.setDate(now.getDate() - 90)
    previousStartDate.setDate(now.getDate() - 180)
  }

  // Step 2: Fetch all orders (we'll filter by date in JavaScript for simplicity)
  const { data: allOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .order("created_at", { ascending: false })
  
  if (ordersError) throw ordersError

  // Step 3: Filter orders by time range
  const currentPeriodOrders = (allOrders || []).filter(order => {
    const orderDate = new Date(order.created_at)
    return orderDate >= startDate && orderDate <= now
  })

  const previousPeriodOrders = (allOrders || []).filter(order => {
    const orderDate = new Date(order.created_at)
    return orderDate >= previousStartDate && orderDate < startDate
  })

  // Step 4: Calculate current period metrics
  const totalRevenue = currentPeriodOrders
    .filter(o => String(o.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, order) => sum + parseFloat(order.total || 0), 0)

  const totalOrders = currentPeriodOrders.length

  // Step 5: Calculate previous period metrics (for growth comparison)
  const previousRevenue = previousPeriodOrders
    .filter(o => String(o.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, order) => sum + parseFloat(order.total || 0), 0)

  const previousOrders = previousPeriodOrders.length

  // Step 6: Calculate growth percentages
  const revenueGrowth = previousRevenue > 0 
    ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
    : (totalRevenue > 0 ? 100 : 0)
  
  const ordersGrowth = previousOrders > 0 
    ? ((totalOrders - previousOrders) / previousOrders) * 100 
    : (totalOrders > 0 ? 100 : 0)

  // Step 7: Count orders by status
  const statusCounts = currentPeriodOrders.reduce((acc, order) => {
    const status = order.status || 'processing'
    // Normalize status names for display
    const normalizedStatus = status === 'completed' ? 'Delivered' :
                             status === 'shipped' ? 'Shipped' :
                             status === 'processing' ? 'Processing' :
                             status === 'cancelled' ? 'Cancelled' : status
    acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1
    return acc
  }, {})

  // Step 8: Get top products from order items
  // Fetch order items and products separately to avoid relationship ambiguity
  const currentOrderIds = currentPeriodOrders.map(o => o.id)
  
  if (currentOrderIds.length === 0) {
    // No orders in current period, return empty top products
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: 0,
      ordersByStatus: statusCounts,
      topProducts: [],
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      ordersGrowth: Math.round(ordersGrowth * 10) / 10,
      revenueData: [],
      salesData: [],
      chartLabels: []
    }
  }

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, quantity, price")
    .in("order_id", currentOrderIds)
  
  if (itemsError) throw itemsError

  // Get unique product IDs and fetch products separately
  const productIds = [...new Set((orderItems || []).map(item => item.product_id).filter(Boolean))]
  let productsById = new Map()
  
  if (productIds.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds)
    
    if (productsError) throw productsError
    productsById = new Map((products || []).map((product) => [product.id, product]))
  }

  // Calculate product sales by joining order items with products
  const productSales = (orderItems || []).reduce((acc, item) => {
    const product = item.product_id ? productsById.get(item.product_id) : null
    const productName = product?.name || 'Unknown'
    if (!acc[productName]) acc[productName] = { sales: 0, revenue: 0 }
    acc[productName].sales += item.quantity || 0
    acc[productName].revenue += (item.quantity || 0) * parseFloat(item.price || 0)
    return acc
  }, {})

  const topProductsList = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Step 9: Generate monthly chart data (last 12 months)
  const monthlyData = {}
  const nowForChart = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(nowForChart.getFullYear(), nowForChart.getMonth() - i, 1)
    const monthKey = monthDate.toLocaleDateString('en-US', { month: 'short' })
    monthlyData[monthKey] = { orders: 0, revenue: 0 }
  }

  // Group orders by month
  allOrders.forEach(order => {
    const orderDate = new Date(order.created_at)
    const monthKey = orderDate.toLocaleDateString('en-US', { month: 'short' })
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].orders += 1
      if (String(order.status || '').toLowerCase() !== 'cancelled') {
        monthlyData[monthKey].revenue += parseFloat(order.total || 0)
      }
    }
  })

  const chartLabels = Object.keys(monthlyData)
  const revenueData = Object.values(monthlyData).map(m => m.revenue)
  const salesData = Object.values(monthlyData).map(m => m.orders)

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    ordersByStatus: statusCounts,
    topProducts: topProductsList,
    revenueGrowth: Math.round(revenueGrowth * 10) / 10, // Round to 1 decimal
    ordersGrowth: Math.round(ordersGrowth * 10) / 10,
    revenueData,
    salesData,
    chartLabels
  }
}