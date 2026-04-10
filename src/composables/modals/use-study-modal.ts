import { useModal } from '@/composables/modal'
import { emitSfx } from '@/sfx/bus'
import StudySession, {
  type StudySessionResponse
} from '@/components/modals/study-session/index.vue'
import SessionComplete from '@/components/modals/session-complete.vue'

export function useStudyModal() {
  const modal = useModal()

  async function start(deck: Deck) {
    emitSfx('ui.slide_up')
    const payload = await _openStudySession(deck)
    emitSfx('ui.slide_up')

    if (payload) {
      _openSessionComplete(payload)
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

    emitSfx('ui.negative_pop')
    const result = modal.open(SessionComplete, {
      backdrop: true,
      mode: 'popup',
      props: { score, total }
    })

    return result
  }

  return { start }
}
