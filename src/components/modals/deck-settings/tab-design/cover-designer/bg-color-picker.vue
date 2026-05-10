<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { emitSfx } from '@/sfx/bus'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiSlider from '@/components/ui-kit/slider.vue'
import PickerPopover from './picker-popover.vue'

const { t } = useI18n()

type BgColorPickerProps = {
  supported_themes: DeckTheme[]
  bg_color: Theme | undefined
  bg_color_dark: Theme | undefined
  border_size: number | undefined
}

const { bg_color, bg_color_dark, border_size } = defineProps<BgColorPickerProps>()

const emit = defineEmits<{
  (e: 'update:bg_color', value: Theme | undefined): void
  (e: 'update:bg_color_dark', value: Theme | undefined): void
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

function isSelected(option: DeckTheme) {
  return option.light === bg_color && (option.dark ?? null) === (bg_color_dark ?? null)
}

function onThemeSelect(option: DeckTheme) {
  if (isSelected(option)) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.toggle_on')
  emit('update:bg_color', option.light)
  emit('update:bg_color_dark', option.dark)
}
</script>

<template>
  <div data-testid="bg-color-picker-container" class="flex flex-col gap-2.5">
    <h3 data-testid="bg-colo-picker__label" class="text-brown-700 dark:text-brown-100">
      {{ t('deck.settings-modal.cover.bg-color') }}
    </h3>
    <div data-testid="bg-color-picker" class="w-full flex gap-3 pt-3">
      <button
        v-for="option in supported_themes"
        :key="`${option.light}:${option.dark ?? option.light}`"
        :data-testid="`bg-color-picker__option-${option.light}`"
        :data-theme="option.light"
        :data-theme-dark="option.dark"
        v-sfx.hover="'ui.click_07'"
        class="w-9 aspect-square bg-(--theme-primary) rounded-8 rounded-tr-3 cursor-pointer relative! hover:outline-5 outline-white"
        :class="{ 'outline-5 outline-white': isSelected(option) }"
        @click="onThemeSelect(option)"
      >
        <div
          v-if="isSelected(option)"
          class="absolute -top-2 -right-2 bg-white p-0.5 rounded-full flex items-center justify-center"
        >
          <ui-icon src="check" class="text-(--theme-primary)" />
        </div>
      </button>
    </div>
  </div>
</template>
