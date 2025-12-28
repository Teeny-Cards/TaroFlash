<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeader from './section-header.vue'

const { t } = useI18n()
</script>

<template>
  <div data-testid="member-settings" class="w-full h-full flex flex-col items-center gap-8">
    <h1 class="text-6xl text-brown-700">{{ t('settings.member-settings.title') }}</h1>

    <div data-testid="member-settings__body" class="w-full h-full flex flex-col gap-20">
      <div data-testid="member-settings__subscription" class="flex flex-col gap-8">
        <section-header>{{ t('settings.member-settings.subscription.label') }}</section-header>
      </div>
    </div>
  </div>
</template>
