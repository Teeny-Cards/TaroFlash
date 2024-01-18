import { expect, describe, test, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDeckStore } from './decks'

describe('decks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('can set a list of decks', () => {
    const store = useDeckStore()
    const decks: Deck[] = [
      {
        id: '1',
        title: 'deck 1',
        description: 'deck 1 description',
        isPublic: false,
        count: 1,
        image: {}
      },
      {
        id: '2',
        title: 'deck 2',
        description: 'deck 2 description',
        isPublic: false,
        count: 2,
        image: {}
      }
    ]

    store.setDecks(decks)

    expect(store.decks).toEqual(decks)
  })
})
