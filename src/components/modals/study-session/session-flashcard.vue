<script setup lang="ts">
import StudyCard from './study-card.vue'
import RatingButtons from './rating-buttons.vue'
import FinishAnimation from './finish-animation.vue'
import { useFlashcardSession } from '@/composables/study-session/flashcard-session'
import { type Grade, type RecordLogItem } from 'ts-fsrs'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import Card from '@/components/card/index.vue'
import { fetchAllCardsByDeckId } from '@/api/cards'
import { emitSfx } from '@/sfx/bus'

const { deck, config_override } = defineProps<{
  deck: Deck
  config_override?: Partial<DeckConfig>
}>()

const emit = defineEmits<{
  (e: 'closed'): void
  (
    e: 'finished',
    score: number,
    total: number,
    remaining_due: number,
    study_all_used: boolean
  ): void
}>()

const {
  mode,
  cards,
  current_card_side,
  current_index,
  active_card,
  num_correct,
  reviewed_count,
  remaining_due_count,
  is_starting_side,
  config,
  next_card,
  is_cover,
  reviewCard,
  setCards,
  startSession,
  flipCurrentCard
} = useFlashcardSession({ ...deck.config, ...config_override })

const study_card_ref = useTemplateRef('study-card')
const loading = ref(true)
const next_card_side = ref<'front' | 'back' | 'cover'>('cover')

// One-shot promise resolver for the preview-card pre-flip animation.
// Resolved either by the flip-complete event or by onUnmounted as a safety
// fallback so the promise never leaks if the component is torn down mid-animation.
let resolveFlip: (() => void) | null = null

onUnmounted(() => resolveFlip?.())

onMounted(async () => {
  if (!deck.id) {
    emit('closed')
    return
  }

  setCards(await fetchAllCardsByDeckId(deck.id))
  loading.value = false
})

function onSideChanged() {
  emitSfx(is_starting_side.value ? 'ui.transition_up' : 'ui.transition_down')
  flipCurrentCard()
}

/** Called by the shell's close button via the exposed requestClose(). */
function requestClose() {
  if (is_cover.value || reviewed_count.value === 0) {
    emit('closed')
    return
  }

  emit(
    'finished',
    num_correct.value,
    reviewed_count.value,
    remaining_due_count.value,
    config.study_all_cards
  )
}

defineExpose({ requestClose })

function onStart() {
  emitSfx('ui.music_plink_chordyes')
  startSession()
}

/** Triggers the fling animation on the card component; reviewed event follows. */
function onRated(grade: Grade) {
  study_card_ref.value?.rate(grade)
}

function onNextCardFlipped() {
  resolveFlip?.()
  resolveFlip = null
}

async function onCardReviewed(item?: RecordLogItem) {
  if (!active_card.value?.id || mode.value !== 'studying') return

  if (next_card.value) {
    next_card_side.value = config.flip_cards ? 'back' : 'front'
    emitSfx('ui.slide_up')

    await new Promise<void>((resolve) => {
      resolveFlip = resolve
    })

    next_card_side.value = 'cover'
  }

  reviewCard(item)
}
</script>

<template>
  <div
    data-testid="study-session__body"
    class="w-full h-full pt-2 max-h-130 flex flex-col items-center justify-between gap-2 self-center"
    :class="{ 'opacity-0 pointer-events-none': mode !== 'studying' }"
  >
    <div
      data-testid="study-session__counter"
      class="text-brown-700 dark:text-brown-300 text-lg"
      :class="{ invisible: is_cover }"
    >
      {{ current_index + 1 }}<span class="text-sm">/{{ cards.length }}</span>
    </div>

    <div data-testid="study-card__container" class="relative flex items-center justify-center">
      <card
        v-if="!loading && next_card"
        :key="next_card.id"
        size="xl"
        :side="next_card_side"
        v-bind="next_card"
        class="absolute! pointer-events-none"
        @flip-complete="onNextCardFlipped"
      />
      <study-card
        v-if="!loading"
        ref="study-card"
        :key="active_card?.id"
        :card="active_card"
        :side="current_card_side"
        :options="active_card?.preview"
        @started="onStart"
        @side-changed="onSideChanged"
        @reviewed="onCardReviewed"
      />
      <card data-testid="study-card-skeleton" side="cover" v-else size="xl" />
    </div>

    <rating-buttons
      class="z-10 mt-4"
      :options="active_card?.preview"
      :side="current_card_side"
      @started="onStart"
      @rated="onRated"
      @revealed="onSideChanged"
    />
  </div>

  <finish-animation
    v-if="mode === 'completed'"
    @done="emit('finished', num_correct, cards.length, remaining_due_count, config.study_all_cards)"
  />
</template>
