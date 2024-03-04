<template>
  <section
    class="h-full bg-white rounded-2xl shadow-md flex flex-col gap-6 justify-center items-center p-16 m-16 relative"
  >
    <TeenyCard
      size="large"
      class="transition-transform duration-1500 ease-linear"
      @click="flipCard"
      current-card
    >
      <span class="text-5xl font-semibold text-center">
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
          class="flex items-center justify-center gap-8 w-full absolute inset-0"
        >
          <TeenyIcon src="arrow-back" fill="grey" />
          <div class="flex items-center justify-center gap-2">
            <TeenyButton
              color="danger"
              variant="secondary"
              iconLeft="close"
              rounded
              @onClick="failCard"
            />
            <TeenyButton variant="secondary" iconRight="check" rounded @onClick="passCard" />
          </div>
          <TeenyIcon src="arrow-forward" fill="grey" />
        </div>
      </transition>

      <transition
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        leave-active-class="transition-opacity"
      >
        <div v-if="isFirstCard" class="absolute inset-0 flex items-center justify-center">
          <p class="text-gray-300">Click card or press any key to flip</p>
        </div>
      </transition>
    </div>

    <div class="absolute bg-white p-2 left-64 top-1/4">
      <p>State: {{ spacedCard.state }}</p>
      <p>Interval: {{ spacedCard.interval }}</p>
      <p>Pass Interval: {{ spacedCard.passIntervalString }}</p>
      <p>Fail Interval: {{ spacedCard.failIntervalString }}</p>
      <p>Fuzz: {{ spacedCard.fuzzString }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, type PropType, onMounted, onUnmounted } from 'vue'
import TeenyCard from '@/components/TeenyCard.vue'
import TeenyButton from '@/components/TeenyButton.vue'
import TeenyIcon from '@/components/TeenyIcon.vue'
import { onBeforeRouteLeave } from 'vue-router'
import SRC from '@/utils/SRC'

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
let spacedCard = ref(new SRC(currentCard.value))

onMounted(() => {
  cardEl.value = document.querySelector('[current-card]') as HTMLDivElement
  document.addEventListener('keyup', onKeyUp)
  window.addEventListener('visibilitychange', onVisibilityChanged)
})

onBeforeRouteLeave(() => {
  // TODO: save card state
})

onUnmounted(() => {
  document.removeEventListener('keyup', onKeyUp)
  window.addEventListener('visibilitychange', onVisibilityChanged)
})

function failCard(): void {
  spacedCard.value.fail()
  // nextCard()
}

function passCard(): void {
  spacedCard.value.pass()
  // nextCard()
}

function onKeyUp(e: KeyboardEvent): void {
  if (frontShowing.value) {
    flipCard()
    return
  }

  if (e.code === 'ArrowRight') {
    passCard()
    return
  } else if (e.code === 'ArrowLeft') {
    failCard()
    return
  }
}

function flipCard(): void {
  if (!frontShowing.value) return

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
    spacedCard.value = new SRC(currentCard.value)
    frontShowing.value = true
  }
}

function onVisibilityChanged(): void {
  if (document.visibilityState === 'hidden') {
    // TODO: save card state
  }
}
</script>
@/utils/SRC
