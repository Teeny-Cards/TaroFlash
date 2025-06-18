<script setup lang="ts">
import Track from './track.vue'
import Cards from './cards.vue'
import Buttons from './buttons.vue'
import { provide } from 'vue'
import { updateReviewByCardId } from '@/services/cardService'
import { useStudySession } from '@/composables/useStudySession'
import {
  createEmptyCard,
  FSRS,
  generatorParameters,
  Rating,
  type Card as FSRSCard,
  type RecordLog
} from 'ts-fsrs'

defineEmits<{ (e: 'closed'): void }>()
const { open = false, deck } = defineProps<{ open: boolean; deck: Deck }>()

const {
  cards,
  studiedCardIds,
  failedCardIds,
  lastStudiedCard,
  activeCard,
  visibleCard,
  cardRevealed,
  activeCardOptions,
  fsrsInstance
} = useStudySession()

function setupStudySession() {
  cards.value = [...(deck?.cards ?? [])]
  activeCard.value = activeCard.value ?? deck?.cards?.[0]
  visibleCard.value = activeCard.value

  const params = generatorParameters({ enable_fuzz: true })
  fsrsInstance.value = new FSRS(params)

  const now = new Date()

  const card = Boolean(activeCard.value?.review)
    ? (activeCard.value?.review as unknown as FSRSCard)
    : createEmptyCard(now)

  activeCardOptions.value = fsrsInstance.value!.repeat(card, now)
}

async function markStudied(card_id: string) {
  const reviewed_card = activeCardOptions.value![Rating.Good].card

  await updateReviewByCardId(card_id, reviewed_card)
  studiedCardIds.value.add(card_id)
}

async function markFailed(card_id: string) {
  const reviewed_card = activeCardOptions.value![Rating.Again].card
  await updateReviewByCardId(card_id, reviewed_card)

  failedCardIds.value.add(card_id)
}

async function advanceCard(failed: boolean = false) {
  if (!activeCard.value?.id) return

  if (failed) {
    await markFailed(activeCard.value.id)
  } else {
    await markStudied(activeCard.value.id)
  }

  lastStudiedCard.value = activeCard.value

  const remaining = cards.value.filter(
    (c) => !studiedCardIds.value.has(c.id!) && !failedCardIds.value.has(c.id!)
  )

  activeCard.value = remaining[0]
  visibleCard.value = activeCard.value
  cardRevealed.value = false

  const card = Boolean(activeCard.value?.review)
    ? (activeCard.value?.review as unknown as FSRSCard)
    : createEmptyCard(new Date())

  activeCardOptions.value = fsrsInstance!.value!.repeat(card, new Date())
}

function onCorrect() {
  advanceCard()
}

function onIncorrect() {
  advanceCard(true)
}

function onCardClicked(card: Card) {
  cardRevealed.value = false
  visibleCard.value = card
}
</script>

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
        <Cards
          :visibleCard="visibleCard"
          :cardRevealed="cardRevealed"
          :studiedCardIds="studiedCardIds"
          :failedCardIds="failedCardIds"
        />
        <Buttons
          :activeCard="activeCard"
          :activeCardOptions="activeCardOptions"
          :cardRevealed="cardRevealed"
          :studiedCardIds="studiedCardIds"
          :failedCardIds="failedCardIds"
          @reveal="cardRevealed = true"
          @correct="onCorrect"
          @incorrect="onIncorrect"
        />
      </div>

      <Track
        @cardClicked="onCardClicked"
        :cards="cards"
        :studiedCardIds="studiedCardIds"
        :failedCardIds="failedCardIds"
        :lastStudiedCard="lastStudiedCard"
        :activeCard="activeCard"
      />
    </div>
  </ui-kit:modal>
</template>
