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
      out.push(`<li>${markdownLiteToHtml(li[1])}</li>`)
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

export function htmlToMarkdownLite(root: HTMLElement): string {
  const out: string[] = []

  const children = Array.from(root.children) as HTMLElement[]

  for (const child of children) {
    const tag = child.tagName

    if (tag === 'H1') {
      const t = textFromNode(child)
      if (t) out.push(`# ${t}`)
      else out.push('')
      continue
    }

    if (tag === 'H2') {
      const t = textFromNode(child)
      if (t) out.push(`## ${t}`)
      else out.push('')
      continue
    }

    if (tag === 'H3') {
      const t = textFromNode(child)
      if (t) out.push(`### ${t}`)
      else out.push('')
      continue
    }

    if (tag === 'P') {
      const t = textFromNode(child)
      out.push(t ?? '')
      continue
    }

    if (tag === 'UL') {
      const items = Array.from(child.querySelectorAll(':scope > li')) as HTMLElement[]
      for (const li of items) {
        const t = htmlToMarkdownLite(li)
        // keep empty list items out for MVP
        if (t) out.push(`- ${t}`)
      }

      continue
    }

    // Anything unexpected: treat as paragraph fallback
    const fallback = textFromNode(child)
    out.push(fallback ?? '')
  }

  // Remove trailing blank lines
  while (out.length && out[out.length - 1] === '') out.pop()

  return out.join('\n')
}

export function normalizeEditorDom(root: HTMLElement) {
  const allowed = new Set(['H1', 'H2', 'H3', 'P', 'UL', 'LI', 'BR'])
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
  const els: Element[] = []

  while (walker.nextNode()) els.push(walker.currentNode as Element)

  for (const el of els) {
    if (allowed.has(el.tagName)) continue

    // Convert unknown element -> <p> (preserve children)
    const p = document.createElement('p')
    while (el.firstChild) p.appendChild(el.firstChild) // move children
    el.replaceWith(p)
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
