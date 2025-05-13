<template>
  <div data-test-id="edit-card-modal-container" class="relative">
    <div
      data-testid="edit-card-modal"
      class="bg-parchment-dark rounded-11 shadow-modal flex w-full flex-col items-center justify-center overflow-hidden pb-6 lg:max-w-max"
    >
      <div
        data-testid="edit-card-modal__title"
        class="bg-purple-dark wave-bottom flex w-full justify-center pt-12 pb-16 text-white"
      >
        <h1 class="font-primary text-3xl font-semibold">Edit Card</h1>
      </div>
      <div data-testid="edit-card-modal__body" class="flex w-full flex-col items-center gap-2">
        <ui-kit:icon
          src="expand-less"
          size="large"
          class="text-brown-dark cursor-pointer"
          @click="scrollUp"
        ></ui-kit:icon>
        <div
          data-testid="edit-card-modal__card-list"
          ref="cardListEl"
          class="scroll-hidden flex h-[306.42px] w-full snap-y snap-mandatory flex-col gap-4 overflow-y-auto scroll-smooth"
        >
          <div
            data-testid="edit-card-modal__card-editor"
            v-for="card in cards"
            :key="card.id"
            class="scroll-hidden font-primary flex w-full shrink-0 snap-x snap-mandatory snap-center gap-4 overflow-x-auto px-20"
          >
            <CardEditor :card="card" @front-input="updateFront" @back-input="updateBack" />
          </div>
        </div>

        <ui-kit:icon
          src="expand-more"
          size="large"
          class="text-brown-dark cursor-pointer"
          @click="scrollDown"
        ></ui-kit:icon>
      </div>
    </div>

    <div
      data-testid="edit-card-modal__actions"
      class="absolute -bottom-5 flex w-full justify-end gap-2.5 px-8"
    >
      <ui-kit:button variant="muted" icon-left="close" @click="$emit('cancel')"
        >Cancel</ui-kit:button
      >
      <ui-kit:button icon-left="check" @click="save">Save</ui-kit:button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardEditor from '@/components/card-editor.vue'
import { ref, type PropType, onMounted } from 'vue'

const CONTAINER_HEIGHT = 306.42
const GAP = 16

const props = defineProps({
  cards: {
    type: Array as PropType<Card[]>,
    required: true
  },
  focussedCardId: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', cards: Card[]): void
}>()

onMounted(() => {
  const index = props.cards.findIndex((card) => card.id === props.focussedCardId)
  const scrollPos = index * CONTAINER_HEIGHT + GAP
  setScrollPosition(scrollPos)
})

const cardListEl = ref<HTMLDivElement>()
const dirty_cards: Card[] = []

function updateFront(card: Card, value: string): void {
  const dirty_card = dirty_cards.find((dirty_card) => dirty_card.id === card.id)

  if (dirty_card) {
    dirty_card.front_text = value
  } else {
    dirty_cards.push({ ...card, front_text: value })
  }
}

function updateBack(card: Card, value: string): void {
  const dirty_card = dirty_cards.find((dirty_card) => dirty_card.id === card.id)

  if (dirty_card) {
    dirty_card.back_text = value
  } else {
    dirty_cards.push({ ...card, back_text: value })
  }
}

function save(): void {
  emit('save', dirty_cards)
}

function setScrollPosition(pos: number, animate: boolean = false): void {
  cardListEl.value?.scrollTo({ top: pos, left: 0, behavior: animate ? 'smooth' : 'instant' })
}

function scrollDown(): void {
  const scrollTop = cardListEl.value?.scrollTop ?? 0
  const scrollPos = scrollTop + CONTAINER_HEIGHT + GAP
  setScrollPosition(scrollPos, true)
}

function scrollUp(): void {
  const scrollTop = cardListEl.value?.scrollTop ?? 0
  const scrollPos = scrollTop - CONTAINER_HEIGHT - GAP
  setScrollPosition(scrollPos, true)
}
</script>
