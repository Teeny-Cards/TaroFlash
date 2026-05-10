import { reactive, ref } from 'vue'
import { useDeleteDeckMutation } from '@/api/decks'
import { useUploadImageMutation } from '@/api/media'
import { useDeckActions } from '@/composables/deck/use-deck-actions'
import { useMemberStore } from '@/stores/member'
import { emitSfx } from '@/sfx/bus'
import type { ImageUploadPayload } from '@/components/image-uploader.vue'

/**
 * Reactive state + mutations for editing one deck (or staging a brand-new one
 * when `deck` is omitted). Owns the in-flight `settings` / `config` / `cover`
 * objects that the deck-settings tabs bind into, plus the persistence
 * helpers that flush them to the backend.
 */
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

  const active_side = ref<CardSide>('cover')

  const deck_actions = useDeckActions()
  const delete_mutation = useDeleteDeckMutation()
  const upload_image_mutation = useUploadImageMutation()

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
      await delete_mutation.mutateAsync(deck.id)
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
      const url = await upload_image_mutation.mutateAsync({
        bucket: 'decks',
        path,
        file: payload.file
      })
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

  /** Switch the design tab's previewed side. No-op when already active. */
  function setActiveSide(side: CardSide) {
    if (side === active_side.value) return
    emitSfx('ui.slide_up')
    active_side.value = side
  }

  return {
    settings,
    config,
    cover,
    card_attributes,
    cover_image_preview,
    cover_image_loading,
    active_side,
    saveDeck,
    deleteDeck,
    uploadImage,
    removeImage,
    setCoverImage,
    removeCoverImage,
    setActiveSide
  }
}
