<script setup lang="ts">
import { useAudio } from '@/composables/use-audio'

const audio = useAudio()

const { checked } = defineProps<{
  checked: boolean
  intermediate: boolean
}>()

const emit = defineEmits<{
  (e: 'change', checked: boolean): void
}>()

function onClick() {
  audio.play('etc_camera_shutter')
  emit('change', !checked)
}
</script>

<template>
  <div
    data-testid="ui-kit-radio"
    class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-4 border-white
      text-white transition-[all] duration-[50ms]"
    :class="{
      'border-none bg-blue-500 ring-4 ring-white hover:scale-110': checked,
      'bg-white hover:bg-blue-500': !checked
    }"
    @mouseenter="audio.play('click_07')"
    @click="onClick"
  >
    <ui-kit:icon v-if="checked" src="check" />
    <ui-kit:icon v-if="intermediate" src="minus" />
  </div>
</template>
