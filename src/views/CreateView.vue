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
  try {
    const doc = await createDeck(deck)
    saveCards(doc.id, cards)
  } catch (e: any) {
    toastStore.error(e.message)
  }
}

async function saveCards(deckId: string, cards: CardMutation[]): Promise<void> {
  try {
    await saveCardsToDeck(deckId, cards)

    toastStore.success('Deck Saved Successfully')
    router.push({ name: 'deck', params: { id: deckId } })
  } catch (e: any) {
    toastStore.error(e.message)
  }
}
</script>
