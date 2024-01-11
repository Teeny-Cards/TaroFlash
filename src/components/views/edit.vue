<template>
  <div class="grid grid-cols-deck-view-lg p-8 gap-8">
    <section class="flex flex-col gap-8 fixed">
      <TeenyCard>
        <div
          class="w-full h-full flex flex-col gap-2 items-center justify-center text-gray-300 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 -960 960 960">
            <path
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm480-480v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM240-280h480L570-480 450-320l-90-120-120 160Zm-40-480v560-560Z"
              fill="currentColor"
            />
          </svg>
          <p class="text-2xl font-semibold">Choose Cover</p>
        </div>
      </TeenyCard>
      <TeenyInput type="text" placeholder="Enter Title" v-model="title" />
      <TeenyInput type="text" placeholder="Enter Description" v-model="description" />
      <TeenyButton @onClick="saveDeck">Save</TeenyButton>
    </section>
    <section
      class="bg-white rounded-3xl w-full flex flex-col-reverse gap-8 items-center shadow-md p-20 relative col-start-2"
    >
      <TeenyCardEditor
        v-for="(card, index) in cards"
        :key="index"
        :card="card"
        :index="index"
        @frontInput="updateFront"
        @backInput="updateBack"
      />

      <button
        @click="addCard"
        class="bg-green-400 p-5 rounded-full text-white absolute shadow-md -right-8 top-52"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" fill="currentColor" />
        </svg>
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'

declare interface DirtyCard extends Card {
  dirty?: Boolean
}

const props = defineProps({
  deck: {
    type: Object as PropType<Deck>,
    required: true
  },
  cards: {
    type: Object as PropType<Card[]>,
    required: true
  }
})

const emit = defineEmits<{
  (event: 'saveDeck', newDeck: Deck, newCards: Card[]): void
}>()

const title = ref(props.deck.title)
const description = ref(props.deck.description)
const cards = ref<DirtyCard[]>(props.cards)

function addCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: '',
    dirty: true
  })
}

function updateFront(index: number, value: string): void {
  const card = cards.value[index]

  if (card) {
    card.frontText = value
    card.dirty = true
  }
}

function updateBack(index: number, value: string): void {
  const card = cards.value[index]

  if (card) {
    card.backText = value
    card.dirty = true
  }
}

function saveDeck(): void {
  const newDeck: Deck = {
    ...props.deck,
    title: title.value,
    description: description.value
  }

  const newCards = cards.value.filter((card: DirtyCard) => card.dirty)

  emit('saveDeck', newDeck, newCards)
}
</script>
