<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiSlider from '@/components/ui-kit/slider.vue'
import { ref } from 'vue'
import SectionHeader from './section-header.vue'

const { t } = useI18n()

const interface_volume = ref(50)
const alerts_volume = ref(50)
const rewards_volume = ref(50)
</script>

<template>
  <div data-testid="app-settings" class="w-full h-full flex flex-col items-center gap-8">
    <h1 class="text-6xl text-brown-700 dark:text-brown-300">
      {{ t('settings.app-settings.title') }}
    </h1>

    <div data-testid="app-settings__body" class="w-full h-full flex flex-col gap-20">
      <div data-testid="app-settings__audio" class="flex flex-col gap-8">
        <section-header>{{ t('settings.app-settings.audio.label') }}</section-header>

        <div
          class="grid grid-cols-[auto_1fr] gap-y-8 gap-x-20 text-brown-700 dark:text-brown-300
            select-none"
        >
          <h3>{{ t('settings.app-settings.audio.interface') }}</h3>
          <ui-slider
            :label="t('settings.app-settings.audio.interface')"
            v-model="interface_volume"
          />
          <h3>{{ t('settings.app-settings.audio.alerts') }}</h3>
          <ui-slider :label="t('settings.app-settings.audio.alerts')" v-model="alerts_volume" />
          <h3>{{ t('settings.app-settings.audio.rewards') }}</h3>
          <ui-slider :label="t('settings.app-settings.audio.rewards')" v-model="rewards_volume" />
        </div>
      </div>

      <div class="flex flex-col gap-8">
        <section-header>{{ t('settings.app-settings.accessibility.label') }}</section-header>
      </div>
    </div>
  </div>
</template>
