export function getSelectionRange(): Range | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null

  return sel.getRangeAt(0)
}

export function closestBlock(node: Node | null): HTMLElement | null {
  const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
  if (!el) return null

  return el.closest('li, p, h1, h2, h3') as HTMLElement | null
}

export function setCaretToStart(el: HTMLElement) {
  const range = document.createRange()
  const sel = window.getSelection()

  range.selectNodeContents(el)
  range.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(range)
}

export function replaceTag(block: HTMLElement, tag: 'p' | 'h1' | 'h2' | 'h3') {
  if (block.tagName.toLowerCase() === tag) return

  const next = document.createElement(tag)
  // Move children (preserves text nodes)
  while (block.firstChild) next.appendChild(block.firstChild)
  block.replaceWith(next)
  setCaretToStart(next)
}

export function setBlock(editor: HTMLElement, tag: 'p' | 'h1' | 'h2' | 'h3') {
  const r = getSelectionRange()
  if (!r || !editor) return

  const block = closestBlock(r.startContainer)
  if (!block) return

  if (block.tagName === 'LI') {
    // If you’re in a list, apply block format *inside the list item* by inserting a child block.
    // MVP simplification: convert the LI to P first, then replace tag.
    convertListItemToParagraph(block)
    const newBlock = closestBlock(getSelectionRange()?.startContainer ?? null)
    if (newBlock) replaceTag(newBlock, tag)
    return
  }

  replaceTag(block, tag)
}

export function convertListItemToParagraph(li: HTMLElement) {
  const ul = li.closest('ul')
  const p = document.createElement('p')
  while (li.firstChild) p.appendChild(li.firstChild)
  li.replaceWith(p)

  // If UL becomes empty, remove it
  if (ul && ul.querySelectorAll(':scope > li').length === 0) ul.remove()

  setCaretToStart(p)
}

export function convertBlockToList(block: HTMLElement) {
  const ul = document.createElement('ul')
  const li = document.createElement('li')

  // move block’s children into li
  while (block.firstChild) li.appendChild(block.firstChild)
  ul.appendChild(li)
  block.replaceWith(ul)

  setCaretToStart(li)
}

export function toggleBullets(editor: HTMLElement) {
  const r = getSelectionRange()
  if (!r || !editor) return
  const block = closestBlock(r.startContainer)
  if (!block) return

  if (block.tagName === 'LI') {
    convertListItemToParagraph(block)
    return
  }

  // If we’re on P/H1/H2/H3: wrap into UL/LI
  convertBlockToList(block)
}
