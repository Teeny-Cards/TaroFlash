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
  teeny: 'min-w-card-teeny max-w-card-teeny',
  xs: 'min-w-card-xs max-w-card-xs',
  small: 'min-w-card-small max-w-card-small',
  base: 'min-w-card-base max-w-card-base',
  large: 'min-w-card-large max-w-card-large'
}

const borderRadius: { [key: string]: string } = {
  teeny: 'rounded-2',
  xs: 'rounded-3',
  small: 'rounded-8',
  base: 'rounded-10',
  large: 'rounded-16'
}
</script>
