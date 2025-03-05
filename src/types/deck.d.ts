type Deck = {
  id: string
  title: string
  description: string
  is_public: boolean
  count: number
  image: DeckImage
  created_by: string
  user_id: string
}

type DeckImage = {
  name?: string
  url?: string
  newFile?: File
  deleted?: boolean
}
