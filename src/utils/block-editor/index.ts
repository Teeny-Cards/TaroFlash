import { ref } from 'vue'
import { markdownLiteToHtml, normalizeEditorDom, textFromNode } from './utils'

export type EditorSettings = {
  horizontal_align?: 'left' | 'center' | 'right'
  vertical_align?: 'top' | 'middle' | 'bottom'
  content?: string
}

export default class BlockEditor {
  static instance: BlockEditor | null = null

  active_editor = ref<HTMLElement | null>(null)
  editors = new Set<HTMLElement>()

  static getInstance() {
    if (!BlockEditor.instance) {
      BlockEditor.instance = new BlockEditor()
    }

    return BlockEditor.instance
  }

  attachEditor(editor: HTMLElement) {
    if (this.editors.has(editor)) return

    editor.addEventListener('input', (e) => this._onInput(editor, e))
    editor.addEventListener('focusin', (e) => this._onFocusIn(editor, e))
    editor.addEventListener('focusout', (e) => this._onFocusOut(editor, e))

    this.editors.add(editor)
  }

  /**
   * Convert editor DOM -> markdown-lite.
   * Supports:
   *  - H1/H2/H3 => #/##/###
   *  - UL/LI    => - item
   *  - P        => paragraph line
   *
   * Notes:
   *  - Blank lines separate blocks.
   *  - UL becomes consecutive "- " lines.
   */
  getContent(root: HTMLElement): string {
    const out: string[] = []

    const children = Array.from(root.children) as HTMLElement[]

    for (const child of children) {
      const tag = child.tagName

      if (tag === 'H1') {
        const t = textFromNode(child)
        if (t) out.push(`# ${t}`, '') // blank line after block
        continue
      }

      if (tag === 'H2') {
        const t = textFromNode(child)
        if (t) out.push(`## ${t}`, '')
        continue
      }

      if (tag === 'H3') {
        const t = textFromNode(child)
        if (t) out.push(`### ${t}`, '')
        continue
      }

      if (tag === 'P') {
        const t = textFromNode(child)
        if (t) out.push(t)
        else out.push('')
        continue
      }

      if (tag === 'UL') {
        const items = Array.from(child.querySelectorAll(':scope > li')) as HTMLElement[]
        for (const li of items) {
          const t = textFromNode(li)
          // keep empty list items out for MVP
          if (t) out.push(`- ${t}`)
        }
        out.push('') // blank line after list block
        continue
      }

      // Anything unexpected: treat as paragraph fallback
      const fallback = textFromNode(child)
      if (fallback) out.push(fallback, '')
    }

    // Remove trailing blank lines
    while (out.length && out[out.length - 1] === '') out.pop()

    return out.join('\n')
  }

  /**
   * Set editor DOM content from markdown-lite.
   * - Only supports: headers (#/##/###), unordered lists (-/*), paragraphs
   * - Escapes HTML
   * - Normalizes DOM for editable caret behavior
   */
  setContent(editor: HTMLElement, markdown: string) {
    editor.innerHTML = markdownLiteToHtml(markdown)
    normalizeEditorDom(editor)
  }

  private _onInput(editor: HTMLElement, e: Event) {
    e.preventDefault()
    e.stopPropagation()

    const md = this.getContent(editor)
    const event = new CustomEvent('update', { detail: md })

    editor.dispatchEvent(event)
  }

  private _onFocusIn(editor: HTMLElement, e: Event) {
    e.preventDefault()
    e.stopPropagation()

    this.active_editor.value = editor
    const event = new CustomEvent('activate')
    editor.dispatchEvent(event)
  }

  private _onFocusOut(editor: HTMLElement, e: Event) {
    e.preventDefault()
    e.stopPropagation()

    this.active_editor.value = null
    const event = new CustomEvent('deactivate')
    editor.dispatchEvent(event)
  }
}
