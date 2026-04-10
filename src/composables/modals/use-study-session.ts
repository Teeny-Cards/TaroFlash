import { useModal } from '@/composables/modal'
import { emitSfx } from '@/sfx/bus'
import StudySession, {
  type StudySessionResponse
} from '@/components/modals/study-session/index.vue'
import RewardDialog from '@/components/modals/reward-dialog/index.vue'

export function useStudySessionModal() {
  const modal = useModal()

  async function start(deck: Deck) {
    const payload = await _openStudySession(deck)

    if (payload) {
      _openRewardDialog(payload)
    }
  }

  function _openStudySession(deck: Deck) {
    emitSfx('ui.slide_up')

    const result = modal.open<StudySessionResponse>(StudySession, {
      backdrop: true,
      mode: 'mobile-sheet',
      props: { deck }
    })

    result.response.then(() => emitSfx('ui.slide_up'))

    return result.response
  }

  function _openRewardDialog(payload: StudySessionResponse) {
    emitSfx('ui.slide_up')

    const result = modal.open(RewardDialog, {
      backdrop: true,
      props: { ...payload }
    })

    result.response.then(() => emitSfx('ui.slide_up'))

    return result
  }

  return { start }
}
