<template>
  <nav class="w-full sticky top-0 z-10 pb-4">
    <div class="font-primary flex pt-4 pb-8 w-full justify-center bg-blue-500 wave-bottom-sm">
      <div class="flex w-full max-w-375 items-center justify-between px-4 sm:px-16">
        <RouterLink to="/dashboard" class="flex items-center gap-2 text-3xl text-white">
          <ui-kit:image src="taro-logo_3" class="max-w-6" />
          <div>TaroCards</div>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'

defineProps<{
  display_name: String
}>()

const router = useRouter()
const route = useRoute()

function isActive(routeName: string) {
  return route.name === routeName
}

function routeToShop() {
  router.push({ name: 'shop' })
}
</script>
