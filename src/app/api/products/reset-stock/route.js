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
    if (!userId) console.warn('[products/reset-stock] Proceeding without Clerk auth in development')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, stock, min_stock')

    if (fetchError) {
      return NextResponse.json({ error: `Failed to fetch products: ${fetchError.message}` }, { status: 400 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ updatedCount: 0 }, { status: 200 })
    }

    const updates = products.map(product => {
      return {
        id: product.id,
        stock: 0,
        status: 'out-of-stock'
      }
    })

    let updatedCount = 0
    const errors = []

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: update.stock, status: update.status })
        .eq('id', update.id)

      if (updateError) {
        errors.push(`Failed to update product ${update.id}: ${updateError.message}`)
        console.error(`[reset-stock] Failed to update product ${update.id}:`, updateError)
      } else {
        updatedCount++
      }
    }

    if (errors.length > 0 && updatedCount === 0) {
      return NextResponse.json({ 
        error: `Failed to reset stock: ${errors.join('; ')}`,
        updatedCount: 0
      }, { status: 500 })
    }

    return NextResponse.json({ 
      updatedCount,
      errors: errors.length > 0 ? errors : undefined
    }, { status: 200 })
  } catch (err) {
    console.error('[reset-stock] failed:', err)
    return NextResponse.json({ error: err?.message || 'Failed to reset stock' }, { status: 500 })
  }
}

