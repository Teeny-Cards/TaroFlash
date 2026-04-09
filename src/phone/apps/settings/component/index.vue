<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import AppSettings from './app-settings.vue'
import MemberSettings from './member-settings.vue'
import { ref, onMounted } from 'vue'
import SettingsHeader from './settings-header.vue'
import type { AppProps, AppEmits } from '@/phone/system/types'
import { useStorage } from '@/composables/use-storage'

export type SettingsTab = 'app-settings' | 'member-settings' | 'notification-settings'

const STORAGE_KEY = 'settings-tab'

defineProps<AppProps>()
const emit = defineEmits<AppEmits>()

const storage = useStorage()

const tab = ref<SettingsTab>('app-settings')

const tabs: { [key in SettingsTab]: any } = {
  'app-settings': AppSettings,
  'member-settings': MemberSettings,
  'notification-settings': undefined
}

onMounted(() => {
  if (!STORAGE_KEY) return

  const storedValue = storage.get(STORAGE_KEY)
  if (storedValue) {
    tab.value = storedValue as SettingsTab
  }
})

function onTabClick(_tab: SettingsTab) {
  if (_tab === tab.value) return

  storage.set(STORAGE_KEY, _tab)
  tab.value = _tab
}
</script>

<template>
  <div
    data-testid="settings-container"
    class="flex flex-col items-center w-157.5 h-146.25 rounded-top-16 overflow-hidden sm:rounded-16 bg-brown-300 shadow-lg"
  >
    <settings-header :selected-tab="tab" @change-tab="onTabClick" @close="emit('close')" />

    <div
      data-testid="settings"
      class="w-full h-full px-10 py-8 relative grid grid-cols-1 grid-rows-1"
    >
      <component :is="tabs[tab]" class="z-10" />

      <ui-icon
        src="logo"
        class="h-100! w-100! text-brown-500 opacity-15 dark:opacity-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  </div>
</template>
