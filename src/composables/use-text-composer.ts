import { onMounted, type ShallowRef } from 'vue'
import { useLogger } from './logger'
import TextComposer from '@/utils/text-composer'

export type EditorSettings = {
  horizontal_align?: 'left' | 'center' | 'right'
  vertical_align?: 'top' | 'middle' | 'bottom'
  content?: string
}

export function useTextComposer(editor: ShallowRef<HTMLElement | null>, settings?: EditorSettings) {
  const logger = useLogger()
  const text_composer = TextComposer.getInstance()

  onMounted(() => {
    if (!editor.value) {
      logger.error('use-text-composer: editor element is undefined')
      return
    }

    text_composer.attachEditor(editor.value)

    if (settings?.content) {
      text_composer.setContent(editor.value, settings.content)
    }
  })

  function setActive() {
    if (!editor.value) return
    text_composer.activateEditor(editor.value)
  }

  return {
    setActive
  }
}
