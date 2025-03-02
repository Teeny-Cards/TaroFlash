<template>
  <div
    edit-card-modal
    class="w-full bg-orange rounded-16 flex flex-col items-center justify-center gap-4 shadow-modal text-white py-4 bg-[url('../assets/img/stripe-orange.png')] bg-cover overflow-hidden"
  >
    <div edit-card-modal__title class="flex justify-center w-full">
      <h1 class="text-2xl font-semibold font-primary">Edit Card</h1>
    </div>
    <div edit-card-modal__body class="flex flex-col items-center w-full gap-2">
      <TeenyIcon src="expand-less" size="large" @click="scrollUp"></TeenyIcon>

      <div
        edit-card-modal__card-list
        ref="cardListEl"
        class="overflow-y-auto h-[306.42px] w-full flex flex-col gap-4 snap-mandatory snap-y scroll-hidden"
      >
        <div
          edit-card-modal__teeny-card-editor
          v-for="(card, index) in cardList"
          :key="card.id"
          class="flex w-full gap-4 px-20 overflow-x-auto shrink-0 snap-mandatory snap-x scroll-hidden font-primary snap-center"
        >
          <TeenyCardEditor
            :card="card"
            :index="index"
            @front-input="updateFront"
            @back-input="updateBack"
          />
        </div>
      </div>

      <TeenyIcon src="expand-more" size="large" @click="scrollDown"></TeenyIcon>
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
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', cards: CardMutation[]): void
}>()

onMounted(() => {
  const scrollPos = props.index * CONTAINER_HEIGHT + GAP
  setScrollPosition(scrollPos)
})

const cardListEl = ref<HTMLDivElement>()
const cardList = ref<CardMutation[]>([...props.cards])

function updateFront(index: number, value: string): void {
  const card = cardList.value[index]

  if (card) {
    const updatedCard = { ...card, frontText: value, dirty: true }
    cardList.value.splice(index, 1, updatedCard)
  }
}

function updateBack(index: number, value: string): void {
  const card = cardList.value[index]

  if (card) {
    const updatedCard = { ...card, backText: value, dirty: true }
    cardList.value.splice(index, 1, updatedCard)
  }
}

function save(): void {
  const newCards = cardList.value.filter((card: CardMutation) => card.dirty)
  emit('save', newCards)
}

function setScrollPosition(pos: number, animate?: boolean): void {
  cardListEl.value?.scrollTo({ top: pos, left: 0, behavior: animate ? 'smooth' : 'auto' })
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
