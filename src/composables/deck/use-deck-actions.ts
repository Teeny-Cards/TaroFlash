import { useI18n } from 'vue-i18n'
import { useMemberDeckCountQuery, useUpsertDeckMutation } from '@/api/decks'
import { useAlert } from '@/composables/alert'
import { useCan } from '@/composables/use-can'

export function useDeckActions() {
  const { t } = useI18n()
  const alert = useAlert()
  const can = useCan()
  const deck_count_query = useMemberDeckCountQuery()
  const upsert_mutation = useUpsertDeckMutation()

  async function createDeck(deck: Deck): Promise<boolean> {
    await deck_count_query.refresh()
    const count = deck_count_query.data.value ?? 0
    if (!can.createDeck(count)) {
      await alert.warn({
        title: t('errors.deck-limit-reached.title'),
        message: t('errors.deck-limit-reached.message')
      }).response
      return false
    }
    await upsert_mutation.mutateAsync(deck)
    return true
  }

  async function updateDeck(deck: Deck): Promise<boolean> {
    await upsert_mutation.mutateAsync(deck)
    return true
  }

  return { createDeck, updateDeck }
}
