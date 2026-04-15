import { ref, watch, type Ref } from 'vue'
import type { StudyCard } from './study-session-core'

/**
 * Owns the editing/saving state for the active study card. Mutates the
 * CardRecord in place via its debounced `update()` so the FSRS queue and
 * rendered card stay in sync without a second data-path.
 */
export function useCardEdit(active_card: Ref<StudyCard | undefined>) {
  const editing = ref(false)
  const saving = ref(false)

  watch(
    () => active_card.value?.id,
    () => {
      editing.value = false
    }
  )

  function start() {
    if (!active_card.value) return
    editing.value = true
  }

  function stop() {
    editing.value = false
  }

  async function update(side: 'front' | 'back', text: string) {
    const card = active_card.value
    if (!card) return
    saving.value = true
    await card.update({ [`${side}_text`]: text })
    saving.value = false
  }

  return { editing, saving, start, stop, update }
}
