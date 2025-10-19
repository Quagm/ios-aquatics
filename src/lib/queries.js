import { supabase } from "@/supabaseClient"

// Helper function for consistent error handling
const handleSupabaseError = (error, operation) => {
  const msg = error?.message || error?.error_description || error?.hint || JSON.stringify(error) || 'Unknown error'
  console.error(`❌ ${operation} failed:`, error)
  throw new Error(`${operation} failed: ${msg}`)
};

// Helper function for data validation
const validateRequired = (data, fields, operation) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`${operation} failed: Missing required fields: ${missing.join(', ')}`);
  }
};

export async function fetchProductById(productId) {
  try {
    if (!productId) throw new Error('Product ID is required')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()
    if (error) handleSupabaseError(error, 'Fetch product')
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// Products
export async function fetchProducts({ category, includeInactive } = {}) {
  try {
    let query = supabase.from("products").select("*").order("created_at", { ascending: false })
    // By default only show active products (store). Admin can pass includeInactive=true
    if (!includeInactive) query = query.eq('active', true)
    if (category && category !== "all") query = query.eq("category", category)
    let { data, error } = await query
    // If 'active' column doesn't exist yet, retry without the filter so UI still works
    if (error && (error.message || '').toLowerCase().includes("'active' column")) {
      let retry = supabase.from('products').select('*').order('created_at', { ascending: false })
      if (category && category !== 'all') retry = retry.eq('category', category)
      const r = await retry
      data = r.data
      error = r.error
    }
    if (error) handleSupabaseError(error, "Fetch products")
    return data || []
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function createProduct(product) {
  try {
    validateRequired(product, ['name', 'price', 'category'], 'Create product');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(product),
    })
    const data = await res.json()
    if (!res.ok) handleSupabaseError({ message: data?.error || 'Create product failed' }, 'Create product')
    return data
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(productId, updates) {
  try {
    if (!productId) throw new Error("Product ID is required");
    // Use server API (service role) to bypass RLS and handle column compatibility
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: productId, updates })
    })
    const data = await res.json()
    if (!res.ok) handleSupabaseError({ message: data?.error || 'Update product failed' }, 'Update product')
    return data
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProductById(productId) {
  try {
    if (!productId) throw new Error("Product ID is required");
    const { error } = await supabase.from("products").delete().eq("id", productId)
    if (error) handleSupabaseError(error, "Delete product")
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// Inquiries
export async function fetchInquiries() {
  try {
    const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false })
    if (error) handleSupabaseError(error, "Fetch inquiries")
    return data || []
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    throw error;
  }
}

export async function createInquiry(inquiry) {
  try {
    validateRequired(inquiry, ['first_name', 'last_name', 'email', 'subject', 'message'], 'Create inquiry');
    const { data, error } = await supabase.from("inquiries").insert(inquiry).select().single()
    if (error) handleSupabaseError(error, "Create inquiry")
    return data
  } catch (error) {
    console.error("Error creating inquiry:", error);
    throw error;
  }
}

export async function deleteInquiryById(inquiryId) {
  try {
    if (!inquiryId) throw new Error("Inquiry ID is required");
    const { error } = await supabase.from("inquiries").delete().eq("id", inquiryId)
    if (error) handleSupabaseError(error, "Delete inquiry")
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    throw error;
  }
}

// Update inquiry status
export async function updateInquiryStatus(inquiryId, status) {
  try {
    if (!inquiryId) throw new Error("Inquiry ID is required");
    if (!status) throw new Error("Status is required");
    const validStatuses = ['accepted', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    const { data, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", inquiryId)
      .select()
      .single()
    if (error) handleSupabaseError(error, "Update inquiry status")
    return data
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    throw error;
  }
}

// Orders
export async function fetchOrders() {
  try {
    // 1) Fetch orders only (avoid ambiguous embedding errors)
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (ordersErr) handleSupabaseError(ordersErr, 'Fetch orders')

    if (!orders || orders.length === 0) return []

    const orderIds = orders.map(o => o.id)

    // 2) Fetch order items separately (no embedding to avoid ambiguity)
    const { data: items, error: itemsErr } = await supabase
      .from('order_items')
      .select('order_id, product_id, quantity, price')
      .in('order_id', orderIds)
    if (itemsErr) handleSupabaseError(itemsErr, 'Fetch order items')

    // 3) Fetch product names and join in memory (preserves shape: item.products?.name)
    const productIds = Array.from(new Set((items || []).map(i => i.product_id))).filter(Boolean)
    let productNameById = new Map()
    if (productIds.length > 0) {
      const { data: prods, error: prodsErr } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds)
      if (prodsErr) handleSupabaseError(prodsErr, 'Fetch products for items')
      productNameById = new Map((prods || []).map(p => [p.id, p.name]))
    }

    const byOrder = new Map()
    for (const it of items || []) {
      if (!byOrder.has(it.order_id)) byOrder.set(it.order_id, [])
      // attach products object with name to mimic embedded shape
      const withProduct = { ...it, products: { name: productNameById.get(it.product_id) || null } }
      byOrder.get(it.order_id).push(withProduct)
    }

    return orders.map(o => ({ ...o, order_items: byOrder.get(o.id) || [] }))
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export async function createOrder(payload) {
  try {
    const { items, customer } = payload || {}
    // total can be provided either as payload.total or payload.totals.total
    let computedTotal = payload?.total ?? payload?.totals?.total

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Order must contain at least one item')
    }
    items.forEach((item, index) => {
      if (!item.id) throw new Error(`Item ${index + 1}: Product ID is required`)
      if (!item.quantity || item.quantity <= 0) throw new Error(`Item ${index + 1}: Quantity must be greater than 0`)
      if (!item.price || item.price <= 0) throw new Error(`Item ${index + 1}: Price must be greater than 0`)
    })

    // Validate customer required fields
    if (!customer || typeof customer !== 'object') {
      throw new Error('Customer information is required')
    }
    const requiredCustomer = ['name', 'email', 'phone', 'address', 'city', 'province']
    const missing = requiredCustomer.filter(k => !customer[k] || String(customer[k]).trim() === '')
    if (missing.length) {
      throw new Error(`Missing customer fields: ${missing.join(', ')}`)
    }

    // Compute total if not provided or invalid
    if (computedTotal == null || Number(computedTotal) <= 0) {
      const itemsSum = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
      const shipping = Number(payload?.totals?.shipping ?? 0)
      const tax = Number(payload?.totals?.tax ?? 0)
      computedTotal = itemsSum + shipping + tax
    }
    if (Number.isNaN(Number(computedTotal)) || Number(computedTotal) <= 0) {
      throw new Error('Order total must be greater than 0')
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ total: Number(computedTotal), status: 'processing', customer })
      .select()
      .single()
    if (orderError) handleSupabaseError(orderError, 'Create order')

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) handleSupabaseError(itemsError, 'Create order items')

    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    if (!orderId) throw new Error("Order ID is required");
    if (!status) throw new Error("Status is required");
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Use maybeSingle to avoid coercion error when the database returns an array
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .maybeSingle()
    if (error) handleSupabaseError(error, "Update order status")

    if (data) return data

    // Fallback: fetch the updated row explicitly
    const { data: one, error: fetchErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    if (fetchErr) handleSupabaseError(fetchErr, 'Fetch updated order')
    return one
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// Analytics
export async function getSalesAnalytics() {
  try {
    const { data: revenueData, error: revenueError } = await supabase.from("orders").select("total")
    if (revenueError) handleSupabaseError(revenueError, "Fetch revenue data")

    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0

    const { count: totalOrders, error: ordersError } = await supabase.from("orders").select("*", { count: "exact", head: true })
    if (ordersError) handleSupabaseError(ordersError, "Count total orders")

    const { data: ordersByStatus, error: statusError } = await supabase.from("orders").select("status")
    if (statusError) handleSupabaseError(statusError, "Fetch orders by status")

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
    if (productsError) handleSupabaseError(productsError, "Fetch top products")

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
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: totalOrders || 0,
      averageOrderValue: totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0,
      ordersByStatus: statusCounts,
      topProducts: topProductsList
    }
  } catch (error) {
    console.error("Error getting sales analytics:", error);
    throw error;
  }
}
