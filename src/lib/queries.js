import { supabase } from "@/supabaseClient"

// Helper function for consistent error handling
const handleSupabaseError = (error, operation) => {
  console.error(`❌ ${operation} failed:`, error);
  throw new Error(`${operation} failed: ${error.message}`);
};

// Helper function for data validation
const validateRequired = (data, fields, operation) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`${operation} failed: Missing required fields: ${missing.join(', ')}`);
  }
};

// Products
export async function fetchProducts({ category } = {}) {
  try {
    let query = supabase.from("products").select("*").order("created_at", { ascending: false })
    if (category && category !== "all") query = query.eq("category", category)
    const { data, error } = await query
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
    const { data, error } = await supabase.from("products").insert(product).select().single()
    if (error) handleSupabaseError(error, "Create product")
    return data
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(productId, updates) {
  try {
    if (!productId) throw new Error("Product ID is required");
    const { data, error } = await supabase.from("products").update(updates).eq("id", productId).select().single()
    if (error) handleSupabaseError(error, "Update product")
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
    const validStatuses = ['pending', 'in_progress', 'resolved', 'closed'];
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
    if (error) handleSupabaseError(error, "Fetch orders")
    return data || []
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function createOrder(payload) {
  try {
    const { items } = payload || {};
    // Support both { items, total } and { items, totals: { total } }
    let computedTotal = payload?.total ?? payload?.totals?.total;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    // Validate each item
    items.forEach((item, index) => {
      if (!item.id) throw new Error(`Item ${index + 1}: Product ID is required`);
      if (!item.quantity || item.quantity <= 0) throw new Error(`Item ${index + 1}: Quantity must be greater than 0`);
      if (!item.price || item.price <= 0) throw new Error(`Item ${index + 1}: Price must be greater than 0`);
    });

    // If total is not provided or invalid, compute from items
    if (computedTotal == null || Number(computedTotal) <= 0) {
      const itemsSum = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
      // Optionally add shipping/tax if present
      const shipping = Number(payload?.totals?.shipping ?? 0);
      const tax = Number(payload?.totals?.tax ?? 0);
      computedTotal = itemsSum + shipping + tax;
    }

    if (Number.isNaN(Number(computedTotal)) || Number(computedTotal) <= 0) {
      throw new Error("Order total must be greater than 0");
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ total: Number(computedTotal), status: "processing" })
      .select()
      .single()
    if (orderError) handleSupabaseError(orderError, "Create order")

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))
    
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
    if (itemsError) handleSupabaseError(itemsError, "Create order items")

    return order
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    if (!orderId) throw new Error("Order ID is required");
    if (!status) throw new Error("Status is required");
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()
    if (error) handleSupabaseError(error, "Update order status")
    return data
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
