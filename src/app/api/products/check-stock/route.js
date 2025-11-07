import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { items } = await request.json()
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const stockIssues = []
    for (const item of items) {
      if (!item.id || !item.quantity) continue
      
      const { data: product, error: prodError } = await supabase
        .from('products')
        .select('id, name, stock')
        .eq('id', item.id)
        .single()
      
      if (prodError) {
        stockIssues.push(`Product ${item.name || item.id} not found`)
        continue
      }
      
      const currentStock = Number(product?.stock || 0)
      const requestedQty = Number(item.quantity || 0)
      
      if (currentStock < requestedQty) {
        stockIssues.push(
          `Insufficient stock for ${product.name || 'product'}. Available: ${currentStock}, Requested: ${requestedQty}`
        )
      }
    }

    if (stockIssues.length > 0) {
      return NextResponse.json({ 
        error: stockIssues.join('; '),
        details: stockIssues
      }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[check-stock] failed:', err)
    return NextResponse.json({ error: err?.message || 'Stock check failed' }, { status: 500 })
  }
}

