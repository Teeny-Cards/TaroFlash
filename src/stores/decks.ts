import { getUserDecks } from '@/services/deckService'
import { defineStore } from 'pinia'

export const useDeckStore = defineStore('decks', {
  state: () => ({
    decks: [] as Deck[]
  }),

  actions: {
    async fetchUserDecks(): Promise<void> {
      const decks = await getUserDecks()
      this.setDecks(decks)
    },

    setDecks(newDecks: Deck[]): void {
      this.decks = newDecks
    }
  }
})
