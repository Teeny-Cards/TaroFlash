<script lang="ts" setup>
import ListItem from './list-item.vue'
import { useI18n } from 'vue-i18n'
import {
  type EditableCardValue,
  type EditableCardKey,
  MAX_INPUT_LENGTH
} from '@/composables/card-bulk-editor'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiDivider from '@/components/ui-kit/divider.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'

const { mode, activeCardId, cards } = defineProps<{
  cards: Card[]
  activeCardId?: number
  selectedCardIds: number[]
  mode: CardEditorMode
}>()

const emit = defineEmits<{
  (e: 'card-added'): void
  (e: 'card-activated', id: number): void
  (e: 'next-card-activated'): void
  (e: 'card-deactivated', id: number): void
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
  (e: 'card-moved', id: number): void
  (e: 'card-updated', id: number, column: EditableCardKey, value: EditableCardValue): void
}>()

const { t } = useI18n()

const card_list = useTemplateRef('card-list')

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

async function onKeydown(e: KeyboardEvent) {
  if (e.shiftKey && e.key === 'Enter') {
    e.preventDefault()
    emit('next-card-activated')
  }
}

function onInput(e: Event, id: number) {
  const target = e.target as HTMLTextAreaElement
  const column = target.dataset['testid'] === 'front-input' ? 'front_text' : 'back_text'

  emit('card-updated', id, column, target.value)
}

watch(
  () => mode,
  (new_mode, old_mode) => {
    if (!activeCardId || (new_mode === 'edit' && old_mode !== 'edit')) return

    const active_card = card_list.value?.querySelector(`#card-${activeCardId}`)
    active_card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
)
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-button icon-left="add" @click="emit('card-added')">
      {{ t('deck-view.add-card') }}
    </ui-button>
  </div>

  <div v-else ref="card-list" data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :id="`card-${card.id}`"
        :class="{
          'mode-edit': mode === 'edit' || (mode === 'edit-one' && activeCardId === card.id),
          'mode-select': mode === 'select',
          'mode-view': mode === 'view'
        }"
        :card="card"
        :mode="mode"
        :selected="selectedCardIds.includes(card.id!)"
        @focusout="emit('card-deactivated', card.id!)"
        @deleted="emit('card-deleted', card.id!)"
        @selected="emit('card-selected', card.id!)"
        @moved="emit('card-moved', card.id!)"
        @activated="emit('card-activated', card.id!)"
      >
        <div
          class="flex w-full gap-4"
          :class="{
            active: activeCardId === card.id
          }"
        >
          <textarea
            data-testid="front-input"
            class="card-list__input"
            :placeholder="t('card.placeholder-front')"
            :value="card.front_text"
            :disabled="mode !== 'edit' && mode !== 'edit-one'"
            @focusin="emit('card-activated', card.id!)"
            @input="onInput($event, card.id!)"
            :maxlength="MAX_INPUT_LENGTH"
          ></textarea>

          <textarea
            data-testid="back-input"
            class="card-list__input"
            :placeholder="t('card.placeholder-back')"
            :value="card.back_text"
            :disabled="mode !== 'edit' && mode !== 'edit-one'"
            @focusin="emit('card-activated', card.id!)"
            @input="onInput($event, card.id!)"
            :maxlength="MAX_INPUT_LENGTH"
          ></textarea>
        </div>
      </list-item>

      <ui-divider v-if="index < cards.length - 1" dashed />
    </template>

    <div class="w-full flex justify-center p-4">
      <ui-button v-if="mode === 'edit'" icon-left="add" class="mt-4" @click="emit('card-added')">
        {{ t('deck-view.add-card') }}
      </ui-button>
    </div>
  </div>
</template>

<style>
.card-list__input {
  transition: height 100ms ease-in-out;

  border-radius: var(--radius-4);
  width: 100%;
  height: 58px;
  resize: none;

  padding: 8px 12px;
  overflow: hidden;
}

.mode-edit textarea {
  color: var(--color-brown-700);
  outline: 2px solid var(--color-brown-300);
  background-color: var(--color-white);
  height: 260px;
}

.mode-select .card-list__input {
  pointer-events: none;
}

.active textarea {
  outline: 2px solid var(--color-blue-500);
}
</style>
