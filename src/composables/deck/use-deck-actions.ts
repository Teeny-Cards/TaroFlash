import { useI18n } from 'vue-i18n'
import { fetchMemberDeckCount, upsertDeck } from '@/api/decks'
import { useAlert } from '@/composables/alert'
import { useCan } from '@/composables/use-can'

export function useDeckActions() {
  const { t } = useI18n()
  const alert = useAlert()
  const can = useCan()

  async function createDeck(deck: Deck): Promise<boolean> {
    const count = await fetchMemberDeckCount()
    if (!can.createDeck(count)) {
      await alert.warn({
        title: t('errors.deck-limit-reached.title'),
        message: t('errors.deck-limit-reached.message')
      }).response
      return false
    }
    await upsertDeck(deck)
    return true
  }

  async function updateDeck(deck: Deck): Promise<boolean> {
    await upsertDeck(deck)
    return true
  }

  return { createDeck, updateDeck }
}
