// Creates an incomplete subscription + PaymentIntent for the caller's plan.
//
// Used with Stripe Elements (Payment Element). The client gets back the
// PaymentIntent's client_secret and runs `stripe.confirmPayment()` with a
// Payment Element mounted in our own UI. That's the opposite of Embedded
// Checkout (which returned a *Session* client_secret and mounted Stripe's
// pre-built UI). We chose Elements to own the appearance layer.

import Stripe from 'npm:stripe@20'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient()
})

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: cors })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401, headers: cors })
  }

  const userClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const {
    data: { user },
    error: authError
  } = await userClient.auth.getUser()
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401, headers: cors })
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    const { planId } = await req.json().catch(() => ({}))
    if (!planId) {
      return new Response('Missing planId', { status: 400, headers: cors })
    }

    // Client sends plan id, server resolves to Stripe price id via plans.
    const { data: plan } = await admin
      .from('plans')
      .select('stripe_price_id')
      .eq('id', planId)
      .eq('is_active', true)
      .maybeSingle()

    if (!plan?.stripe_price_id) {
      return new Response(`Plan not purchasable: ${planId}`, {
        status: 400,
        headers: cors
      })
    }

    // Get — or create — the Stripe customer for this member.
    const { data: member } = await admin
      .from('members')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = member?.stripe_customer_id ?? null

    if (!customerId) {
      const existing = await stripe.customers.list({ email: user.email, limit: 1 })
      const customer =
        existing.data[0] ??
        (await stripe.customers.create({
          email: user.email,
          metadata: { member_id: user.id }
        }))
      customerId = customer.id

      await admin.from('members').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Create the subscription in "incomplete" state. Stripe generates a
    // PaymentIntent for the first invoice; we expand it so we can read the
    // client_secret without a second round-trip.
    //
    // `default_incomplete` means the subscription exists but has no active
    // payment yet — completing the PaymentIntent on the frontend activates
    // it, at which point the webhook fires `customer.subscription.updated`.
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: plan.stripe_price_id }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: { member_id: user.id }
    })

    const paymentIntent = subscription.latest_invoice?.payment_intent
    if (!paymentIntent || typeof paymentIntent !== 'object') {
      return new Response('No PaymentIntent on subscription', {
        status: 500,
        headers: cors
      })
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error(err)
    return new Response('Error creating subscription', { status: 500, headers: cors })
  }
})
