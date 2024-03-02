<template>
  <button
    class="px-3 py-2 transition-colors font-semibold flex items-center justify-center gap-2.5 font-primary rounded-2xl"
    :class="styles"
    @click="$emit('onClick')"
    data-test="teeny-button"
  >
    <div v-if="iconLeft" class="rounded-full" :class="iconStyles">
      <TeenyIcon v-if="iconLeft" :src="iconLeft" />
    </div>
    <slot></slot>
    <div v-if="iconRight" class="rounded-full" :class="iconStyles">
      <TeenyIcon v-if="iconRight" :src="iconRight" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TeenyIcon from './TeenyIcon.vue'

const props = defineProps({
  color: {
    type: String,
    validator(value: string) {
      return ['danger', 'gray'].includes(value)
    }
  },
  variant: {
    type: String,
    validator(value: string) {
      return ['secondary', 'ghost'].includes(value)
    }
  },
  iconRight: String,
  iconLeft: String
})

const styles = computed(() => {
  switch (props.color) {
    case 'danger':
      return {
        'bg-red text-white': props.variant === undefined,
        'border border-red-400 border-2 text-red hover:bg-red hover:text-white':
          props.variant === 'secondary',
        'text-red-400 hover:bg-red hover:text-white': props.variant === 'ghost'
      }
    case 'gray':
      return {
        'bg-grey text-white': props.variant === undefined,
        'border border-grey border-2 text-grey hover:bg-grey hover:text-white':
          props.variant === 'secondary',
        'text-grey hover:bg-grey hover:text-white': props.variant === 'ghost'
      }
    default:
      return {
        'bg-blue text-white': props.variant === undefined,
        'border border-blue border-2 text-blue hover:bg-blue hover:text-white':
          props.variant === 'secondary',
        'text-blue hover:bg-blue hover:text-white': props.variant === 'ghost'
      }
  }
})

const iconStyles = computed(() => {
  switch (props.color) {
    case 'danger':
      return {
        'bg-white text-red': props.variant === undefined || props.variant === 'secondary',
        'bg-red text-white': props.variant === 'ghost'
      }
    case 'gray':
      return {
        'bg-white text-grey': props.variant === undefined || props.variant === 'secondary',
        'bg-grey text-white': props.variant === 'ghost'
      }
    default:
      return {
        'bg-white text-blue': props.variant === undefined || props.variant === 'secondary',
        'bg-blue text-white': props.variant === 'ghost'
      }
  }
})
</script>
