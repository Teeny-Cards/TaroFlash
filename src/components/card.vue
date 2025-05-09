<template>
  <div
    teeny-card
    class="flex items-center justify-center p-3 bg-white aspect-card shrink-0"
    :class="classes[size]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: String,
    validator(value: string) {
      return ['large', 'base', 'small', 'xs', '2xs', '3xs'].includes(value)
    },
    default: 'base'
  }
})

const classes: { [key: string]: string } = {
  '3xs': 'min-w-7 max-w-7 rounded-2 text-xs',
  '2xs': 'min-w-10.75 max-w-10.75 rounded-3 text-xs',
  xs: 'min-w-25.5 max-w-25.5 rounded-6 text-sm',
  small: 'min-w-34.5 max-w-34.5 rounded-8 text-base',
  base: 'min-w-48 max-w-48 rounded-10 text-xl',
  large: 'min-w-65 max-w-65 rounded-12  text-2xl'
}
</script>
