<template>
  <div class="flex p-8 gap-8">
    <section class="flex flex-col gap-8">
      <TeenyCard></TeenyCard>
      <TeenyInput type="text" placeholder="Enter Title" v-model="title" />
      <TeenyInput type="text" placeholder="Enter Description" v-model="description" />
      <TeenyButton @onClick="saveDeck">Save</TeenyButton>
    </section>
    <section
      class="bg-white rounded-md w-full flex flex-col gap-8 justify-center items-center shadow-md p-20 relative"
    >
      <div v-for="(card, index) in cards" :key="index">
        <TeenyCardEditor :card="card" @input="updateCard" />
      </div>
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
import TeenyInput from '@/components/TeenyInput.vue'
import TeenyButton from '@/components/TeenyButton.vue'
import TeenyCardEditor from '@/components/TeenyCardEditor.vue'
import TeenyCard from '@/components/TeenyCard.vue'
import { ref } from 'vue'
import { createDeck } from '@/services/deckService'
import { saveCardsToDeck } from '@/services/cardService'

const title = ref('')
const description = ref('')
const cards = ref<Card[]>([
  {
    order: 0,
    frontText: '',
    backText: ''
  }
])

function addCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: ''
  })
}

function updateCard(order: number, value: { front: string; back: string }) {
  const card = cards.value.find((c) => (c.order = order))

  if (card) {
    card.frontText = value.front
    card.backText = value.back
  }
}

async function saveDeck(): Promise<void> {
  const deckRef = await createDeck(title.value, description.value, cards.value.length)
  saveCards(deckRef.id)
}

async function saveCards(deckId: string): Promise<void> {
  await saveCardsToDeck(deckId, cards.value)
}
</script>
