import { expect, describe, test, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDeckStore } from '@/stores/decks'
import { createDecks, createDeck } from '@/tests/factories/deck'

describe('decks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('can set a current deck', () => {
    const store = useDeckStore()
    const deck = createDeck()

    store.setCurrentDeck(deck)
    expect(store.currentDeck).toEqual(deck)
  })

  test('can set a list of decks', () => {
    const store = useDeckStore()
    const decks: Deck[] = createDecks(3)

    store.setDecks(decks)
    expect(store.decks).toEqual(decks)
  })
})
