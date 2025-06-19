<script setup lang="ts">
import HistoryTrack from './history-track.vue'
import StudyCards from './study-cards.vue'
import RatingButtons from './rating-buttons.vue'
import { useStudySession } from '@/composables/useStudySession'
import { type RecordLogItem } from 'ts-fsrs'
import { computed } from 'vue'

defineEmits<{ (e: 'closed'): void }>()
const { open = false, deck } = defineProps<{ open: boolean; deck: Deck }>()

const {
  cards_in_deck,
  current_card_state,
  current_card,
  view_state,
  studied_card_ids,
  failed_card_ids,
  getActiveCardReviewOptions,
  setupStudySession,
  advanceSession,
  setPreviewCard,
  review
} = useStudySession()

const isPreviewingOrRevealed = computed(() => {
  return view_state.value === 'previewing' || current_card_state.value === 'revealed'
})

async function onCardReviewed(item: RecordLogItem) {
  await review(item)
  advanceSession()
}

function onCardRevealed() {
  current_card_state.value = 'revealed'
}
</script>

<template>
  <ui-kit:modal
    :open="open"
    @close="$emit('closed')"
    @opened="setupStudySession(deck.cards)"
    backdrop
  >
    <div
      data-testid="study-modal"
      class="bg-parchment-dark rounded-8 shadow-modal flex h-170 w-268 flex-col items-center overflow-hidden pb-6"
    >
      <div
        data-testid="study-modal__header"
        class="bg-purple-dark pointy-bottom relative flex w-full justify-center bg-(image:--diagonal-stripes)
          bg-(length:--bg-sm) px-13 py-11.5"
      >
        <div data-testid="study-modal__actions" class="absolute top-0 left-0 p-4">
          <ui-kit:button
            icon-left="close"
            variant="muted"
            inverted
            icon-only
            @click="$emit('closed')"
          ></ui-kit:button>
        </div>
        <h1 class="text-3xl text-white">Studying {{ deck?.title }}</h1>
      </div>

      <div
        v-if="open"
        data-testid="study-modal__body"
        class="grid h-full w-full grid-cols-[1fr_auto_1fr] content-center"
      >
        <div data-testid="study-modal__powerup"></div>
        <study-cards :card="current_card" :revealed="isPreviewingOrRevealed" />

        <rating-buttons
          :options="getActiveCardReviewOptions()"
          :show-options="isPreviewingOrRevealed"
          :disabled="view_state !== 'studying'"
          @reviewed="onCardReviewed"
          @revealed="onCardRevealed"
        />
      </div>

      <history-track
        :cards="cards_in_deck"
        :studied-card-ids="studied_card_ids"
        :failed-card-ids="failed_card_ids"
        :current-card="current_card"
        @card-clicked="setPreviewCard"
      />
    </div>
  </ui-kit:modal>
</template>
