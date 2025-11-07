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
  // Try insert with customer_email; if column missing, fallback without it
  let order
  let orderError
  {
    const res = await supabase
      .from("orders")
      .insert({ total, status: "processing", customer_email: customerEmail })
      .select()
      .single()
    order = res.data
    orderError = res.error
  }
  if (orderError && String(orderError.message || '').toLowerCase().includes('customer_email')) {
    const res2 = await supabase
      .from("orders")
      .insert({ total, status: "processing" })
      .select()
      .single()
    order = res2.data
    orderError = res2.error
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

// Analytics
export async function getSalesAnalytics() {
  const { data: revenueData, error: revenueError } = await supabase.from("orders").select("total")
  if (revenueError) throw revenueError

  const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0

  const { count: totalOrders, error: ordersError } = await supabase.from("orders").select("*", { count: "exact", head: true })
  if (ordersError) throw ordersError

  const { data: ordersByStatus, error: statusError } = await supabase.from("orders").select("status")
  if (statusError) throw statusError

  const statusCounts = ordersByStatus?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {}) || {}

  const { data: topProducts, error: productsError } = await supabase
    .from("order_items")
    .select(`
      quantity,
      price,
      products (
        name
      )
    `)
  if (productsError) throw productsError

  const productSales = topProducts?.reduce((acc, item) => {
    const productName = item.products?.name || 'Unknown'
    if (!acc[productName]) acc[productName] = { sales: 0, revenue: 0 }
    acc[productName].sales += item.quantity
    acc[productName].revenue += item.quantity * parseFloat(item.price)
    return acc
  }, {}) || {}

  const topProductsList = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return {
    totalRevenue,
    totalOrders: totalOrders || 0,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    ordersByStatus: statusCounts,
    topProducts: topProductsList
  }
}