<script setup lang="ts">
import { useAudio } from '@/composables/audio'
import UiIcon from '@/components/ui-kit/icon.vue'

defineProps<{
  color: string
}>()

const emit = defineEmits<{
  (e: 'select', color: string): void
}>()

const audio = useAudio()

const theme_map: { [key: string]: MemberTheme } = {
  green: 'green-400',
  blue: 'blue-500',
  purple: 'purple-500',
  pink: 'pink-500',
  red: 'red-500',
  orange: 'orange-500'
}
</script>

<template>
  <div
    data-testid="md-toolbar__color-selector"
    class="grid grid-cols-3 gap-3 bg-brown-300 rounded-6 p-4"
  >
    <div
      v-for="(theme, color) in theme_map"
      :key="theme"
      class="ring-brown-100 relative h-8.5 w-8.5 cursor-pointer rounded-full ring-4 transition-all duration-75
        hover:scale-110"
      :class="`bg-${theme} text-${theme}`"
      @mouseenter="audio.play('click_04')"
      @click="emit('select', color as string)"
    >
      <ui-icon
        src="check"
        v-if="theme === color"
        class="ring-brown-100 bg-brown-100 absolute -top-1.5 -right-1.5 rounded-full ring-2"
      ></ui-icon>
    </div>
  </div>
</template>
