import { ref, onMounted, onUnmounted, type Ref } from 'vue'

const cache = new Map<
  string,
  { ref: Ref<boolean>; mq: MediaQueryList; count: number; handler: () => void }
>()

export function useBreakpoint(query: string) {
  let entry = cache.get(query)

  if (!entry) {
    const r = ref(false)

    entry = {
      ref: r,
      mq: window.matchMedia(query),
      count: 0,
      handler: () => (r.value = entry!.mq.matches)
    }

    cache.set(query, entry)
    entry.mq.addEventListener('change', entry.handler)
  }

  entry.count++

  onUnmounted(() => {
    const e = cache.get(query)
    if (!e) return
    e.count--
    if (e.count <= 0) {
      e.mq.removeEventListener('change', e.handler)
      cache.delete(query)
    }
  })

  onMounted(() => {
    const e = cache.get(query)
    if (e) e.ref.value = e.mq.matches
  })

  return entry.ref
}
