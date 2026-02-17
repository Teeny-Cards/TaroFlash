import { onMounted, type ShallowRef } from 'vue'
import { useLogger } from './logger'
import BlockEditor, { type EditorSettings } from '@/utils/block-editor'

export function useBlockEditor(editor: ShallowRef<HTMLElement | null>, settings?: EditorSettings) {
  const logger = useLogger()
  const block_editor = BlockEditor.getInstance()

  onMounted(() => {
    if (!editor.value) {
      logger.error('use-block-editor: editor element is undefined')
      return
    }

    block_editor.attachEditor(editor.value)

    if (settings?.content) {
      block_editor.setContent(editor.value, settings.content)
    }
  })

  function setActive() {
    block_editor.active_editor.value = editor.value
  }

  return {
    setActive
  }
}
