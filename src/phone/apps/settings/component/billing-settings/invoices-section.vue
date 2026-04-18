<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'
import SectionHeader from '../section-header.vue'
import { useInvoicesQuery } from '@/api/billing'

const { t, locale } = useI18n()
const invoices_query = useInvoicesQuery()

const invoices = computed(() => invoices_query.data.value?.invoices ?? [])

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount / 100)
}

function formatDate(ts: number) {
  return DateTime.fromMillis(ts * 1000)
    .setLocale(locale.value)
    .toLocaleString(DateTime.DATE_MED)
}
</script>

<template>
  <div data-testid="billing-settings__invoices" class="flex flex-col gap-8">
    <section-header>{{ t('settings.billing-settings.invoices.label') }}</section-header>

    <p
      v-if="invoices_query.isLoading.value"
      data-testid="billing-settings__invoices-loading"
      class="text-brown-500 dark:text-brown-400"
    >
      {{ t('settings.billing-settings.loading') }}
    </p>

    <p
      v-else-if="invoices.length === 0"
      data-testid="billing-settings__invoices-empty"
      class="text-brown-500 dark:text-brown-400"
    >
      {{ t('settings.billing-settings.invoices.empty') }}
    </p>

    <ul v-else data-testid="billing-settings__invoices-list" class="flex flex-col gap-2">
      <li
        v-for="invoice in invoices"
        :key="invoice.id"
        :data-testid="`billing-settings__invoice-${invoice.id}`"
        class="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 bg-brown-200 dark:bg-grey-700 rounded-3 p-3 text-brown-700 dark:text-brown-200"
      >
        <span class="text-sm text-brown-500 dark:text-brown-400 tabular-nums">
          {{ formatDate(invoice.created) }}
        </span>
        <span class="truncate">{{ invoice.number ?? invoice.id }}</span>
        <span class="tabular-nums">{{
          formatAmount(invoice.amount_paid || invoice.amount_due, invoice.currency)
        }}</span>
        <a
          v-if="invoice.hosted_invoice_url"
          :data-testid="`billing-settings__invoice-link-${invoice.id}`"
          :href="invoice.hosted_invoice_url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-green-700 dark:text-green-400 hover:underline"
        >
          {{ t('settings.billing-settings.invoices.view') }}
        </a>
        <span v-else></span>
      </li>
    </ul>
  </div>
</template>
