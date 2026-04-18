<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMemberStore } from '@/stores/member'
import { useSubscriptionQuery } from '@/api/billing'
import { useModal } from '@/composables/modal'
import SectionHeader from '../section-header.vue'
import PlanSection from './plan-section.vue'
import PaymentMethodsSection from './payment-methods-section.vue'
import InvoicesSection from './invoices-section.vue'
import UiButton from '@/components/ui-kit/button.vue'
import Checkout from '@/components/modals/checkout.vue'

const { t } = useI18n()
const member_store = useMemberStore()
const modal = useModal()
const subscription_query = useSubscriptionQuery()

function openUpgradeModal() {
  modal.open(Checkout, { mode: 'mobile-sheet', backdrop: true })
}
</script>

<template>
  <div
    data-testid="billing-settings__body"
    class="w-full h-full flex flex-col gap-16 overflow-y-auto"
  >
    <div
      v-if="member_store.plan !== 'paid'"
      data-testid="billing-settings__free"
      class="flex flex-col gap-8"
    >
      <section-header>{{ t('settings.billing-settings.free.label') }}</section-header>
      <div class="grid grid-cols-[200px_1fr] gap-6 items-start">
        <h2 class="text-brown-700 dark:text-brown-300 text-lg">
          {{ t('settings.billing-settings.free.status') }}
        </h2>
        <div>
          <ui-button
            data-testid="billing-settings__upgrade"
            theme="green-400"
            size="sm"
            icon-left="moon-stars"
            @click="openUpgradeModal"
          >
            {{ t('settings.billing-settings.free.upgrade') }}
          </ui-button>
        </div>
      </div>
    </div>

    <template v-else>
      <p
        v-if="subscription_query.isLoading.value"
        data-testid="billing-settings__loading"
        class="text-brown-600 dark:text-brown-300 text-center py-8"
      >
        {{ t('settings.billing-settings.loading') }}
      </p>

      <p
        v-else-if="subscription_query.error.value"
        data-testid="billing-settings__error"
        class="text-red-500 text-center py-8"
      >
        {{ t('settings.billing-settings.error') }}
      </p>

      <template v-else>
        <plan-section :subscription-query="subscription_query" />
        <payment-methods-section />
        <invoices-section />
      </template>
    </template>
  </div>
</template>
