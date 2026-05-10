<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UiSpinbox from '@/components/ui-kit/spinbox.vue'
import AlignPicker from './align-picker.vue'
import { emitSfx } from '@/sfx/bus'

type CardDesignerProps = {
  attributes: CardAttributes
}

const { attributes } = defineProps<CardDesignerProps>()

const { t } = useI18n()

const TEXT_SIZE_DEFAULT = 4

const text_size = computed({
  get: () => (typeof attributes.text_size === 'number' ? attributes.text_size : TEXT_SIZE_DEFAULT),
  set: (value: number) => {
    attributes.text_size = value
    emitSfx('ui.select')
  }
})

const horizontal_alignment = computed({
  get: () => attributes.horizontal_alignment,
  set: (v) => (attributes.horizontal_alignment = v)
})

const vertical_alignment = computed({
  get: () => attributes.vertical_alignment,
  set: (v) => (attributes.vertical_alignment = v)
})
</script>

<template>
  <div
    data-testid="card-designer"
    class="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-3 w-full"
  >
    <span data-testid="card-designer__text-size-label" class="text-sm">
      {{ t('card-designer.text-size-label') }}
    </span>
    <ui-spinbox
      data-testid="card-designer__text-size-spinbox"
      v-model:value="text_size"
      :min="1"
      :max="10"
      :step="1"
      size="lg"
    />

    <span data-testid="card-designer__alignment-label" class="text-sm">
      {{ t('card-designer.alignment-label') }}
    </span>
    <align-picker v-model:horizontal="horizontal_alignment" v-model:vertical="vertical_alignment" />
  </div>
</template>
