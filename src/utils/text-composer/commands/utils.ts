import type { TextBlockType } from '../doc'

export function kindToTag(kind: TextBlockType): 'p' | 'h1' | 'h2' | 'h3' {
  return kind
}

export function isTextTagName(tagName: string) {
  return tagName === 'H1' || tagName === 'H2' || tagName === 'H3' || tagName === 'P'
}

export function closestBlock(node: Node | null): HTMLElement | null {
  const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
  if (!el) return null

  // Important: include UL? no. Commands operate on p/h*/li content
  return el.closest('li, p, h1, h2, h3') as HTMLElement | null
}

export function closestHeadingBlock(node: Node | null): HTMLElement | null {
  const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
  if (!el) return null
  return el.closest('h1,h2,h3') as HTMLElement | null
}

export function closestEl(node: Node | null, selector: string): HTMLElement | null {
  const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
  return (el?.closest(selector) as HTMLElement) ?? null
}

export function isEffectivelyEmptyTextBlock(el: HTMLElement) {
  // textContent trims to empty AND no non-BR elements inside
  const text = (el.textContent ?? '').replace(/\u200B/g, '').trim()
  if (text.length > 0) return false

  // allow <br> and nothing else
  const hasNonBrElement = Array.from(el.querySelectorAll('*')).some(
    (n) => (n as HTMLElement).tagName !== 'BR'
  )
  return !hasNonBrElement
}

export function setCaretToStart(el: HTMLElement) {
  const range = document.createRange()
  const sel = window.getSelection()
  range.selectNodeContents(el)
  range.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(range)
}
