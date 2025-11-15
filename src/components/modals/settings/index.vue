<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import AppSettings from './app-settings.vue'
</script>

<template>
  <div data-testid="settings-container" class="flex items-center drop-shadow-modal">
    <div
      data-testid="settings"
      class="w-224 h-153 bg-brown-300 rounded-6 px-18 py-8 relative grid grid-cols-1 grid-rows-1"
    >
      <AppSettings class="z-10" />

      <div
        datat-testid="settings__side-bar"
        class="absolute -left-9 top-36.5 bg-blue-900 rounded-7.5 outline-brown-300 outline-12 flex flex-col
          items-center justify-center gap-8 px-5 py-9"
      >
        <ui-icon src="id-card" size="large" class="text-white" />
        <span class="w-full h-px bg-white"></span>
        <ui-icon src="settings" size="large" class="text-white" />
        <span class="w-full h-px bg-white"></span>
        <ui-icon src="book" size="large" class="text-white" />
      </div>

      <ui-icon
        src="logo"
        class="h-107.5! w-107.5! text-brown-500 opacity-15 absolute left-1/2 top-1/2 -translate-x-1/2
          -translate-y-1/2"
      />
    </div>
  </div>
</template>
