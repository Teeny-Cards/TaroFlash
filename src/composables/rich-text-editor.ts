import { ref } from 'vue'
import Quill, { type Range } from 'quill'
import { useLogger } from '@/composables/logger'

const TOOLBAR_HIDE_DELAY = 10

type Target = HTMLElement | null
type Align = 'left' | 'center' | 'right' | 'justify'

let hide_timeout: number | null = null

const active_toolbar = ref<HTMLElement | null>(null)
const active_el = ref<Target>(null)
const active_quill = ref<Quill | null>(null)
const selection_format = ref<{ [key: string]: any }>()
const active_callback = ref<((delta: any, text?: string) => void) | null>(null)

export function useRichTextEditor() {
  const logger = useLogger()

  function setToolbar(el: HTMLElement | null) {
    active_toolbar.value = el
  }

  function activate(editor: HTMLElement | null) {
    if (hide_timeout) {
      clearTimeout(hide_timeout)
      hide_timeout = null
    }

    if (editor && active_toolbar.value) {
      active_quill.value = new Quill(editor, {
        modules: { toolbar: active_toolbar.value }
      })

      active_quill.value.on('editor-change', onEditorChanged)
      active_quill.value.on('text-change', onTextChange)
      onEditorChanged(null)
    } else {
      active_quill.value = null
      logger.warn('Failed to set active editor. Toolbar not set.')
    }

    active_el.value = editor ?? null
  }

  function deferDeactivate(expectedEl: HTMLElement | null, delay = TOOLBAR_HIDE_DELAY) {
    if (hide_timeout) clearTimeout(hide_timeout)

    hide_timeout = window.setTimeout(() => {
      // Only clear if nobody else claimed active in the meantime
      if (active_el.value === expectedEl) active_el.value = null
      hide_timeout = null
    }, delay)
  }

  function formatInline(key: string, val: any) {
    const q = active_quill.value
    if (!q) return
    q.format(key, val)
  }

  function header(level: '' | 1 | 2 | 3) {
    const q = active_quill.value
    if (!q) return
    q.format('header', level === '' ? false : level)
  }

  function align(dir: Align) {
    const q = active_quill.value
    if (!q) return
    q.format('align', dir || false)
  }

  function link(url?: string) {
    const q = active_quill.value
    if (!q) return
    const u = url ?? prompt('URL:') ?? ''
    if (!u) return
    q.format('link', u)
  }

  function onEditorChanged(r: Range | null) {
    let range = r ?? active_quill.value?.getSelection()
    if (!range) return

    selection_format.value = active_quill.value?.getFormat(range)
  }

  function onTextChange(delta: any, oldDelta: any, source: any) {
    if (source === 'api') return
    if (active_callback.value) {
      const delta = active_quill.value?.getContents()
      const text = active_quill.value?.getText()
      active_callback.value(delta, text)
    }
  }

  function subscribe(callback: (delta: any, text?: string) => void) {
    active_callback.value = callback
  }

  function unsubscribe(callback: (delta: any, text?: string) => void) {
    if (active_callback.value === callback) {
      active_callback.value = null
    }
  }

  function render(el: HTMLElement, delta?: any, placeholder?: string) {
    let q = new Quill(el, {
      modules: { toolbar: false },
      placeholder
    })

    if (delta) {
      q.setContents(delta, 'api')
    }

    q.disable()
    ;(q as any) = null
  }

  return {
    active_el,
    selection_format,
    setToolbar,
    activate,
    deferDeactivate,
    render,
    subscribe,
    unsubscribe,
    // toolbar actions
    bold: () => formatInline('bold', true),
    italic: () => formatInline('italic', true),
    clearBold: () => formatInline('bold', false),
    clearItalic: () => formatInline('italic', false),
    color: (c?: string) => formatInline('color', c || false),
    background: (c?: string) => formatInline('background', c || false),
    header,
    align,
    link
  }
}
