<script setup lang="ts">
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import { useMediaQuery } from '@/composables/use-media-query'

defineProps<{ title: string; theme: Theme }>()

const is_coarse = useMediaQuery('coarse')
</script>

<template>
  <ui-tooltip
    :text="title"
    position="bottom"
    :data-theme="theme"
    :gap="is_coarse ? -16 : -5"
    element="button"
    data-testid="phone-app"
    static_on_mobile
  >
    <slot></slot>
  </ui-tooltip>
</template>
