import { getUserDecks, getDeckById, updateDeckById } from '@/services/deckService'
import { getCardsByDeckID, updateCardsByDeckID } from '@/services/cardService'
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
      await updateCardsByDeckID(id, cards)
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

const localDeck = {
  title: 'Chinese Characters',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate vestibulum tristique.',
  id: 'qvdybfQN9RlsANl54ryM',
  isPublic: false,
  count: 8,
  image: {
    name: '中文.png',
    url: 'https://firebasestorage.googleapis.com/v0/b/tinycards-9b4f2.appspot.com/o/deck-photos%2F%E4%B8%AD%E6%96%87.png?alt=media&token=4ba58404-1062-492e-9591-68de46f4ab03'
  },
  createdBy: 'Teeny Cards'
}

const localCards = [
  {
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    deckID: 'qvdybfQN9RlsANl54ryM',
    order: 0,
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    backText: 'I',
    frontText: '我',
    id: 'poHC5kBetf2x5jL6aZcY'
  },
  {
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    backText: 'You',
    order: 1,
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    frontText: '你',
    deckID: 'qvdybfQN9RlsANl54ryM',
    id: 'i6poKEDEQ5JnZJPhDYBR'
  },
  {
    deckID: 'qvdybfQN9RlsANl54ryM',
    order: 2,
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    frontText: '她',
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    backText: 'She',
    id: 'sK5MbWVBsyCZanUPyhrh'
  },
  {
    deckID: 'qvdybfQN9RlsANl54ryM',
    frontText: '他',
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    order: 3,
    backText: 'He',
    id: '3O3EosamnAaoB6K8NccM'
  },
  {
    frontText: '它',
    order: 4,
    deckID: 'qvdybfQN9RlsANl54ryM',
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    backText: 'It',
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    id: 'QLUSA4NVn7o6w4Pu3bTq'
  },
  {
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    backText: 'Us',
    frontText: '我们',
    order: 5,
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    deckID: 'qvdybfQN9RlsANl54ryM',
    id: 'rrUrVdwybCdcehwHNB5Y'
  },
  {
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    backText: 'You guys',
    frontText: '你们',
    deckID: 'qvdybfQN9RlsANl54ryM',
    order: 6,
    id: 'CekKbbHuosRP2tScGukB'
  },
  {
    deckID: 'qvdybfQN9RlsANl54ryM',
    updated_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    created_at: {
      seconds: 1704839897,
      nanoseconds: 770000000
    },
    order: 7,
    frontText: '他们',
    backText: 'Them',
    id: 'hUqFFB8nK3GhZSgbncmv'
  },
  {
    frontText: '她们',
    created_at: {
      seconds: 1705015678,
      nanoseconds: 539000000
    },
    updated_at: {
      seconds: 1705015678,
      nanoseconds: 539000000
    },
    backText: 'Them (female)',
    order: 8,
    deckID: 'qvdybfQN9RlsANl54ryM',
    id: 'TjVtxwEG22UC2oZ1tggP'
  }
]
