import { ref } from 'vue'
import { markdownLiteToHtml, normalizeEditorDom, htmlToMarkdownLite } from './utils'
import {
  setBlock as upstreamSetBlock,
  toggleBullets as upstreamToggleBullets,
  type SupportedTag
} from './format'

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
  getContent(editor: HTMLElement): string {
    normalizeEditorDom(editor)
    return htmlToMarkdownLite(editor)
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

  setBlock = (tag: SupportedTag) => {
    if (!this.active_editor.value) return

    upstreamSetBlock(this.active_editor.value, tag)
    this._emitUpdate(this.active_editor.value)
  }

  toggleBullets = () => {
    if (!this.active_editor.value) return

    upstreamToggleBullets(this.active_editor.value)
    this._emitUpdate(this.active_editor.value)
  }

  activateEditor = (editor: HTMLElement) => {
    this.active_editor.value = editor
  }

  private _emitUpdate = (editor: HTMLElement) => {
    const md = this.getContent(editor)
    const event = new CustomEvent('update', { detail: md })
    editor.dispatchEvent(event)
  }

  private _onInput = (editor: HTMLElement, e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    this._emitUpdate(editor)
  }

  private _onFocusIn = (editor: HTMLElement, e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    this.activateEditor(editor)
    const event = new CustomEvent('activate')
    editor.dispatchEvent(event)
  }

  private _onFocusOut = (editor: HTMLElement, e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    this.active_editor.value = null
    const event = new CustomEvent('deactivate')
    editor.dispatchEvent(event)
  }
}
