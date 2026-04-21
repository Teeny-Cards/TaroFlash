import { ref, type Ref } from 'vue'
import {
  useDeleteCardsMutation,
  useDeleteCardsInDeckMutation,
  useInsertCardAtMutation,
  useMoveCardsToDeckMutation,
  useSaveCardMutation
} from '@/api/cards'
import type { VirtualCardList } from '@/composables/virtual-card-list'

export type CardMutations = ReturnType<typeof useCardMutations>

type Options = {
  list: VirtualCardList
  deck_id: Ref<number | undefined>
}

type DeleteArgs = { cards: Card[] } | { except_ids: number[] }
type MoveArgs = { cards: Card[]; target_deck_id: number }

export function useCardMutations(opts: Options) {
  const { list, deck_id } = opts
  const saving = ref(false)

  const delete_mutation = useDeleteCardsMutation()
  const delete_in_deck_mutation = useDeleteCardsInDeckMutation()
  const insert_mutation = useInsertCardAtMutation()
  const save_mutation = useSaveCardMutation()
  const move_mutation = useMoveCardsToDeckMutation()

  async function updateCard(id: number, values: Partial<Card>) {
    // Temp card path — first save promotes it to a real INSERT.
    if (id < 0) {
      const temp = list.findTemp(id)
      if (!temp) return

      saving.value = true
      try {
        const inserted = await insert_mutation.mutateAsync({
          deck_id: deck_id.value!,
          anchor_id: temp.anchor_id,
          side: temp.side,
          front_text: values.front_text ?? temp.card.front_text ?? '',
          back_text: values.back_text ?? temp.card.back_text ?? ''
        })
        list.promoteTemp(id, inserted.id, inserted.rank, values)
      } finally {
        saving.value = false
      }
      return
    }

    // Real card path — debounced in-place save.
    const card = list.findCard(id)
    if (!card) return

    saving.value = true
    try {
      await save_mutation.mutateAsync({ card, values })
    } finally {
      saving.value = false
    }
  }

  async function deleteCards(args: DeleteArgs) {
    if ('except_ids' in args) {
      await delete_in_deck_mutation.mutateAsync({
        deck_id: deck_id.value!,
        except_ids: args.except_ids
      })
      return
    }
    if (args.cards.length === 0) return
    await delete_mutation.mutateAsync(args.cards)
  }

  async function moveCards(args: MoveArgs) {
    if (args.cards.length === 0) return
    await move_mutation.mutateAsync({ cards: args.cards, deck_id: args.target_deck_id })
  }

  return { saving, updateCard, deleteCards, moveCards }
}
