import { closestBlock, isTextTagName, kindToTag, setCaretToStart } from './utils'
import { normalizeEditorDom } from '../dom/normalize'
import type { TextBlockType } from '../doc'
import { ensureTextBlockInLi } from './list'

export function makeEmptyP(): HTMLParagraphElement {
  const p = document.createElement('p')
  p.appendChild(document.createElement('br'))
  return p
}

export function replaceTag(block: HTMLElement, tag: 'p' | 'h1' | 'h2' | 'h3') {
  if (block.tagName.toLowerCase() === tag) return block

  const next = document.createElement(tag)
  while (block.firstChild) next.appendChild(block.firstChild)
  block.replaceWith(next)
  return next
}

/**
 * Command: set block kind (p/h1/h2/h3), supporting headers INSIDE list items.
 * Selection is explicit.
 */
export function setBlockKind(root: HTMLElement, range: Range, kind: TextBlockType) {
  normalizeEditorDom(root)

  const block = closestBlock(range.startContainer)
  if (!block) return

  // inside list item -> apply to LI's text container (p/h*)
  if (block.tagName === 'LI') {
    const textBlock = ensureTextBlockInLi(block)
    const next = replaceTag(textBlock, kindToTag(kind))
    normalizeEditorDom(root)
    setCaretToStart(next)
    return
  }

  // normal blocks
  if (isTextTagName(block.tagName)) {
    const next = replaceTag(block, kindToTag(kind))
    normalizeEditorDom(root)
    setCaretToStart(next)
  }
}

export function insertHr(root: HTMLElement, range: Range) {
  normalizeEditorDom(root)

  const block = closestBlock(range.startContainer)
  if (!block) return

  const hr = document.createElement('hr')
  block.after(hr)
  normalizeEditorDom(root)
  setCaretToStart(hr)
}
