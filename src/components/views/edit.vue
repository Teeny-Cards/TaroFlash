<template>
  <div class="grid grid-cols-deck-view-lg p-8 gap-8">
    <section class="flex flex-col gap-8 fixed">
      <TeenyCard class="relative overflow-hidden">
        <div v-if="deckImagePreview" class="absolute inset-0">
          <img
            :src="deckImagePreview"
            alt="Deck Image preview"
            class="object-cover w-full h-full"
          />
        </div>
        <imageUploader v-else @imageUploaded="onDeckImageUploaded">
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
        </imageUploader>
      </TeenyCard>
      <TeenyInput type="text" placeholder="Enter Title" v-model="title" />
      <TeenyInput type="text" placeholder="Enter Description" v-model="description" />
      <div class="w-full flex gap-2">
        <TeenyButton color="gray" variant="secondary" @onClick="cancel" class="w-full"
          >Cancel</TeenyButton
        >
        <TeenyButton @onClick="saveDeck" class="w-full">Save</TeenyButton>
      </div>
    </section>
    <section
      class="bg-white rounded-3xl w-full flex flex-col-reverse gap-8 items-center shadow-md p-20 relative col-start-2"
    >
      <TeenyCardEditor
        v-for="(card, index) in nonDeletedCards"
        :key="index"
        :card="card"
        :index="index"
        @frontInput="updateFront"
        @backInput="updateBack"
        @delete="deleteCard"
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
import router from '@/router'
import { ref, type PropType, computed } from 'vue'
import imageUploader from '../imageUploader.vue'

declare interface DirtyCard extends CardMutation {
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

const deckImagePreview = ref()
const title = ref(props.deck.title)
const description = ref(props.deck.description)
const cards = ref<DirtyCard[]>(props.cards)

const nonDeletedCards = computed(() => {
  return cards.value.filter((card) => !card.deleted)
})

function onDeckImageUploaded(preview: string, file: File): void {
  deckImagePreview.value = preview
}

function addCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: '',
    dirty: true
  })
}

function deleteCard(index: number): void {
  const card = cards.value[index]

  if (card) {
    card.deleted = true
    card.dirty = true
  }
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

  const newCards: CardMutation[] = cards.value
    .filter((card: DirtyCard) => card.dirty)
    .map(({ dirty, ...cleanCard }) => cleanCard)

  emit('saveDeck', newDeck, newCards)
}

function cancel(): void {
  router.push({ name: 'deck', params: { id: props.deck.id } })
}
</script>
