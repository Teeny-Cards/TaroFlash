<template>
  <Edit :deck="deck" :cards="cards" @saveDeck="saveDeck"></Edit>
</template>

<script setup lang="ts">
import Edit from '@/components/views/edit.vue'
import { ref } from 'vue'
import { createDeck } from '@/services/deckService'
import { saveCardsToDeck } from '@/services/cardService'
import router from '@/router'
import generateUID from '@/utils/uid'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const deck = ref<Deck>()
const cards = ref<Card[]>([
  {
    order: 0,
    frontText: '',
    backText: '',
    id: generateUID()
  }
])

async function saveDeck(deck: Deck, cards: CardMutation[]): Promise<void> {
  const response = await createDeck(deck)

  if (response.success) {
    saveCards(response.value.id, cards)
  } else {
    toastStore.addToast({
      message: response.error.message,
      state: 'error'
    })
  }
}

async function saveCards(deckId: string, cards: CardMutation[]): Promise<void> {
  const response = await saveCardsToDeck(deckId, cards)
  if (response.success) {
    toastStore.addToast({
      message: 'Deck Saved Successfully'
    })
    router.push({ name: 'deck', params: { id: deckId } })
  } else {
    toastStore.addToast({
      message: response.error.message,
      state: 'error'
    })
  }
}
</script>
