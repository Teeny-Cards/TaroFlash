import { getUserDecks, getDeckById } from '@/services/deckService'
import { getCardsByDeckID } from '@/services/cardService'
import { defineStore } from 'pinia'

export const useDeckStore = defineStore('decks', {
  state: () => ({
    decks: [] as Deck[],
    currentDeck: {} as Deck,
    currentDeckCards: [] as Card[]
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
      await this.fetchCardsByDeckId(id)

      if (deck) {
        this.setCurrentDeck(deck)
      }
    },

    async fetchCardsByDeckId(id: string): Promise<void> {
      const cards = await getCardsByDeckID(id)

      if (cards) {
        this.currentDeckCards = cards
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
