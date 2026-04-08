<script setup lang="ts">
import StudyCard from './study-card.vue'
import RatingButtons from './rating-buttons.vue'
import { useStudySession } from '@/composables/study-session'
import { type RecordLogItem } from 'ts-fsrs'
import { onMounted, ref } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import Card from '@/components/card/index.vue'
import { fetchAllCardsByDeckId } from '@/api/cards'

const { deck } = defineProps<{ deck: Deck }>()
const emit = defineEmits<{
  (e: 'closed', response?: boolean): void
  (e: 'finished', score: number, total: number): void
}>()

const {
  mode,
  cards,
  current_card_side,
  current_index,
  active_card,
  num_correct,
  reviewCard,
  setCards
} = useStudySession(deck.config)

const loading = ref(true)

onMounted(async () => {
  if (!deck.id) {
    emit('closed')
    return
  }

  await setup(deck.id!)
  loading.value = false
})

async function setup(deck_id: number) {
  let cards = await fetchAllCardsByDeckId(deck_id)
  setCards(cards)
}

function onCardReviewed(item: RecordLogItem) {
  if (!active_card.value?.id || mode.value !== 'studying') return

  reviewCard(item)

  emit('finished', num_correct.value, cards.value.length)
}
</script>

<template>
  <div class="flex flex-col gap-6 items-center justify-between w-full h-full" :data-mode="mode">
    <div
      data-testid="study-session__header"
      class="relative flex w-full justify-center bg-purple-500 wave-bottom-[50px] bgx-diagonal-stripes bgx-size-20 bg-center px-13 py-11.5 pb-14 z-10"
    >
      <div data-testid="study-session__actions" class="absolute top-0 left-0 p-4">
        <ui-button
          icon-left="close"
          theme="purple-500"
          inverted
          icon-only
          @click="emit('closed')"
        ></ui-button>
      </div>
      <h1 class="text-5xl text-white">{{ deck?.title }}</h1>
    </div>

    <div
      data-testid="study-session__body"
      class="w-full h-full flex flex-col items-center justify-center gap-6"
    >
      <div class="text-brown-700 text-lg">
        {{ current_index + 1 }}<span class="text-sm">/{{ cards.length }}</span>
      </div>

      <study-card
        v-if="!loading"
        :card="active_card"
        :side="current_card_side"
        :options="active_card?.preview"
        @side-changed="(side) => (current_card_side = side)"
        @reviewed="onCardReviewed"
      />
      <card v-else size="xl" />

      <rating-buttons
        class="z-10 mt-4"
        :options="active_card?.preview"
        :show-options="current_card_side === 'back'"
        :disabled="mode !== 'studying'"
        @reviewed="onCardReviewed"
        @revealed="current_card_side = 'back'"
      />
    </div>
  </div>
</template>
