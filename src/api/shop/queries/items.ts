import { useQuery } from '@pinia/colada'
import { fetchShopItems } from '../db'

export function useShopItemsQuery() {
  return useQuery({
    key: ['shop', 'items'],
    query: fetchShopItems
  })
}
