import { useInfiniteQuery } from '@pinia/colada'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { fetchCardsPageByDeckId } from '../db'

export const CARDS_PAGE_SIZE = 50

export function useCardsInDeckInfiniteQuery(
  deck_id: MaybeRefOrGetter<number>,
  page_size: number = CARDS_PAGE_SIZE
) {
  return useInfiniteQuery({
    key: () => ['cards', toValue(deck_id), 'pages', page_size],
    initialPageParam: 0,
    query: ({ pageParam }) =>
      fetchCardsPageByDeckId({
        deck_id: toValue(deck_id),
        offset: pageParam as number,
        limit: page_size
      }),
    getNextPageParam: (lastPage, allPages) => {
      // Short page → no more rows on the server.
      if (lastPage.length < page_size) return null
      return allPages.reduce((sum, page) => sum + page.length, 0)
    }
  })
}
