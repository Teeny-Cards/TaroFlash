<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import phoneApp, { type App } from '../phone-app.vue'
import { useRouter } from 'vue-router'
import { type NavigationStack } from '@/composables/navigation-stack'
import { useModal } from '@/composables/modal'
import Inventory from '@/components/modals/inventory.vue'
import memberCard from '@/components/modals/member-card.vue'

const router = useRouter()
const modal = useModal()
const phone_nav = inject<NavigationStack>('phone-nav')

const apps: App[] = [
  {
    name: 'Dashboard',
    icon: 'home',
    theme: 'blue',
    click_action: () => router.push({ name: 'dashboard' })
  },
  {
    name: 'Shop',
    icon: 'shopping-bag',
    theme: 'purple',
    click_action: () => router.push({ name: 'shop' })
  },
  { name: 'Settings', icon: 'settings', theme: 'brown' },
  {
    name: 'Inventory',
    icon: 'store',
    theme: 'green',
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
  }
]

const hovered_app = ref<string | null>(null)

const menu_title = computed(() => {
  return hovered_app.value ?? 'Menu'
})

async function setHoveredApp(app: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 50))
  hovered_app.value = app
}
</script>

<template>
  <div data-testid="home" class="flex flex-col gap-5 px-5 py-7 pt-8">
    <div class="flex justify-center items-center">
      <h2 class="text-2xl text-brown-700 select-none">{{ menu_title }}</h2>
    </div>

    <div
      class="w-full h-full grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-1 justify-center
        content-center"
    >
      <phone-app
        v-for="app in apps"
        :key="app.name"
        :name="app.name"
        :icon="app.icon"
        :theme="app.theme"
        :shape="app.shape"
        :col_span="app.col_span"
        :row_span="app.row_span"
        @mouseenter="setHoveredApp(app.name)"
        @mouseleave="setHoveredApp(null)"
        @click="app.click_action?.()"
      />
    </div>
  </div>
</template>
