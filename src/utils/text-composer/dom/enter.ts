import { setCaretToStart, closestEl } from '../commands/utils'
import { makeEmptyP } from '../commands/block'
import { makeEmptyLi, isEmptyLi } from '../commands/list'

function handleEnterInBody(range: Range): boolean {
  const heading = closestEl(range.startContainer, 'h1,h2,h3,p')
  if (!heading) return false

  const p = makeEmptyP()
  heading.after(p)
  setCaretToStart(p)
  return true
}

function handleEnterInList(range: Range): boolean {
  const li = closestEl(range.startContainer, 'li')
  if (!li) return false

  const ul = li.closest('ul')
  if (!ul) return false

  if (isEmptyLi(li)) {
    const p = makeEmptyP()

    li.replaceWith(p)

    // If UL is now empty, remove it too
    if (ul.querySelectorAll(':scope > li').length === 0) {
      ul.remove()
    }

    setCaretToStart(p)
    return true
  }

  const nextLi = makeEmptyLi()
  li.after(nextLi)
  setCaretToStart(nextLi)

  return true
}

/**
 * Intercept Enter to keep DOM in strict schema.
 * Returns true if handled.
 */
export function interceptEnter(range: Range): boolean {
  if (handleEnterInBody(range)) return true
  // if (handleEnterInList(range)) return true
  return false
}
