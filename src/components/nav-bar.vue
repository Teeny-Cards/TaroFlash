<template>
  <nav class="w-full bg-blue font-primary sticky top-0 z-10 flex justify-center h-17">
    <div class="w-full max-w-app flex justify-between items-center px-4 sm:px-16">
      <RouterLink to="/dashboard" class="text-4xl text-white">TeenyCards</RouterLink>
      <div class="flex gap-6 items-end">
        <div class="flex gap-2.25 mt-6">
          <div
            v-for="i in 5"
            :key="i"
            class="w-17 h-17 bg-pink-light rounded-8 border-parchment border-6 ring-blue ring-8"
          ></div>
        </div>
        <div class="flex gap-4">
          <ui-kit:button
            icon-left="store"
            icon-size="base"
            icon-only
            inverted
            class="ring-8 ring-blue p-1.5"
            :class="{ 'ring-pink': isActive('shop') }"
            @click="routeToShop"
          ></ui-kit:button>
          <ui-kit:button
            icon-left="apps"
            icon-only
            icon-size="base"
            inverted
            class="relative ring-8 ring-blue p-1.5"
          >
            <AppMenu />
          </ui-kit:button>
        </div>
      </div>
    </div>
  </nav>

  <ui-kit:modal :open="member_card_open" backdrop @close="member_card_open = false">
    <MemberCard />
  </ui-kit:modal>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MemberCard from './member-card.vue'
import AppMenu from './app-menu.vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineProps({
  display_name: String
})

const router = useRouter()
const route = useRoute()
const member_card_open = ref(false)

function isActive(routeName: string) {
  return route.name === routeName
}

function routeToShop() {
  router.push({ name: 'shop' })
}
</script>
