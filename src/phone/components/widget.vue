<script setup lang="ts">
import UiTooltip from '@/components/ui-kit/tooltip.vue'

const { hoverEffect = true } = defineProps<{
  theme: MemberTheme
  title: string
  hoverEffect?: boolean
}>()
</script>

<template>
  <ui-tooltip
    :text="title"
    position="bottom"
    :data-theme="theme"
    :gap="-5"
    element="button"
    data-testid="phone-app"
    class="rounded-5.5 w-15 h-15 cursor-pointer hover:scale-110 focus:scale-110 transition-transform
      duration-50 flex items-center justify-center text-white outline-none bg-(--theme-primary)"
    :class="{
      [`hover:bgx-diagonal-stripes animation-safe:hover:bgx-slide animation-safe:focus:bgx-slide
      focus:bgx-diagonal-stripes`]: hoverEffect
    }"
  >
    <slot></slot>
  </ui-tooltip>
</template>
