import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request) {
  try {

    const { userId } = getAuth(request)
    if (!userId) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }

      console.warn('[upload] Proceeding without Clerk auth in development')
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase environment variables missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const safeName = file.name?.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'upload.bin'
    const fileName = `uploads/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    const { data: publicUrl } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl.publicUrl }, { status: 200 })
  } catch (err) {
    console.error('Upload failed:', err)
    const message = err?.message || 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
