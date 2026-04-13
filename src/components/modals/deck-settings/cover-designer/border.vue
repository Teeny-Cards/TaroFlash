<script setup lang="ts">
import { emitSfx } from '@/sfx/bus'

type BorderProps = {
  supported_themes: MemberTheme[]
  border_color: MemberTheme | undefined
  border_size: number | undefined
  bg_color: MemberTheme | undefined
}

const { supported_themes, border_color, border_size, bg_color } = defineProps<BorderProps>()

const emit = defineEmits<{
  (e: 'select', theme: MemberTheme | undefined): void
}>()

function onThemeSelect(theme: MemberTheme | undefined) {
  if (theme === border_color) {
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
    :data-selected="theme === border_color || undefined"
    :style="{
      borderWidth: `${border_size ?? 4}px`,
      backgroundColor: bg_color ? `var(--color-${bg_color})` : undefined
    }"
    class="w-full aspect-square rounded-2 cursor-pointer bg-transparent border-solid border-(--theme-primary)"
    @click="onThemeSelect(theme)"
  ></button>

  <button
    data-testid="border__none"
    :data-selected="border_color === undefined || undefined"
    class="w-full aspect-square rounded-2 cursor-pointer bg-brown-200 border-2 border-dashed border-brown-400 flex items-center justify-center text-brown-500 text-xs font-medium"
    @click="onThemeSelect(undefined)"
  >
    None
  </button>
</template>
