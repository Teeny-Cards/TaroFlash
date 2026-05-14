<script setup lang="ts">
import AppWrapper from '@/phone/components/app-wrapper.vue'
import UiImage from '@/components/ui-kit/image.vue'
import { type ViewApp, type TriggerApp } from '@/phone/system/types'

defineProps<{ app: ViewApp | TriggerApp }>()
</script>

<template>
  <app-wrapper
    :title="app.title"
    :theme="app.launcher.theme"
    tap-burst="base"
    class="rounded-6 pointer-fine:rounded-5.5 w-16.5 pointer-fine:w-15 aspect-square cursor-pointer hover:scale-110 focus:scale-110 transition-transform duration-50 flex items-center justify-center text-white group outline-none bg-(--theme-primary) tap:bgx-diagonal-stripes animation-safe:tap:bgx-slide"
  >
    <ui-image
      :src="app.launcher.icon_src"
      class="pointer-events-none"
      :class="{ 'group-hover:hidden group-focus:hidden': app.launcher.hover_icon_src }"
    />
    <ui-image
      v-if="app.launcher.hover_icon_src"
      :src="app.launcher.hover_icon_src"
      class="hidden group-hover:block group-focus:block pointer-events-none"
    />
  </app-wrapper>
</template>
