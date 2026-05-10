<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiIcon from '@/components/ui-kit/icon.vue'
import PickerPopover from './cover-designer/picker-popover.vue'
import { emitSfx } from '@/sfx/bus'

type Axis = 'horizontal' | 'vertical'
type AlignValue = 'left' | 'center' | 'right' | 'top' | 'bottom'

type AlignPickerProps = {
  axis: Axis
}

const { axis } = defineProps<AlignPickerProps>()

const value = defineModel<AlignValue | undefined>('value')

const { t } = useI18n()

const OPTIONS: Record<Axis, { value: AlignValue; icon: string }[]> = {
  horizontal: [
    { value: 'left', icon: 'align-left' },
    { value: 'center', icon: 'align-center' },
    { value: 'right', icon: 'align-right' }
  ],
  vertical: [
    { value: 'top', icon: 'align-v-top' },
    { value: 'center', icon: 'align-v-center' },
    { value: 'bottom', icon: 'align-v-bottom' }
  ]
}

const TRIGGER_ICON: Record<Axis, string> = {
  horizontal: 'align-center',
  vertical: 'align-v-center'
}

const TRIGGER_LABEL_KEY: Record<Axis, string> = {
  horizontal: 'deck-view.card-attributes.horizontal-alignment',
  vertical: 'deck-view.card-attributes.vertical-alignment'
}

function onSelect(next: AlignValue) {
  if (next === value.value) {
    emitSfx('ui.digi_powerdown')
    return
  }
  emitSfx('ui.etc_camera_shutter')
  value.value = next
}
</script>

<template>
  <picker-popover :label="t(TRIGGER_LABEL_KEY[axis])" :icon="TRIGGER_ICON[axis]">
    <div :data-testid="`align-picker__${axis}-options`" class="col-span-4 grid grid-cols-3 gap-1">
      <button
        v-for="option in OPTIONS[axis]"
        :key="option.value"
        :data-testid="`align-picker__${axis}-option`"
        :data-active="option.value === (value ?? 'center')"
        class="aspect-square flex items-center justify-center rounded-2 cursor-pointer text-(--theme-on-neutral) hover:bg-(--theme-neutral) data-[active=true]:bg-(--theme-primary) data-[active=true]:text-(--theme-on-primary)"
        @click="onSelect(option.value)"
      >
        <ui-icon :src="option.icon" />
      </button>
    </div>
  </picker-popover>
</template>
