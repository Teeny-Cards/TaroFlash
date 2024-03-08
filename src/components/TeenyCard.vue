<template>
  <div
    class="flex items-center justify-center p-3 bg-white aspect-card shrink-0"
    :class="[cardSize[size], borderRadius[size]]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: String,
    validator(value: string) {
      return ['large', 'base', 'small', 'xs', 'teeny'].includes(value)
    },
    default: 'base'
  }
})

const cardSize: { [key: string]: string } = {
  teeny: 'w-card-teeny',
  xs: 'w-card-xs',
  small: 'w-card-small',
  base: 'w-card-base',
  large: 'w-card-large'
}

const borderRadius: { [key: string]: string } = {
  teeny: 'rounded-xs',
  xs: 'rounded',
  small: 'rounded-xl',
  base: 'rounded-2xl',
  large: 'rounded-4xl'
}
</script>
