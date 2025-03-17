import { supabase } from '@/supabaseClient'
import { TeenyError } from '@/utils/TeenyError'

export async function fetchShopItems(): Promise<ShopItem[]> {
  const { data, error } = await supabase.from('shop_items').select('*')

  if (error) {
    throw new TeenyError(error.message)
  }

  return data
}

export async function upsertPurchase(purchase: Purchase): Promise<void> {
  const { error } = await supabase.rpc('add_or_update_purchase', {
    member: purchase.member_id,
    item: purchase.item_id,
    qty: purchase.quantity
  })

  if (error) {
    throw new TeenyError(error.message)
  }
}
