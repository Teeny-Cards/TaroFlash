<script setup lang="ts">
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { type SettingsPage } from './index.vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  tab: SettingsPage
}>()

const emit = defineEmits<{
  (e: 'change-tab', tab: SettingsPage): void
}>()

const { t } = useI18n()
</script>

<template>
  <div
    data-testid="settings__header"
    class="w-full grid grid-cols-[40px_1fr_40px] grid-rows-[auto_auto] items-center bg-blue-800 p-5
      gap-6 cloud-bottom-[40px]"
  >
    <ui-button icon-left="close" icon-only theme="blue-800" inverted></ui-button>

    <h1 class="text-5xl text-brown-100 col-start-2 w-full text-center">App Settings</h1>

    <div
      data-testid="header__tabs"
      class="flex items-center justify-center gap-6.75 col-start-2 row-start-2"
    >
      <ui-button
        icon-left="id-card"
        icon-only
        theme="blue-800"
        size="lg"
        rounded-full
        :variant="tab === 'member-settings' ? 'solid' : 'outline'"
        inverted
        @click="emit('change-tab', 'member-settings')"
      >
        {{ t('settings.member-settings.title') }}
      </ui-button>

      <ui-button
        icon-left="settings"
        icon-only
        theme="blue-800"
        size="lg"
        rounded-full
        :variant="tab === 'app-settings' ? 'solid' : 'outline'"
        inverted
        @click="emit('change-tab', 'app-settings')"
      >
        {{ t('settings.app-settings.title') }}
      </ui-button>

      <ui-button
        icon-left="book"
        icon-only
        theme="blue-800"
        size="lg"
        rounded-full
        :variant="tab === 'member-settings' ? 'solid' : 'outline'"
        inverted
      >
        {{ t('settings.member-settings.title') }}
      </ui-button>
    </div>
  </div>
</template>

<style>
.header__tab {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50px;
  height: 66px;
  border-radius: 21px;

  color: var(--color-brown-100);
}

.header__tab [data-testid='ui-kit-icon'] {
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}

.header__tab:not(.selected) [data-testid='ui-kit-icon']:hover {
  transform: scale(1.1) rotate(10deg);
}

.header__tab.selected {
  background-color: var(--color-brown-100);
  color: var(--color-blue-800);
}

@media (prefers-color-scheme: dark) {
  .header__tab.selected {
    background-color: var(--color-blue-900);
    color: var(--color-brown-300);
  }

  .header__tab {
    color: var(--color-blue-900);
  }
}
</style>
