<template>
  <button
    class="p-2 transition-colors font-semibold flex items-center justify-center gap-1"
    :class="{ ...styles, 'rounded-full': rounded, 'rounded-lg': !rounded }"
    @click="$emit('onClick')"
    data-test="teeny-button"
  >
    <TeenyIcon v-if="iconLeft" :src="iconLeft" />
    <slot></slot>
    <TeenyIcon v-if="iconRight" :src="iconRight" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TeenyIcon from './TeenyIcon.vue'

const props = defineProps({
  color: {
    type: String,
    validator(value: string) {
      return ['interaction', 'danger', 'gray'].includes(value)
    }
  },
  variant: {
    type: String,
    validator(value: string) {
      return ['secondary', 'ghost'].includes(value)
    }
  },
  rounded: {
    type: Boolean,
    default: false
  },
  iconRight: String,
  iconLeft: String
})

const styles = computed(() => {
  switch (props.color) {
    case 'danger':
      return {
        'bg-red-400 text-white': props.variant === undefined,
        'border border-red-400 border-2 text-red-400 hover:bg-red-400 hover:text-white':
          props.variant === 'secondary',
        'text-red-400 hover:bg-red-400 hover:text-white': props.variant === 'ghost'
      }
    case 'gray':
      return {
        'bg-gray-400 text-white': props.variant === undefined,
        'border border-gray-400 border-2 text-gray-400 hover:bg-gray-400 hover:text-white':
          props.variant === 'secondary',
        'text-gray-400 hover:bg-gray-400 hover:text-white': props.variant === 'ghost'
      }
    default:
      return {
        'bg-green-400 text-white': props.variant === undefined,
        'border border-green-400 border-2 text-green-400 hover:bg-green-400 hover:text-white':
          props.variant === 'secondary',
        'text-green-400 hover:bg-green-400 hover:text-white': props.variant === 'ghost'
      }
  }
})
</script>
