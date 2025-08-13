<script setup lang="ts">
import HistoryTrack from './history-track.vue'
import StudyCard from './study-card.vue'
import RatingButtons from './rating-buttons.vue'
import { useStudySession } from '@/composables/use-study-session'
import { type RecordLogItem } from 'ts-fsrs'
import { computed, onMounted } from 'vue'

const { deck } = defineProps<{ deck: Deck; close: (response?: boolean) => void }>()

const {
  mode,
  cards,
  current_card_state,
  current_card,
  active_card,
  preview_card,
  pickNextCard,
  setPreviewCard,
  reviewCard,
  setup
} = useStudySession()

onMounted(() => {
  setup(deck.cards)
})

const isPreviewingOrRevealed = computed(() => {
  return mode.value === 'previewing' || current_card_state.value === 'revealed'
})

function onCardReviewed(item: RecordLogItem) {
  if (current_card.value?.id && mode.value === 'studying') {
    reviewCard(item)
    pickNextCard()
  }
}

function onCardRevealed() {
  current_card_state.value = 'revealed'
}
</script>

<template>
  <div
    data-testid="study-modal"
    class="bg-brown-300 rounded-8 shadow-modal flex h-170 w-268 flex-col items-center overflow-hidden pb-6"
  >
    <div
      data-testid="study-modal__header"
      class="pointy-bottom relative flex w-full justify-center bg-purple-500 bg-(image:--diagonal-stripes)
        bg-(length:--bg-sm) px-13 py-11.5"
    >
      <div data-testid="study-modal__actions" class="absolute top-0 left-0 p-4">
        <ui-kit:button
          icon-left="close"
          variant="muted"
          inverted
          icon-only
          @click="close()"
        ></ui-kit:button>
      </div>
      <h1 class="text-5xl text-white">Studying {{ deck?.title }}</h1>
    </div>

    <div
      data-testid="study-modal__body"
      class="grid h-full w-full grid-cols-[1fr_auto_1fr] content-center"
    >
      <div data-testid="study-modal__powerup"></div>
      <study-card
        :card="current_card"
        :revealed="current_card_state === 'revealed'"
        :previewing="mode === 'previewing'"
      />

      <rating-buttons
        :options="current_card?.preview"
        :show-options="isPreviewingOrRevealed"
        :disabled="mode !== 'studying'"
        @reviewed="onCardReviewed"
        @revealed="onCardRevealed"
      />
    </div>

    <history-track
      :cards="cards"
      :mode="mode"
      :active-card="active_card"
      :preview-card="preview_card"
      @card-clicked="setPreviewCard"
    />
  </div>
</template>
