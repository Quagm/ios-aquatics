import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) console.warn('[orders/create] Proceeding without Clerk auth in development')

    const body = await request.json()
    const { customer, items, totals } = body || {}

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const total = totals?.total ?? 0
    const customerEmail = customer?.email || null
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
    
    console.log('[orders/create] Customer data received:', customer)
    console.log('[orders/create] Customer snapshot created:', customerSnapshot)

    for (const item of items) {
      if (!item.id || !item.quantity) continue
      
      const { data: product, error: prodError } = await supabase
        .from('products')
        .select('id, name, stock')
        .eq('id', item.id)
        .single()
      
      if (prodError) {
        return NextResponse.json({ error: `Product not found: ${item.name || item.id}` }, { status: 400 })
      }
      
      const currentStock = Number(product?.stock || 0)
      const requestedQty = Number(item.quantity || 0)
      
      if (currentStock < requestedQty) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name || 'product'}. Available: ${currentStock}, Requested: ${requestedQty}` 
        }, { status: 400 })
      }
    }

    console.log('[orders/create] Attempting to create order with customer_snapshot:', JSON.stringify(customerSnapshot, null, 2))
    
    let order = null
    
    const orderPayload = {
      total,
      status: "processing",
      customer_email: customerEmail,
      customer_snapshot: customerSnapshot
    }

    console.log('[orders/create] Inserting order with payload:', JSON.stringify(orderPayload, null, 2))
    const { data: orderData, error: orderInsertError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single()

    if (orderInsertError) {
      console.error('[orders/create] Order insert failed:', orderInsertError)
      const message = String(orderInsertError?.message || '').toLowerCase()
      const isColumnMissing = message.includes('column') && (message.includes('customer_snapshot') || message.includes('customer_email'))
      
      if (isColumnMissing) {
        console.warn('[orders/create] Column missing, attempting to create order without customer_snapshot first, then updating')
        const fallbackPayload = { total, status: "processing" }
        if (customerEmail) {
          fallbackPayload.customer_email = customerEmail
        }
        const { data: fallbackOrder, error: fallbackError } = await supabase
          .from("orders")
          .insert(fallbackPayload)
          .select()
          .single()
        
        if (fallbackError) {
          return NextResponse.json({ 
            error: `Database column missing. Please run this SQL in Supabase SQL Editor:\n\nALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_snapshot JSONB;\nALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);\n\nThen try creating the order again.`,
            sqlCommand: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_snapshot JSONB; ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);'
          }, { status: 400 })
        }
        
        order = fallbackOrder
        console.log('[orders/create] Order created without customer_snapshot column. User must run SQL migration.')
        
        if (customerSnapshot) {
          try {
            const { error: updateError } = await supabase
              .from("orders")
              .update({ customer_snapshot: customerSnapshot })
              .eq('id', fallbackOrder.id)
            
            if (updateError) {
              console.warn('[orders/create] Could not update customer_snapshot - column may not exist:', updateError.message)
            } else {
              const { data: updatedOrder } = await supabase
                .from("orders")
                .select()
                .eq('id', fallbackOrder.id)
                .single()
              if (updatedOrder) {
                order = updatedOrder
                console.log('[orders/create] Successfully updated order with customer_snapshot')
              }
            }
          } catch (updateErr) {
            console.warn('[orders/create] Could not update customer_snapshot:', updateErr)
          }
        }
      } else {
        return NextResponse.json({ error: orderInsertError.message || 'Failed to create order' }, { status: 400 })
      }
    } else {
      order = orderData
      console.log('[orders/create] Order created successfully:', order.id)
      console.log('[orders/create] Order customer_snapshot:', order.customer_snapshot)
    }

    if (!order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 400 })
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))
    
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
    if (itemsError) {
      return NextResponse.json({ error: `Failed to create order items: ${itemsError.message}` }, { status: 400 })
    }

    const stockUpdateErrors = []
    for (const item of items) {
      if (!item.id || !item.quantity) continue
      
      const { data: product, error: prodError } = await supabase
        .from('products')
        .select('id, stock')
        .eq('id', item.id)
        .single()
      
      if (prodError) {
        stockUpdateErrors.push(`Failed to fetch product ${item.id}: ${prodError.message}`)
        console.error(`[orders/create] Failed to fetch product ${item.id} for stock update:`, prodError)
        continue
      }
      
      const currentStock = Number(product?.stock || 0)
      const requestedQty = Number(item.quantity || 0)
      const newStock = Math.max(0, currentStock - requestedQty)
      
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.id)
      
      if (stockError) {
        stockUpdateErrors.push(`Failed to update stock for product ${item.id}: ${stockError.message}`)
        console.error(`[orders/create] Failed to update stock for product ${item.id}:`, stockError)
      } else {
        console.log(`[orders/create] Stock updated for product ${item.id}: ${currentStock} -> ${newStock}`)
      }
    }

    if (stockUpdateErrors.length > 0) {
      console.error('[orders/create] Stock updates failed, rolling back order:', stockUpdateErrors)
      try {
        await supabase.from('order_items').delete().eq('order_id', order.id)
        await supabase.from('orders').delete().eq('id', order.id)
        console.log('[orders/create] Order rolled back successfully')
      } catch (rollbackError) {
        console.error('[orders/create] Failed to rollback order:', rollbackError)
      }
      return NextResponse.json({ 
        error: 'Failed to update product stock. Order was cancelled.',
        details: stockUpdateErrors
      }, { status: 500 })
    }

    if (order && customerSnapshot && !order.customer_snapshot) {
      console.log('[orders/create] customer_snapshot missing in response, updating database...')
      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({ customer_snapshot: customerSnapshot })
        .eq('id', order.id)
        .select()
        .single()
      
      if (!updateError && updatedOrder) {
        order = updatedOrder
        console.log('[orders/create] customer_snapshot updated successfully')
      } else if (updateError) {
        console.error('[orders/create] Failed to update customer_snapshot:', updateError)
        const message = String(updateError?.message || '').toLowerCase()
        if (message.includes('column') && message.includes('customer_snapshot')) {
          console.warn('[orders/create] customer_snapshot column does not exist. Please run: ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_snapshot JSONB;')
        }
      }
    }

    if (order && customerSnapshot) {
      console.log('[orders/create] Order created with customer_snapshot:', {
        orderId: order.id,
        hasSnapshot: !!order.customer_snapshot,
        snapshotKeys: order.customer_snapshot ? Object.keys(order.customer_snapshot) : [],
        snapshotData: order.customer_snapshot
      })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (err) {
    console.error('[orders/create] failed:', err)
    return NextResponse.json({ error: err?.message || 'Failed to create order' }, { status: 500 })
  }
}

