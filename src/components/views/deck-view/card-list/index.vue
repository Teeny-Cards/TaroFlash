<script lang="ts" setup>
import ListItem from './list-item.vue'
import { useI18n } from 'vue-i18n'
import { type EditableCardValue, type EditableCardKey } from '@/composables/use-card-editor'

const MAX_INPUT_LENGTH = 400

defineProps<{
  cards: Card[]
  activeCardId?: number
  selectedCardIds: number[]
  mode: 'edit' | 'view' | 'select'
}>()

const emit = defineEmits<{
  (e: 'card-added'): void
  (e: 'card-activated', id?: number): void
  (e: 'card-selected', id?: number): void
  (e: 'card-deleted', id?: number): void
  (e: 'card-updated', id: number, column: EditableCardKey, value: EditableCardValue): void
}>()

const { t } = useI18n()

function onFocus(e: Event, id?: number) {
  const target = e.target as HTMLTextAreaElement

  target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  emit('card-activated', id)
}

function onInput(e: Event, id?: number) {
  if (!id) return

  const target = e.target as HTMLTextAreaElement
  const column = target.dataset['testid'] === 'front-input' ? 'front_text' : 'back_text'

  if (target.value.length > MAX_INPUT_LENGTH) {
    target.value = target.value.slice(0, MAX_INPUT_LENGTH)
  }

  emit('card-updated', id, column, target.value)
}
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-kit:button icon-left="add" @click="emit('card-added')">Add Card</ui-kit:button>
  </div>

  <div v-else data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :card="card"
        :mode="mode"
        :selected="selectedCardIds.includes(card.id ?? -1)"
        @focusout="emit('card-activated')"
        @deleted="emit('card-deleted', card.id)"
        @selected="emit('card-selected', card.id)"
      >
        <div
          class="flex w-full gap-4"
          :class="{
            editing: activeCardId === card.id,
            'edit-mode': mode === 'edit',
            'select-mode': mode === 'select'
          }"
        >
          <textarea
            data-testid="front-input"
            :placeholder="t('card.placeholder-front')"
            :value="card.front_text"
            :disabled="mode !== 'edit'"
            @focusin="onFocus($event, card.id)"
            @input="onInput($event, card.id)"
          ></textarea>

          <textarea
            data-testid="back-input"
            :placeholder="t('card.placeholder-back')"
            :value="card.back_text"
            :disabled="mode !== 'edit'"
            @focusin="onFocus($event, card.id)"
            @input="onInput($event, card.id)"
          ></textarea>
        </div>
      </list-item>

      <ui-kit:divider v-if="index < cards.length - 1" dashed />
    </template>

    <ui-kit:button
      v-if="mode === 'edit'"
      data-testid="card-list__card-added-button"
      icon-only
      icon-left="add"
      class="absolute top-3 -right-12"
      @click="emit('card-added')"
    />
  </div>
</template>

<style>
@reference '@/styles/main.css';

textarea {
  @apply text-grey-700 focus:outline-none;
  @apply transition-all duration-100;
  @apply rounded-4 h-14.5 w-full resize-none px-3 py-2;
  @apply overflow-hidden;
}

.edit-mode textarea {
  @apply ring-brown-300 bg-white ring-2;
}

.editing textarea {
  @apply h-46 ring-blue-500 group-hover:bg-white;
}

.select-mode textarea {
  @apply pointer-events-none;
}
</style>
