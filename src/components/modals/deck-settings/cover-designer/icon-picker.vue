<script setup lang="ts">
import { emitSfx } from '@/sfx/bus'
import UiIcon from '@/components/ui-kit/icon.vue'

type IconPickerProps = {
  icon: string | undefined
}

const { icon } = defineProps<IconPickerProps>()

const emit = defineEmits<{
  (e: 'select', icon: string | undefined): void
}>()

const icons: string[] = [
  'card-deck',
  'book',
  'school-cap',
  'music-note',
  'moon-stars',
  'cable-car',
  'bell',
  'public',
  'id-card',
  'store',
  'teeny-cards'
]

function onIconSelect(value: string | undefined) {
  if (value === icon) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.etc_camera_shutter')
  emit('select', value)
}
</script>

<template>
  <button
    v-for="name in icons"
    :key="name"
    :data-testid="`icon-picker__option-${name}`"
    :data-selected="name === icon || undefined"
    class="w-full aspect-square rounded-2 cursor-pointer bg-brown-200 flex items-center justify-center text-brown-700 [&_svg]:size-6 data-selected:ring-2 data-selected:ring-brown-700 data-selected:bg-brown-300"
    @click="onIconSelect(name)"
  >
    <ui-icon :src="name" />
  </button>

  <button
    data-testid="icon-picker__none"
    :data-selected="icon === undefined || undefined"
    class="w-full aspect-square rounded-2 cursor-pointer bg-brown-200 border-2 border-dashed border-brown-400 flex items-center justify-center text-brown-500 text-xs font-medium"
    @click="onIconSelect(undefined)"
  >
    None
  </button>
</template>
