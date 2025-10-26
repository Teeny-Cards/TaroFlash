<script setup lang="ts">
import { useAudio } from '@/composables/audio'
import UiIcon from '@/components/ui-kit/icon.vue'

const audio = useAudio()

const { checked } = defineProps<{
  checked: boolean
  intermediate?: boolean
}>()

function onClick() {
  audio.play('etc_camera_shutter')
}
</script>

<template>
  <div
    data-testid="ui-kit-radio"
    class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white
      transition-[all] duration-[50ms]"
    :class="{
      'border-none bg-blue-500 ring-4 ring-white hover:scale-110': checked,
      'border-2 border-blue-500 bg-white hover:border-4 hover:border-white hover:bg-blue-500':
        !checked
    }"
    @mouseenter="audio.play('click_07')"
    @click="onClick"
  >
    <ui-icon v-if="checked" src="check" />
    <ui-icon v-if="intermediate" src="minus" />
  </div>
</template>
