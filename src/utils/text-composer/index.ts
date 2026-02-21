// editor.ts
import { ref } from 'vue'
import { normalizeEditorDom } from './dom/normalize'
import { domToDoc } from './transforms/dom-to-doc'
import { parseMarkdownLite, serializeMarkdownLite } from './transforms/markdown-lite'
import { docToHtml } from './transforms/html'
import { setBlockKind } from './commands/block'
import { toggleList } from './commands/list'
import type { TextBlockType } from './doc'

export default class TextComposer {
  static instance: TextComposer | null = null

  active_editor = ref<HTMLElement | null>(null)
  editors = new Set<HTMLElement>()
  private _isComposing = new WeakMap<HTMLElement, boolean>()

  static getInstance() {
    if (!TextComposer.instance) TextComposer.instance = new TextComposer()
    return TextComposer.instance
  }

  attachEditor(editor: HTMLElement) {
    if (this.editors.has(editor)) return

    editor.addEventListener('input', () => this._onInput(editor))
    editor.addEventListener('focusin', () => this._onFocusIn(editor))
    editor.addEventListener('focusout', () => this._onFocusOut(editor))

    editor.addEventListener('compositionstart', () => this._isComposing.set(editor, true))
    editor.addEventListener('compositionend', () => {
      this._isComposing.set(editor, false)
      this._emitUpdate(editor)
    })

    this.editors.add(editor)
  }

  getContent(editor: HTMLElement): string {
    normalizeEditorDom(editor)
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

  toggleList = () => {
    const editor = this.active_editor.value
    if (!editor) return
    const range = this._getRange()
    if (!range) return

    toggleList(editor, range)
    this._emitUpdate(editor)
  }

  activateEditor = (editor: HTMLElement) => {
    this.active_editor.value = editor
  }

  private _emitUpdate(editor: HTMLElement) {
    if (this._isComposing.get(editor)) return

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

  private _getRange(): Range | null {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    return sel.getRangeAt(0)
  }
}
