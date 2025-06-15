<template>
  <span
    data-testid="ui-kit-tooltip"
    class="ui-kit-tooltip"
    :class="[position_class[position], { 'tooltip--hidden': !open }]"
    :aria-hidden="!open"
    ref="ui-kit-tooltip"
    role="tooltip"
  >
    <div class="ui-kit-tooltip__line"></div>

    <div class="ui-kit-tooltip__bubble">
      <p class="text-purple-dark text-xs">{{ text }}</p>
    </div>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'

type Props = {
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
}

const { text, position = 'top-right' } = defineProps<Props>()

const open = ref(false)
const tooltip = useTemplateRef('ui-kit-tooltip')

const position_class: { [key: string]: string } = {
  top: 'tooltip--top',
  bottom: 'tooltip--bottom',
  left: 'tooltip--left',
  right: 'tooltip--right',
  'top-right': 'tooltip--top-right',
  'bottom-right': 'tooltip--bottom-right',
  'top-left': 'tooltip--top-left',
  'bottom-left': 'tooltip--bottom-left'
}

onMounted(() => {
  if (tooltip.value) {
    const parent = tooltip.value.parentElement

    if (parent) {
      parent.style.position = 'relative'
      parent.addEventListener('mouseenter', () => {
        open.value = true
      })
      parent.addEventListener('mouseleave', () => {
        open.value = false
      })
    }
  }
})
</script>
