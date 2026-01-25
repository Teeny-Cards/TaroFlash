<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionHeader from './section-header.vue'
import UiInput from '@/components/ui-kit/input.vue'
import { useMemberStore } from '@/stores/member'

const { t } = useI18n()
const member_store = useMemberStore()

const display_name = ref(member_store.display_name)
const email = ref(member_store.email)
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
    </div>
  </div>
</template>
