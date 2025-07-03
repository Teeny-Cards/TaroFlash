<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'

const { text, position = 'top-right' } = defineProps<{
  text: string
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-right'
    | 'bottom-right'
    | 'top-left'
    | 'bottom-left'
}>()

const tooltip = useTemplateRef('ui-kit-tooltip')

onMounted(() => {
  if (tooltip.value) {
    const parent = tooltip.value.parentElement

    if (parent) {
      parent.classList.add('group', 'relative')
    }
  }
})
</script>

<template>
  <span
    data-testid="ui-kit-tooltip"
    class="ui-kit-tooltip hidden group-hover:flex"
    :class="`tooltip--${position}`"
    ref="ui-kit-tooltip"
    role="tooltip"
  >
    <div class="ui-kit-tooltip__line"></div>

    <div class="ui-kit-tooltip__bubble">
      <p class="text-sm text-purple-500">{{ text }}</p>
    </div>
  </span>
</template>
