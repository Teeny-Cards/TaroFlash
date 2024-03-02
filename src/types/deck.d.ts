declare global {
  type Deck = {
    id: string
    title: string
    description: string
    isPublic: boolean
    count: number
    image: DeckImage
    createdBy: string
  }

  type DeckImage = {
    name?: string
    url?: string
    newFile?: File
    deleted?: boolean
  }
}

export {}
