export const dynamic = 'force-dynamic'


export async function POST(req) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) {
      return new Response(JSON.stringify({ error: 'PAYMONGO_SECRET_KEY is not set' }), { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    let { amount, description, email, name, orderId, successUrl, cancelUrl, paymentMethod } = body || {}

    if (!amount || isNaN(Number(amount))) {
      return new Response(JSON.stringify({ error: 'amount (in centavos) is required' }), { status: 400 })
    }

    amount = Math.max(1, Math.floor(Number(amount)))

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    if (!successUrl && baseUrl) {
      successUrl = `${baseUrl}/store-page?payment=success&orderId=${orderId || ''}`
    } else if (!successUrl) {
      successUrl = `/store-page?payment=success&orderId=${orderId || ''}`
    }
    if (!cancelUrl && baseUrl) {
      cancelUrl = `${baseUrl}/checkout-page?payment=cancelled`
    } else if (!cancelUrl) {
      cancelUrl = `/checkout-page?payment=cancelled`
    }

    let payment_method_types = ['card', 'gcash']
    const method = (paymentMethod || '').toLowerCase()
    if (method === 'gcash') {
      payment_method_types = ['gcash']
    } else if (method === 'card' || method === 'credit' || method === 'debit') {
      payment_method_types = ['card']
    }

    const payload = {
      data: {
        attributes: {
          amount,
          currency: 'PHP',
          description: description || `Order ${orderId || ''}`.trim(),
          remarks: 'IOS Aquatics Checkout',
          payment_method_types,
          ...(successUrl && { success_url: successUrl }),
          ...(cancelUrl && { cancel_url: cancelUrl }),
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
