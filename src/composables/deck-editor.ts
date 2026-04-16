import { reactive, ref } from 'vue'
import { deleteDeck as upstreamDeleteDeck } from '@/api/decks'
import { uploadImage as uploadImageToStorage } from '@/api/media'
import { useDeckActions } from '@/composables/deck/use-deck-actions'
import { useMemberStore } from '@/stores/member'
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
      study_all_cards: false
    }
  )

  const cover = reactive<DeckCover>(deck?.cover_config ?? {})
  const card_attributes = reactive<DeckCardAttributes>({
    front: deck?.card_attributes?.front ?? {},
    back: deck?.card_attributes?.back ?? {}
  })

  const uploaded_image = ref<File | undefined>()
  const image_removed = ref<boolean>(false)

  const cover_image_preview = ref<string | undefined>(deck?.cover_config?.bg_image)
  const cover_image_loading = ref(false)

  const deck_actions = useDeckActions()

  async function saveDeck(): Promise<boolean> {
    const payload: Deck = {
      ...settings,
      study_config: { ...config },
      cover_config: { ...cover },
      card_attributes: {
        front: { ...card_attributes.front },
        back: { ...card_attributes.back }
      }
    }
    return settings.id
      ? await deck_actions.updateDeck(payload)
      : await deck_actions.createDeck(payload)
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
      const member_id = useMemberStore().id
      if (!member_id) throw new Error('Not authenticated')
      const deck_id = settings.id
      const leaf = deck_id ? `covers/${deck_id}` : `covers/draft-${crypto.randomUUID()}`
      const path = `${member_id}/${leaf}`
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
    card_attributes,
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
