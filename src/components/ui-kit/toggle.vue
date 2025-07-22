<template>
  <label
    data-testid="ui-kit-toggle"
    class="ui-kit-toggle"
    :class="{ 'ui-kit-toggle--checked': checked }"
  >
    <span data-testid="ui-kit-toggle__label" class="ui-kit-toggle__label">
      <slot></slot>
    </span>

    <span data-testid="ui-kit-toggle__switch" class="ui-kit-toggle__switch">
      <input type="checkbox" v-model="checked" class="hidden" />
      <span data-testid="ui-kit-toggle__switch-handle" class="ui-kit-toggle__switch-handle"></span>
    </span>
  </label>
</template>

<script setup lang="ts">
const checked = defineModel<boolean>('checked')
</script>
