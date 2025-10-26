<template>
  <nav
    data-testid="nav-bar-container"
    ref="nav-bar"
    class="w-full sticky top-0 z-10 pb-4 bg-brown-100"
  >
    <div
      data-testid="nav-bar"
      class="font-primary flex pt-4 pb-8 w-full justify-center bg-blue-500 wave-bottom-sm"
    >
      <div class="flex w-full max-w-375 items-center justify-between px-4 sm:px-16">
        <RouterLink to="/dashboard" class="flex items-center gap-2 text-3xl text-white">
          <ui-image src="taro-logo_3" class="max-w-6" />
          <div>TaroFlash</div>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
import UiImage from '@/components/ui-kit/image.vue'

defineProps<{
  display_name: String
}>()

const router = useRouter()
const route = useRoute()

const nav_bar = useTemplateRef('nav-bar')

onMounted(() => {
  const height = nav_bar.value?.clientHeight
  document.documentElement.style.setProperty('--nav-height', `${height}px`)
})

function isActive(routeName: string) {
  return route.name === routeName
}

function routeToShop() {
  router.push({ name: 'shop' })
}
</script>
