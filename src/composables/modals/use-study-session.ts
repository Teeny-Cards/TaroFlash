import { useModal } from '@/composables/modal'
import { emitSfx } from '@/sfx/bus'
import StudySession from '@/components/modals/study-session/index.vue'

export function useStudySessionModal() {
  const modal = useModal()

  function open(deck: Deck) {
    emitSfx('ui.slide_up')
    const result = modal.open(StudySession, {
      backdrop: true,
      props: { deck }
    })
    result.response.then(() => emitSfx('ui.slide_up'))
    return result
  }

  return { open }
}
