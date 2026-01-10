import { ref, onUnmounted } from 'vue'
import Quill, { type Range } from 'quill'
import { useLogger } from '@/composables/logger'
import { DividerBlot } from '@/utils/formats/divider-blot'
import { FontSizeBlot } from '@/utils/formats/font-size-blot'
import { ImageBlot, type ImageValue } from '@/utils/formats/image-blot'

export type TextEditorUpdatePayload = {
  delta?: Object
  text?: string
  attributes?: CardAttributes
}

export type CardAttributes = {
  bg_color?: MemberTheme
  vertical_align?: 'top' | 'center' | 'bottom'
}

export type RenderOptions = {
  placeholder?: string
  readOnly?: boolean
}

type Align = 'center' | 'right' | 'justify' | false

Quill.register(DividerBlot, true)
Quill.register(FontSizeBlot, true)
Quill.register(ImageBlot, true)

const TOOLBAR_HIDE_DELAY = 10

let hide_timeout: number | null = null
let active_quill: Quill | null = null
let active_input: HTMLElement | null = null
let active_input_onUpdate: null | ((payload: TextEditorUpdatePayload) => void) = null
const activate_handlers = new Set<() => void>()
const deactivate_handlers = new Set<() => void>()
const removed_images_per_quill = new Map<Quill, Set<string>>()
const image_ids_per_quill = new Map<Quill, Set<string>>()

const selection_format = ref<{ [key: string]: any }>()
const last_range = ref<Range | null>(null)

export function useRichTextEditor() {
  const logger = useLogger()

  // PUBLIC API
  function activate(editor: HTMLElement | null) {
    if (hide_timeout) {
      clearTimeout(hide_timeout)
      hide_timeout = null
    }

    if (editor) {
      const found = Quill.find(editor)

      if (found instanceof Quill) {
        active_quill = found
        _onEditorChanged(found, 'editor-change', null)
      }
    } else {
      active_quill = null
      logger.warn('Failed to activate editor: ', editor)
    }

    active_input = editor ?? null
    activate_handlers.forEach((h) => h())
  }

  function deactivate(expected_input: HTMLElement | null, delay = TOOLBAR_HIDE_DELAY) {
    if (hide_timeout) clearTimeout(hide_timeout)

    hide_timeout = window.setTimeout(() => {
      // Only clear if nobody else claimed active in the meantime
      if (active_input === expected_input) {
        active_input = null
        deactivate_handlers.forEach((h) => h())
      }

      hide_timeout = null
    }, delay)
  }

  function setup(el: HTMLElement, delta?: any, options: RenderOptions = {}) {
    const found = Quill.find(el)
    if (found instanceof Quill) return

    const q = new Quill(el, {
      modules: {
        toolbar: false,
        history: {
          userOnly: true
        }
      },
      ...options
    })

    if (delta) {
      q.setContents(delta, Quill.sources.API)

      if (_isWhitespaceOnly(q)) {
        _resetToEmpty(q)
      }
    }

    if (!options.readOnly) {
      _attachListeners(q)
    }
  }

  // EVENT SUBSCRIPTION
  function subscribe(callback: (delta: any, text?: string) => void) {
    active_input_onUpdate = callback
  }

  function unsubscribe(callback: (delta: any, text?: string) => void) {
    if (active_input_onUpdate === callback) {
      active_input_onUpdate = null
    }
  }

  function onActivate(handler: () => void) {
    activate_handlers.add(handler)

    onUnmounted(() => {
      activate_handlers.delete(handler)
    })
  }

  function onDeactivate(handler: () => void) {
    deactivate_handlers.add(handler)

    onUnmounted(() => {
      deactivate_handlers.delete(handler)
    })
  }

  // TOOLBAR ACTIONS
  function format(key: string, val: any) {
    const q = active_quill
    if (!q) return

    q.format(key, val, 'user')
  }

  function align(dir: Align) {
    if (!active_quill) return

    const range = last_range.value ?? active_quill.getSelection(true)
    active_quill.formatLine(range.index, range.length, 'align', dir || false, Quill.sources.USER)
    _emitChanged()
  }

  function link(url?: string) {
    const q = active_quill
    if (!q) return
    const u = url ?? prompt('URL:') ?? ''
    if (!u) return
    q.format('link', u)
  }

  function divider() {
    if (!active_quill) return

    const range = active_quill.getSelection(true)
    active_quill.insertText(range.index, '\n', Quill.sources.USER)
    active_quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER)
    // active_quill.insertText(range.index + 2, '\n', Quill.sources.USER)
  }

  function list(type: 'bullet' | 'ordered' | false) {
    if (!active_quill) return
    active_quill.format('list', type)
  }

  function underline() {
    if (!active_quill) return

    const format = active_quill.getFormat()
    const isUnderlined = !!format.underline

    active_quill.format('underline', !isUnderlined)
    _emitChanged()
  }

  function image(value: ImageValue) {
    const q = active_quill
    if (!q || !value.url || !value.id) return

    const images = image_ids_per_quill.get(q) ?? new Set()
    images.add(value.id)
    image_ids_per_quill.set(q, images)

    const range = q.getSelection(true)
    const index = range ? range.index : q.getLength()

    q.insertEmbed(index, 'image', value, Quill.sources.USER)
    q.setSelection(index, 0, Quill.sources.SILENT)
  }

  // PRIVATE HELPERS
  function _onEditorChanged(quill: Quill, eventName: string, ...args: any[]) {
    if (eventName === 'selection-change') {
      let range = args[0]
      if (!range) return

      selection_format.value = quill?.getFormat(range)
      last_range.value = range
    }
  }

  function _onTextChange(_delta: any, _oldDelta: any, source: any) {
    if (source === 'api') return
    _emitChanged()
  }

  function _emitChanged(attributes?: CardAttributes) {
    if (active_quill && active_input_onUpdate) {
      const delta = active_quill?.getContents()
      const text = active_quill?.getText()

      active_input_onUpdate({ delta, text, attributes })
      removed_images_per_quill.delete(active_quill)
      image_ids_per_quill.delete(active_quill)
    }
  }

  function _syncSelection(q: Quill) {
    const r = q.getSelection()
    if (r) {
      last_range.value = r
      selection_format.value = q.getFormat(r)
    }
  }

  function _isWhitespaceOnly(quill: Quill) {
    // Quill always has a trailing newline.
    // If everything except the final newline is whitespace, treat as empty.
    const text = quill.getText() // includes trailing '\n'
    return text.replace(/\n$/, '').trim().length === 0
  }

  function _resetToEmpty(quill: Quill) {
    // This is the canonical “empty editor” state for Quill
    quill.setContents([{ insert: '\n' }], Quill.sources.API)
  }

  function _attachListeners(q: Quill) {
    q.on('editor-change', (eventName: string, ...args: any[]) =>
      _onEditorChanged(q, eventName, ...args)
    )
    q.on('text-change', _onTextChange)
    q.root.addEventListener('mouseup', () => _syncSelection(q))

    q.root.addEventListener('keyup', (e: KeyboardEvent) => {
      // especially important for Shift+Up/Down
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Shift') {
        // next frame to let the browser update selection/layout
        requestAnimationFrame(() => _syncSelection(q))
      }
    })

    q.root.addEventListener('keydown', (e: KeyboardEvent) => {
      const isSelectAll = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a'
      if (!isSelectAll) return

      setTimeout(() => {
        _syncSelection(q)
        const r = q.getSelection()
        if (r) _onEditorChanged(q, 'selection-change', r)
      }, 10)
    })

    q.on('image-delete', (id: string) => {
      const images = removed_images_per_quill.get(q) ?? new Set()
      images.add(id)
      removed_images_per_quill.set(q, images)
    })
  }

  return {
    active_input,
    selection_format,
    activate,
    deactivate,
    setup,
    subscribe,
    unsubscribe,
    onActivate,
    onDeactivate,
    // toolbar actions
    textColor: (c?: string) => format('color', c || false),
    textBgColor: (c?: string) => format('background', c || false),
    textSize: (s?: number) => format('size', s ? `${s}px` : false),
    cardBgColor: (c?: MemberTheme) => _emitChanged({ bg_color: c }),
    underline,
    align,
    link,
    divider,
    list,
    image
  }
}
