<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import ItemOptions from './item-options.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { type TextEditorUpdatePayload } from '@/components/text-editor.vue'
import { nextTick, watch } from 'vue'

const { card, mode, active, active_side } = defineProps<{
  index: number
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
  if (mode === 'select') {
    emit('selected')
  } else if (mode === 'view' || (mode === 'edit' && !active)) {
    emit('activated')
  }
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

  const is_toolbar = target.closest('[data-testid="text-editor-toolbar"]')
  const is_card = target.closest(`[data-id="${card.id}"]`)

  if (!is_toolbar && !is_card && !target.closest('.options-popover')) {
    emit('deactivated')
  }
}

async function focusSide(side: 'front' | 'back') {
  const el = document.querySelector(`[data-id="${card.id}"]`)

  await nextTick()

  if (side === 'front') {
    const input = el?.querySelector('[data-testid="card-face__text-editor__front"]') as HTMLElement
    input?.focus()
  } else if (side === 'back') {
    const input = el?.querySelector('[data-testid="card-face__text-editor__back"]') as HTMLElement
    input?.focus()
  }
}

watch(
  () => active,
  (new_value) => {
    if (new_value) {
      focusSide(active_side)
      document.addEventListener('click', deactivate)
    } else {
      document.removeEventListener('click', deactivate)
    }
  }
)
</script>

<template>
  <div
    data-testid="card-list-item"
    :data-id="card.id"
    :hover_effect="mode === 'select'"
    class="card-list-item"
    :class="{
      'mode-edit': mode === 'edit' && active,
      'mode-select cursor-pointer': mode === 'select',
      'mode-view': mode === 'view',
      duplicate: is_duplicate
    }"
    @click="onClick"
  >
    <div
      class="flex items-center justify-center w-12 h-12 rounded-full text-lg text-brown-900 group cursor-grab"
      :class="{ 'bg-brown-300': !active, 'bg-brown-100': active }"
    >
      <ui-icon
        src="reorder"
        class="group-hover:block"
        :class="{ block: active, hidden: !active }"
      />
      <span class="group-hover:hidden" :class="{ hidden: active }">{{ index + 1 }}</span>
    </div>

    <div class="flex w-full gap-6 justify-center" :class="{ active }">
      <card
        data-testid="front-input"
        ref="front-input"
        :data-id="card.id"
        side="front"
        size="xl"
        mode="edit"
        :front_delta="card.front_delta"
        :active="active && active_side === 'front'"
        @focusin="activate"
        @focusout="deactivate"
        @update:front="onUpdate(card.id!, 'front', $event)"
      ></card>
      <card
        data-testid="back-input"
        ref="back-input"
        :data-id="card.id"
        side="back"
        size="xl"
        mode="edit"
        :back_delta="card.back_delta"
        :active="active && active_side === 'back'"
        @focusin="activate"
        @focusout="deactivate"
        @update:back="onUpdate(card.id!, 'back', $event)"
      ></card>
    </div>

    <item-options
      v-if="active"
      @select="emit('selected')"
      @move="emit('moved')"
      @delete="emit('deleted')"
    />
  </div>
</template>

<style>
.card-list-item {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  justify-items: center;

  width: 100%;
  padding: 24px;
  border-radius: 24px;

  transition: background-color 0.1s ease-in-out;
}
.card-list-item.mode-edit {
  background-color: var(--color-brown-300);
}
.card-list-item:not(.mode-edit):hover {
  background-color: var(--color-brown-200);
}
</style>
