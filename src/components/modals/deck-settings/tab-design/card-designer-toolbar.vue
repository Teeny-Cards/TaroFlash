<script setup lang="ts">
import { computed } from 'vue'
import UiSpinbox from '@/components/ui-kit/spinbox.vue'
import AlignPicker from './align-picker.vue'
import { emitSfx } from '@/sfx/bus'

type CardDesignerToolbarProps = {
  attributes: CardAttributes
}

const { attributes } = defineProps<CardDesignerToolbarProps>()

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
  <div data-testid="card-designer-toolbar" class="flex gap-4">
    <ui-spinbox
      data-testid="card-designer-toolbar__text-size-spinbox"
      v-model:value="text_size"
      :min="1"
      :max="10"
      :step="1"
      size="lg"
    />

    <align-picker axis="horizontal" v-model:value="horizontal_alignment" />
    <align-picker axis="vertical" v-model:value="vertical_alignment" />
  </div>
</template>
