export const dynamic = 'force-dynamic'

// POST /api/paymongo/create-link
// Body: { amount, description, email, name, orderId }
export async function POST(req) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) {
      return new Response(JSON.stringify({ error: 'PAYMONGO_SECRET_KEY is not set' }), { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    let { amount, description, email, name, orderId, successUrl, cancelUrl } = body || {}

    if (!amount || isNaN(Number(amount))) {
      return new Response(JSON.stringify({ error: 'amount (in centavos) is required' }), { status: 400 })
    }

    // Ensure integer centavos
    amount = Math.max(1, Math.floor(Number(amount)))

    // Default URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    if (!successUrl && baseUrl) successUrl = `${baseUrl}/store-page?payment=success`
    if (!cancelUrl && baseUrl) cancelUrl = `${baseUrl}/cart-page?payment=cancelled`

    const payload = {
      data: {
        attributes: {
          amount,
          currency: 'PHP',
          description: description || `Order ${orderId || ''}`.trim(),
          remarks: 'IOS Aquatics Checkout',
          checkout_url: null,
          payment_method_types: ['card', 'paymaya', 'gcash'],
          // Optional redirection URLs if enabled in PayMongo
          // Note: PayMongo Payment Links may not support per-link redirect; if unsupported, manage in dashboard
          // We'll still include metadata to reconcile later (via webhook or admin view)
          metadata: {
            orderId: orderId || null,
            customerEmail: email || null,
            customerName: name || null,
          },
        },
      },
    }

    const res = await fetch('https://api.paymongo.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${secret}:`).toString('base64')}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data?.errors || data || 'Failed to create payment link' }), { status: res.status })
    }

    const link = data?.data
    const checkoutUrl = link?.attributes?.checkout_url
    return new Response(
      JSON.stringify({
        id: link?.id,
        checkout_url: checkoutUrl,
        data,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), { status: 500 })
  }
}
