<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

const apps = [
  { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { name: 'Shop', icon: 'shop', route: '/shop' },
  { name: 'Settings', icon: 'settings', route: '/settings' },
  { name: 'Settings', icon: 'settings', route: '/settings' },
  { name: 'Settings', icon: 'settings', route: '/settings' },
  { name: 'Settings', icon: 'settings', route: '/settings' },
  { name: 'Settings', icon: 'settings', route: '/settings' },
  { name: 'Settings', icon: 'settings', route: '/settings' },
  { name: 'Settings', icon: 'settings', route: '/settings' }
]
</script>

<template>
  <div data-testid="home" class="flex flex-col gap-5 px-5 py-7">
    <div class="grid grid-cols-[auto_1fr_auto] justify-items-center items-center">
      <ui-button icon-only icon-left="close" size="xs" theme="grey"></ui-button>
      <h2 class="text-2xl text-brown-700">Phone</h2>
      <ui-button icon-only icon-left="edit" size="xs" theme="grey"></ui-button>
    </div>

    <div
      class="w-full h-full rounded-15 grid grid-cols-[repeat(3,64px)] grid-rows-[repeat(3,64px)] gap-1
        justify-center content-center"
    >
      <button
        v-for="app in apps"
        :key="app.name"
        class="flex justify-center items-center gap-1 bg-blue-500 w-full h-full rounded-5.5"
      >
        <!-- <ui-icon :src="app.icon" size="large" /> -->
      </button>
    </div>
  </div>
</template>
