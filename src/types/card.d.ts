declare global {
  type Card = {
    deckID?: string
    order: number
    frontText: string
    backText: string
    imageURL?: string
    audioClip?: string
  }
}

export {}
