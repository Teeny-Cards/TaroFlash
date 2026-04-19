import { defineAsyncComponent } from 'vue'
import { useModal } from '@/composables/modal'
import { emitSfx } from '@/sfx/bus'
import type { DeckSettingsResponse } from '@/components/modals/deck-settings/index.vue'

const DeckSettings = defineAsyncComponent(
  () => import('@/components/modals/deck-settings/index.vue')
)

export function useDeckSettingsModal() {
  const modal = useModal()

  function open(deck?: Deck) {
    emitSfx('ui.etc_camera_reel')
    const result = modal.open<DeckSettingsResponse>(DeckSettings, {
      backdrop: true,
      mode: 'mobile-sheet',
      props: { deck }
    })
    result.response.then(() => emitSfx('ui.card_drop'))
    return result
  }

  return { open }
}
