type DebounceCallback = (...args: any[]) => any | Promise<any>

const debounceMap = new Map<
  DebounceCallback | string,
  { timer: number; resolve: (v: any) => void }
>()

type DebounceOptions = {
  delay?: number
  key?: string
}

export function debounce<T extends DebounceCallback>(
  fn: T,
  { delay = 300, key }: DebounceOptions = {}
): Promise<Awaited<ReturnType<T>> | undefined> {
  return new Promise((resolve, reject) => {
    const existing = debounceMap.get(key ?? fn)

    if (existing) {
      clearTimeout(existing.timer)
      existing.resolve(undefined)
    }

    const timer = window.setTimeout(async () => {
      debounceMap.delete(key ?? fn)

      try {
        const result = await fn()
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }, delay)

    debounceMap.set(key ?? fn, { timer, resolve })
  })
}
