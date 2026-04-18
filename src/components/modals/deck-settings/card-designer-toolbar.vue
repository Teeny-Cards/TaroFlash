<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiIcon from '@/components/ui-kit/icon.vue'
import PickerPopover from './cover-designer/picker-popover.vue'
import { emitSfx } from '@/sfx/bus'

type CardDesignerToolbarProps = {
  attributes: CardAttributes
}

const { attributes } = defineProps<CardDesignerToolbarProps>()

const { t } = useI18n()

type TextSizeOption = NonNullable<CardAttributes['text_size']>
type HAlign = NonNullable<CardAttributes['horizontal_alignment']>
type VAlign = NonNullable<CardAttributes['vertical_alignment']>

const text_size_options: { value: TextSizeOption; label: string }[] = [
  { value: 'small', label: t('deck-view.card-attributes.text-size.small') },
  { value: 'medium', label: t('deck-view.card-attributes.text-size.medium') },
  { value: 'large', label: t('deck-view.card-attributes.text-size.large') },
  { value: 'x-large', label: t('deck-view.card-attributes.text-size.x-large') },
  { value: 'huge', label: t('deck-view.card-attributes.text-size.huge') },
  { value: 'ginormous', label: t('deck-view.card-attributes.text-size.ginormous') }
]

const h_align_options: { value: HAlign; icon: string }[] = [
  { value: 'left', icon: 'align-left' },
  { value: 'center', icon: 'align-center' },
  { value: 'right', icon: 'align-right' }
]

const v_align_options: { value: VAlign; icon: string }[] = [
  { value: 'top', icon: 'align-v-top' },
  { value: 'center', icon: 'align-v-center' },
  { value: 'bottom', icon: 'align-v-bottom' }
]

function onSelectTextSize(value: TextSizeOption) {
  if (attributes.text_size === value) {
    emitSfx('ui.digi_powerdown')
    return
  }
  emitSfx('ui.etc_camera_shutter')
  attributes.text_size = value
}

function onSelectHAlign(value: HAlign) {
  if (attributes.horizontal_alignment === value) {
    emitSfx('ui.digi_powerdown')
    return
  }
  emitSfx('ui.etc_camera_shutter')
  attributes.horizontal_alignment = value
}

function onSelectVAlign(value: VAlign) {
  if (attributes.vertical_alignment === value) {
    emitSfx('ui.digi_powerdown')
    return
  }
  emitSfx('ui.etc_camera_shutter')
  attributes.vertical_alignment = value
}
</script>

<template>
  <div data-testid="card-designer-toolbar" class="flex gap-4">
    <picker-popover :label="t('deck-view.card-attributes.text-size')" icon="text-field">
      <div
        data-testid="card-designer-toolbar__text-size-options"
        class="col-span-4 flex flex-col gap-1"
      >
        <button
          v-for="option in text_size_options"
          :key="option.value"
          data-testid="card-designer-toolbar__text-size-option"
          :data-active="option.value === (attributes.text_size ?? 'large')"
          class="w-full text-left px-3 py-2 rounded-2 cursor-pointer text-brown-700 hover:bg-brown-200 data-[active=true]:bg-(--theme-primary) data-[active=true]:text-(--theme-on-primary)"
          @click="onSelectTextSize(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </picker-popover>

    <picker-popover
      :label="t('deck-view.card-attributes.horizontal-alignment')"
      icon="align-center"
    >
      <div
        data-testid="card-designer-toolbar__h-align-options"
        class="col-span-4 grid grid-cols-3 gap-1"
      >
        <button
          v-for="option in h_align_options"
          :key="option.value"
          data-testid="card-designer-toolbar__h-align-option"
          :data-active="option.value === (attributes.horizontal_alignment ?? 'center')"
          class="aspect-square flex items-center justify-center rounded-2 cursor-pointer text-brown-700 hover:bg-brown-200 data-[active=true]:bg-(--theme-primary) data-[active=true]:text-(--theme-on-primary)"
          @click="onSelectHAlign(option.value)"
        >
          <ui-icon :src="option.icon" />
        </button>
      </div>
    </picker-popover>

    <picker-popover
      :label="t('deck-view.card-attributes.vertical-alignment')"
      icon="align-v-center"
    >
      <div
        data-testid="card-designer-toolbar__v-align-options"
        class="col-span-4 grid grid-cols-3 gap-1"
      >
        <button
          v-for="option in v_align_options"
          :key="option.value"
          data-testid="card-designer-toolbar__v-align-option"
          :data-active="option.value === (attributes.vertical_alignment ?? 'center')"
          class="aspect-square flex items-center justify-center rounded-2 cursor-pointer text-brown-700 hover:bg-brown-200 data-[active=true]:bg-(--theme-primary) data-[active=true]:text-(--theme-on-primary)"
          @click="onSelectVAlign(option.value)"
        >
          <ui-icon :src="option.icon" />
        </button>
      </div>
    </picker-popover>
  </div>
</template>
