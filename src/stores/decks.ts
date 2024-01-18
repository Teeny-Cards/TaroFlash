import { getUserDecks } from '@/services/deckService'
import { defineStore } from 'pinia'

export const useDeckStore = defineStore('decks', {
  state: () => ({
    decks: [] as Deck[]
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
      const response = await getUserDecks()

      if (response.success) {
        this.setDecks(response.value)
      }
    },

    setDecks(newDecks: Deck[]): void {
      this.decks = newDecks
    }
  }
})
