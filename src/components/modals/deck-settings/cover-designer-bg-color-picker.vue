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
  <div class="rounded-6 bg-brown-100 p-4 flex flex-col gap-4 w-60">
    <h3 class="text-brown-700 text-xl text-center">Background Color</h3>

    <div class="grid grid-cols-[1fr_1fr_1fr] gap-1">
      <button
        v-for="theme in supported_themes"
        :key="theme"
        :data-theme="theme"
        class="w-full aspect-square bg-(--theme-primary) rounded-2 cursor-pointer"
        @click="onThemeSelect(theme)"
      ></button>
    </div>
  </div>
</template>
