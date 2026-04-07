import { useModal } from '@/composables/modal'
import StudySession from '@/components/modals/study-session/index.vue'

export function useStudySessionModal() {
  const modal = useModal()

  function open(deck: Deck) {
    return modal.open(StudySession, {
      backdrop: true,
      props: {
        deck
      },
      openAudio: 'ui.slide_up',
      closeAudio: 'ui.slide_up'
    })
  }

  return { open }
}
