declare global {
  type Deck = {
    id: string
    title: string
    description: string
    isPublic: boolean
    count: number
    imageURL?: string
    imageFile?: File
  }
}

export {}
