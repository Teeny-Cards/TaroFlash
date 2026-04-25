---
lastUpdated: 2026-04-25T00:00:00-07:00
paths:
  - 'tests/**/*'
---

# Composables in tests

## Pure composables (refs/computed only)

Call directly:

```js
const { count, increment } = useCounter()
increment()
expect(count.value).toBe(1)
```

## Lifecycle hooks or `inject`

`onMounted`, `onUnmounted`, `inject` need a component context. Wrap in a host app:

```js
import { createApp } from 'vue'

function withSetup(composable, { provide } = {}) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    }
  })
  if (provide) Object.entries(provide).forEach(([k, v]) => app.provide(k, v))
  app.mount(document.createElement('div'))
  return [result, app]
}
```

```js
afterEach(() => app?.unmount()) // fires onUnmounted, releases injected mocks

const [result, app] = withSetup(() => useFetch('/api/test'), {
  provide: { apiClient: mockApiClient }
})
await flushPromises()
expect(result.data.value).toEqual(...)
```

For composables that need a Pinia store, wire `createTestingPinia` into the host app via `app.use(...)` before mounting (see [testing-pinia.md](./testing-pinia.md)).
