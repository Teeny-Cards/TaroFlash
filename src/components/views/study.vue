<template>
  <section
    class="h-full bg-white rounded-2xl shadow-md flex flex-col gap-6 justify-center items-center p-16 m-16"
  >
    <TeenyCard
      size="large"
      class="transition-transform duration-1500 ease-linear"
      @click="setCardState"
      current-card
    >
      <span class="text-5xl font-semibold">
        {{ frontShowing ? currentCard.frontText : currentCard.backText }}
      </span>
    </TeenyCard>

    <div class="w-[300px] h-10 relative">
      <transition
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        enter-active-class="transition-opacity"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        leave-active-class="transition-opacity"
      >
        <div
          v-if="!isFirstCard && !frontShowing"
          class="flex items-center justify-center gap-2 w-full absolute inset-0"
        >
          <TeenyButton color="danger" variant="secondary" class="w-full">Nope</TeenyButton>
          <TeenyButton variant="secondary" class="w-full">Got It!</TeenyButton>
        </div>
      </transition>

      <transition
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        leave-active-class="transition-opacity"
      >
        <div v-if="isFirstCard" class="absolute inset-0 flex items-center justify-center">
          <p class="text-gray-300">
            Click card or press
            <span class="border-2 rounded-md border-gray-300 py-0.5 px-2">Space</span> to flip
          </p>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, type PropType, onMounted, onUnmounted } from 'vue'
import TeenyCard from '@/components/TeenyComponents/TeenyCard.vue'
import TeenyButton from '@/components/TeenyComponents/TeenyButton.vue'

const props = defineProps({
  cards: {
    type: Object as PropType<Card[]>,
    required: true
  }
})

const cardEl = ref<HTMLDivElement>()
const cards = props.cards
const isFirstCard = ref(true)
const frontShowing = ref(true)
const currentCard = ref(cards.pop() as Card)

onMounted(() => {
  cardEl.value = document.querySelector('[current-card]') as HTMLDivElement
  document.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keyup', onKeyUp)
})

function onKeyUp(e: KeyboardEvent): void {
  if (e.code === 'Space' || e.key === ' ') {
    setCardState()
  }
}

function setCardState(): void {
  if (frontShowing.value) {
    flipCard()
  } else {
    nextCard()
  }
}

function flipCard(): void {
  isFirstCard.value = false
  cardEl.value?.classList.add('[transform:rotateY(90deg)]')

  setTimeout(() => {
    frontShowing.value = false
    cardEl.value?.classList.remove('[transform:rotateY(90deg)]')
  }, 150)
}

function nextCard(): void {
  if (cards.length > 0) {
    currentCard.value = cards.pop() as Card
    frontShowing.value = true
  }
}
</script>
