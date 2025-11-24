<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import ItemOptions from './item-options.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

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

function activate(side: 'front' | 'back') {
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

function deactivate(e: Event) {
  const target = e.target as HTMLElement

  const is_toolbar = target.closest('[data-testid="text-editor-toolbar"]')
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
        v-bind="card"
        :active="active && active_side === 'front'"
        :placeholder="t('card.placeholder-front')"
        @focus="activate('front')"
        @update:front="onUpdate(card.id!, 'front', $event)"
      ></card>
      <card
        data-testid="back-input"
        ref="back-input"
        :data-id="card.id"
        side="back"
        size="xl"
        mode="edit"
        v-bind="card"
        :active="active && active_side === 'back'"
        :placeholder="t('card.placeholder-back')"
        @focus="activate('back')"
        @update:back="onUpdate(card.id!, 'back', $event)"
      ></card>
    </div>

    <item-options
      v-if="active"
      @select="emit('selected')"
      @move="emit('moved')"
      @delete="emit('deleted')"
    />

    <ui-button
      v-if="active"
      icon-left="add"
      icon-only
      theme="brown"
      size="xs"
      class="absolute! -top-4 z-1 [&>.btn-icon]:text-brown-500!"
    />
    <ui-button
      v-if="active"
      icon-left="add"
      icon-only
      theme="brown"
      size="xs"
      class="absolute! -bottom-4 z-1 [&>.btn-icon]:text-brown-500!"
    />
  </div>
</template>

<style>
.card-list-item {
  position: relative;

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
