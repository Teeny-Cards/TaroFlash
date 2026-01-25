<script setup lang="ts">
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { type SettingsPage } from './index.vue'

defineProps<{
  tab: SettingsPage
}>()

const emit = defineEmits<{
  (e: 'change-tab', tab: SettingsPage): void
}>()
</script>

<template>
  <div
    data-testid="settings__header"
    class="w-full grid grid-cols-[40px_1fr_40px] grid-rows-[auto_auto] items-center bg-blue-800 p-5
      gap-6 cloud-bottom-[40px]"
  >
    <ui-button icon-left="close" icon-only theme="brown-100" size="lg"></ui-button>

    <h1 class="text-5xl text-brown-100 col-start-2 w-full text-center">App Settings</h1>

    <div
      data-testid="header__tabs"
      class="flex items-center justify-center gap-3.5 col-start-2 row-start-2"
    >
      <div class="header__tab" :class="{ selected: tab === 'member-settings' }">
        <ui-tooltip position="bottom" text="Member Settings" :disabled="tab === 'member-settings'">
          <ui-icon src="id-card" size="large" @click="emit('change-tab', 'member-settings')" />
        </ui-tooltip>
      </div>

      <div class="header__tab" :class="{ selected: tab === 'app-settings' }">
        <ui-tooltip position="bottom" text="App Settings" :disabled="tab === 'app-settings'">
          <ui-icon src="settings" size="large" @click="emit('change-tab', 'app-settings')" />
        </ui-tooltip>
      </div>

      <div class="header__tab">
        <ui-icon src="book" size="large" />
      </div>
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
