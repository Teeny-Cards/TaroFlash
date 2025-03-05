type Deck = {
  id?: string
  title?: string
  description?: string
  is_public?: boolean
  card_count?: number
  member_id?: string
  member?: { display_name: string }
  cards?: Card[]
  tags?: string[]
  created_at?: string
  image_url?: string
}
