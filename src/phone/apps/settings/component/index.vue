<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import AppSettings from './app-settings.vue'
import MemberSettings from './member-settings.vue'
import UiLoader from '@/components/ui-kit/loader.vue'
import { ref } from 'vue'

type SettingsPage = 'app-settings' | 'member-settings'

const tab = ref<SettingsPage>('app-settings')

const tabs: { [key in SettingsPage]: any } = {
  'app-settings': AppSettings,
  'member-settings': MemberSettings
}
</script>

<template>
  <ui-loader
    :immediate="false"
    loading-image="settings"
    done-image="settings-hover"
    size="lg"
    theme="pink"
    class="rounded-[inherit]"
  >
    <div
      data-testid="settings-container"
      class="flex items-center w-full h-full dark:bg-blue-900 rounded-16"
    >
      <div
        data-testid="settings"
        class="w-full h-full px-18 py-8 relative grid grid-cols-1 grid-rows-1"
      >
        <component :is="tabs[tab]" class="z-10" />

        <div
          datat-testid="settings__side-bar"
          class="absolute -left-9 top-36.5 bg-blue-800 dark:bg-brown-300 rounded-7.5
            outline-brown-300 dark:outline-blue-900 outline-12 flex flex-col items-center
            justify-center gap-3.5 px-3 py-6"
        >
          <div class="settings__side-bar__item" :class="{ selected: tab === 'member-settings' }">
            <ui-tooltip
              position="bottom"
              text="Member Settings"
              :disabled="tab === 'member-settings'"
            >
              <ui-icon src="id-card" size="large" @click="tab = 'member-settings'" />
            </ui-tooltip>
          </div>

          <span class="w-full h-px bg-white dark:bg-grey-900"></span>

          <div class="settings__side-bar__item" :class="{ selected: tab === 'app-settings' }">
            <ui-tooltip position="bottom" text="App Settings" :disabled="tab === 'app-settings'">
              <ui-icon src="settings" size="large" @click="tab = 'app-settings'" />
            </ui-tooltip>
          </div>

          <span class="w-full h-px bg-white dark:bg-grey-900"></span>

          <div class="settings__side-bar__item">
            <ui-icon src="book" size="large" />
          </div>
        </div>

        <ui-icon
          src="logo"
          class="h-107.5! w-107.5! text-brown-500 opacity-15 dark:opacity-5 absolute left-1/2
            top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div></div
  ></ui-loader>
</template>

<style>
.settings__side-bar__item {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50px;
  height: 66px;
  border-radius: 21px;

  color: var(--color-brown-100);
}

.settings__side-bar__item [data-testid='ui-kit-icon'] {
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}

.settings__side-bar__item:not(.selected) [data-testid='ui-kit-icon']:hover {
  transform: scale(1.1) rotate(10deg);
}

.settings__side-bar__item.selected {
  background-color: var(--color-brown-100);
  color: var(--color-blue-800);
}

@media (prefers-color-scheme: dark) {
  .settings__side-bar__item.selected {
    background-color: var(--color-blue-900);
    color: var(--color-brown-300);
  }

  .settings__side-bar__item {
    color: var(--color-blue-900);
  }
}
</style>
