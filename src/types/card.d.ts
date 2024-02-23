declare global {
  type Card = {
    order: number
    frontText: string
    backText: string
    deckID?: string
    id: string
    imageURL?: string
    audioClip?: string
    dueDate?: Date
    lastUpdated?: Date
    state?: CardState
    interval?: number
    ease?: number
    leechCount?: number
  }

  type CardMutation = Card & {
    deleted?: boolean
    dirty?: boolean
  }

  type CardState = 'new' | 'learning' | 'young' | 'mature' | 'relearn'
}

export {}
