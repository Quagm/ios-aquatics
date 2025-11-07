import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

export async function GET(request) {
  try {

    const { userId } = getAuth(request)
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (!userId) {
      console.warn('[users/count] Proceeding without Clerk auth in development')
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY
    if (!clerkSecretKey) {
      console.warn('[users/count] CLERK_SECRET_KEY not found, returning 0')
      return NextResponse.json({ count: 0 }, { status: 200 })
    }


    const response = await fetch('https://api.clerk.com/v1/users/count', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Clerk API error:', response.status, errorText)

      return NextResponse.json({ count: 0 }, { status: 200 })
    }

    const data = await response.json()
    const totalCount = data?.count || data?.total_count || 0

    return NextResponse.json({ count: totalCount }, { status: 200 })
  } catch (err) {
    console.error('[users/count] Failed:', err)

    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}

