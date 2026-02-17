export function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function markdownLiteToHtml(md: string): string {
  const lines = (md ?? '').replaceAll('\r\n', '\n').split('\n')

  const out: string[] = []
  let inUl = false

  const closeUl = () => {
    if (inUl) {
      out.push('</ul>')
      inUl = false
    }
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/g, '') // trim end only
    const t = line.trim()

    // Empty Line
    if (!t) {
      closeUl()
      out.push(`<p><br/></p>`)
      continue
    }

    // Headers: #, ##, ###
    const h = t.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      closeUl()
      const level = h[1].length
      out.push(`<h${level}>${escapeHtml(h[2])}</h${level}>`)
      continue
    }

    // Unordered list: - or *
    const li = t.match(/^[-*]\s+(.*)$/)
    if (li) {
      if (!inUl) {
        out.push('<ul>')
        inUl = true
      }
      out.push(`<li>${escapeHtml(li[1])}</li>`)
      continue
    }

    // Paragraph
    closeUl()
    out.push(`<p>${escapeHtml(t)}</p>`)
  }

  closeUl()

  // Ensure there’s always at least one block for caret placement
  if (out.length === 0) out.push('<p><br></p>')

  return out.join('')
}

export function normalizeEditorDom(root: HTMLElement) {
  const allowed = new Set(['H1', 'H2', 'H3', 'P', 'UL', 'LI', 'BR'])

  // Strip unexpected tags + attributes (defensive)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
  const els: Element[] = []
  while (walker.nextNode()) els.push(walker.currentNode as Element)

  for (const el of els) {
    if (!allowed.has(el.tagName)) {
      // unwrap unknown nodes
      const parent = el.parentNode
      if (!parent) continue
      while (el.firstChild) parent.insertBefore(el.firstChild, el)
      parent.removeChild(el)
      continue
    }
    // for (const attr of [...el.attributes]) el.removeAttribute(attr.name)
  }

  // Ensure empty blocks contain <br> so caret can land there
  const blocks = root.querySelectorAll('p,h1,h2,h3,li')
  for (const b of Array.from(blocks)) {
    const el = b as HTMLElement
    if (!el.textContent?.trim() && el.children.length === 0) {
      el.appendChild(document.createElement('br'))
    }
  }

  // If totally empty, add a paragraph
  if (root.childNodes.length === 0) {
    root.innerHTML = '<p><br></p>'
  }
}

export function normalizeText(s: string) {
  // Collapse internal whitespace a bit, but keep it readable.
  return s
    .replace(/\u00A0/g, ' ')
    .replace(/\s+\n/g, '\n')
    .trim()
}

export function textFromNode(el: Element): string {
  // Use textContent to avoid accidentally reintroducing HTML.
  return normalizeText(el.textContent ?? '')
}
