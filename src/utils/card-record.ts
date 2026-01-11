import { upsertCard, deleteCards as upstreamDeleteCards, reserveCard } from '@/api/cards'
import { debounce } from '@/utils/debounce'

export default class CardRecord {
  id: number
  deck_id?: Card['deck_id']
  front_text?: Card['front_text']
  back_text?: Card['back_text']
  front_delta?: Card['front_delta']
  back_delta?: Card['back_delta']
  attributes?: Card['attributes']
  created_at?: Card['created_at']
  updated_at?: Card['updated_at']
  rank?: Card['rank']
  member_id?: Card['member_id']
  front_image_path?: Card['front_image_path']
  back_image_path?: Card['back_image_path']
  review?: Card['review']

  static async create(deck_id: number, left_card_id?: number, right_card_id?: number) {
    const { out_rank: rank, out_id: id } = await reserveCard(deck_id, left_card_id, right_card_id)
    return new CardRecord({ id, rank })
  }

  constructor(card: Card) {
    this.id = card.id
    this.front_text = card.front_text
    this.back_text = card.back_text
    this.front_delta = card.front_delta
    this.back_delta = card.back_delta
    this.deck_id = card.deck_id
    this.created_at = card.created_at
    this.updated_at = card.updated_at
    this.rank = card.rank
    this.member_id = card.member_id
    this.front_image_path = card.front_image_path
    this.back_image_path = card.back_image_path
    this.review = card.review
  }

  async update(values: Partial<Card>) {
    if (!this.id || !this._valuesDiffer(values)) return

    this._assign(values)

    const payload = this._buildUpsertPayload()
    await debounce(async () => await upsertCard(payload), { key: `card-${this.id}` })
  }

  private _assign(card: Partial<Card>) {
    for (const [k, v] of Object.entries(card) as [keyof Card, Card[keyof Card]][]) {
      ;(this as any)[k] = v
    }
  }

  private _buildUpsertPayload(): Partial<Card> & { id: number } {
    const payload: Partial<Card> & { id: number } = {
      id: this.id,
      deck_id: this.deck_id,
      front_text: this.front_text,
      back_text: this.back_text,
      front_delta: this.front_delta,
      back_delta: this.back_delta,
      attributes: this.attributes,
      created_at: this.created_at,
      updated_at: this.updated_at,
      rank: this.rank,
      member_id: this.member_id
    }

    // Remove undefined (but keep null!)
    for (const key of Object.keys(payload) as (keyof typeof payload)[]) {
      if (payload[key] === undefined) delete (payload as any)[key]
    }

    return payload
  }

  private _valuesDiffer(values: Partial<Card>) {
    for (const [k, v] of Object.entries(values) as [keyof Card, Card[keyof Card]][]) {
      if (v === undefined) continue
      if ((this as any)[k] !== v) return true
    }

    return false
  }
}
