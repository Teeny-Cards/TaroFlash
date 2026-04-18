<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionHeader from '../section-header.vue'
import UiButton from '@/components/ui-kit/button.vue'
import AddCreditCardModal from './add-credit-card-modal.vue'
import {
  usePaymentMethodsQuery,
  useSetDefaultPaymentMethodMutation,
  useDetachPaymentMethodMutation
} from '@/api/billing'
import { useModal } from '@/composables/modal'
import { useToast } from '@/composables/toast'

const { t } = useI18n()
const modal = useModal()
const toast = useToast()

const methods_query = usePaymentMethodsQuery()
const set_default_mutation = useSetDefaultPaymentMethodMutation()
const detach_mutation = useDetachPaymentMethodMutation()

const payment_methods = computed(() => methods_query.data.value?.paymentMethods ?? [])
const default_id = computed(() => methods_query.data.value?.defaultPaymentMethodId ?? null)

function formatExpiry(month: number, year: number) {
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`
}

async function onSetDefault(paymentMethodId: string) {
  try {
    await set_default_mutation.mutateAsync(paymentMethodId)
    toast.success(t('settings.member-settings.billing.payment-methods.set-default-success'))
  } catch {
    toast.error(t('settings.member-settings.billing.payment-methods.set-default-error'))
  }
}

async function onDetach(paymentMethodId: string) {
  try {
    await detach_mutation.mutateAsync(paymentMethodId)
    toast.success(t('settings.member-settings.billing.payment-methods.detach-success'))
  } catch {
    toast.error(t('settings.member-settings.billing.payment-methods.detach-error'))
  }
}

function openAddCreditCard() {
  modal.open(AddCreditCardModal, { mode: 'mobile-sheet', backdrop: true })
}
</script>

<template>
  <div data-testid="billing-settings__payment-methods" class="flex flex-col gap-8">
    <section-header>{{
      t('settings.member-settings.billing.payment-methods.label')
    }}</section-header>

    <div class="flex flex-col gap-4">
      <p
        v-if="methods_query.isLoading.value"
        data-testid="billing-settings__payment-methods-loading"
        class="text-brown-500 dark:text-brown-400"
      >
        {{ t('settings.member-settings.billing.loading') }}
      </p>

      <p
        v-else-if="payment_methods.length === 0"
        data-testid="billing-settings__payment-methods-empty"
        class="text-brown-500 dark:text-brown-400"
      >
        {{ t('settings.member-settings.billing.payment-methods.empty') }}
      </p>

      <ul v-else data-testid="billing-settings__payment-methods-list" class="flex flex-col gap-3">
        <li
          v-for="method in payment_methods"
          :key="method.id"
          :data-testid="`billing-settings__payment-method-${method.id}`"
          class="flex items-center gap-4 bg-brown-200 dark:bg-grey-700 rounded-4 p-4"
        >
          <div class="flex-1 flex flex-col gap-1">
            <p class="text-brown-700 dark:text-brown-200 text-lg capitalize">
              {{ method.card?.brand }} •••• {{ method.card?.last4 }}
            </p>
            <p v-if="method.card" class="text-sm text-brown-500 dark:text-brown-400">
              {{
                t('settings.member-settings.billing.payment-methods.expires', {
                  expiry: formatExpiry(method.card.exp_month, method.card.exp_year)
                })
              }}
            </p>
          </div>

          <span
            v-if="method.id === default_id"
            data-testid="billing-settings__payment-method-default"
            class="text-sm text-green-700 dark:text-green-400"
          >
            {{ t('settings.member-settings.billing.payment-methods.default') }}
          </span>
          <ui-button
            v-else
            :data-testid="`billing-settings__payment-method-make-default-${method.id}`"
            theme="green-400"
            size="xs"
            variant="outline"
            :loading="set_default_mutation.isLoading.value"
            @click="onSetDefault(method.id)"
          >
            {{ t('settings.member-settings.billing.payment-methods.make-default') }}
          </ui-button>

          <ui-button
            :data-testid="`billing-settings__payment-method-detach-${method.id}`"
            theme="red-500"
            size="xs"
            variant="outline"
            icon-only
            icon-left="delete"
            :loading="detach_mutation.isLoading.value"
            @click="onDetach(method.id)"
          >
            {{ t('settings.member-settings.billing.payment-methods.detach') }}
          </ui-button>
        </li>
      </ul>

      <div>
        <ui-button
          data-testid="billing-settings__payment-methods-add"
          theme="green-400"
          size="sm"
          icon-left="add"
          @click="openAddCreditCard"
        >
          {{ t('settings.member-settings.billing.payment-methods.add') }}
        </ui-button>
      </div>
    </div>
  </div>
</template>
