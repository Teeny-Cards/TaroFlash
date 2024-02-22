import { getUserDecks, getDeckById } from '@/services/deckService'
import { defineStore } from 'pinia'

export const useDeckStore = defineStore('decks', {
  state: () => ({
    decks: [] as Deck[],
    currentDeck: {} as Deck
  }),

  getters: {
    getDeckById:
      (state) =>
      (id: string): Deck | undefined => {
        return state.decks.find((deck) => deck.id === id)
      }
  },

  actions: {
    async fetchUserDecks(): Promise<void> {
      const decks = await getUserDecks()
      this.setDecks(decks)
    },

    async fetchDeckById(id: string): Promise<void> {
      const deck = this.getDeckById(id) ?? (await getDeckById(id))

      if (deck) {
        this.setCurrentDeck(deck)
      }
    },

    setDecks(newDecks: Deck[]): void {
      this.decks = newDecks
    },

    setCurrentDeck(newDeck: Deck): void {
      this.currentDeck = newDeck
    }
  }
})
