<template>
  <div data-test-id="edit-card-modal-container" class="relative">
    <div
      data-testid="edit-card-modal"
      class="w-full lg:max-w-max bg-parchment-dark rounded-11 flex flex-col items-center justify-center shadow-modal overflow-hidden pb-6"
    >
      <div
        data-testid="edit-card-modal__title"
        class="flex justify-center w-full bg-purple-dark wave-bottom pt-12 pb-16 text-white"
      >
        <h1 class="text-3xl font-semibold font-primary">Edit Card</h1>
      </div>
      <div data-testid="edit-card-modal__body" class="flex flex-col items-center w-full gap-2">
        <ui-kit:icon
          src="expand-less"
          size="large"
          class="text-brown-dark cursor-pointer"
          @click="scrollUp"
        ></ui-kit:icon>
        <div
          data-testid="edit-card-modal__card-list"
          ref="cardListEl"
          class="overflow-y-auto h-[306.42px] w-full flex flex-col gap-4 snap-mandatory snap-y scroll-hidden scroll-smooth"
        >
          <div
            data-testid="edit-card-modal__card-editor"
            v-for="card in cards"
            :key="card.id"
            class="flex w-full gap-4 px-20 overflow-x-auto shrink-0 snap-mandatory snap-x scroll-hidden font-primary snap-center"
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
      class="w-full flex justify-end gap-2.5 absolute -bottom-5 px-8"
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
