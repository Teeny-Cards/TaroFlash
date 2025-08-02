<script lang="ts" setup>
import ListItem from './list-item.vue'
import { useI18n } from 'vue-i18n'
import { useSelection } from '@/composables/use-selection'

const MAX_INPUT_LENGTH = 400

const { cards } = defineProps<{ cards: Card[]; editing: boolean }>()
const emit = defineEmits<{
  (e: 'updated', id: number, prop: 'front_text' | 'back_text', value: string): void
  (e: 'add-card'): void
  (e: 'cards-deleted', ids: number[]): void
}>()

const { t } = useI18n()

const { current_card_index, setCurrentCard, setCurrentColumn, selectCard } = useSelection(cards)

function onDeleteCard(id?: number) {
  if (!id) return

  emit('cards-deleted', [id])
}

function onFocus(e: Event, index: number) {
  const target = e.target as HTMLTextAreaElement
  const column = target.dataset['testid'] === 'front-input' ? 'front' : 'back'

  target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setCurrentCard(index)
  setCurrentColumn(column)
}

function onInput(e: Event, id?: number) {
  if (!id) return

  const target = e.target as HTMLTextAreaElement
  const column = target.dataset['testid'] === 'front-input' ? 'front_text' : 'back_text'

  if (target.value.length > MAX_INPUT_LENGTH) {
    target.value = target.value.slice(0, MAX_INPUT_LENGTH)
  }

  emit('updated', id, column, target.value)
}
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-kit:button icon-left="add" @click="emit('add-card')">Add Card</ui-kit:button>
  </div>

  <div v-else data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :card="card"
        :editing="editing"
        @deleted="onDeleteCard"
        @focusout="setCurrentCard"
        @selected="selectCard"
      >
        <div
          class="flex w-full gap-4"
          :class="{ editing: current_card_index === index, 'edit-mode': editing }"
        >
          <textarea
            data-testid="front-input"
            :placeholder="t('card.placeholder-front')"
            :value="card.front_text"
            :disabled="!editing"
            @focusin="onFocus($event, index)"
            @input="onInput($event, card.id)"
          ></textarea>

          <textarea
            data-testid="back-input"
            :placeholder="t('card.placeholder-back')"
            :value="card.back_text"
            :disabled="!editing"
            @focusin="onFocus($event, index)"
            @input="onInput($event, card.id)"
          ></textarea>
        </div>
      </list-item>

      <ui-kit:divider v-if="index < cards.length - 1" dashed />
    </template>

    <ui-kit:button
      data-testid="card-list__add-card-button"
      icon-only
      icon-left="add"
      class="absolute top-3 -right-12"
      @click="emit('add-card')"
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
</style>
