declare global {
  type Card = {
    order: number
    frontText: string
    backText: string
    deckID?: string
    id?: string
    imageURL?: string
    audioClip?: string
  }
}

export {}
