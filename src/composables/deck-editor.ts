import { reactive, ref } from 'vue'
import { deleteDeck as upstreamDeleteDeck, upsertDeck } from '@/api/decks'
import { uploadImage as uploadImageToStorage } from '@/api/media'
import type { ImageUploadPayload } from '@/components/image-uploader.vue'

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

  const cover_image_preview = ref<string | undefined>(deck?.cover_config?.bg_image)
  const cover_image_loading = ref(false)

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

  async function setCoverImage(payload: ImageUploadPayload) {
    cover_image_preview.value = payload.preview
    cover_image_loading.value = true
    try {
      const deck_id = settings.id
      const path = deck_id ? `covers/${deck_id}` : `covers/draft-${crypto.randomUUID()}`
      const url = await uploadImageToStorage('decks', path, payload.file)
      cover.bg_image = url
      cover_image_preview.value = url
    } finally {
      cover_image_loading.value = false
    }
  }

  function removeCoverImage() {
    cover_image_preview.value = undefined
    cover.bg_image = undefined
  }

  return {
    settings,
    config,
    cover,
    cover_image_preview,
    cover_image_loading,
    saveDeck,
    deleteDeck,
    uploadImage,
    removeImage,
    setCoverImage,
    removeCoverImage
  }
}
