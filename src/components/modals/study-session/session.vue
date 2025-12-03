<script setup lang="ts">
import StudyCard from './study-card.vue'
import RatingButtons from './rating-buttons.vue'
import { useStudySession } from '@/composables/study-session'
import { type RecordLogItem } from 'ts-fsrs'
import { onMounted, ref } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'

const { deck } = defineProps<{ deck: Deck }>()
const emit = defineEmits<{
  (e: 'closed', response?: boolean): void
  (e: 'finished', score: number, total: number): void
}>()

const {
  mode,
  cards,
  current_card_side,
  active_card,
  num_correct,
  pickNextCard,
  reviewCard,
  setup
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

function onCardReviewed(item: RecordLogItem) {
  if (active_card.value?.id && mode.value === 'studying') {
    reviewCard(item)
    pickNextCard()
  }

  if (mode.value === 'completed') {
    emit('finished', num_correct.value, cards.value.length)
  }
}

function onSideChanged(side: 'front' | 'back') {
  current_card_side.value = side
}
</script>

<template>
  <div
    data-testid="study-session"
    :data-mode="mode"
    class="sm:rounded-8 shadow-modal flex flex-col gap-6 items-center justify-between overflow-hidden pb-10
      relative bg-brown-300 h-full w-full sm:h-auto sm:w-160"
  >
    <div
      data-testid="study-session__header"
      class="relative flex w-full justify-center bg-purple-500 wave-bottom-[50px] bg-(image:--diagonal-stripes)
        bg-size-(--bg-sm) bg-center px-13 py-11.5 pb-14 z-10"
    >
      <div data-testid="study-session__actions" class="absolute top-0 left-0 p-4">
        <ui-button icon-left="close" theme="brown" icon-only @click="emit('closed')"></ui-button>
      </div>
      <h1 class="text-5xl text-white">{{ deck?.title }}</h1>
    </div>

    <study-card
      :card="active_card"
      :side="current_card_side"
      :options="active_card?.preview"
      @side-changed="onSideChanged"
      @reviewed="onCardReviewed"
    />

    <rating-buttons
      class="z-10 mt-4"
      :options="active_card?.preview"
      :show-options="current_card_side === 'back'"
      :disabled="mode !== 'studying'"
      @reviewed="onCardReviewed"
      @revealed="current_card_side = 'back'"
    />

    <div
      data-testid="study-session__pattern"
      class="absolute inset-0 bg-(image:--taro-flash) bg-size-[60px] text-brown-500 bg-brown-300 opacity-5
        bg-center"
    ></div>
  </div>
</template>
