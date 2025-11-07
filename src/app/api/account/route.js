import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) {
      console.warn('[account GET] Proceeding without Clerk auth in development')
      return NextResponse.json(null, { status: 200 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('[account GET] Error:', error)
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'The user_accounts table does not exist',
          hint: 'Please run the SQL migration in Supabase SQL Editor to create the table.'
        }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json(null, { status: 200 })
    }

    return NextResponse.json({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      province: data.province || '',
      postal: data.postal_code || ''
    }, { status: 200 })
  } catch (err) {
    console.error('[account GET] failed:', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch account' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) {
      console.warn('[account POST] Proceeding without Clerk auth in development')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, address, city, province, postal } = body || {}

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: existing, error: checkError } = await supabase
      .from('user_accounts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116' && !checkError.message.includes('relation') && !checkError.message.includes('does not exist')) {
      console.error('[account POST] Error checking existing:', checkError)
      return NextResponse.json({ 
        error: `Failed to check existing account: ${checkError.message}`,
        hint: 'Make sure the user_accounts table exists. Run the SQL migration in Supabase.'
      }, { status: 400 })
    }

    const accountData = {
      user_id: userId,
      name: name || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      province: province || null,
      postal_code: postal || null,
      updated_at: new Date().toISOString()
    }

    let result
    if (existing && existing.id) {
      const { data, error } = await supabase
        .from('user_accounts')
        .update(accountData)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('[account POST] Update error:', error)
        return NextResponse.json({ 
          error: error.message,
          hint: error.message.includes('relation') || error.message.includes('does not exist') 
            ? 'The user_accounts table does not exist. Please run the SQL migration in Supabase SQL Editor.'
            : undefined
        }, { status: 400 })
      }
      result = data
    } else {
      const { data, error } = await supabase
        .from('user_accounts')
        .insert(accountData)
        .select()
        .single()

      if (error) {
        console.error('[account POST] Insert error:', error)
        return NextResponse.json({ 
          error: error.message,
          hint: error.message.includes('relation') || error.message.includes('does not exist') 
            ? 'The user_accounts table does not exist. Please run the SQL migration in Supabase SQL Editor.'
            : undefined
        }, { status: 400 })
      }
      result = data
    }

    return NextResponse.json({
      name: result.name || '',
      email: result.email || '',
      phone: result.phone || '',
      address: result.address || '',
      city: result.city || '',
      province: result.province || '',
      postal: result.postal_code || ''
    }, { status: 200 })
  } catch (err) {
    console.error('[account POST] failed:', err)
    return NextResponse.json({ error: err?.message || 'Failed to save account' }, { status: 500 })
  }
}

