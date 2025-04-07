import { supabase } from '@/supabaseClient'
import { useMemberStore } from '@/stores/member'

export async function fetchShopItems(): Promise<ShopItem[]> {
  const { data, error } = await supabase.from('shop_items').select('*')

  if (error) {
    throw new Error(error.message)
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
    throw new Error(error.message)
  }
}

export async function fetchPurchaseItems(): Promise<PurchaseItem[]> {
  const member = useMemberStore()

  const { data, error } = await supabase
    .from('purchases')
    .select('item_id, quantity, shop_item:shop_items(*)')
    .eq('member_id', member.id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
