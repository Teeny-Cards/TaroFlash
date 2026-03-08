import { onBeforeUnmount, computed } from 'vue'
import Toolbar, { type TextBlockType } from '@/utils/text-composer/toolbar'

export function useTextComposerToolbar() {
  function setFontSize(size: TextBlockType | 'p') {
    if (size === 'p') {
      Toolbar.setParagraph()
    } else {
      Toolbar.setHeading(size)
    }
  }

  onBeforeUnmount(() => {
    Toolbar.destroy()
  })

  return {
    setFontSize,
    block_type: computed(() => Toolbar.block_type),
    bold: computed(() => Toolbar.bold),
    italic: computed(() => Toolbar.italic),
    underline: computed(() => Toolbar.underline)
  }
}
