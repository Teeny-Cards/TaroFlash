<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { emitSfx } from '@/sfx/bus'
import UiIcon from '@/components/ui-kit/icon.vue'

const { t } = useI18n()

type IconPickerProps = {
  supported_icons: string[]
  icon: string | undefined
}

const { icon } = defineProps<IconPickerProps>()

const emit = defineEmits<{
  (e: 'update:icon', icon: string | undefined): void
}>()

function onIconSelect(value: string | undefined) {
  if (value === icon) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.toggle_on')
  emit('update:icon', value)
}
</script>

<template>
  <div data-testid="icon-picker-container" class="flex flex-col gap-2.5">
    <h3 data-testid="icon-picker__label" class="text-brown-700 dark:text-brown-100">
      {{ t('deck.settings-modal.cover.icon-picker.label') }}
    </h3>
    <div data-testid="icon-picker" class="grid grid-cols-6 gap-2 pt-3">
      <button
        v-for="name in supported_icons"
        :key="name"
        :data-testid="`icon-picker__option-${name}`"
        :data-selected="name === icon || undefined"
        v-sfx.hover="'ui.click_07'"
        class="w-full aspect-square rounded-4 rounded-tr-2 rounded-bl-2 cursor-pointer bg-brown-100 flex items-center justify-center text-brown-700 [&_svg]:size-6 data-selected:ring-2 ring-brown-700 data-selected:bg-brown-300 hover:bg-brown-300"
        @click="onIconSelect(name)"
      >
        <ui-icon :src="name" />
      </button>

      <button
        data-testid="icon-picker__none"
        :data-selected="icon === undefined || undefined"
        class="w-full aspect-square rounded-4 rounded-tr-2 rounded-bl-2 cursor-pointer bg-brown-200 border-2 border-dashed border-brown-400 flex items-center justify-center text-brown-500 text-xs font-medium"
        @click="onIconSelect(undefined)"
      >
        {{ t('deck.settings-modal.cover.icon-picker.none-option') }}
      </button>
    </div>
  </div>
</template>
