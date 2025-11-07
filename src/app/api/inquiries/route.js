import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase environment variables missing')
  }
  return createClient(supabaseUrl, serviceRoleKey)
}

async function ensureAuth(request) {
  const { userId } = getAuth(request)
  if (!userId && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  if (!userId) {
    console.warn('[inquiries] Proceeding without Clerk auth in development')
  }
  return null
}

export async function GET(request) {
  try {
    const authErr = await ensureAuth(request)
    if (authErr) return authErr

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Fetch inquiries failed:', err)
    return NextResponse.json({ error: err?.message || 'Fetch inquiries failed' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const authErr = await ensureAuth(request)
    if (authErr) return authErr

    const body = await request.json()
    const { id, status, appointment_at } = body || {}
    if (!id) return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
    const validStatuses = ['accepted', 'in_progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: current, error: currentErr } = await supabase
      .from('inquiries')
      .select('status, appointment_at, subject, email')
      .eq('id', id)
      .single()
    if (currentErr) return NextResponse.json({ error: currentErr.message }, { status: 400 })

    const prevStatus = current?.status || null
    const prevAppointment = current?.appointment_at || null

    const updatePayload = { status }
    if (appointment_at) {
      updatePayload.appointment_at = appointment_at
    }
    const { data, error } = await supabase
      .from('inquiries')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Broadcast a realtime notification to clients
    try {
      const channel = supabase.channel('user_notifications')
      await channel.subscribe()
      await channel.send({
        type: 'broadcast',
        event: 'inquiry_update',
        payload: {
          id: data.id,
          email: data.email,
          subject: data.subject,
          status: data.status,
          previous_status: prevStatus,
          appointment_at: data.appointment_at || null,
          previous_appointment_at: prevAppointment,
          updated_at: new Date().toISOString()
        }
      })
      await channel.unsubscribe()
    } catch (e) {
      console.warn('Realtime broadcast failed (inquiry_update):', e?.message || e)
    }
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Update inquiry failed:', err)
    return NextResponse.json({ error: err?.message || 'Update inquiry failed' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const authErr = await ensureAuth(request)
    if (authErr) return authErr

    const body = await request.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })

    const supabase = getServiceClient()
    const { error } = await supabase.from('inquiries').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Delete inquiry failed:', err)
    return NextResponse.json({ error: err?.message || 'Delete inquiry failed' }, { status: 500 })
  }
}
