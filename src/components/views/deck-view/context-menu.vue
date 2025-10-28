<script lang="ts" setup>
import { type SplitButtonOption } from '@/components/ui-kit/split-button.vue'
import { computed } from 'vue'
import UiSplitButton from '@/components/ui-kit/split-button.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'

const { mode, selectedCardIds, allCardsSelected } = defineProps<{
  mode: CardEditorMode
  selectedCardIds: number[]
  allCardsSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'new-card'): void
  (e: 'import'): void
  (e: 'export'): void
  (e: 'move'): void
  (e: 'delete'): void
  (e: 'save'): void
  (e: 'mode-changed', mode: CardEditorMode): void
  (e: 'select-all'): void
}>()

const view_options: SplitButtonOption[] = [
  {
    label: 'Edit All',
    default: true,
    icon: 'edit',
    action: () => emit('mode-changed', 'edit')
  },
  {
    label: 'Select',
    action: () => emit('mode-changed', 'select')
  },
  {
    label: 'New Card',
    action: () => emit('new-card')
  },
  {
    label: 'Import',
    action: () => emit('import')
  },
  {
    label: 'Export',
    action: () => emit('export')
  }
]

const edit_options: SplitButtonOption[] = [
  {
    label: 'Cancel',
    icon: 'close',
    default: true,
    theme: 'grey',
    action: () => emit('mode-changed', 'view')
  },
  {
    label: 'New',
    icon: 'teeny-cards',
    default: true,
    action: () => emit('new-card')
  },
  {
    label: 'Save',
    icon: 'check',
    default: true,
    action: () => emit('save')
  },
  {
    label: 'Select',
    action: () => emit('mode-changed', 'select')
  }
]

const select_options = computed<SplitButtonOption[]>(() => [
  {
    label: 'Cancel',
    icon: 'close',
    default: true,
    theme: 'grey',
    action: () => emit('mode-changed', 'view')
  },
  {
    label: `Delete (${selectedCardIds.length})`,
    icon: 'delete',
    default: true,
    theme: 'red',
    action: () => emit('delete')
  },
  {
    label: allCardsSelected ? 'Deselect All' : 'Select All',
    icon: allCardsSelected ? 'close' : 'check',
    default: true,
    action: () => emit('select-all')
  },
  {
    label: 'Move',
    icon: 'arrow-forward',
    default: true,
    action: () => emit('move')
  },
  {
    label: 'Edit',
    action: () => emit('mode-changed', 'edit')
  }
])

const options = computed(() => ({
  view: view_options,
  edit: edit_options,
  select: select_options.value,
  'edit-one': view_options
}))

function onOptionClicked(option: SplitButtonOption) {
  option.action?.()
}
</script>

<template>
  <ui-split-button
    :options="options[mode]"
    @option-clicked="onOptionClicked"
    :ring="mode !== 'view' && mode !== 'edit-one'"
  />
</template>
