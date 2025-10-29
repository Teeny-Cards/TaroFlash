const debounceMap = new Map<Function, number>()

export function debounce(fn: Function, delay = 300) {
  const existing = debounceMap.get(fn)
  if (existing) clearTimeout(existing)

  const timeout = window.setTimeout(() => {
    debounceMap.delete(fn)
    fn()
  }, delay)

  debounceMap.set(fn, timeout)
}
