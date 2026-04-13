<script setup lang="ts">
import { emitSfx } from '@/sfx/bus'

const { supported_themes, bg_color } = defineProps<{
  supported_themes: MemberTheme[]
  bg_color: MemberTheme | undefined
}>()

const emit = defineEmits<{
  (e: 'select', theme: MemberTheme | undefined): void
}>()

function onThemeSelect(theme: MemberTheme) {
  if (theme === bg_color) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.etc_camera_shutter')
  emit('select', theme)
}
</script>

<template>
  <button
    v-for="theme in supported_themes"
    :key="theme"
    :data-theme="theme"
    class="w-full aspect-square bg-(--theme-primary) rounded-2 cursor-pointer"
    @click="onThemeSelect(theme)"
  ></button>
</template>
