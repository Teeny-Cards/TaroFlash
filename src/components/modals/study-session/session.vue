<script setup lang="ts">
import StudyCard from './study-card.vue'
import RatingButtons from './rating-buttons.vue'
import SessionSettings from './session-settings.vue'
import { useStudySession } from '@/composables/study-session'
import { type Grade, type RecordLogItem } from 'ts-fsrs'
import { computed, onMounted, reactive, ref, useTemplateRef } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import Card from '@/components/card/index.vue'
import { fetchAllCardsByDeckId } from '@/api/cards'
import { emitSfx } from '@/sfx/bus'

const { deck } = defineProps<{ deck: Deck }>()
const emit = defineEmits<{
  (e: 'closed', response?: boolean): void
  (e: 'finished', score: number, total: number): void
}>()

const session_config = reactive<Required<DeckConfig>>({
  study_all_cards: deck.config?.study_all_cards ?? false,
  retry_failed_cards: deck.config?.retry_failed_cards ?? false,
  shuffle: false,
  card_limit: null,
  flip_cards: false
})

const {
  mode,
  cards,
  current_card_side,
  current_index,
  active_card,
  num_correct,
  is_starting_side,
  reviewCard,
  setCards,
  updateConfig,
  startSession,
  flipCurrentCard
} = useStudySession(session_config)

const study_card_ref = useTemplateRef('study-card')
const loading = ref(true)
const raw_cards = ref<Card[]>([])

const is_cover = computed(() => current_card_side.value === 'cover')

onMounted(async () => {
  if (!deck.id) {
    emit('closed')
    return
  }

  raw_cards.value = await fetchAllCardsByDeckId(deck.id!)
  setCards(raw_cards.value)
  loading.value = false
})

function onSideChanged() {
  emitSfx(is_starting_side.value ? 'ui.transition_up' : 'ui.transition_down')
  flipCurrentCard()
}

function onStart() {
  emitSfx('ui.music_plink_chordyes')
  startSession()
}

/** Triggers the card flip animation on the card component */
function onRated(grade: Grade) {
  study_card_ref.value?.rate(grade)
}

function onCardReviewed(item?: RecordLogItem) {
  if (!active_card.value?.id || mode.value !== 'studying') return

  reviewCard(item)

  // @ts-ignore - stupid error
  if (mode.value === 'completed') {
    emit('finished', num_correct.value, cards.value.length)
  }
}
</script>

<template>
  <div
    class="grid grid-rows-[auto_1fr] grid-cols-1 items-center justify-between w-full h-full"
    :data-mode="mode"
  >
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
      class="w-full h-full pt-2 max-h-130 flex flex-col items-center justify-between gap-2 self-center overflow-y-auto"
    >
      <div
        data-testid="study-session__counter"
        class="text-brown-700 dark:text-brown-300 text-lg"
        :class="{ invisible: is_cover }"
      >
        {{ current_index + 1 }}<span class="text-sm">/{{ cards.length }}</span>
      </div>

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
      <card data-testid="study-card-skeleton" v-else size="xl" />

      <rating-buttons
        class="z-10 mt-4"
        :options="active_card?.preview"
        :side="current_card_side"
        @started="onStart"
        @rated="onRated"
        @revealed="onSideChanged"
      />

      <!-- <session-settings
        v-if="is_cover && !loading"
        :settings="session_config"
        :total_cards="raw_cards.length"
        @change="updateConfig"
      /> -->
    </div>
  </div>
</template>
