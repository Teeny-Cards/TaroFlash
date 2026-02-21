export type SupportedTag = 'p' | 'h1' | 'h2' | 'h3' | 'li'

export function setBlock(editor: HTMLElement, tag: SupportedTag) {
  const r = getSelectionRange()
  if (!r || !editor) return

  const block = closestBlock(r.startContainer)
  if (!block) return

  // LI special handling
  if (block.tagName === 'LI') {
    // Convert LI -> P (your MVP path)
    if (tag === 'li') {
      convertListItemToParagraph(block)
      const newBlock = closestBlock(getSelectionRange()?.startContainer ?? null)
      if (newBlock) replaceTag(newBlock, tag)
      return
    }

    // Toggle/replace text tag inside LI
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p') {
      const firstEl = Array.from(block.childNodes).find((n) => n.nodeType === Node.ELEMENT_NODE) as
        | HTMLElement
        | undefined

      if (firstEl && isTextTagName(firstEl.tagName)) {
        if (firstEl.tagName === tagUpper(tag)) {
          removeTagFromListItem(block, firstEl)
        } else {
          replaceTag(firstEl, tag) // just changes H1/H2/H3/P
        }
        return
      }

      addTagToListItem(block, tag)
      return
    }
  }

  replaceTag(block, tag)
}

export function toggleBullets(editor: HTMLElement) {
  const r = getSelectionRange()
  if (!r || !editor) return
  const block = closestBlock(r.startContainer)
  if (!block) return

  const parent = block.parentElement

  if (block.tagName !== 'LI' && parent?.tagName === 'UL') {
    replaceTag(block, 'li')
    return
  }

  if (block.tagName === 'LI') {
    convertListItemToParagraph(block)
    return
  }

  // If we’re on P/H1/H2/H3: wrap into UL/LI
  convertBlockToList(block)
}

// Helpers
function convertListItemToParagraph(li: HTMLElement) {
  const ul = li.closest('ul')
  const p = document.createElement('p')
  while (li.firstChild) p.appendChild(li.firstChild)
  li.replaceWith(p)

  // If UL becomes empty, remove it
  if (ul && ul.querySelectorAll(':scope > li').length === 0) ul.remove()

  setCaretToStart(p)
}

function addTagToListItem(li: HTMLElement, tag: 'h1' | 'h2' | 'h3' | 'p') {
  const header = document.createElement(tag)

  // Move only the “content” nodes (everything before a nested UL/OL)
  const toMove: Node[] = []

  for (let n = li.firstChild; n; n = n.nextSibling) {
    // Stop before nested list blocks
    if (n.nodeType === Node.ELEMENT_NODE && isNestedListEl(n as Element)) break
    toMove.push(n)
  }

  // Nothing to wrap? Create a <br> so the caret can land.
  if (toMove.length === 0) {
    header.appendChild(document.createElement('br'))
    li.insertBefore(header, li.firstChild)
    return
  }

  for (const n of toMove) header.appendChild(n)
  li.insertBefore(header, li.firstChild)
}

function removeTagFromListItem(li: HTMLElement, header: HTMLElement) {
  // Unwrap header but keep nested lists where they are.
  const frag = document.createDocumentFragment()
  while (header.firstChild) frag.appendChild(header.firstChild)

  // Replace header with its children
  li.insertBefore(frag, header)
  header.remove()

  // If LI content becomes empty, keep it editable
  if (!li.firstChild) li.appendChild(document.createElement('br'))
}

function convertBlockToList(block: HTMLElement) {
  const ul = document.createElement('ul')
  const li = document.createElement('li')

  // move block’s children into li
  while (block.firstChild) li.appendChild(block.firstChild)
  ul.appendChild(li)
  block.replaceWith(ul)

  setCaretToStart(li)
}

function closestBlock(node: Node | null): HTMLElement | null {
  const el = node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement
  if (!el) return null

  return el.closest('li, p, h1, h2, h3') as HTMLElement | null
}

function getSelectionRange(): Range | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null

  return sel.getRangeAt(0)
}

function setCaretToStart(el: HTMLElement) {
  const range = document.createRange()
  const sel = window.getSelection()

  range.selectNodeContents(el)
  range.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(range)
}

function replaceTag(block: HTMLElement, tag: SupportedTag) {
  if (block.tagName.toLowerCase() === tag) return

  const next = document.createElement(tag)
  // Move children (preserves text nodes)
  while (block.firstChild) next.appendChild(block.firstChild)
  block.replaceWith(next)
  setCaretToStart(next)
}

function tagUpper(tag: string) {
  return tag.toUpperCase()
}

function isTextTagName(tagName: string) {
  return tagName === 'H1' || tagName === 'H2' || tagName === 'H3' || tagName === 'P'
}

function isNestedListEl(el: Element) {
  return el.tagName === 'UL' || el.tagName === 'OL'
}
