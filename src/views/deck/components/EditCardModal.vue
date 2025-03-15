<template>
  <div
    edit-card-modal
    class="w-full lg:w-max bg-orange rounded-16 flex flex-col items-center justify-center gap-4 shadow-modal text-white py-4 bg-(image:--curve-green-bg) overflow-hidden"
  >
    <div edit-card-modal__title class="flex justify-center w-full">
      <h1 class="text-2xl text-grey font-semibold font-primary">Edit Card</h1>
    </div>
    <div edit-card-modal__body class="flex flex-col items-center w-full gap-2">
      <TeenyIcon
        src="expand-less"
        size="large"
        class="text-grey cursor-pointer"
        @click="scrollUp"
      ></TeenyIcon>
      <div
        edit-card-modal__card-list
        ref="cardListEl"
        class="overflow-y-auto h-[306.42px] w-full flex flex-col gap-4 snap-mandatory snap-y scroll-hidden scroll-smooth"
      >
        <div
          edit-card-modal__teeny-card-editor
          v-for="card in cards"
          :key="card.id"
          class="flex w-full gap-4 px-20 overflow-x-auto shrink-0 snap-mandatory snap-x scroll-hidden font-primary snap-center"
        >
          <TeenyCardEditor :card="card" @front-input="updateFront" @back-input="updateBack" />
        </div>
      </div>

      <TeenyIcon
        src="expand-more"
        size="large"
        class="text-grey cursor-pointer"
        @click="scrollDown"
      ></TeenyIcon>
    </div>
    <div edit-card-modal__actions class="w-full flex justify-center gap-2.5">
      <TeenyButton variant="muted" icon-left="close" @click="$emit('cancel')">Cancel</TeenyButton>
      <TeenyButton icon-left="check" @click="save">Save</TeenyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyIcon from '@teeny/TeenyIcon.vue'
import TeenyButton from '@teeny/TeenyButton.vue'
import TeenyCardEditor from '@teeny/TeenyCardEditor.vue'
import { ref, type PropType, onMounted } from 'vue'

const CONTAINER_HEIGHT = 306.42
const GAP = 16

const props = defineProps({
  cards: {
    type: Array as PropType<Card[]>,
    required: true
  },
  focussedCardId: {
    type: Number,
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
