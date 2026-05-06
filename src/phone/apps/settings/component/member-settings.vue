<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionHeader from './section-header.vue'
import UiInput from '@/components/ui-kit/input.vue'
import UiButton from '@/components/ui-kit/button.vue'
import PlanSection from './billing-settings/plan-section.vue'
import PaymentMethodsSection from './billing-settings/payment-methods-section.vue'
import InvoicesSection from './billing-settings/invoices-section.vue'
import { useMemberStore } from '@/stores/member'
import { useSubscriptionQuery } from '@/api/billing'
import { useModal } from '@/composables/modal'
import Checkout from '@/components/modals/checkout.vue'

const { t } = useI18n()
const member_store = useMemberStore()
const modal = useModal()
const subscription_query = useSubscriptionQuery()

const display_name = ref(member_store.display_name)
const email = ref(member_store.email)

function openUpgradeModal() {
  modal.open(Checkout, { mode: 'mobile-sheet', backdrop: true })
}
</script>

<template>
  <div
    data-testid="member-settings__body"
    class="w-full h-full flex flex-col gap-16 overflow-y-auto"
  >
    <div data-testid="member-settings__general" class="flex flex-col gap-8">
      <section-header>{{ t('settings.member-settings.general.label') }}</section-header>

      <div class="grid grid-cols-[200px_1fr] gap-6">
        <h2 class="text-brown-700 dark:text-brown-300 text-lg">
          {{ t('settings.member-settings.member-name-label') }}
        </h2>
        <ui-input v-model:value="display_name" />

        <h2 class="text-brown-700 dark:text-brown-300 text-lg">
          {{ t('settings.member-settings.email-label') }}
        </h2>
        <ui-input v-model:value="email" />
      </div>
    </div>

    <div
      v-if="member_store.plan !== 'paid'"
      data-testid="member-settings__free"
      class="flex flex-col gap-8"
    >
      <section-header>{{ t('settings.member-settings.billing.free.label') }}</section-header>
      <div class="grid grid-cols-[200px_1fr] gap-6 items-start">
        <h2 class="text-brown-700 dark:text-brown-300 text-lg">
          {{ t('settings.member-settings.billing.free.status') }}
        </h2>
        <div>
          <ui-button
            data-testid="member-settings__upgrade"
            data-theme="green-400"
            size="sm"
            icon-left="moon-stars"
            @click="openUpgradeModal"
          >
            {{ t('settings.member-settings.billing.free.upgrade') }}
          </ui-button>
        </div>
      </div>
    </div>

    <template v-else>
      <p
        v-if="subscription_query.isLoading.value"
        data-testid="member-settings__billing-loading"
        class="text-brown-600 dark:text-brown-300 text-center py-8"
      >
        {{ t('settings.member-settings.billing.section-loading') }}
      </p>

      <p
        v-else-if="subscription_query.error.value"
        data-testid="member-settings__billing-error"
        class="text-red-500 text-center py-8"
      >
        {{ t('settings.member-settings.billing.error') }}
      </p>

      <template v-else>
        <plan-section :subscription-query="subscription_query" />
        <payment-methods-section />
        <invoices-section />
      </template>
    </template>
  </div>
</template>
