<script setup lang="ts">
import { inject } from 'vue'
import phoneApp, { type App } from '../phone-app.vue'
import { useRouter } from 'vue-router'
import { type NavigationStack } from '@/composables/navigation-stack'
import { useModal } from '@/composables/modal'
import Inventory from '@/components/modals/inventory.vue'
import memberCard from '@/components/modals/member-card.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

const router = useRouter()
const modal = useModal()
const phone_nav = inject<NavigationStack>('phone-nav')

const apps: App[] = [
  { name: 'Settings', icon: 'settings', theme: 'brown' },
  {
    name: 'Inventory',
    icon: 'inventory',
    hover_icon: 'inventory-hover',
    theme: 'purple',
    click_action: () => modal.open(Inventory)
  },
  {
    name: 'Member Card',
    icon: 'user',
    theme: 'pink',
    click_action: () =>
      modal.open(memberCard, {
        backdrop: true
      })
  },
  {
    name: 'Dashboard',
    icon: 'home',
    theme: 'blue',
    click_action: () => router.push({ name: 'dashboard' })
  },
  {
    name: 'Shop',
    icon: 'shopping-bag',
    theme: 'green',
    click_action: () => router.push({ name: 'shop' })
  }
]
</script>

<template>
  <div data-testid="home" class="h-full flex flex-col gap-8 px-5 py-7 pt-4">
    <div class="grid grid-cols-[18px_1fr_18px] px-6 justify-center items-center">
      <h2 class="text-brown-500 select-none col-start-2 justify-self-center">Phone</h2>
      <button
        class="text-brown-500 border-[1.5px] border-brown-500 rounded-full p-0.5 w-min cursor-pointer"
      >
        <ui-icon src="edit" size="xs" />
      </button>
    </div>

    <div
      class="grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-2 gap-y-6 sm:gap-y-2 justify-center
        content-center"
    >
      <phone-app v-for="app in apps" :key="app.name" v-bind="app" />
    </div>
  </div>
</template>
