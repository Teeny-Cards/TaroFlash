type Deck = {
  id: string
  title: string
  description: string
  is_public: boolean
  count: number
  image: DeckImage
  member_id?: string
  member?: { display_name: string }
  cards?: Card[]
}

type DeckImage = {
  name?: string
  url?: string
  newFile?: File
  deleted?: boolean
}
