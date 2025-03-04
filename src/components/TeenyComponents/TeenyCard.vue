<template>
  <div
    teeny-card
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
  teeny: 'min-w-7 max-w-7',
  xs: 'min-w-10.75 max-w-10.75',
  small: 'min-w-34.5 max-w-34.5',
  base: 'min-w-48 max-w-48',
  large: 'min-w-65 max-w-65'
}

const borderRadius: { [key: string]: string } = {
  teeny: 'rounded-2',
  xs: 'rounded-3',
  small: 'rounded-8',
  base: 'rounded-10',
  large: 'rounded-16'
}
</script>
