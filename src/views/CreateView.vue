<template>
  <Edit :deck="deck" :cards="cards" @saveDeck="saveDeck"></Edit>
</template>

<script setup lang="ts">
import Edit from '@/components/views/edit.vue'
import { ref } from 'vue'
import { createDeck } from '@/services/deckService'
import { saveCards } from '@/services/cardService'
import router from '@/router'
import generateUID from '@/utils/uid'
import { useMessageStore } from '@/stores/message'

const messageStore = useMessageStore()
const deck = ref<Deck>()
const cards = ref<Card[]>([
  {
    front_text: '',
    back_text: '',
    id: generateUID()
  }
])

async function saveDeck(deck: Deck, cards: Card[]): Promise<void> {
  try {
    await createDeck(deck)
    // saveCards(doc.id, cards)
  } catch (e: any) {
    messageStore.error(e.message)
  }
}

async function save(deckId: string, cards: Card[]): Promise<void> {
  try {
    await saveCards(cards)

    messageStore.success('Deck Saved Successfully')
    router.push({ name: 'deck', params: { id: deckId } })
  } catch (e: any) {
    messageStore.error(e.message)
  }
}
</script>
