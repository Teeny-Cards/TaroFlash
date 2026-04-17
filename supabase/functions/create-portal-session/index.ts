// Creates a Stripe Billing Portal session for the caller.
//
// The portal is a Stripe-hosted page where a paying customer can update their
// payment method, change/cancel their plan, download invoices, and see
// billing history. We don't build any of that UI — we just hand Stripe the
// customer id and send the browser to the short-lived URL it returns.

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

  try {
    const { returnUrl } = await req.json().catch(() => ({}))
    if (!returnUrl) {
      return new Response('Missing returnUrl', { status: 400, headers: cors })
    }

    // Member can read their own stripe_customer_id (SELECT policy allows it);
    // the self-update guard only blocks *writing* it. So the user-scoped
    // client is enough here — no admin escalation needed.
    const { data: member } = await userClient
      .from('members')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!member?.stripe_customer_id) {
      // Free users hit this: they have no Stripe record, so there's nothing
      // to manage. The UI shouldn't offer the portal to free users, but we
      // defend in depth.
      return new Response('No Stripe customer for this member', {
        status: 400,
        headers: cors
      })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripe_customer_id,
      return_url: returnUrl
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...cors, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error(err)
    return new Response('Error creating portal session', { status: 500, headers: cors })
  }
})
