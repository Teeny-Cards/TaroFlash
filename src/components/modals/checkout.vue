<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQueryCache } from '@pinia/colada'
import {
  loadStripe,
  type Stripe,
  type StripeElements,
  type StripePaymentElement
} from '@stripe/stripe-js'
import mobileSheet from '@/components/layout-kit/modal/mobile-sheet.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useCreateSubscriptionMutation } from '@/api/billing'
import logger from '@/utils/logger'

export type CheckoutResponse = { upgraded: boolean }

const { close } = defineProps<{
  close: (response?: CheckoutResponse) => void
}>()

const { t } = useI18n()
const queryCache = useQueryCache()
const { mutateAsync: createSubscription } = useCreateSubscriptionMutation()

const container_ref = useTemplateRef<HTMLDivElement>('container')

const is_loading = ref(true)
const is_submitting = ref(false)
const is_ready = ref(false)
const load_error = ref(false)
const submit_error = ref<string | null>(null)

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let payment_element: StripePaymentElement | null = null

const APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#6f9b80',
    colorBackground: '#f9f8f5',
    colorText: '#744e2a',
    colorDanger: '#dc2626',
    colorTextPlaceholder: '#b8b1a9',
    fontFamily: 'Tilt Neon, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px'
  },
  rules: {
    '.Input': {
      border: '1px solid #e7e0d5',
      boxShadow: 'none'
    },
    '.Input:focus': {
      border: '1px solid #6f9b80',
      boxShadow: '0 0 0 3px rgba(111, 155, 128, 0.25)'
    },
    '.Label': {
      color: '#744e2a',
      fontWeight: '500'
    },
    '.Tab': {
      border: '1px solid #e7e0d5',
      backgroundColor: '#f9f8f5'
    },
    '.Tab:hover': {
      backgroundColor: '#ede9df'
    },
    '.Tab--selected': {
      borderColor: '#6f9b80',
      backgroundColor: '#f3f1ea'
    }
  }
}

onMounted(async () => {
  try {
    const [subscription, stripeInstance] = await Promise.all([
      createSubscription({ planId: 'paid' }),
      loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
    ])
    if (!stripeInstance) throw new Error('Stripe.js failed to load')
    stripe = stripeInstance

    elements = stripe.elements({
      clientSecret: subscription.clientSecret,
      appearance: APPEARANCE,
      fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap' }]
    })

    payment_element = elements.create('payment', { layout: 'tabs' })
    payment_element.on('ready', () => {
      is_ready.value = true
    })

    if (container_ref.value) payment_element.mount(container_ref.value)
  } catch (err) {
    logger.error((err as Error).message)
    load_error.value = true
  } finally {
    is_loading.value = false
  }
})

onBeforeUnmount(() => {
  payment_element?.destroy()
})

async function onSubmit() {
  if (!stripe || !elements) return
  is_submitting.value = true
  submit_error.value = null

  const result = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin
    },
    redirect: 'if_required'
  })

  if (result.error) {
    submit_error.value = result.error.message ?? t('billing.checkout.submit-error')
    is_submitting.value = false
    return
  }

  if (result.paymentIntent?.status === 'succeeded') {
    queryCache.invalidateQueries({ key: ['member'] })
    close({ upgraded: true })
    return
  }

  submit_error.value = t('billing.checkout.submit-error')
  is_submitting.value = false
}
</script>

<template>
  <mobile-sheet
    data-testid="checkout"
    class="sm:max-w-130! max-h-[95dvh]"
    :title="t('billing.checkout.title')"
    theme="green-400"
    @close="close()"
  >
    <template #body>
      <div
        data-testid="checkout__body"
        class="overflow-y-auto max-h-[65dvh] px-6 pb-2 flex flex-col gap-4"
      >
        <p
          v-if="is_loading"
          data-testid="checkout__loading"
          class="text-brown-700 py-10 text-center"
        >
          {{ t('billing.checkout.loading') }}
        </p>
        <p
          v-else-if="load_error"
          data-testid="checkout__error"
          class="py-10 text-center text-red-500"
        >
          {{ t('billing.checkout.error') }}
        </p>
        <div ref="container" data-testid="checkout__payment-element"></div>
        <p v-if="submit_error" data-testid="checkout__submit-error" class="text-sm text-red-500">
          {{ submit_error }}
        </p>
      </div>
    </template>
    <template #footer>
      <div v-if="!is_loading && !load_error" data-testid="checkout__footer" class="px-6 pb-6 pt-2">
        <ui-button
          data-testid="checkout__submit"
          theme="green-400"
          full-width
          size="lg"
          :loading="is_submitting"
          :disabled="!is_ready"
          @click="onSubmit"
        >
          {{ t('billing.checkout.submit') }}
        </ui-button>
      </div>
    </template>
  </mobile-sheet>
</template>
