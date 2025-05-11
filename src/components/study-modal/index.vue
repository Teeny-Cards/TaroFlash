<template>
  <ui-kit:modal :open="open" @close="$emit('closed')" @opened="setupStudySession" backdrop>
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
        <div></div>
        <Cards />
        <Buttons
          @reveal="studySession.cardRevealed = true"
          @correct="onCorrect"
          @incorrect="onIncorrect"
        />
      </div>

      <Track @cardClicked="onCardClicked" />
    </div>
  </ui-kit:modal>
</template>

<script setup lang="ts">
import Track from './track.vue'
import Cards from './cards.vue'
import Buttons from './buttons.vue'
import { provide, type PropType, reactive } from 'vue'

export type StudySession = {
  cards: Card[]
  studiedCardIds: Set<string>
  failedCardIds: Set<string>
  lastStudiedCard: Card | undefined
  activeCard: Card | undefined
  visibleCard: Card | undefined
  cardRevealed: boolean
}

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  deck: {
    type: Object as PropType<Deck>
  }
})

defineEmits<{
  (e: 'closed'): void
}>()

const studySession: StudySession = reactive({
  cards: [] as Card[],
  studiedCardIds: new Set<string>(),
  failedCardIds: new Set<string>(),
  lastStudiedCard: undefined as Card | undefined,
  activeCard: undefined as Card | undefined,
  visibleCard: undefined as Card | undefined,
  cardRevealed: false
})

provide('studySession', studySession)

function setupStudySession() {
  studySession.cards = [...(props.deck?.cards ?? [])]
  studySession.activeCard = studySession?.activeCard ?? props.deck?.cards?.[0]
  studySession.visibleCard = studySession.activeCard
}

function markStudied(card: Card) {
  if (card.id) {
    studySession.studiedCardIds.add(card.id)
  }
}

function markFailed(card: Card) {
  if (card.id) {
    studySession.failedCardIds.add(card.id)
  }
}

function advanceCard(failed: boolean = false) {
  if (!studySession.activeCard) return

  if (failed) {
    markFailed(studySession.activeCard)
  } else {
    markStudied(studySession.activeCard)
  }

  studySession.lastStudiedCard = studySession.activeCard
  
  const remaining = studySession.cards.filter(
    (c) => !studySession.studiedCardIds.has(c.id!) && !studySession.failedCardIds.has(c.id!)
  )

  studySession.activeCard = remaining[0]
  studySession.visibleCard = studySession.activeCard
  studySession.cardRevealed = false
}

function onCorrect() {
  advanceCard()
}

function onIncorrect() {
  advanceCard(true)
}

function onCardClicked(card: Card) {
  studySession.cardRevealed = false
  studySession.visibleCard = card
}
</script>
