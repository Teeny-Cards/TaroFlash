<template>
  <div class="flex p-8 gap-8">
    <section class="flex flex-col gap-8">
      <div class="w-[284px] h-[327px] rounded-[36px] bg-white shadow-lg"></div>
      <TeenyInput type="text" placeholder="Enter Title" v-model="title" />
      <TeenyInput type="text" placeholder="Enter Description" v-model="description" />
      <TeenyButton @click="saveDeck" />
    </section>
    <section
      class="bg-white rounded-md w-full flex flex-col gap-8 justify-center items-center shadow-md p-20 relative"
    >
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="flex gap-8 justify-around items-center w-full"
      >
        <h2 class="text-3xl font-semibold text-gray-400">{{ card.order + 1 }}</h2>
        <div class="flex gap-8 justify-center items-center">
          <TeenyCard
            placeholder="Front"
            :value="card.frontText"
            :order="card.order"
            @input="updateFrontCard"
          />
          <TeenyCard
            placeholder="Back"
            :value="card.backText"
            :order="card.order"
            @input="updateBackCard"
          />
        </div>
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
import TeenyInput from '../components/TeenyInput.vue'
import TeenyButton from '../components/TeenyButton.vue'
import TeenyCard from '../components/TeenyCard.vue'
import { ref } from 'vue'
import { createDeck } from '../services/deckService'

const title = ref('')
const description = ref('')
const cards = ref<Card[]>([
  {
    order: 0,
    frontText: '',
    backText: 'string'
  }
])

function addCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: ''
  })
}

function updateFrontCard(order: number, value: string): void {
  cards.value[order].frontText = value
}

function updateBackCard(order: number, value: string): void {
  cards.value[order].backText = value
}

async function saveDeck(): Promise<void> {
  await createDeck(title.value, description.value)
}
</script>
