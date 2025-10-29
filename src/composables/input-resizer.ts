import { onUnmounted, ref } from 'vue'

type InputResizerOptions = {
  max_lines?: number
  min_height?: number
}

export function useInputResizer({ max_lines = 10, min_height = 58 }: InputResizerOptions = {}) {
  const inputs: Set<HTMLTextAreaElement> = new Set()

  onUnmounted(() => {
    inputs.forEach((input) => {
      input.removeEventListener('keydown', _blockMaxLines)
      input.removeEventListener('beforeinput', _sanitizeInput)
      input.removeEventListener('input', _updateInputHeight)
    })
  })

  function setupInput(el?: HTMLTextAreaElement) {
    if (!el) return

    inputs.add(el)
    el.addEventListener('keydown', _blockMaxLines)
    el.addEventListener('beforeinput', _sanitizeInput)
    el.addEventListener('input', _updateInputHeight)

    _updateInputHeight({ target: el } as any)
  }

  function forceUpdate() {
    inputs.forEach((input) => {
      _updateInputHeight({ target: input } as any)
    })
  }

  function _blockMaxLines(e: KeyboardEvent) {
    const input = e.target as HTMLTextAreaElement
    if (!input || e.key !== 'Enter') return

    const { selectionStart, selectionEnd, value } = input
    const before = value.slice(0, selectionStart)
    const after = value.slice(selectionEnd)
    const predicted = `${before}\n${after}`

    // If inserting a newline would push us over MAX_LINES, block it
    if (_countLines(predicted) > max_lines) {
      e.preventDefault()
    }
  }

  function _sanitizeInput(e: InputEvent) {
    const input = e.target as HTMLTextAreaElement
    if (!input) return
    if (!e.data && e.inputType !== 'insertLineBreak' && e.inputType !== 'insertFromPaste') return

    // Proposed insertion text:
    const insertText =
      e.inputType === 'insertLineBreak' ? '\n' : typeof e.data === 'string' ? e.data : '' // other cases we let pass

    if (!insertText) return

    const { selectionStart, selectionEnd, value } = input
    const before = value.slice(0, selectionStart)
    const after = value.slice(selectionEnd)
    const currentLines = _countLines(value)
    const remaining = max_lines - currentLines

    // If there's room for newlines, we may keep up to `remaining` of them.
    // Otherwise, strip all newlines from the incoming text.
    let allowed = insertText
    if (remaining <= 0) {
      // No more line breaks allowed: remove all \n
      allowed = insertText.replace(/\n/g, ' ')
    } else {
      // Keep at most `remaining` newlines in the inserted chunk
      let breaks = 0
      allowed = insertText.replace(/\n/g, () => {
        /* inserting into selection may replace lines, but keep simple */
        if (breaks < remaining - 0) {
          breaks++
          return '\n'
        }
        return ' '
      })

      // If even a single '\n' would exceed, strip them all
      const predicted = `${before}${allowed}${after}`
      if (_countLines(predicted) > max_lines) {
        allowed = allowed.replace(/\n/g, ' ')
      }
    }

    // If we changed anything, override the insertion
    if (allowed !== insertText) {
      e.preventDefault()
      // Insert sanitized text and move caret to the end of the insertion
      input.setRangeText(allowed, selectionStart!, selectionEnd!, 'end')
      // Trigger your resize + update flow
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  async function _updateInputHeight(e: Event): Promise<void> {
    const input = e.target as HTMLTextAreaElement
    if (!input) return

    input.style.height = 'auto' // reset
    input.style.height = `${Math.max(input.scrollHeight, min_height)}px`
  }

  function _countLines(text: string) {
    return (text.match(/\n/g)?.length ?? 0) + 1
  }

  return { setupInput, forceUpdate }
}
