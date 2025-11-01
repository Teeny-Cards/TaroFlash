type DebounceCallback = (...args: any[]) => any

const debounceMap = new Map<
  DebounceCallback,
  { timer: number; promise: Promise<any>; resolve: (v: any) => void; reject: (e: any) => void }
>()

export function debounce<T extends DebounceCallback>(
  fn: T,
  delay = 300
): Promise<Awaited<ReturnType<T>>> {
  const existing = debounceMap.get(fn)
  if (existing) {
    clearTimeout(existing.timer)
  }

  let resolve!: (v: Awaited<ReturnType<T>>) => void
  let reject!: (e: any) => void

  const promise = new Promise<Awaited<ReturnType<T>>>((res, rej) => {
    resolve = res
    reject = rej
  })

  const timer = window.setTimeout(async () => {
    debounceMap.delete(fn)
    try {
      const result = await fn()
      resolve(result)
    } catch (err) {
      reject(err)
    }
  }, delay)

  debounceMap.set(fn, { timer, promise, resolve, reject })
  return promise
}
