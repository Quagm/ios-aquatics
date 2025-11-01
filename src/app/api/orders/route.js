import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) console.warn('[orders] Proceeding without Clerk auth in development')

    const { id, status } = await request.json()
    if (!id) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Fetch current order to compare status
    const { data: current, error: curErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    if (curErr) return NextResponse.json({ error: curErr.message }, { status: 400 })
    if (!current) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const prevStatus = String(current.status || '').toLowerCase()
    const nextStatus = String(status || '').toLowerCase()

    // Update status
    const { data: updated, error: updErr } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', id)
      .select()
      .single()
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 })

    // If transitioning into 'accepted', decrement stock based on items
    if (prevStatus !== 'accepted' && nextStatus === 'accepted') {
      const { data: items, error: itemsErr } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', id)
      if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 400 })

      for (const it of items || []) {
        if (!it.product_id || !it.quantity) continue
        const { data: prod, error: prodErr } = await supabase
          .from('products')
          .select('id, stock')
          .eq('id', it.product_id)
          .single()
        if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 400 })
        const currentStock = Number(prod?.stock || 0)
        const nextStock = Math.max(0, currentStock - Number(it.quantity))
        const { error: upErr } = await supabase
          .from('products')
          .update({ stock: nextStock })
          .eq('id', it.product_id)
        if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })
      }
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error('[orders] PATCH failed:', err)
    return NextResponse.json({ error: err?.message || 'Update order failed' }, { status: 500 })
  }
}





