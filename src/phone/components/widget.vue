<script setup lang="ts">
import AppWrapper from '@/phone/components/app-wrapper.vue'
import UiTooltip from '@/components/ui-kit/tooltip.vue'

const { hoverEffect = true } = defineProps<{
  theme: Theme
  title: string
  hoverEffect?: boolean
}>()
</script>

<template>
  <app-wrapper
    :title="title"
    :theme="theme"
    class="rounded-6 pointer-fine:rounded-5.5 w-16.5 pointer-fine:w-15 aspect-square cursor-pointer hover:scale-110 focus:scale-110 transition-transform duration-50 flex items-center justify-center text-white outline-none bg-(--theme-primary)"
    :class="{
      [`hover:bgx-diagonal-stripes animation-safe:hover:bgx-slide animation-safe:focus:bgx-slide
      focus:bgx-diagonal-stripes`]: hoverEffect
    }"
  >
    <slot></slot>
  </app-wrapper>
</template>
