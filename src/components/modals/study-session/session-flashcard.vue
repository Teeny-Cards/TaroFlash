<script setup lang="ts">
import StudyCard from './study-card.vue'
import RatingButtons from './rating-buttons.vue'
import FinishAnimation from './finish-animation.vue'
import { useFlashcardSession } from '@/composables/study-session/flashcard-session'
import { useModalRequestClose } from '@/composables/modal'
import { type Grade } from 'ts-fsrs'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
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

defineExpose({ requestClose })
useModalRequestClose(requestClose)

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
} = useFlashcardSession({ ...deck.study_config, ...config_override })

const study_card_ref = useTemplateRef('study-card')
const loading = ref(true)
const next_card_side = ref<'front' | 'back' | 'cover'>('cover')
const preview_progress = ref(0)
const preview_transition_duration = ref(0)

const preview_style = computed(() => ({
  opacity: preview_progress.value,
  transform: `scale(${0.9 + 0.1 * preview_progress.value})`,
  transition: preview_transition_duration.value
    ? `opacity ${preview_transition_duration.value}s ease-out, transform ${preview_transition_duration.value}s ease-out`
    : 'none'
}))

watch(
  () => next_card.value?.id,
  () => {
    preview_progress.value = 0
    preview_transition_duration.value = 0
  }
)

function onDragProgress(progress: number, duration: number) {
  preview_transition_duration.value = duration
  preview_progress.value = progress
}

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

/** Called by the shell's close button and by the modal backdrop / esc handler. */
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

async function onCardReviewed(grade?: Grade) {
  if (!active_card.value?.id || mode.value !== 'studying') return

  if (next_card.value) {
    next_card_side.value = config.flip_cards ? 'back' : 'front'
    emitSfx('ui.slide_up')

    await new Promise<void>((resolve) => {
      resolveFlip = resolve
    })

    next_card_side.value = 'cover'
  }

  reviewCard(grade)
}
</script>

<template>
  <div
    data-testid="study-session__body"
    :data-theme="deck.cover_config?.bg_color ?? 'purple-500'"
    class="w-full h-full max-h-130 flex flex-col items-center justify-between gap-4 self-center"
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
      <div
        v-if="!loading && next_card"
        data-testid="study-card__preview"
        class="absolute pointer-events-none"
        :style="preview_style"
      >
        <card
          :key="next_card.id"
          size="xl"
          :side="next_card_side"
          v-bind="next_card"
          :cover_config="deck.cover_config"
          :front_attributes="deck.card_attributes?.front"
          :back_attributes="deck.card_attributes?.back"
          @flip-complete="onNextCardFlipped"
        />
      </div>
      <study-card
        v-if="!loading"
        ref="study-card"
        :key="active_card?.id"
        :card="active_card"
        :side="current_card_side"
        :options="active_card?.preview"
        :cover_config="deck.cover_config"
        :front_attributes="deck.card_attributes?.front"
        :back_attributes="deck.card_attributes?.back"
        @started="onStart"
        @side-changed="onSideChanged"
        @reviewed="onCardReviewed"
        @drag-progress="onDragProgress"
      />
      <card
        data-testid="study-card-skeleton"
        side="cover"
        :cover_config="deck.cover_config"
        :front_attributes="deck.card_attributes?.front"
        :back_attributes="deck.card_attributes?.back"
        v-else
        size="xl"
      />
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
