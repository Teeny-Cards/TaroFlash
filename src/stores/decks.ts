import { defineStore } from 'pinia'
import Logger from '@/utils/logger'

export const useDeckStore = defineStore('decks', {
  state: () => ({
    decks: [] as Deck[],
    currentDeck: null as Deck | null
  }),

  actions: {
    setDecks(decks: Deck[]): void {
      Logger.info(`Setting ${decks.length} decks in store`)
      this.decks = decks
    },

    setCurrentDeck(deck: Deck): void {
      Logger.info(`Setting current deck: ${deck.title}`)
      this.currentDeck = deck
    },

    clearCurrentDeck(): void {
      Logger.info('Clearing current deck')
      this.currentDeck = null
    }
  }
})
