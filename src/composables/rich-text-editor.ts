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
  front_image?: string
  back_image?: string
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
        _onEditorChanged(null)
      }
    } else {
      active_quill = null
      logger.warn('Failed to set active editor. Toolbar not set.')
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

  function render(el: HTMLElement, delta?: any, options: RenderOptions = {}) {
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
    }

    if (!options.readOnly) {
      q.on('editor-change', _onEditorChanged)
      q.on('text-change', _onTextChange)
      q.on('image-delete', (id: string) => {
        const images = removed_images_per_quill.get(q) ?? new Set()
        images.add(id)
        removed_images_per_quill.set(q, images)
      })
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

    console.log('format', key, val)
    q.format(key, val, 'user')
  }

  function align(dir: Align) {
    if (!active_quill) return

    active_quill.format('align', dir || false)
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
  function _onEditorChanged(_r: Range | null) {
    let range = active_quill?.getSelection()
    if (!range) return

    selection_format.value = active_quill?.getFormat(range)
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

  return {
    active_input,
    selection_format,
    activate,
    deactivate,
    render,
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
