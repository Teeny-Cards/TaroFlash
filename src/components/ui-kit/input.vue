<script setup lang="ts">
const { textAlign = 'left', size = 'base' } = defineProps<{
  label?: string
  placeholder?: string
  textAlign?: 'left' | 'center' | 'right'
  size?: 'sm' | 'base' | 'lg'
}>()

const emit = defineEmits<{
  (e: 'input', value?: string): void
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
      <input
        v-bind="$attrs"
        :placeholder="placeholder"
        v-model="value"
        @input="emit('input', value)"
      />
    </div>
  </label>
</template>

<style>
.ui-kit-input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.ui-kit-input-container--sm {
  border-radius: var(--radius-3_5);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  padding: 8px 12px;
}

.ui-kit-input-container--lg {
  border-radius: var(--radius-5_5);
}

.ui-kit-input-container span {
  color: var(--color-brown-700);
}

.ui-kit-input {
  background-color: var(--color-brown-100);
  border-radius: var(--radius-4);
  width: 100%;
  padding: 12px 16px;

  width: 100%;
}

.ui-kit-input input {
  border-bottom: 1px dashed var(--color-brown-500);
  outline: none;
  background: transparent;
  color: var(--color-brown-700);

  width: 100%;
  min-width: 0;
}
.ui-kit-input input::placeholder {
  color: var(--color-brown-500);
}
.ui-kit-input input:autofill,
.ui-kit-input input:autofill:hover,
.ui-kit-input input:autofill:focus,
.ui-kit-input input::-webkit-autofill,
.ui-kit-input input::-webkit-autofill:hover,
.ui-kit-input input::-webkit-autofill:focus {
  box-shadow: 0 0 0px 1000px var(--color-brown-100) inset;
}

.ui-kit-input-container--text-left input {
  text-align: left;
}

.ui-kit-input-container--text-right input {
  text-align: right;
}

.ui-kit-input-container--text-center input {
  text-align: center;
}

.ui-kit-input-container--lg input {
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
}
</style>
