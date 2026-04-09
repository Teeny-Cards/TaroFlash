// editor.ts
import {
  createEditor as createLexicalEditor,
  type CreateEditorArgs,
  type LexicalEditor
} from 'lexical'
import { createHeadlessEditor } from '@lexical/headless'
import { HeadingNode } from '@lexical/rich-text'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  registerMarkdownShortcuts,
  HEADING,
  UNORDERED_LIST
} from '@lexical/markdown'
import { $generateHtmlFromNodes } from '@lexical/html'
import { registerRichText } from '@lexical/rich-text'
import { registerList, ListNode, ListItemNode } from '@lexical/list'

const MARKDOWN_TRANSFORMERS = [HEADING, UNORDERED_LIST]

const lexical_config: CreateEditorArgs = {
  namespace: 'text-composer',
  nodes: [HeadingNode, ListNode, ListItemNode]
}

export type EditorConfig = {
  content?: string
  disabled?: boolean
  onUpdate?: (markdown: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

/**
 * TextComposer is a wrapper around Lexical that provides a simple API for registering
 * and managing multiple text editors in the DOM.
 */
class TextComposer {
  private lexical: LexicalEditor = createLexicalEditor(lexical_config)
  private headless: LexicalEditor = createHeadlessEditor(lexical_config)
  private editors: Map<HTMLElement, EditorConfig> = new Map()
  private editor_content_cache: Map<HTMLElement, string> = new Map()
  private unregister?: () => void

  constructor() {
    const unregisterUpdate = this.lexical.registerUpdateListener(this._onUpdate)
    const unregisterRichText = registerRichText(this.lexical)
    const unregisterList = registerList(this.lexical)
    const unregisterMarkdown = registerMarkdownShortcuts(this.lexical, MARKDOWN_TRANSFORMERS)

    this.unregister = () => {
      unregisterUpdate()
      unregisterRichText()
      unregisterList()
      unregisterMarkdown()
    }
  }

  /**
   * Destroys the TextComposer instance.
   */
  destroy() {
    this.unregister?.()
    this.editors.clear()
    this.editor_content_cache.clear()
  }

  /**
   * Returns the lexical editor instance.
   */
  getEditor() {
    return this.lexical
  }

  focusEditor(rootEl: HTMLElement) {
    rootEl.focus()
  }

  /**
   * Returns the active root element, if it exists.
   */
  getActiveRoot() {
    return this.lexical.getRootElement()
  }

  hasActiveRoot() {
    return this.getActiveRoot() !== null
  }

  getEditorContentCache(rootEl: HTMLElement) {
    return this.editor_content_cache.get(rootEl)
  }

  setEditorContentCache(md: string, { rootEl }: { rootEl?: HTMLElement } = {}) {
    const el = rootEl ?? this.getActiveRoot()
    if (!el) return

    this.editor_content_cache.set(el, md)
  }

  /**
   * Registers an HTML element as a text editor.
   * When the editor is focused, the lexical editor instance is attached to the element.
   * When the editor is blurred, the lexical editor instance is detached from the element
   * and the editor content is rendered as static HTML.
   *
   * @param rootEl The element to register as a text editor.
   * @param config Optional config for the editor.
   *  - content: Optional initial content as Markdown.
   *  - onUpdate: Optional callback to be called when the editor content changes.
   *  - disabled: Optional flag to disable the editor.
   *
   * @returns A function to detach the editor from the element.
   */
  attachEditor(rootEl: HTMLElement, config: EditorConfig = {}) {
    if (config.disabled) return

    this.editors.set(rootEl, { ...config })
    this.setEditorContentCache(config.content ?? '', { rootEl })

    const boundFocusIn = this._focusEditor.bind(this, rootEl)
    const boundFocusOut = this._blurEditor.bind(this)

    rootEl.setAttribute('contenteditable', 'true')
    rootEl.addEventListener('focusin', boundFocusIn)
    rootEl.addEventListener('focusout', boundFocusOut)

    return () => {
      rootEl.setAttribute('contenteditable', 'false')
      rootEl.removeEventListener('focusin', boundFocusIn)
      rootEl.removeEventListener('focusout', boundFocusOut)
    }
  }

  /**
   * Registers a listener to lexical editor updates.
   * Editor updates when:
   *  - the editor's root element changes.
   *  - the editor's content changes.
   *  - the editor's selection changes.
   *
   * @param listener The listener to be called.
   * @returns A function to remove the listener.
   */
  registerUpdateListener(listener: () => void) {
    return this.lexical.registerUpdateListener(listener)
  }

  /**
   * Renders the given Markdown as HTML in the given element.
   * Uses a headless editor instance to convert the Markdown to HTML.
   * Sets the HTML to the element's innerHTML.
   *
   * @param rootEl The element to render the HTML in.
   * @param md The Markdown to render.
   */
  renderStatic(rootEl: HTMLElement, md: string) {
    let html = ''

    this.headless.update(
      () => {
        $convertFromMarkdownString(md, MARKDOWN_TRANSFORMERS, undefined, true)
      },
      { discrete: true }
    )

    this.headless.getEditorState().read(() => {
      html = $generateHtmlFromNodes(this.headless, null)
    })

    rootEl.innerHTML = html
  }

  /**
   * Finds the editor config for the current root element, if it exists.
   * Calls the onUpdate callback if it exists, passing the given Markdown content.
   *
   * @param markdown The Markdown content to pass to the onUpdate callback.
   */
  private _emitUpdate(markdown: string) {
    const rootEl = this.getActiveRoot()
    if (!rootEl) return

    const editor = this.editors.get(rootEl)
    editor?.onUpdate?.(markdown)
  }

  /**
   * Sets the lexical editor root element to the given element.
   * Finds the last known `content` state for the given element, if it exists,
   * and populates the editor with it.
   *
   * @param rootEl The element to set as the lexical editor root.
   */
  private _focusEditor(rootEl: HTMLElement) {
    this.lexical.setRootElement(rootEl)
    const markdown = this.getEditorContentCache(rootEl) ?? ''

    this.lexical.update(() => {
      $convertFromMarkdownString(markdown, MARKDOWN_TRANSFORMERS, undefined, true)
    })

    this.editors.get(rootEl)?.onFocus?.()
  }

  /**
   * Converts the current editor state to Markdown.
   * Caches the new Markdown in the editor content cache.
   * Clears the lexical editor root element.
   * Renders the Markdown as static HTML in the editor element.
   */
  private _blurEditor() {
    let markdown = ''
    const rootEl = this.getActiveRoot()

    if (!rootEl) return

    this.lexical.getEditorState().read(() => {
      markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS, undefined, true)
    })

    this.setEditorContentCache(markdown)
    this.lexical.setRootElement(null)
    this.renderStatic(rootEl, markdown)

    this.editors.get(rootEl)?.onBlur?.()
  }

  /**
   * Converts the current editor state to Markdown and emits the update.
   */
  private _onUpdate = ({ editorState }: { editorState: any }) => {
    let markdown = ''
    editorState.read(() => {
      markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS, undefined, true)
    })

    this._emitUpdate(markdown)
  }
}

const text_composer = new TextComposer()
export default text_composer
