// editor.ts
import { ref } from 'vue'
import { normalizeEditorDom } from './dom/normalize'
import { domToDoc } from './transforms/html-to-doc'
import { parseMarkdownLite, serializeMarkdownLite } from './transforms/markdown-lite'
import { docToHtml } from './transforms/doc-to-html'
import { setBlockKind } from './commands/block'
import { toggleList as upstreamToggleList } from './commands/list'
import type { TextBlockType } from './doc'
import { interceptEnter } from './dom/enter'

export default class TextComposer {
  static instance: TextComposer | null = null

  private active_editor = ref<HTMLElement | null>(null)
  private editors = new Set<HTMLElement>()
  private is_composing = new WeakMap<HTMLElement, boolean>()

  static getInstance() {
    if (!TextComposer.instance) TextComposer.instance = new TextComposer()
    return TextComposer.instance
  }

  attachEditor(editor: HTMLElement) {
    if (this.editors.has(editor)) return

    editor.addEventListener('input', () => this._onInput(editor))
    editor.addEventListener('focusin', () => this._onFocusIn(editor))
    editor.addEventListener('focusout', () => this._onFocusOut(editor))
    editor.addEventListener('keydown', (e) => this._onEnter(e, editor))

    editor.addEventListener('compositionstart', () => this.is_composing.set(editor, true))
    editor.addEventListener('compositionend', () => {
      this.is_composing.set(editor, false)
      this._emitUpdate(editor)
    })

    this.editors.add(editor)
  }

  getContent(editor: HTMLElement): string {
    const doc = domToDoc(editor)
    return serializeMarkdownLite(doc)
  }

  setContent(editor: HTMLElement, markdown: string) {
    const doc = parseMarkdownLite(markdown)
    editor.innerHTML = docToHtml(doc)
    normalizeEditorDom(editor)
  }

  setBlock = (kind: TextBlockType) => {
    const editor = this.active_editor.value
    if (!editor) return
    const range = this._getRange()
    if (!range) return

    setBlockKind(editor, range, kind)
    this._emitUpdate(editor)
  }

  /** NOT SUPPORTED IN MVP */
  toggleList = () => {
    const editor = this.active_editor.value
    if (!editor) return
    const range = this._getRange()
    if (!range) return

    upstreamToggleList(editor, range)
    this._emitUpdate(editor)
  }

  activateEditor = (editor: HTMLElement) => {
    this.active_editor.value = editor
  }

  private _emitUpdate(editor: HTMLElement) {
    if (this.is_composing.get(editor)) return

    const md = this.getContent(editor)
    editor.dispatchEvent(new CustomEvent('update', { detail: md }))
  }

  private _onInput(editor: HTMLElement) {
    this._emitUpdate(editor)
  }

  private _onFocusIn(editor: HTMLElement) {
    this.activateEditor(editor)
    editor.dispatchEvent(new CustomEvent('activate'))
  }

  private _onFocusOut(editor: HTMLElement) {
    if (this.active_editor.value === editor) this.active_editor.value = null
    editor.dispatchEvent(new CustomEvent('deactivate'))
  }

  private _onEnter(e: KeyboardEvent, editor: HTMLElement) {
    if (e.key !== 'Enter') return
    const range = this._getRange()
    if (!range) return

    if (interceptEnter(range)) {
      e.preventDefault()
      this._emitUpdate(editor)
    }
  }

  private _getRange(): Range | null {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    return sel.getRangeAt(0)
  }
}
