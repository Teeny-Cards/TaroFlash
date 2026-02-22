import { setCaretToStart, closestEl } from '../commands/utils'
import { makeEmptyP } from '../commands/block'

function handleEnterInBody(range: Range): boolean {
  const heading = closestEl(range.startContainer, 'h1,h2,h3,p')
  if (!heading) return false

  const p = makeEmptyP()
  heading.after(p)
  setCaretToStart(p)
  return true
}

function handleEnterInHr(range: Range): boolean {
  const hr = closestEl(range.startContainer, 'hr')
  if (!hr) return false

  const p = makeEmptyP()
  hr.after(p)
  setCaretToStart(p)
  return true
}

/**
 * Intercept Enter to keep DOM in strict schema.
 * Returns true if handled.
 */
export function interceptEnter(range: Range): boolean {
  if (handleEnterInBody(range)) return true
  if (handleEnterInHr(range)) return true
  return false
}
