import { normalizeEditorDom } from '../dom/normalize'
import { closestBlock, setCaretToStart, isEffectivelyEmptyTextBlock } from './utils'
import { makeEmptyP } from './block'

export function toggleList(root: HTMLElement, range: Range) {
  normalizeEditorDom(root)

  const block = closestBlock(range.startContainer)
  if (!block) return

  // If we're in LI -> remove list (convert to its text block)
  if (block.tagName === 'LI') {
    convertListItemToBlock(block)
    normalizeEditorDom(root)
    return
  }

  // If we're in P/H1/H2/H3 -> make a UL with LI containing a P (keep it simple)
  convertBlockToList(block)
  normalizeEditorDom(root)
}

export function ensureTextBlockInLi(li: HTMLElement): HTMLElement {
  const child = Array.from(li.children).find((c) => {
    const tag = (c as HTMLElement).tagName
    return tag === 'P' || tag === 'H1' || tag === 'H2' || tag === 'H3'
  }) as HTMLElement | undefined

  if (child) return child

  const p = document.createElement('p')
  while (li.firstChild) p.appendChild(li.firstChild)
  li.appendChild(p)
  return p
}

export function makeEmptyLi(): HTMLLIElement {
  const li = document.createElement('li')
  li.appendChild(makeEmptyP())
  return li
}

export function isEmptyLi(li: HTMLElement) {
  const tb = ensureTextBlockInLi(li)
  return isEffectivelyEmptyTextBlock(tb)
}

/************************************************************
 *                        HELPERS
 ************************************************************/
function convertBlockToList(block: HTMLElement) {
  const ul = document.createElement('ul')
  const li = document.createElement('li')
  const p = document.createElement('p')

  while (block.firstChild) p.appendChild(block.firstChild)

  li.appendChild(p)
  ul.appendChild(li)
  block.replaceWith(ul)

  setCaretToStart(p)
}

function convertListItemToBlock(li: HTMLElement) {
  const ul = li.closest('ul')
  const textBlock = ensureTextBlockInLi(li)

  // unwrap LI into the textBlock element
  li.replaceWith(textBlock)

  // if UL empty, remove
  if (ul && ul.querySelectorAll(':scope > li').length === 0) ul.remove()

  setCaretToStart(textBlock)
}

function getOwningUl(li: HTMLElement): HTMLUListElement | null {
  const ul = li.closest('ul')
  return ul && ul.tagName === 'UL' ? (ul as HTMLUListElement) : null
}
