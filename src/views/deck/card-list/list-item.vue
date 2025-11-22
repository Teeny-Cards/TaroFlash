<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import { watch } from 'vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { type TextEditorUpdatePayload } from '@/components/text-editor.vue'

const { card, mode, active, active_side } = defineProps<{
  card: Card
  mode: CardEditorMode
  active: boolean
  is_duplicate?: boolean
  active_side: 'front' | 'back'
}>()

const emit = defineEmits<{
  (e: 'selected'): void
  (e: 'deleted'): void
  (e: 'moved'): void
  (e: 'activated'): void
  (e: 'deactivated'): void
  (e: 'updated', id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload): void
  (e: 'side-changed', side: 'front' | 'back'): void
}>()

function onClick() {
  if (mode !== 'select') return
  emit('selected')
}

function onUpdate(id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload) {
  emit('updated', id, side, payload)
}

function activate(e?: Event) {
  const target = e?.target as HTMLTextAreaElement
  const side = target?.dataset['testid'] === 'card-face__text-editor__back' ? 'back' : 'front'

  if (active_side !== side) {
    if (side === 'front') {
      emit('side-changed', 'front')
    } else if (side === 'back') {
      emit('side-changed', 'back')
    }
  }

  if (!active) {
    emit('activated')
  }
}

function deactivate(e?: Event) {
  if (!e) {
    emit('deactivated')
    return
  }

  const target = e.target as HTMLElement

  const is_toolbar = target.closest('[data-testid="md-toolbar"]')
  const is_card = target.closest(`[data-id="${card.id}"]`)

  if (!is_toolbar && !is_card && !target.closest('.options-popover')) {
    emit('deactivated')
  }
}

watch(
  () => active,
  (new_value) => {
    if (new_value) {
      document.addEventListener('click', deactivate)
    } else {
      document.removeEventListener('click', deactivate)
    }
  }
)
</script>

<template>
  <div
    data-testid="card-list__item"
    :data-id="card.id"
    :hover_effect="mode === 'select'"
    class="group"
    :class="{
      'mode-edit': mode === 'edit' && active,
      'mode-select cursor-pointer': mode === 'select',
      'mode-view': mode === 'view',
      duplicate: is_duplicate
    }"
    @click="onClick"
  >
    <div class="flex w-full gap-4 justify-center" :class="{ active }">
      <card
        data-testid="front-input"
        :data-id="card.id"
        side="front"
        size="xl"
        mode="edit"
        class="shadow-cutout"
        :front_delta="card.front_delta"
        :active="active && active_side === 'front'"
        @focusin="activate"
        @focusout="deactivate"
        @update:front="onUpdate(card.id!, 'front', $event)"
      ></card>
      <card
        data-testid="back-input"
        :data-id="card.id"
        side="back"
        size="xl"
        mode="edit"
        class="shadow-cutout"
        :back_delta="card.back_delta"
        :active="active && active_side === 'back'"
        @focusin="activate"
        @focusout="deactivate"
        @update:back="onUpdate(card.id!, 'back', $event)"
      ></card>
    </div>
  </div>
</template>

<style>
.card-list__input {
  border-radius: var(--radius-4);
  width: 100%;
  min-height: 58px;

  padding: 8px 12px;
  overflow: hidden;
  outline: none;
}

.mode-select .card-list__input {
  pointer-events: none;
}

.duplicate .card-list__input {
  color: var(--color-red-500);
}
</style>
