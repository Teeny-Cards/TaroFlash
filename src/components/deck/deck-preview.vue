<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/card/index.vue'
import { useCardsInDeckInfiniteQuery } from '@/api/cards'

type DeckPreviewProps = {
  deck_id?: number
  cover: DeckCover
  card_attributes: DeckCardAttributes
  side: CardSide
}

const { deck_id, side } = defineProps<DeckPreviewProps>()

const emit = defineEmits<{
  (e: 'update:side', value: CardSide): void
}>()

const { t } = useI18n()

const cards_query = useCardsInDeckInfiniteQuery(() => deck_id)
const first_card = computed(() => cards_query.data.value?.pages?.[0]?.[0])

const sides = computed(() => [
  { value: 'cover' as const, label: t('deck.settings-modal.designer-tabs.cover') },
  { value: 'front' as const, label: t('deck.settings-modal.designer-tabs.front') },
  { value: 'back' as const, label: t('deck.settings-modal.designer-tabs.back') }
])

const preview_text = computed(() => {
  if (side === 'front') {
    return first_card.value?.front_text || t('deck.settings-modal.preview.front-fallback')
  }
  return first_card.value?.back_text || t('deck.settings-modal.preview.back-fallback')
})

function cycleSide() {
  const index = sides.value.findIndex((s) => s.value === side)
  const next = sides.value[(index + 1) % sides.value.length].value
  emit('update:side', next)
}
</script>

<template>
  <div data-testid="deck-preview">
    <card
      size="xl"
      :side="side"
      :front_text="side === 'front' ? preview_text : undefined"
      :back_text="side === 'back' ? preview_text : undefined"
      :cover_config="cover"
      :card_attributes="card_attributes"
      class="cursor-pointer"
      face_classes="border-t border-l border-brown-100 dark:border-stone-900"
      @click="cycleSide"
    />
  </div>
</template>
