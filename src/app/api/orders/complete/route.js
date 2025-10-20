import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    // Clerk auth (optional admin check could be added)
    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) console.warn('[orders/complete] Proceeding without Clerk auth in development')

    const { orderId } = await request.json()
    if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Fetch order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 400 })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // If already completed, do nothing
    if (String(order.status || '').toLowerCase() === 'completed') {
      return NextResponse.json(order, { status: 200 })
    }

    // Fetch order items
    const { data: items, error: itemsErr } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId)
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 400 })

    // Decrement stock for each product
    for (const it of items || []) {
      if (!it.product_id || !it.quantity) continue
      // Fetch current stock
      const { data: prod, error: prodErr } = await supabase
        .from('products')
        .select('id, stock')
        .eq('id', it.product_id)
        .single()
      if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 400 })

      const current = Number(prod?.stock || 0)
      const next = Math.max(0, current - Number(it.quantity))

      const { error: upErr } = await supabase
        .from('products')
        .update({ stock: next })
        .eq('id', it.product_id)
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })
    }

    // Mark order as completed
    const { data: updated, error: updErr } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId)
      .select()
      .single()
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 })

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error('[orders/complete] failed:', err)
    return NextResponse.json({ error: err?.message || 'Failed to complete order' }, { status: 500 })
  }
}
