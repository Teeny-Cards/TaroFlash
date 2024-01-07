declare global {
  type Card = {
    order: number
    frontText: string
    backText: string
    image?: string
    audioClip?: string
  }
}

export {}
