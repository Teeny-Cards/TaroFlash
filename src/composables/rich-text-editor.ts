import { ref, onUnmounted, computed } from 'vue'
import Quill, { type Range } from 'quill'
import { DividerBlot } from '@/utils/formats/divider-blot'
import { FontSizeBlot } from '@/utils/formats/font-size-blot'

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
type ActionConfig = {
  source?: 'user' | 'api' | 'silent'
  quill?: Quill
}

Quill.register(DividerBlot, true)
Quill.register(FontSizeBlot, true)

const TOOLBAR_HIDE_DELAY = 10

const active_quill = ref<Quill | null>(null)

let hide_timeout: number | null = null
let active_input: HTMLElement | null = null

const selection_format = ref<{ [key: string]: any }>()
const last_range = ref<Range | null>(null)

export function useRichTextEditor() {
  function attachEditor(el: HTMLElement, delta?: any, options: RenderOptions = {}) {
    const found = Quill.find(el)
    if (found instanceof Quill) return // already setup

    const q = new Quill(el, {
      modules: {
        toolbar: false,
        history: {
          userOnly: true
        }
      },
      ...options
    })

    _render(q, delta)

    if (!options.readOnly) {
      _attachListeners(q)
    }
  }

  // TOOLBAR ACTIONS
  function format(key: string, val: any) {
    const q = active_quill.value
    if (!q) return

    q.format(key, val, 'user')
  }

  function align(dir: Align, { source = Quill.sources.USER, quill }: ActionConfig = {}) {
    const q = quill ?? active_quill.value
    if (!q) return

    const range = last_range.value ?? q.getSelection(true)
    q.formatLine(range.index, range.length, 'align', dir || false, source)

    if (source === Quill.sources.USER) {
      _emitUpdate()
    }
  }

  function link(url?: string) {
    const q = active_quill.value
    if (!q) return
    const u = url ?? prompt('URL:') ?? ''
    if (!u) return
    q.format('link', u)
  }

  function divider() {
    if (!active_quill.value) return

    const range = active_quill.value.getSelection(true)
    active_quill.value.insertText(range.index, '\n', Quill.sources.USER)
    active_quill.value.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER)
    // active_quill.value.insertText(range.index + 2, '\n', Quill.sources.USER)
  }

  function list(type: 'bullet' | 'ordered' | false) {
    if (!active_quill.value) return
    active_quill.value.format('list', type)
  }

  function underline() {
    if (!active_quill.value) return

    const format = active_quill.value.getFormat()
    const isUnderlined = !!format.underline

    active_quill.value.format('underline', !isUnderlined)
    _emitUpdate()
  }

  // PRIVATE HELPERS
  function _activate(quill: Quill) {
    if (hide_timeout) {
      clearTimeout(hide_timeout)
      hide_timeout = null
    }

    active_quill.value = quill
    active_input = quill.container
    _emitActivated()
  }

  function _deactivate(expected_input: HTMLElement | null, delay = TOOLBAR_HIDE_DELAY) {
    if (hide_timeout) clearTimeout(hide_timeout)

    hide_timeout = window.setTimeout(() => {
      // Only clear if nobody else claimed active in the meantime
      if (active_input === expected_input) {
        active_input = null
        active_quill.value = null
        _emitDeactivated()
      }

      hide_timeout = null
    }, delay)
  }

  function _render(q: Quill, delta: any) {
    q.setContents(delta, Quill.sources.API)
    const isEmpty = q.getLength() === 1

    if (_isWhitespaceOnly(q) || isEmpty) {
      _resetToEmpty(q)
      align('center', { source: Quill.sources.API, quill: q })
    }
  }

  function _onEditorChanged(quill: Quill, eventName: string, ...args: any[]) {
    if (eventName === 'selection-change') {
      const [range, oldRange, source] = args as any

      if (range && !oldRange) {
        _activate(quill)
      } else if (!range && oldRange) {
        _deactivate(quill.container)
      }

      if (!range) return

      selection_format.value = quill?.getFormat(range)
      last_range.value = range
    }
  }

  function _onTextChange(_delta: any, _oldDelta: any, source: any) {
    if (source === 'api') return
    _emitUpdate()
  }

  function _emitActivated() {
    const event = new CustomEvent('activate')
    active_input?.dispatchEvent(event)
  }

  function _emitDeactivated() {
    const event = new CustomEvent('deactivate')
    active_input?.dispatchEvent(event)
  }

  function _emitUpdate(attributes?: CardAttributes) {
    if (active_quill.value) {
      const delta = active_quill.value?.getContents()
      const text = active_quill.value?.getText()
      const payload: TextEditorUpdatePayload = { delta, text, attributes }

      const el = active_quill.value.container
      const event = new CustomEvent('update', { detail: payload })
      el.dispatchEvent(event)
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
  }

  return {
    active: computed(() => active_quill.value !== null),
    active_input,
    selection_format,
    attachEditor,
    // toolbar actions
    textColor: (c?: string) => format('color', c || false),
    textBgColor: (c?: string) => format('background', c || false),
    textSize: (s?: number) => format('size', s ? `${s}px` : false),
    cardBgColor: (c?: MemberTheme) => _emitUpdate({ bg_color: c }),
    underline,
    align,
    verticalAlign: (v?: CardAttributes['vertical_align']) =>
      _emitUpdate({ vertical_align: v ?? 'top' }),
    link,
    divider,
    list
  }
}
