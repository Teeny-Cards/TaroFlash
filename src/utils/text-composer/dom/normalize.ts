const ALLOWED = new Set(['H1', 'H2', 'H3', 'P', 'UL', 'LI', 'BR'])
const WRAPPERS = new Set(['DIV', 'SPAN'])

/**
 * DOM normalizer rules:
 * - Remove/convert unknown elements into `<p>` preserving children
 * - Ensure root has at least one block
 * - Ensure each P/H1/H2/H3 is not empty (add `<br>`)
 * - For UL/LI: ensure each LI contains exactly one text block child (P by default),
 *   and remove nested UL/OL if they show up
 */
export function normalizeEditorDom(root: HTMLElement) {
  replaceInvalidElements(root)
  normalizeUlLi(root)
  ensureEmptyBlocks(root)

  //ensure root has at least one block
  if (root.childNodes.length === 0) root.innerHTML = '<p><br></p>'
}

/**
 * Replace unknown elements with `<p>` preserving children
 */
function replaceInvalidElements(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
  const els: Element[] = []
  while (walker.nextNode()) els.push(walker.currentNode as Element)

  for (const el of els) {
    if (isAllowedBlockEl(el)) continue

    console.warn(`normalizeEditorDom: found unknown element <${el.tagName}>`)

    // Handle wrapper DIVs created by contenteditable Enter:
    // If DIV is just a wrapper, unwrap it (prevents <p><p/></p>).
    if (WRAPPERS.has(el.tagName)) {
      unwrapElement(el)
      continue
    }

    // If it contains a <p> (or other allowed block) as direct child,
    // unwrap instead of wrapping into <p>
    const hasDirectAllowedChild = Array.from(el.children).some((c) => isAllowedBlockEl(c))
    if (hasDirectAllowedChild) {
      unwrapElement(el)
      continue
    }

    // Fallback: convert unknown element into <p> preserving children
    convertUnknownToParagraph(el)
  }
}

/**
 * Normalize UL/LI structure (no nested lists)
 */
function normalizeUlLi(root: HTMLElement) {
  const uls = Array.from(root.querySelectorAll('ul')) as HTMLElement[]
  for (const ul of uls) {
    const lis = Array.from(ul.querySelectorAll(':scope > li')) as HTMLElement[]
    for (const li of lis) {
      // remove nested lists if any appear
      for (const nested of Array.from(li.querySelectorAll('ul,ol'))) nested.remove()

      // ensure LI contains one text block element
      const textChild = Array.from(li.children).find((c) =>
        isTextTag((c as HTMLElement).tagName)
      ) as HTMLElement | undefined

      if (textChild) {
        // move any stray nodes before/after into the textChild
        const toMove: Node[] = []
        for (let n = li.firstChild; n; n = n.nextSibling) {
          if (n === textChild) continue
          toMove.push(n)
        }
        for (const n of toMove) textChild.appendChild(n)
      } else {
        // wrap all existing children into <p>
        const p = document.createElement('p')
        while (li.firstChild) p.appendChild(li.firstChild)
        li.appendChild(p)
      }
    }
  }
}

/**
 * Ensure empty blocks have `<br>`
 */
function ensureEmptyBlocks(root: HTMLElement) {
  const blocks = root.querySelectorAll('p,h1,h2,h3')
  for (const b of Array.from(blocks)) {
    const el = b as HTMLElement
    if (!el.textContent?.trim() && el.children.length === 0) {
      el.appendChild(document.createElement('br'))
    }
  }
}

function convertUnknownToParagraph(el: Element) {
  const p = document.createElement('p')

  // If it contains a single <p>, unwrap that <p> instead of nesting.
  const onlyChild =
    el.childNodes.length === 1 && el.firstChild?.nodeType === Node.ELEMENT_NODE
      ? (el.firstChild as Element)
      : null

  if (onlyChild?.tagName === 'P') {
    // replace unknown element with the inner <p>
    el.replaceWith(onlyChild)
    return
  }

  while (el.firstChild) p.appendChild(el.firstChild)
  el.replaceWith(p)
}

function isTextTag(tag: string) {
  return tag === 'P' || tag === 'H1' || tag === 'H2' || tag === 'H3'
}

function unwrapElement(el: Element) {
  const parent = el.parentNode
  if (!parent) return

  // move children out before removing wrapper
  while (el.firstChild) parent.insertBefore(el.firstChild, el)
  parent.removeChild(el)
}

function isAllowedBlockEl(el: Element) {
  return ALLOWED.has(el.tagName)
}
