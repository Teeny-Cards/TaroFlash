<script setup lang="ts">
import { supabase } from '@/supabase-client'
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js'
import { onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/session'

type SubscriptionData = {
  clientSecret: string
  subscriptionId: string
  customerId: string
}

const session = useSessionStore()

const stripe_elements = ref<StripeElements | null>(null)
const payment_element = ref<any | null>(null)
const subscription_data = ref<SubscriptionData | null>(null)

onMounted(async () => {
  const res = await supabase.functions.invoke<SubscriptionData>('create-subscription', {
    body: {
      priceId: import.meta.env.VITE_MEMBERSHIP_PRICE_ID,
      email: session.user_email
    }
  })

  subscription_data.value = res.data

  if (!subscription_data.value) return

  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

  if (!stripe) return

  stripe_elements.value = stripe.elements({
    clientSecret: subscription_data.value.clientSecret,
    appearance: {
      theme: 'flat',
      variables: {
        fontFamily: 'Tilt Neon, sans-serif',
        colorBackground: '#f3f1ea',
        colorText: '#744e2a'
      }
    }
  })

  payment_element.value = stripe_elements.value.create('payment')
  payment_element.value.mount('#payment-element')
})
</script>

<template>
  <div class="max-w-150 mx-auto">
    <h1 class="text-xl font-semibold mb-4">Subscribe</h1>

    <div>
      <!-- Stripe mounts the Payment Element here -->
      <div id="payment-element" class="mb-4"></div>

      <button
        type="button"
        class="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
        :disabled="!stripe_elements"
      >
        Start subscription
      </button>
    </div>
  </div>
</template>
