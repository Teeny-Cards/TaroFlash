import { useModal } from '@/composables/modal'
import { emitSfx } from '@/sfx/bus'
import StudySession, {
  type StudySessionResponse
} from '@/components/modals/study-session/index.vue'
import SessionComplete from '@/components/modals/study-session/session-complete.vue'

export function useStudyModal() {
  const modal = useModal()

  async function start(deck: Deck) {
    emitSfx('ui.slide_up')
    const payload = await _openStudySession(deck)
    emitSfx('ui.slide_up')

    if (payload) {
      await _openSessionComplete(payload)
      emitSfx('ui.slide_up')
    }
  }

  function _openStudySession(deck: Deck) {
    const result = modal.open<StudySessionResponse>(StudySession, {
      backdrop: true,
      mode: 'mobile-sheet',
      props: { deck }
    })

    return result.response
  }

  async function _openSessionComplete({ score, total }: StudySessionResponse) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    emitSfx('ui.music_pizz_duo_hi')
    const result = modal.open(SessionComplete, {
      backdrop: true,
      mode: 'mobile-sheet',
      props: { score, total }
    })

    return result.response
  }

  return { start }
}
