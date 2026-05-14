<script setup lang="ts">
import AppWrapper from '@/phone/components/app-wrapper.vue'
import { type BurstSize } from '@/components/ui-kit/burst.vue'

const {
  hoverEffect = true,
  tapHold = 0,
  tapDuration = 0.2,
  tapBurst = false
} = defineProps<{
  theme: Theme
  title: string
  hoverEffect?: boolean
  tapHold?: number
  tapDuration?: number
  tapBurst?: BurstSize | false
}>()
</script>

<template>
  <app-wrapper
    :title="title"
    :theme="theme"
    :tap-hold="tapHold"
    :tap-duration="tapDuration"
    :tap-burst="tapBurst"
    class="rounded-6 pointer-fine:rounded-5.5 w-16.5 pointer-fine:w-15 aspect-square cursor-pointer hover:scale-110 focus:scale-110 transition-transform duration-50 flex items-center justify-center text-white outline-none bg-(--theme-primary)"
    :class="{ 'tap:bgx-diagonal-stripes animation-safe:tap:bgx-slide': hoverEffect }"
  >
    <slot></slot>
  </app-wrapper>
</template>
