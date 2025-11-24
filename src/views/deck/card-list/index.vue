<script lang="ts" setup>
import ListItem from './list-item.vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { nextTick, onMounted, ref } from 'vue'
import { useShortcuts } from '@/composables/use-shortcuts'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'

const { mode, activeCardId, cards } = defineProps<{
  cards: Card[]
  activeCardId?: number
  selectedCardIds: number[]
  mode: CardEditorMode
}>()

const emit = defineEmits<{
  (e: 'card-added'): void
  (e: 'card-activated', id: number): void
  (e: 'card-deactivated', id: number): void
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
  (e: 'card-moved', id: number): void
  (e: 'card-updated', id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload): void
  (e: 'card-deactivated'): void
}>()

const { t } = useI18n()
const { registerShortcut } = useShortcuts('card-list')

const active_side = ref<'front' | 'back'>('front')

onMounted(() => {
  registerShortcut([
    {
      id: 'tab-card',
      combo: 'tab',
      description: 'Tab to Next Card',
      handler: () => onTab(false),
      when: () => activeCardId !== undefined
    },
    {
      id: 'tab-card',
      combo: 'shift+tab',
      description: 'Tab to Previous Card',
      handler: () => onTab(true),
      when: () => activeCardId !== undefined
    }
  ])
})

async function onTab(is_going_back: boolean) {
  if (active_side.value === 'front' && !is_going_back) return
  if (active_side.value === 'back' && is_going_back) return

  const active_card_index = cards.findIndex((card) => card.id === activeCardId)
  const next_card_index = is_going_back ? active_card_index - 1 : active_card_index + 1

  if (next_card_index < 0 || next_card_index >= cards.length) {
    emit('card-added')
    await nextTick()
  }

  const next_card = cards[next_card_index]
  if (!next_card.id) return

  emit('card-activated', next_card.id)

  await nextTick()

  active_side.value = is_going_back ? 'back' : 'front'
  const next_card_element = document.getElementById(`card-${next_card.id}`)
  const next_card_input = next_card_element?.querySelector(
    `[data-testid="${active_side.value}-input"]`
  ) as HTMLTextAreaElement

  next_card_input?.focus()
  next_card_input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function onCardUpdated(id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload) {
  emit('card-updated', id, side, payload)
}

function onSideChanged(side: 'front' | 'back') {
  active_side.value = side
}

function isDuplicate(card: Card) {
  const non_empty_cards = cards.filter((c) => c.front_text !== '' || c.back_text !== '')

  return (
    non_empty_cards.filter(
      (c) => c.front_text === card.front_text || c.back_text === card.back_text
    ).length > 1
  )
}
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

  <div v-else data-testid="card-list" class="relative flex pt-4 w-full flex-col items-center">
    <list-item
      v-for="(card, index) in cards"
      :key="card.id"
      :id="`card-${card.id}`"
      :index="index"
      :card="card"
      :mode="mode"
      :selected="selectedCardIds.includes(card.id!)"
      :active="activeCardId === card.id"
      :is_duplicate="isDuplicate(card)"
      :active_side="active_side"
      @deleted="emit('card-deleted', card.id!)"
      @selected="emit('card-selected', card.id!)"
      @moved="emit('card-moved', card.id!)"
      @activated="emit('card-activated', card.id!)"
      @deactivated="emit('card-deactivated')"
      @updated="onCardUpdated"
      @side-changed="onSideChanged"
    />

    <div class="w-full flex justify-center p-4">
      <ui-button v-if="mode !== 'select'" icon-left="add" class="mt-4" @click="emit('card-added')">
        {{ t('deck-view.add-card') }}
      </ui-button>
    </div>

    <slot></slot>
  </div>
</template>
