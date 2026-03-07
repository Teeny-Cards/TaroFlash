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
  HEADING
} from '@lexical/markdown'
import { $generateHtmlFromNodes } from '@lexical/html'
import { registerRichText } from '@lexical/rich-text'

const MARKDOWN_TRANSFORMERS = [HEADING]

const config: CreateEditorArgs = {
  namespace: 'text-composer',
  nodes: [HeadingNode],
  onError: console.error
}

export type EditorConfig = {
  content?: string
  onUpdate?: (markdown: string) => void
}

/**
 * TextComposer is a wrapper around Lexical that provides a simple API for registering
 * and managing multiple text editors in the DOM.
 */
class TextComposer {
  private lexical: LexicalEditor = createLexicalEditor(config)
  private headless: LexicalEditor = createHeadlessEditor(config)
  private unregister?: () => void
  private editors: Map<HTMLElement, EditorConfig> = new Map()

  constructor() {
    const unregisterUpdate = this.lexical.registerUpdateListener(this._onUpdate)
    const unregisterRichText = registerRichText(this.lexical)
    const unregisterMarkdown = registerMarkdownShortcuts(this.lexical, MARKDOWN_TRANSFORMERS)

    this.unregister = () => {
      unregisterUpdate()
      unregisterRichText()
      unregisterMarkdown()
    }
  }

  /**
   * Destroys the TextComposer instance.
   */
  destroy() {
    this.unregister?.()
    this.editors.clear()
  }

  /**
   * Registers an HTML element as a text editor (element must have the `contenteditable` attribute).
   * When the editor is focused, the lexical editor instance is attached to the element.
   * When the editor is blurred, the lexical editor instance is detached from the element
   * and the editor content is rendered as static HTML.
   *
   * @param rootEl The element to register as a text editor.
   * @param config Optional config for the editor.
   *  - content: Optional initial content as Markdown.
   *  - onUpdate: Optional callback to be called when the editor content changes.
   *
   * @returns A function to detach the editor from the element.
   */
  attachEditor(rootEl: HTMLElement, config: EditorConfig = {}) {
    if (!rootEl.hasAttribute('contenteditable')) {
      throw new Error('Element is not a contenteditable element')
    }

    this.editors.set(rootEl, { ...config })

    const boundFocusIn = this._onFocusIn.bind(this, rootEl)
    const boundFocusOut = this._onFocusOut.bind(this, rootEl)

    rootEl.addEventListener('focusin', boundFocusIn)
    rootEl.addEventListener('focusout', boundFocusOut)

    return () => {
      rootEl.removeEventListener('focusin', boundFocusIn)
      rootEl.removeEventListener('focusout', boundFocusOut)
    }
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
        $convertFromMarkdownString(md, MARKDOWN_TRANSFORMERS)
        html = $generateHtmlFromNodes(this.headless, null)
      },
      { discrete: true }
    )

    rootEl.innerHTML = html
  }

  /**
   * Finds the editor config for the current root element, if it exists.
   * Calls the onUpdate callback if it exists, passing the given Markdown content.
   *
   * @param markdown The Markdown content to pass to the onUpdate callback.
   */
  private _emitUpdate(markdown: string) {
    const rootEl = this.lexical.getRootElement()
    if (!rootEl) return

    const editor = this.editors.get(rootEl)
    editor?.onUpdate?.(markdown)
  }

  /**
   * Converts the current editor state to Markdown and emits the update.
   */
  private _onUpdate = ({ editorState }: { editorState: any }) => {
    let markdown = ''
    editorState.read(() => {
      markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS)
    })

    this._emitUpdate(markdown)
  }

  /**
   * Sets the lexical editor root element to the given element.
   * Converts the editor config content to the lexical state.
   *
   * @param rootEl The element to set as the lexical editor root.
   */
  private _onFocusIn(rootEl: HTMLElement) {
    this.lexical.setRootElement(rootEl)
    const markdown = this.editors.get(rootEl)?.content ?? ''

    this.lexical.update(() => {
      $convertFromMarkdownString(markdown, MARKDOWN_TRANSFORMERS)
    })
  }

  /**
   * Converts the current editor state to Markdown.
   * Updates the editor config content with the new Markdown.
   * Clears the lexical editor root element.
   * Renders the Markdown as static HTML in the editor element.
   */
  private _onFocusOut(rootEl: HTMLElement) {
    let markdown = ''

    this.lexical.getEditorState().read(() => {
      markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS)
    })

    const config = this.editors.get(rootEl)
    this.editors.set(rootEl, { ...config, content: markdown })
    this.lexical.setRootElement(null)
    this.renderStatic(rootEl, markdown)
  }
}

const text_composer = new TextComposer()
export default text_composer
