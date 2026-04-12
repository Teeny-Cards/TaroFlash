import { reactive, ref } from 'vue'
import { deleteDeck as upstreamDeleteDeck, upsertDeck } from '@/api/decks'

export function useDeckEditor(deck?: Deck) {
  const settings = reactive<Omit<Deck, 'study_config' | 'cover_config'>>({
    id: deck?.id as number,
    title: deck?.title,
    description: deck?.description,
    is_public: deck?.is_public ?? true,
    updated_at: deck?.updated_at
  })

  const config = reactive<DeckConfig>(
    deck?.study_config ?? {
      study_all_cards: false,
      retry_failed_cards: true
    }
  )

  const cover = reactive<DeckCover>(deck?.cover_config ?? {})

  const uploaded_image = ref<File | undefined>()
  const image_removed = ref<boolean>(false)

  async function saveDeck() {
    await upsertDeck({ ...settings, study_config: { ...config }, cover_config: { ...cover } })
  }

  async function deleteDeck() {
    if (!deck?.id) return

    try {
      await upstreamDeleteDeck(deck.id)
    } catch {
      // TODO
    }
  }

  function uploadImage(file: File) {
    uploaded_image.value = file
  }

  function removeImage() {
    image_removed.value = true
  }

  return {
    settings,
    config,
    cover,
    saveDeck,
    deleteDeck,
    uploadImage,
    removeImage
  }
}
