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

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid request body. Expected JSON.' }, { status: 400 })
    }

    const { id, status, appointment_at } = body || {}
    
    if (!id) {
      console.error('Missing inquiry ID in request body:', body)
      return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
    }
    
    if (!status) {
      console.error('Missing status in request body:', body)
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }
    
    const validStatuses = ['accepted', 'in_progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      console.error('Invalid status:', status, 'Valid statuses:', validStatuses)
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 })
    }
    
    console.log('Updating inquiry:', { id, status, appointment_at })

    const supabase = getServiceClient()

    const isColumnMissing = (err, column) => {
      if (!err) return false
      const msg = String(err.message || '').toLowerCase()
      return msg.includes(`column ${column.toLowerCase()}`) || msg.includes(`${column.toLowerCase()} column`)
    }

    let allowAppointmentUpdates = true
    let current

    let { data: currentData, error: currentErr } = await supabase
      .from('inquiries')
      .select('status, appointment_at, subject, email')
      .eq('id', id)
      .single()

    if (currentErr && isColumnMissing(currentErr, 'appointment_at')) {
      console.warn('appointment_at column does not exist. Please run: ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS appointment_at TIMESTAMP WITH TIME ZONE;')
      allowAppointmentUpdates = false
      const fallback = await supabase
        .from('inquiries')
        .select('status, subject, email')
        .eq('id', id)
        .single()
      currentData = fallback.data
      currentErr = fallback.error
    }

    if (currentErr) {
      console.error('Error fetching current inquiry:', currentErr)
      let errorMessage = currentErr.message || 'Failed to fetch inquiry'

      if (isColumnMissing(currentErr, 'appointment_at')) {
        errorMessage = 'The appointment_at column is missing from the database. Please run this SQL in Supabase: ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS appointment_at TIMESTAMP WITH TIME ZONE;'
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: currentErr.details || null,
        hint: currentErr.hint || 'Run the migration SQL to add the missing column.',
        migration_sql: isColumnMissing(currentErr, 'appointment_at') 
          ? 'ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS appointment_at TIMESTAMP WITH TIME ZONE;'
          : null
      }, { status: 400 })
    }
    current = currentData

    const prevStatus = current?.status || null
    const prevAppointment = allowAppointmentUpdates ? current?.appointment_at || null : null

    const updatePayload = { status }
    if (allowAppointmentUpdates && appointment_at) {
      updatePayload.appointment_at = appointment_at
    }

    if (!allowAppointmentUpdates && appointment_at) {
      console.warn('Skipping appointment_at update because column does not exist')
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to update inquiry',
        details: error.details || null,
        hint: error.hint || null
      }, { status: 400 })
    }
    
    if (!data) {
      console.error('No data returned from update')
      return NextResponse.json({ error: 'Inquiry not found or update failed' }, { status: 404 })
    }

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
          appointment_at: allowAppointmentUpdates ? (data.appointment_at || null) : null,
          previous_appointment_at: allowAppointmentUpdates ? prevAppointment : null,
          updated_at: new Date().toISOString()
        }
      })
      await channel.unsubscribe()
    } catch (e) {
      console.warn('Realtime broadcast failed (inquiry_update):', e?.message || e)
    }
    console.log('Inquiry updated successfully:', data)
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Update inquiry failed:', err)
    console.error('Error stack:', err?.stack)
    console.error('Error details:', {
      message: err?.message,
      name: err?.name,
      cause: err?.cause
    })
    return NextResponse.json({ 
      error: err?.message || 'Update inquiry failed',
      details: err?.details || null,
      hint: err?.hint || null
    }, { status: 500 })
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
