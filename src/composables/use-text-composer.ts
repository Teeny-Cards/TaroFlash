import { onMounted, type ShallowRef, onBeforeUnmount } from 'vue'
import { useLogger } from './logger'
import TextComposer, { type EditorConfig } from '@/utils/text-composer'

export function useTextComposer(editor: ShallowRef<HTMLElement | null>, config?: EditorConfig) {
  const logger = useLogger()
  let unregister: (() => void) | undefined = undefined

  onMounted(() => {
    if (!editor.value) {
      logger.error('use-text-composer: editor element is undefined')
      return
    }

    unregister = TextComposer.attachEditor(editor.value, config)

    if (config?.content) {
      TextComposer.renderStatic(editor.value, config.content)
    }
  })

  onBeforeUnmount(() => {
    unregister?.()
  })
}
