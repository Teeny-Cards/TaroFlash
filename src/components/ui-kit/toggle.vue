<script setup lang="ts">
import { useAudio } from '@/composables/audio'

const audio = useAudio()

const checked = defineModel<boolean>('checked')
</script>

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
      <input
        type="checkbox"
        v-model="checked"
        class="hidden"
        @change="audio.play('etc_camera_shutter')"
      />
      <span data-testid="ui-kit-toggle__switch-handle" class="ui-kit-toggle__switch-handle"></span>
    </span>
  </label>
</template>

<style>
@reference '@/styles/main.css';

.ui-kit-toggle {
  @apply flex cursor-pointer items-center justify-between gap-2;
}

.ui-kit-toggle .ui-kit-toggle__label {
  @apply text-brown-700;
}

.ui-kit-toggle .ui-kit-toggle__switch {
  @apply bg-brown-100 flex w-12 items-center rounded-full p-1 transition-colors;
}

.ui-kit-toggle.ui-kit-toggle--checked .ui-kit-toggle__switch {
  @apply bg-green-400;
}

.ui-kit-toggle .ui-kit-toggle__switch-handle {
  @apply bg-brown-500 h-5 w-5 rounded-full transition-all duration-100 ease-in-out;
}

.ui-kit-toggle.ui-kit-toggle--checked .ui-kit-toggle__switch-handle {
  @apply bg-brown-100 translate-x-full transform;
}
</style>
