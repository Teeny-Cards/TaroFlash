import Stripe from 'npm:stripe@20'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20'
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  // Verify the caller is a logged-in Supabase user.
  // The frontend sends the session JWT as "Authorization: Bearer <token>".
  // We create a Supabase client scoped to that token and call getUser(),
  // which validates the JWT server-side. If it fails, we stop here.
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } }
  })

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  try {
    const { priceId, customerId, email } = await req.json().catch(() => ({}))

    if (!priceId) {
      return new Response('Missing priceId', { status: 400 })
    }

    let customer: string

    if (customerId) {
      customer = customerId
    } else if (email) {
      const existing = await stripe.customers.list({
        email,
        limit: 1
      })

      if (existing.data.length > 0) {
        customer = existing.data[0].id
      } else {
        const created = await stripe.customers.create({ email })
        customer = created.id
      }
    } else {
      return new Response('Missing customerId or email', { status: 400 })
    }

    // Create subscription in "incomplete" state
    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent']
    })

    const paymentIntent = subscription.latest_invoice?.payment_intent

    if (!paymentIntent || typeof paymentIntent !== 'object') {
      return new Response('No PaymentIntent on subscription', { status: 500 })
    }

    const clientSecret = (paymentIntent as any).client_secret as string

    return new Response(
      JSON.stringify({
        clientSecret,
        subscriptionId: subscription.id,
        customerId: customer
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (err) {
    console.error(err)
    return new Response('Error creating subscription', { status: 500 })
  }
})
