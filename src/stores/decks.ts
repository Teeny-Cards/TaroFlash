import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDeckStore = defineStore('decks', () => {
  const decks = ref<Deck[]>([])

  function addDeck(deck: Deck): void {
    decks.value.push(deck)
  }

  function setDecks(newDecks: Deck[]): void {
    decks.value = newDecks
  }

  function getDeckById(id: string): Deck | undefined {
    return decks.value.find((deck) => deck.id === id)
  }

  return { decks, addDeck, setDecks, getDeckById }
})
