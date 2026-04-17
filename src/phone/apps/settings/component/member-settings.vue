<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionHeader from './section-header.vue'
import UiInput from '@/components/ui-kit/input.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useMemberStore } from '@/stores/member'
import { useMemberDeckCountQuery } from '@/api/decks'
import { useCreatePortalSessionMutation } from '@/api/billing'
import { useModal } from '@/composables/modal'
import { useToast } from '@/composables/toast'
import { PLANS } from '@/config/plans'
import Checkout from '@/components/modals/checkout.vue'

const { t } = useI18n()
const member_store = useMemberStore()
const deck_count_query = useMemberDeckCountQuery()
const portal_mutation = useCreatePortalSessionMutation()
const modal = useModal()
const toast = useToast()

const display_name = ref(member_store.display_name)
const email = ref(member_store.email)
const portal_loading = ref(false)

function openUpgradeModal() {
  modal.open(Checkout, { mode: 'mobile-sheet', backdrop: true })
}

async function openBillingPortal() {
  portal_loading.value = true
  try {
    const { url } = await portal_mutation.mutateAsync({
      returnUrl: window.location.href
    })
    window.location.href = url
  } catch {
    portal_loading.value = false
    toast.error(t('settings.member-settings.subscription.portal-error'))
  }
}
</script>

<template>
  <div data-testid="member-settings__body" class="w-full h-full flex flex-col gap-20">
    <div data-testid="member-settings__general" class="flex flex-col gap-8">
      <section-header>{{ t('settings.member-settings.general.label') }}</section-header>

      <div class="grid grid-cols-[200px_1fr] gap-6">
        <h2 class="text-brown-700 dark:text-brown-300 text-lg">
          {{ t('member-application.member-name') }}
        </h2>
        <ui-input v-model:value="display_name" />

        <h2 class="text-brown-700 dark:text-brown-300 text-lg">
          {{ t('login-dialog.email') }}
        </h2>
        <ui-input v-model:value="email" />
      </div>
    </div>

    <div data-testid="member-settings__subscription" class="flex flex-col gap-8">
      <section-header>{{ t('settings.member-settings.subscription.label') }}</section-header>

      <div
        v-if="member_store.plan === 'paid'"
        data-testid="member-settings__subscription-paid"
        class="grid grid-cols-[200px_1fr] gap-6 items-center"
      >
        <h2
          data-testid="member-settings__subscription-status"
          class="text-brown-700 dark:text-brown-300 text-lg"
        >
          {{ t('settings.member-settings.subscription.paid.status') }}
        </h2>
        <div>
          <ui-button
            data-testid="member-settings__subscription-manage"
            theme="green-400"
            size="sm"
            :loading="portal_loading"
            @click="openBillingPortal"
          >
            {{ t('settings.member-settings.subscription.paid.manage') }}
          </ui-button>
        </div>
      </div>

      <div
        v-else
        data-testid="member-settings__subscription-free"
        class="grid grid-cols-[200px_1fr] gap-6 items-start"
      >
        <h2
          data-testid="member-settings__subscription-status"
          class="text-brown-700 dark:text-brown-300 text-lg"
        >
          {{ t('settings.member-settings.subscription.free.status') }}
        </h2>
        <div data-testid="member-settings__subscription-free-body" class="flex flex-col gap-3">
          <p
            data-testid="member-settings__subscription-usage"
            class="text-brown-500 dark:text-brown-400"
          >
            {{
              t('settings.member-settings.subscription.free.usage', {
                used: deck_count_query.data.value ?? 0,
                limit: PLANS.free.deckLimit
              })
            }}
          </p>
          <div>
            <ui-button
              data-testid="member-settings__subscription-upgrade"
              theme="green-400"
              size="sm"
              icon-left="sparkles"
              @click="openUpgradeModal"
            >
              {{ t('settings.member-settings.subscription.free.upgrade') }}
            </ui-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
