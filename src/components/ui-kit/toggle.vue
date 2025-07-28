<script setup lang="ts">
import { useAudio } from '@/composables/use-audio'

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
