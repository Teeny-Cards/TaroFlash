<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import AppSettings from './app-settings.vue'
import MemberSettings from './member-settings.vue'
import UiLoader from '@/components/ui-kit/loader.vue'
import { ref } from 'vue'
import SettingsHeader from './settings-header.vue'
import type { AppProps, AppEmits } from '@/phone/system/types'

export type SettingsTab = 'app-settings' | 'member-settings' | 'notification-settings'

defineProps<AppProps>()
const emit = defineEmits<AppEmits>()

const tab = ref<SettingsTab>('app-settings')

const tabs: { [key in SettingsTab]: any } = {
  'app-settings': AppSettings,
  'member-settings': MemberSettings,
  'notification-settings': undefined
}
</script>

<template>
  <ui-loader
    loading-image="settings"
    keep-alive
    done-image="settings-hover"
    size="lg"
    theme="blue-800"
    class="rounded-[inherit]"
  >
    <div
      data-testid="settings-container"
      class="flex flex-col items-center w-157.5 h-full rounded-16"
    >
      <settings-header :selected-tab="tab" @change-tab="tab = $event" @close="emit('close')" />

      <div
        data-testid="settings"
        class="w-full h-full px-10 py-8 relative grid grid-cols-1 grid-rows-1"
      >
        <component :is="tabs[tab]" class="z-10" />

        <ui-icon
          src="logo"
          class="h-107.5! w-107.5! text-brown-500 opacity-15 dark:opacity-5 absolute left-1/2
            top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div></div
  ></ui-loader>
</template>
