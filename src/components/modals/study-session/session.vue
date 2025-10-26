<script setup lang="ts">
import HistoryTrack from './history-track.vue'
import StudyCard from './study-card.vue'
import RatingButtons from './rating-buttons.vue'
import { useStudySession } from '@/composables/study-session'
import { useDeckEditor } from '@/composables/deck-editor'
import { type RecordLogItem } from 'ts-fsrs'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'

const { deck } = defineProps<{ deck: Deck }>()
const emit = defineEmits<{
  (e: 'closed', response?: boolean): void
  (e: 'finished', score: number, total: number): void
}>()

const { t } = useI18n()
const { image_url } = useDeckEditor(deck)

const {
  mode,
  cards,
  current_card_state,
  current_card,
  active_card,
  preview_card,
  num_correct,
  pickNextCard,
  setPreviewCard,
  reviewCard,
  setup
} = useStudySession(deck.config)

onMounted(async () => {
  if (!deck.id) {
    emit('closed')
    return
  }

  await setup(deck.id!)
})

const isPreviewingOrRevealed = computed(() => {
  return mode.value === 'previewing' || current_card_state.value === 'revealed'
})

function onCardReviewed(item: RecordLogItem) {
  if (current_card.value?.id && mode.value === 'studying') {
    reviewCard(item)
    pickNextCard()
  }

  if (mode.value === 'completed') {
    emit('finished', num_correct.value, cards.value.length)
  }
}

function onCardRevealed() {
  current_card_state.value = 'revealed'
}
</script>

<template>
  <div
    data-testid="study-session"
    :data-mode="mode"
    class="bg-brown-300 rounded-8 shadow-modal flex h-170 w-268 flex-col items-center overflow-hidden pb-6"
  >
    <div
      data-testid="study-session__header"
      class="pointy-bottom relative flex w-full justify-center bg-purple-500 bg-(image:--diagonal-stripes)
        bg-(length:--bg-sm) px-13 py-11.5"
    >
      <div data-testid="study-session__actions" class="absolute top-0 left-0 p-4">
        <ui-button
          icon-left="close"
          variant="muted"
          inverted
          icon-only
          @click="emit('closed')"
        ></ui-button>
      </div>
      <h1 class="text-5xl text-white">{{ t('study-session.title', { deck: deck?.title }) }}</h1>
    </div>

    <div
      data-testid="study-session__body"
      class="grid h-full w-full grid-cols-[1fr_auto_1fr] content-center"
    >
      <div data-testid="study-session__powerup"></div>
      <study-card
        :card="current_card"
        :image_url="image_url"
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
