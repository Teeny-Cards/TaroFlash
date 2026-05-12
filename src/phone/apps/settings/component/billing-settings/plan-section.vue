<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useCancelSubscriptionMutation, useResumeSubscriptionMutation } from '@/api/billing'
import type { useSubscriptionQuery } from '@/api/billing'
import { useToast } from '@/composables/toast'
import { formatShortDate } from '@/utils/date'

type SubscriptionQuery = ReturnType<typeof useSubscriptionQuery>

type PlanSectionProps = {
  subscriptionQuery: SubscriptionQuery
}

const { subscriptionQuery } = defineProps<PlanSectionProps>()

const { t, locale } = useI18n()
const toast = useToast()
const cancelMutation = useCancelSubscriptionMutation()
const resumeMutation = useResumeSubscriptionMutation()

const confirming_cancel = ref(false)

const subscription = computed(() => subscriptionQuery.data.value?.subscription ?? null)

const product_name = computed(() => {
  const price = subscription.value?.items.data[0]?.price
  if (!price) return null
  const product = price.product
  return typeof product === 'string' ? null : product.name
})

const price_label = computed(() => {
  const price = subscription.value?.items.data[0]?.price
  if (!price?.unit_amount) return null
  const amount = (price.unit_amount / 100).toFixed(2)
  const currency = price.currency.toUpperCase()
  const interval = price.recurring?.interval ?? null
  return interval
    ? t('settings.subscription.plan.price-per-interval', { amount, currency, interval })
    : t('settings.subscription.plan.price', { amount, currency })
})

const renewal_label = computed(() => {
  if (!subscription.value) return null
  const ts = subscription.value.current_period_end * 1000
  const formatted = formatShortDate(ts, locale.value)
  return subscription.value.cancel_at_period_end
    ? t('settings.subscription.plan.cancels-on', { date: formatted })
    : t('settings.subscription.plan.renews-on', { date: formatted })
})

const status_label = computed(() => {
  const status = subscription.value?.status
  if (!status) return null
  return t(`settings.subscription.plan.status.${status}`, status)
})

async function onCancel() {
  try {
    await cancelMutation.mutateAsync(true)
    confirming_cancel.value = false
    toast.success(t('settings.subscription.plan.cancel-success'))
  } catch {
    toast.error(t('settings.subscription.plan.cancel-error'))
  }
}

async function onResume() {
  try {
    await resumeMutation.mutateAsync()
    toast.success(t('settings.subscription.plan.resume-success'))
  } catch {
    toast.error(t('settings.subscription.plan.resume-error'))
  }
}
</script>

<template>
  <labeled-section
    data-testid="billing-settings__plan"
    :label="t('settings.subscription.plan.label')"
  >
    <div class="grid grid-cols-[200px_1fr] gap-6 items-start">
      <h2 class="text-brown-700 dark:text-brown-300 text-lg">
        {{ t('settings.subscription.plan.current') }}
      </h2>
      <div
        data-testid="billing-settings__plan-details"
        class="flex flex-col gap-2 text-brown-700 dark:text-brown-300"
      >
        <p data-testid="billing-settings__plan-name" class="text-xl">
          {{ product_name ?? t('settings.subscription.plan.unknown') }}
        </p>
        <p
          v-if="price_label"
          data-testid="billing-settings__plan-price"
          class="text-brown-500 dark:text-brown-400"
        >
          {{ price_label }}
        </p>
        <p
          v-if="status_label"
          data-testid="billing-settings__plan-status"
          class="text-sm text-brown-500 dark:text-brown-400"
        >
          {{ status_label }}
        </p>
        <p
          v-if="renewal_label"
          data-testid="billing-settings__plan-renewal"
          class="text-sm text-brown-500 dark:text-brown-400"
        >
          {{ renewal_label }}
        </p>
      </div>

      <div></div>
      <div data-testid="billing-settings__plan-actions" class="flex flex-wrap gap-3">
        <template v-if="subscription?.cancel_at_period_end">
          <ui-button
            data-testid="billing-settings__plan-resume"
            data-theme="green-400"
            size="sm"
            :loading="resumeMutation.isLoading.value"
            @click="onResume"
          >
            {{ t('settings.subscription.plan.resume') }}
          </ui-button>
        </template>

        <template v-else-if="!confirming_cancel">
          <ui-button
            data-testid="billing-settings__plan-cancel"
            data-theme="red-500"
            size="sm"
            variant="outline"
            @click="confirming_cancel = true"
          >
            {{ t('settings.subscription.plan.cancel') }}
          </ui-button>
        </template>

        <template v-else>
          <p
            data-testid="billing-settings__plan-cancel-prompt"
            class="text-sm text-brown-700 dark:text-brown-300 w-full"
          >
            {{ t('settings.subscription.plan.cancel-confirm') }}
          </p>
          <ui-button
            data-testid="billing-settings__plan-cancel-confirm"
            data-theme="red-500"
            size="sm"
            :loading="cancelMutation.isLoading.value"
            @click="onCancel"
          >
            {{ t('settings.subscription.plan.cancel-confirm-button') }}
          </ui-button>
          <ui-button
            data-testid="billing-settings__plan-cancel-abort"
            data-theme="grey-400"
            size="sm"
            variant="outline"
            @click="confirming_cancel = false"
          >
            {{ t('settings.subscription.plan.cancel-abort') }}
          </ui-button>
        </template>
      </div>
    </div>
  </labeled-section>
</template>
