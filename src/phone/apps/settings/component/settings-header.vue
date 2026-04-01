<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'
import { type SettingsTab } from './index.vue'
import { useI18n } from 'vue-i18n'

const { selectedTab } = defineProps<{
  selectedTab: SettingsTab
}>()

const emit = defineEmits<{
  (e: 'change-tab', tab: SettingsTab): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const tabs: Array<{
  key: SettingsTab
  icon: string
  label: string
}> = [
  {
    key: 'member-settings',
    icon: 'id-card',
    label: t('settings.member-settings.title')
  },
  {
    key: 'app-settings',
    icon: 'settings',
    label: t('settings.app-settings.title')
  },
  {
    key: 'notification-settings',
    icon: 'book',
    label: t('settings.notification-settings.title')
  }
]

function titleFor(tab: SettingsTab) {
  return tabs.find((t) => t.key === tab)?.label
}

function isSelected(tab: SettingsTab) {
  return selectedTab === tab
}
</script>

<template>
  <div
    data-testid="settings__header"
    class="w-full grid grid-cols-[40px_1fr_40px] grid-rows-[auto_auto] items-center bg-blue-800 p-5
      pb-4 gap-6 cloud-bottom-[40px]"
  >
    <ui-button icon-left="close" icon-only theme="blue-800" inverted @click="emit('close')" />

    <h1 class="text-5xl text-brown-100 col-start-2 w-full text-center">
      {{ titleFor(selectedTab) }}
    </h1>

    <div
      data-testid="header__tabs"
      class="flex items-center justify-center gap-6.75 col-start-2 row-start-2"
    >
      <ui-button
        v-for="tab in tabs"
        :icon-left="tab.icon"
        icon-only
        theme="blue-800"
        size="lg"
        rounded-full
        :variant="isSelected(tab.key) ? 'solid' : 'outline'"
        inverted
        :sfx="{ click: 'ui.select' }"
        :class="{
          [`hover:[&_.btn-icon]:scale-110 hover:[&_.btn-icon]:rotate-10 transition-transform
          duration-75`]: !isSelected(tab.key)
        }"
        @click="emit('change-tab', tab.key)"
      >
        {{ tab.label }}
      </ui-button>
    </div>
  </div>
</template>
