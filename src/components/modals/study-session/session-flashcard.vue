<script setup lang="ts">
import StudyCard from './study-card.vue'
import StudyCardEdit from './study-card-edit.vue'
import RatingButtons from './rating-buttons.vue'
import FinishAnimation from './finish-animation.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
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
const editing = ref(false)
const saving = ref(false)

watch(
  () => active_card.value?.id,
  () => {
    editing.value = false
  }
)

async function onEditUpdate(side: 'front' | 'back', text: string) {
  const card = active_card.value
  if (!card) return

  saving.value = true
  await card.update({ [`${side}_text`]: text })
  saving.value = false
}

function onEditStart() {
  if (current_card_side.value === 'cover' || !active_card.value) return
  editing.value = true
}

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
      class="text-brown-700 dark:text-brown-300 text-lg flex items-center gap-1"
      :class="{ invisible: is_cover }"
    >
      <template v-if="editing">
        <ui-icon :src="saving ? 'loading-dots' : 'check'" class="h-5 w-5" />
        <span data-testid="study-session__save-status" class="text-sm">
          {{ saving ? $t('common.saving') : $t('common.saved') }}
        </span>
      </template>
      <template v-else>
        {{ current_index + 1 }}<span class="text-sm">/{{ cards.length }}</span>
      </template>
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
        v-if="!loading && !editing"
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
      <study-card-edit
        v-else-if="!loading && editing && active_card"
        :card="active_card"
        :side="current_card_side === 'back' ? 'back' : 'front'"
        :front_attributes="deck.card_attributes?.front"
        :back_attributes="deck.card_attributes?.back"
        @update="onEditUpdate"
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

      <ui-button
        v-if="!loading && !editing && !is_cover"
        data-testid="study-session__edit"
        class="absolute! -top-2 -right-2 z-20"
        icon-only
        rounded-full
        size="lg"
        inverted
        icon-left="edit"
        :sfx="{ click: 'ui.pop_window' }"
        @click="onEditStart"
      >
        {{ $t('study-session.edit.open') }}
      </ui-button>
    </div>

    <rating-buttons
      v-if="!editing"
      class="z-10 mt-4"
      :options="active_card?.preview"
      :side="current_card_side"
      @started="onStart"
      @rated="onRated"
      @revealed="onSideChanged"
    />

    <div
      v-if="editing"
      data-testid="study-card-edit__actions"
      class="z-10 mt-4 flex justify-center gap-2 text-2xl"
    >
      <button
        data-testid="study-card-edit__flip"
        v-sfx="{ click: is_starting_side ? 'ui.transition_up' : 'ui.transition_down' }"
        class="text-brown-700 cursor-pointer rounded-full bg-white px-13 py-4 hover:-translate-0.5 hover:shadow-sm transition-all duration-50"
        @click="flipCurrentCard"
      >
        {{ $t('study.flip') }}
      </button>
      <button
        data-testid="study-card-edit__done"
        v-sfx="{ click: 'ui.music_plink_ok' }"
        class="cursor-pointer rounded-full bg-(--theme-primary) px-13 py-4 text-white hover:-translate-0.5 hover:shadow-sm transition-all duration-50"
        @click="editing = false"
      >
        {{ $t('common.done') }}
      </button>
    </div>
  </div>

  <finish-animation
    v-if="mode === 'completed'"
    @done="emit('finished', num_correct, cards.length, remaining_due_count, config.study_all_cards)"
  />
</template>
