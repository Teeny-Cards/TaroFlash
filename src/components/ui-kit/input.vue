<script setup lang="ts">
const { textAlign = 'left', size = 'base' } = defineProps<{
  label?: string
  placeholder?: string
  textAlign?: 'left' | 'center' | 'right'
  size?: 'sm' | 'base' | 'lg'
}>()

const value = defineModel<string>('value')
</script>

<template>
  <label
    data-testid="ui-kit-input-container"
    class="ui-kit-input-container"
    :class="[`ui-kit-input-container--text-${textAlign}`, `ui-kit-input-container--${size}`]"
  >
    <span>{{ label }}</span>
    <div data-testid="ui-kit-input" class="ui-kit-input">
      <input :placeholder="placeholder" v-model="value" />
    </div>
  </label>
</template>
