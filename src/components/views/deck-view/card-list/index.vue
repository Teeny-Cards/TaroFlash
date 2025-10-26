<script lang="ts" setup>
import ListItem from './list-item.vue'
import { useI18n } from 'vue-i18n'
import {
  type EditableCardValue,
  type EditableCardKey,
  MAX_INPUT_LENGTH
} from '@/composables/card-bulk-editor'
import { nextTick } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiDivider from '@/components/ui-kit/divider.vue'

const { mode, activeCardId } = defineProps<{
  cards: Card[]
  activeCardId?: number
  selectedCardIds: number[]
  mode: 'edit' | 'view' | 'select'
}>()

const emit = defineEmits<{
  (e: 'card-added'): void
  (e: 'card-activated', id: number): void
  (e: 'card-deactivated', id: number): void
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
  (e: 'card-moved', id: number): void
  (e: 'card-updated', id: number, column: EditableCardKey, value: EditableCardValue): void
}>()

const { t } = useI18n()

function onFocus(e: Event, id: number) {
  const target = e.target as HTMLTextAreaElement

  target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  emit('card-activated', id)
}

function onInput(e: Event, id: number) {
  const target = e.target as HTMLTextAreaElement
  const column = target.dataset['testid'] === 'front-input' ? 'front_text' : 'back_text'

  emit('card-updated', id, column, target.value)
}

async function onDblClick(e: MouseEvent, id: number) {
  if (mode !== 'view') return

  const target = e.target as HTMLDivElement
  const textarea = target.querySelector('[data-testid="front-input"]') as HTMLTextAreaElement

  emit('card-activated', id)
  await nextTick()
  textarea?.focus()
}
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-button icon-left="add" @click="emit('card-added')">Add Card</ui-button>
  </div>

  <div v-else data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :class="`mode-${mode}`"
        :card="card"
        :mode="mode"
        :selected="selectedCardIds.includes(card.id!)"
        @dblclick="onDblClick($event, card.id!)"
        @focusout="emit('card-deactivated', card.id!)"
        @deleted="emit('card-deleted', card.id!)"
        @selected="emit('card-selected', card.id!)"
        @moved="emit('card-moved', card.id!)"
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
            :disabled="mode !== 'edit'"
            @focusin="onFocus($event, card.id!)"
            @input="onInput($event, card.id!)"
            :maxlength="MAX_INPUT_LENGTH"
          ></textarea>

          <textarea
            data-testid="back-input"
            class="card-list__input"
            :placeholder="t('card.placeholder-back')"
            :value="card.back_text"
            :disabled="mode !== 'edit'"
            @focusin="onFocus($event, card.id!)"
            @input="onInput($event, card.id!)"
            :maxlength="MAX_INPUT_LENGTH"
          ></textarea>
        </div>
      </list-item>

      <ui-divider v-if="index < cards.length - 1" dashed />
    </template>
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
  pointer-events: none;
  overflow: hidden;
}

.mode-edit textarea {
  color: var(--color-brown-700);
  pointer-events: auto;
  outline: 2px solid var(--color-brown-300);
  background-color: var(--color-white);
  height: 184px;
}

.active textarea {
  outline: 2px solid var(--color-blue-500);
}
</style>
