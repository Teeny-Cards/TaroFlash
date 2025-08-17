import { reactive, ref, computed } from 'vue'
import { deleteDeck as upstreamDeleteDeck, upsertDeck } from '@/api/decks'
import { deleteDeckImage, getDeckImageUrl, uploadDeckImage } from '@/api/files'
import { DateTime } from 'luxon'

export function useDeckEditor(deck?: Deck) {
  const settings = reactive<Deck>({
    id: deck?.id,
    title: deck?.title,
    description: deck?.description,
    is_public: deck?.is_public ?? true,
    updated_at: deck?.updated_at
  })

  const uploaded_image = ref<File | undefined>()
  const image_removed = ref<boolean>(false)

  const image_url = computed(() => {
    if (!deck?.has_image) return undefined

    const url = deck?.id ? getDeckImageUrl(deck.id) : undefined
    return url ? `${url}?t=${settings?.updated_at}` : undefined
  })

  async function saveDeck() {
    settings.updated_at = DateTime.now().toISO()

    await _maybeDeleteOldImage()
    await _maybeUploadImage()
    await upsertDeck(settings)
  }

  async function deleteDeck() {
    if (!deck?.id) return

    try {
      await upstreamDeleteDeck(deck.id)
    } catch (e: any) {
      console.error(e)
    }
  }

  function uploadImage(file: File) {
    uploaded_image.value = file
  }

  function removeImage() {
    image_removed.value = true
  }

  async function _maybeDeleteOldImage() {
    if (image_removed.value && !uploaded_image.value && deck?.id) {
      try {
        await deleteDeckImage(deck.id)
      } catch (e: any) {
        console.error(e)
      }
    }
  }

  async function _maybeUploadImage() {
    if (uploaded_image.value && deck?.id) {
      try {
        await uploadDeckImage(deck.id, uploaded_image.value)
      } catch (e: any) {
        console.error(e)
      }
    }
  }

  return {
    settings,
    image_url,
    saveDeck,
    deleteDeck,
    uploadImage,
    removeImage
  }
}
