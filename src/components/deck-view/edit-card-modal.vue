<script setup lang="ts">
import CardEditor from '@/components/card-editor.vue'
import { ref, type PropType, onMounted } from 'vue'

const CONTAINER_HEIGHT = 334.28
const GAP = 16

const { cards, focusedCardId } = defineProps<{
  cards: Card[]
  focusedCardId: number
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', cards: Card[]): void
}>()

onMounted(() => {
  const index = cards.findIndex((card) => card.id === focusedCardId)
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

<template>
  <div data-test-id="edit-card-modal-container" class="relative">
    <div
      data-testid="edit-card-modal"
      class="brown-300 rounded-11 shadow-modal flex w-full flex-col items-center justify-center overflow-hidden
        pb-6 lg:max-w-max"
    >
      <div
        data-testid="edit-card-modal__title"
        class="wave-bottom flex w-full justify-center bg-purple-500 pt-12 pb-16 text-white"
      >
        <h1 class="font-primary text-5xl font-semibold">{{ $t('edit-card-modal.title') }}</h1>
      </div>
      <div
        data-testid="edit-card-modal__body"
        class="flex w-full flex-col items-center gap-2 px-16"
      >
        <ui-kit:icon
          src="expand-less"
          size="large"
          class="text-brown-700 cursor-pointer"
          @click="scrollUp"
        ></ui-kit:icon>

        <div
          data-testid="edit-card-modal__card-list"
          ref="cardListEl"
          class="scroll-hidden flex h-[334.28px] snap-y snap-mandatory flex-col gap-4 overflow-y-auto scroll-smooth"
        >
          <div
            data-testid="edit-card-modal__card-editor"
            v-for="card in cards"
            :key="card.id"
            class="scroll-hidden font-primary flex w-full shrink-0 snap-x snap-mandatory snap-center gap-4
              overflow-x-auto"
          >
            <CardEditor :card="card" @front-input="updateFront" @back-input="updateBack" />
          </div>
        </div>

        <ui-kit:icon
          src="expand-more"
          size="large"
          class="text-brown-700 cursor-pointer"
          @click="scrollDown"
        ></ui-kit:icon>
      </div>
    </div>

    <div
      data-testid="edit-card-modal__actions"
      class="absolute -bottom-5 flex w-full justify-end gap-2.5 px-8"
    >
      <ui-kit:button variant="muted" icon-left="close" @click="$emit('cancel')">{{
        $t('common.cancel')
      }}</ui-kit:button>
      <ui-kit:button icon-left="check" @click="save">{{ $t('common.save') }}</ui-kit:button>
    </div>
  </div>
</template>
