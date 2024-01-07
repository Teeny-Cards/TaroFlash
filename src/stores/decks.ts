import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDeckStore = defineStore('decks', () => {
  const decks = ref<Deck[]>([])

  function addDeck(deck: Deck) {
    decks.value.push(deck)
  }

  function setDecks(newDecks: Deck[]) {
    decks.value = newDecks
  }

  return { decks, addDeck, setDecks }
})
