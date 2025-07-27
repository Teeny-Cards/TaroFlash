<template>
  <div data-testid="ui-kit-input" class="ui-kit-input" :class="[textAlignClass, sizeClass]">
    <input :placeholder="placeholder" v-model="value" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const {
  placeholder,
  textAlign = 'left',
  size = 'base'
} = defineProps<{
  placeholder?: string
  textAlign?: 'left' | 'center' | 'right'
  size?: 'sm' | 'base' | 'lg'
}>()

const value = defineModel<string>('value')

const textAlignClass = computed(() => {
  return `ui-kit-input--text-${textAlign}`
})

const sizeClass = computed(() => {
  return `ui-kit-input--${size}`
})
</script>
