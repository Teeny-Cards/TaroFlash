declare type ShopItem = {
  id: string
  name: string
  item_key: string
  description: string
  price: number
  category: string
}

declare type Purchase = {
  id?: string
  item_id: string
  member_id?: number
  quantity: number
}

declare type PurchaseItem = purchase & {
  shop_item: ShopItem
}
