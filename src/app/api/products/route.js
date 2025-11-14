import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request) {
  try {

    const { userId, sessionClaims } = getAuth(request)
    if (!userId) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }
      console.warn('[products] Proceeding without Clerk auth in development')
    }








    const body = await request.json()
    const { name, category, price, image, active, description, stock, minStock } = body || {}

    if (!name || !category || price == null || Number.isNaN(Number(price))) {
      return NextResponse.json({ error: 'Missing required fields: name, category, price' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const insertPayload = {
      name,
      category,
      price: Number(price),
      image: image || null,
      active: typeof active === 'boolean' ? active : true,
      description: description ?? null,
    }

    if (stock !== undefined && stock !== null) {
      insertPayload.stock = Number(stock)
    }
    if (minStock !== undefined && minStock !== null) {
      insertPayload.min_stock = Number(minStock)
    }

    let { data, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select()
      .single()

    if (error && (error.message || '').toLowerCase().includes("'description' column")) {
      const fallbackPayload = { ...insertPayload }
      delete fallbackPayload.description
      const retry = await supabase
        .from('products')
        .insert(fallbackPayload)
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error && (error.message || '').toLowerCase().includes("'active' column")) {
      const fallbackPayload2 = { ...insertPayload }
      delete fallbackPayload2.active
      const retry2 = await supabase
        .from('products')
        .insert(fallbackPayload2)
        .select()
        .single()
      data = retry2.data
      error = retry2.error
    }

    if (error && (error.message || '').toLowerCase().includes("'stock' column") || (error.message || '').toLowerCase().includes("'min_stock' column")) {
      const fallbackPayload3 = { ...insertPayload }
      delete fallbackPayload3.stock
      delete fallbackPayload3.min_stock
      const retry3 = await supabase
        .from('products')
        .insert(fallbackPayload3)
        .select()
        .single()
      data = retry3.data
      error = retry3.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Create product failed:', err)
    const message = err?.message || 'Create product failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) console.warn('[products] Proceeding without Clerk auth in development')

    const { id, updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    if (!updates || typeof updates !== 'object') return NextResponse.json({ error: 'Updates object is required' }, { status: 400 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const normalized = { ...updates }
    if ('minStock' in normalized && !('min_stock' in normalized)) {
      normalized.min_stock = normalized.minStock
      delete normalized.minStock
    }
    if ('price' in normalized) normalized.price = Number(normalized.price)
    if ('stock' in normalized) normalized.stock = Number(normalized.stock)
    if ('min_stock' in normalized) normalized.min_stock = Number(normalized.min_stock)

    const allowed = ['name', 'category', 'price', 'image', 'active', 'description', 'stock', 'min_stock', 'status', 'sku']
    const safeUpdates = {}
    for (const k of allowed) if (k in normalized) safeUpdates[k] = normalized[k]
    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: `No valid fields to update. Allowed: ${allowed.join(', ')}` }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('products')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Update product failed:', err)
    return NextResponse.json({ error: err?.message || 'Update product failed' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) console.warn('[products] Proceeding without Clerk auth in development')

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Delete product failed:', err)
    return NextResponse.json({ error: err?.message || 'Delete product failed' }, { status: 500 })
  }
}
