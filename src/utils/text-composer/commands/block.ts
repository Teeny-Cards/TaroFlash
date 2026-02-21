import { normalizeEditorDom } from '../dom/normalize'
import type { TextBlockType } from '../doc'

function kindToTag(kind: TextBlockType): 'p' | 'h1' | 'h2' | 'h3' {
  return kind
}

function isTextTagName(tagName: string) {
  return tagName === 'H1' || tagName === 'H2' || tagName === 'H3' || tagName === 'P'
}

function closestBlock(node: Node | null): HTMLElement | null {
  const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
  if (!el) return null

  // Important: include UL? no. Commands operate on p/h*/li content
  return el.closest('li, p, h1, h2, h3') as HTMLElement | null
}

function setCaretToStart(el: HTMLElement) {
  const range = document.createRange()
  const sel = window.getSelection()
  range.selectNodeContents(el)
  range.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(range)
}

function replaceTag(block: HTMLElement, tag: 'p' | 'h1' | 'h2' | 'h3') {
  if (block.tagName.toLowerCase() === tag) return block

  const next = document.createElement(tag)
  while (block.firstChild) next.appendChild(block.firstChild)
  block.replaceWith(next)
  return next
}

// LI should contain a single text block element (p/h1/h2/h3)
function ensureListItemTextBlock(li: HTMLElement): HTMLElement {
  const child = Array.from(li.children).find((c) => isTextTagName((c as HTMLElement).tagName)) as
    | HTMLElement
    | undefined

  if (child) return child

  const p = document.createElement('p')
  while (li.firstChild) p.appendChild(li.firstChild)
  li.appendChild(p)
  return p
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
    const textBlock = ensureListItemTextBlock(block)
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
