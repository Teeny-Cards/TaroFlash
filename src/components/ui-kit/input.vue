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

<style>
@reference '@/styles/main.css';

.ui-kit-input-container {
  @apply flex flex-col gap-1.5;
}

.ui-kit-input-container--sm {
  @apply rounded-3.5 px-3 py-2 text-sm;
}

.ui-kit-input-container--lg {
  @apply rounded-5.5;
}

.ui-kit-input-container span {
  @apply text-brown-500;
}

.ui-kit-input {
  @apply bg-brown-100 rounded-5 w-full px-6 py-3;
}

.ui-kit-input input {
  @apply border-brown-700 text-brown-700 placeholder:text-brown-500 w-full min-w-0 border-b border-dashed bg-transparent outline-none;
}

.ui-kit-input-container--text-left input {
  @apply text-left;
}

.ui-kit-input-container--text-right input {
  @apply text-right;
}

.ui-kit-input-container--text-center input {
  @apply text-center;
}

.ui-kit-input-container--lg input {
  @apply text-lg;
}
</style>
