<template>
  <nav
    data-testid="nav-bar-container"
    ref="nav-bar"
    class="w-full sticky top-0 z-10 pt-4 pb-8 mb-8 px-4 bg-blue-500 wave-bottom-[30px] flex justify-center"
  >
    <div
      data-testid="nav-bar"
      class="flex w-full max-w-(--page-width) items-center justify-between sm:px-16 relative"
    >
      <RouterLink to="/dashboard" class="flex items-center gap-2 text-4xl text-white">
        <ui-image src="taro-logo_3" class="max-w-6" />
        <div>TaroFlash</div>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import UiImage from '@/components/ui-kit/image.vue'

const nav_bar = useTemplateRef('nav-bar')

onMounted(() => {
  const height = nav_bar.value?.clientHeight
  document.documentElement.style.setProperty('--nav-height', `${height}px`)
})
</script>
