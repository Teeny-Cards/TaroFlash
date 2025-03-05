import { getUserDecks, getDeckById, updateDeckById } from '@/services/deckService'
import { getCardsByDeckID, saveCards } from '@/services/cardService'
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

      if (deck) {
        this.setCurrentDeck(deck)
      }
    },

    async updateDeckById(id: string, deck: Deck): Promise<void> {
      await updateDeckById(id, deck)
      await this.fetchDeckById(id)
    },

    async fetchCardsByDeckId(id: string): Promise<void> {
      this.currentDeckCards = await getCardsByDeckID(id)
    },

    async updateCardsByDeckId(id: string, cards: Card[]): Promise<void> {
      await saveCards(cards)
      await this.fetchCardsByDeckId(id)
    },

    setDecks(newDecks: Deck[]): void {
      this.decks = newDecks
    },

    setCurrentDeck(newDeck: Deck): void {
      this.currentDeck = newDeck
    }
  }
})
