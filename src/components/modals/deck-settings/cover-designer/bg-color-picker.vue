<script setup lang="ts">
import { computed } from 'vue'
import { emitSfx } from '@/sfx/bus'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiSlider from '@/components/ui-kit/slider.vue'
import PickerPopover from './picker-popover.vue'

type BgColorPickerProps = {
  supported_themes: MemberTheme[]
  bg_color: MemberTheme | undefined
  border_size: number | undefined
}

const { bg_color, border_size } = defineProps<BgColorPickerProps>()

const emit = defineEmits<{
  (e: 'update:bg_color', value: MemberTheme | undefined): void
  (e: 'update:border_size', value: number): void
}>()

const BORDER_SIZE_MIN = 1
const BORDER_SIZE_MAX = 16

const borderSizePercent = computed<number>({
  get: () => {
    if (border_size === undefined) return 25
    return Math.round(((border_size - BORDER_SIZE_MIN) / (BORDER_SIZE_MAX - BORDER_SIZE_MIN)) * 100)
  },
  set: (percent: number) => {
    emit(
      'update:border_size',
      Math.round(BORDER_SIZE_MIN + (percent / 100) * (BORDER_SIZE_MAX - BORDER_SIZE_MIN))
    )
  }
})

function onThemeSelect(theme: MemberTheme) {
  if (theme === bg_color) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.toggle_on')
  emit('update:bg_color', theme)
}
</script>

<template>
  <picker-popover label="BG Color" icon="paint-brush">
    <template #default>
      <button
        v-for="theme in supported_themes"
        :key="theme"
        :data-theme="theme"
        v-sfx.hover="'ui.click_07'"
        class="w-full aspect-square bg-(--theme-primary) rounded-8 rounded-tr-3 cursor-pointer relative! hover:outline-5 outline-white"
        :class="{ 'outline-5 outline-white': bg_color === theme }"
        @click="onThemeSelect(theme)"
      >
        <div
          v-if="bg_color === theme"
          class="absolute -top-2 -right-2 bg-white p-0.5 rounded-full flex items-center justify-center"
        >
          <ui-icon src="check" class="text-(--theme-primary)" />
        </div>
      </button>
    </template>

    <template #extra>
      <div data-testid="bg-color-picker__border" class="flex flex-col gap-2 pt-3">
        <span data-testid="bg-color-picker__border-label" class="text-brown-700 text-sm font-medium"
          >Border</span
        >
        <div data-testid="bg-color-picker__border-slider" class="flex flex-col gap-1.5">
          <ui-slider v-model="borderSizePercent" />
        </div>
      </div>
    </template>
  </picker-popover>
</template>
