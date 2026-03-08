import { onMounted, type ShallowRef, onBeforeUnmount, ref } from 'vue'
import { useLogger } from './logger'
import TextComposer, { type EditorConfig } from '@/utils/text-composer'

export function useTextComposer(editor: ShallowRef<HTMLElement | null>, config?: EditorConfig) {
  const logger = useLogger()
  const has_content = ref(false)
  let unregister: (() => void) | undefined = undefined

  onMounted(() => {
    if (!editor.value) {
      logger.error('use-text-composer: editor element is undefined')
      return
    }

    unregister = TextComposer.attachEditor(editor.value, { ...config, onUpdate: _onUpdate })
    has_content.value = Boolean(config?.content?.length ?? 0 > 0)

    if (config?.content) {
      TextComposer.renderStatic(editor.value, config.content)
    }
  })

  onBeforeUnmount(() => {
    unregister?.()
  })

  /**
   * Wraps the `onUpdate` callback from the `EditorConfig`.
   * Updates the `has_content` ref based on the length of the Markdown content.
   * @param md The Markdown content to check for length.
   */
  function _onUpdate(md: string) {
    has_content.value = Boolean(md?.length ?? 0 > 0)
    config?.onUpdate?.(md)
  }

  return {
    has_content
  }
}
