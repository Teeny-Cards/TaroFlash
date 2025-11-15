<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiSlider from '@/components/ui-kit/slider.vue'
import { ref } from 'vue'

const { t } = useI18n()

const interface_volume = ref(40)
const alerts_volume = ref(100)
const rewards_volume = ref(30)
</script>

<template>
  <div data-testid="app-settings" class="w-full h-full flex flex-col items-center gap-8">
    <h1 class="text-6xl text-brown-700">{{ t('settings.app-settings.title') }}</h1>

    <div data-testid="app-settings__body" class="w-full h-full flex flex-col gap-20">
      <div data-testid="app-settings__audio" class="flex flex-col gap-6">
        <div
          data-testid="app-settings__audio__header"
          class="w-full px-2 py-1 bg-blue-900 rounded-1.5"
        >
          <h2 class="text-3xl text-brown-100">{{ t('settings.app-settings.audio.label') }}</h2>
        </div>

        <div class="grid grid-cols-[auto_1fr] gap-y-6 gap-x-20 text-brown-700 select-none">
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

      <div class="w-full px-2 py-1 bg-blue-900 rounded-1.5">
        <h2 class="text-3xl text-brown-100">
          {{ t('settings.app-settings.accessibility.label') }}
        </h2>
      </div>
    </div>
  </div>
</template>
