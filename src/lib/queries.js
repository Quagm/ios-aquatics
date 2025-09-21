import { supabase } from "@/supabaseClient"

// Products
export async function fetchProducts({ category } = {}) {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false })
  if (category && category !== "all") query = query.eq("category", category)
  const { data, error } = await query
  if (error) throw error
  return data || []
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
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        price,
        products (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data || []
}

export async function createOrder({ items, total }) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ total, status: "processing" })
    .select()
    .single()
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
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()
  if (error) throw error
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
