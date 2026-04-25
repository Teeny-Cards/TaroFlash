---
lastUpdated: 2026-04-25T00:00:00-07:00
paths:
  - 'tests/**/*'
---

# Pinia in tests

## Component tests — `createTestingPinia`

```js
import { createTestingPinia } from '@pinia/testing'

mount(Component, {
  global: {
    plugins: [
      createTestingPinia({
        createSpy: vi.fn,
        initialState: { user: { name: 'John' } }
      })
    ]
  }
})
```

- `createSpy: vi.fn` is required — we don't run with Vitest `globals: true`
- Actions are stubbed by default; assert via `expect(store.action).toHaveBeenCalled()`, override with `store.action.mockResolvedValue(...)`
- Pass `stubActions: false` when the action's real effect is under test
- Get the store **after** mounting — `useStore()` before mount returns the wrong instance

## Store unit tests — `setActivePinia`

```js
import { setActivePinia, createPinia } from 'pinia'

beforeEach(() => setActivePinia(createPinia()))
```

Fresh Pinia per test. Use `vi.spyOn(store, 'action')` to assert calls without stubbing the implementation.
