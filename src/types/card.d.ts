declare global {
  type Card = {
    order: number
    frontText: string
    backText: string
    deckID?: string
    id: string
    imageURL?: string
    audioClip?: string
  }

  type CardMutation = Card & {
    deleted?: boolean
    dirty?: boolean
  }
}

export {}
