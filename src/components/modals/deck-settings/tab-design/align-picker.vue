<script setup lang="ts">
import { emitSfx } from '@/sfx/bus'

type Horizontal = 'left' | 'center' | 'right'
type Vertical = 'top' | 'center' | 'bottom'

const horizontal = defineModel<Horizontal | undefined>('horizontal')
const vertical = defineModel<Vertical | undefined>('vertical')

const HORIZONTALS: Horizontal[] = ['left', 'center', 'right']
const VERTICALS: Vertical[] = ['top', 'center', 'bottom']

const DOT_POSITION: Record<Vertical, Record<Horizontal, string>> = {
  top: { left: 'top-1 left-1', center: 'top-1 left-1/2 -translate-x-1/2', right: 'top-1 right-1' },
  center: {
    left: 'top-1/2 left-1 -translate-y-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'top-1/2 right-1 -translate-y-1/2'
  },
  bottom: {
    left: 'bottom-1 left-1',
    center: 'bottom-1 left-1/2 -translate-x-1/2',
    right: 'bottom-1 right-1'
  }
}

function isActive(h: Horizontal, v: Vertical) {
  return (horizontal.value ?? 'center') === h && (vertical.value ?? 'center') === v
}

function onSelect(h: Horizontal, v: Vertical) {
  if (isActive(h, v)) {
    emitSfx('ui.digi_powerdown')
    return
  }
  emitSfx('ui.etc_camera_shutter')
  horizontal.value = h
  vertical.value = v
}
</script>

<template>
  <div data-testid="align-picker" class="grid grid-cols-3 gap-1 w-24">
    <template v-for="v in VERTICALS" :key="v">
      <button
        v-for="h in HORIZONTALS"
        :key="`${h}-${v}`"
        :data-testid="`align-picker__cell-${h}-${v}`"
        :data-active="isActive(h, v)"
        class="relative aspect-square rounded-2 cursor-pointer bg-(--theme-neutral)/30 hover:bg-(--theme-neutral) data-[active=true]:bg-(--theme-primary)"
        @click="onSelect(h, v)"
      >
        <span
          :class="DOT_POSITION[v][h]"
          class="absolute size-1.5 rounded-full bg-(--theme-on-neutral) in-data-[active=true]:bg-(--theme-on-primary)"
        ></span>
      </button>
    </template>
  </div>
</template>
