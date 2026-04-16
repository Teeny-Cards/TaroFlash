---
lastUpdated: 2026-04-12T11:56:41-07:00
---

# Controllers

A **controller** is the logic layer for a phone app. It separates data fetching, state management, and side effects from the component that renders them — the controller is the model, the component is the view.

Controllers are entirely optional for simple apps, but they're the right home for anything that needs to:

- Subscribe to a Pinia store or Supabase realtime channel
- Perform async work when an app opens
- Start running in the background before the user ever opens the app
- Push notification badges to the phone icon

---

## The Factory Pattern

A controller is defined as a **factory function** — a function that receives `AppContext` and returns an `AppController` object.

```ts
import type { AppContext, AppController } from '@/phone/system/types'

export function createMyController(ctx: AppContext): AppController {
  return {
    onOpen()   { ... },
    onTrigger() { ... },
  }
}
```

The factory is called when the controller is instantiated (at phone startup for `mount_policy: 'immediate'`, or on first open otherwise). The returned object's hooks are then called at the appropriate points in the lifecycle.

Register it in the manifest via the `controller` field:

```ts
export default {
  title: 'My App',
  type: 'view',
  display: 'panel',
  component,
  controller: createMyController,
  launcher: { ... }
} satisfies Omit<ViewApp, 'id'>
```

---

## Lifecycle Hooks

The `AppController` interface exposes two hooks:

```ts
type AppController = {
  onOpen?: () => void | Promise<void>
  onTrigger?: () => void | Promise<void>
}
```

### `onOpen()`

Called each time a **`ViewApp`** is opened by the user. Runs before the component is shown.

Use `onOpen` to fetch or refresh data the component will need on each visit:

```ts
export function createShortcutsController(ctx: AppContext): AppController {
  const store = useShortcutStore()

  return {
    async onOpen() {
      await store.fetchShortcuts()
    }
  }
}
```

::: info
`onOpen()` is called on **every open**, not just the first. If your app needs one-time initialisation, do it in the factory body — that runs exactly once when the controller is instantiated.
:::

### `onTrigger()`

Called when a **`TriggerApp`** icon is tapped. The phone does not navigate anywhere — it just executes `onTrigger()` and stays on the home screen.

`onTrigger()` is ignored on `ViewApp` and `WidgetApp`.

```ts
export function createFeedbackController(ctx: AppContext): AppController {
  const modal = useModal()

  return {
    onTrigger() {
      modal.open(FeedbackForm, { backdrop: true })
    }
  }
}
```

---

## AppContext

The `ctx` parameter passed to every controller factory is an `AppContext` — the full phone API scoped to that specific app.

```ts
type AppContext = {
  // Navigation
  open(id: string): Promise<void>
  close(): void
  clear(): void

  // Notifications (scoped — no app ID needed)
  notify(payload: NotifyPayload): void
  clearNotification(): void

  // i18n
  t: ReturnType<typeof useI18n>['t']
}
```

| Method                | Description                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `open(id)`            | Open another app by its runtime ID. IDs are assigned dynamically; prefer navigating via events or the launcher rather than hard-coding IDs. |
| `close()`             | Close the currently open app and return to the launcher.                                                                                    |
| `clear()`             | Immediately return to the launcher, clearing any navigation state.                                                                          |
| `notify(payload)`     | Push a notification badge to the phone icon. See [Notifications](./notifications).                                                          |
| `clearNotification()` | Remove this app's notification badge.                                                                                                       |
| `t`                   | The vue-i18n translation function, bound to the current locale.                                                                             |

---

## Background Apps

By default, the controller factory is called the first time the user opens the app. If you want an app to **start running at phone initialisation** — for example to subscribe to a realtime channel and push notifications — set `mount_policy` to `'immediate'` in the manifest.

```ts
export default {
  title: 'Due Cards',
  type: 'trigger',
  mount_policy: 'immediate',   // ← factory runs at phone startup
  controller: createDueCardsController,
  launcher: { ... }
} satisfies Omit<TriggerApp, 'id'>
```

With `mount_policy: 'immediate'`, the runtime calls the controller factory when the phone mounts — before the user has interacted with anything. Any background work (subscriptions, badge initialisation) goes directly in the factory body, not in a hook:

```ts
export function createDueCardsController(ctx: AppContext): AppController {
  const deckStore = useDeckStore()

  // Factory body runs at startup — set up subscriptions here
  deckStore.$subscribe((_, state) => {
    const due = state.decks.reduce((sum, d) => sum + d.due_count, 0)

    if (due > 0) {
      ctx.notify({ count: due })
    } else {
      ctx.clearNotification()
    }
  })

  return {}
}
```

::: warning
`mount_policy: 'immediate'` is a startup cost. Keep the factory body lean: subscribe to events, don't eagerly fetch large datasets. Prefer reactive store subscriptions over one-shot fetch calls.
:::

### Background Notification Pattern

```ts
// src/phone/apps/due-cards/controller.ts
import type { AppContext, AppController } from '@/phone/system/types'
import { useDeckStore } from '@/stores/deck'

export function createDueCardsController(ctx: AppContext): AppController {
  const deckStore = useDeckStore()

  deckStore.$subscribe((_, state) => {
    const due = state.decks.reduce((sum, d) => sum + d.due_count, 0)

    if (due > 0) {
      ctx.notify({ count: due })
    } else {
      ctx.clearNotification()
    }
  })

  return {}
}
```

```ts
// src/phone/apps/due-cards/_manifest.ts
export default {
  title: 'Due Cards',
  type: 'trigger',
  mount_policy: 'immediate',
  controller: createDueCardsController,
  launcher: {
    icon_src: 'cards-due',
    theme: 'blue-500'
  }
} satisfies Omit<TriggerApp, 'id'>
```

Now the badge updates in real time as decks become due, and the user sees the count before they ever open the app.

---

## Separating the Controller File

For anything beyond a trivial `onTrigger()`, extract the controller into its own `controller.ts` file. This keeps `_manifest.ts` as pure configuration and makes the controller independently testable.

```
src/phone/apps/my-app/
  _manifest.ts      ← imports createMyController
  controller.ts     ← all logic lives here
  component.vue     ← only rendering
```

A controller file typically exports a single factory function:

```ts
// controller.ts
import type { AppContext, AppController } from '@/phone/system/types'

export function createMyController(ctx: AppContext): AppController {
  // set up reactive state, composables, stores here
  const count = ref(0)

  return {
    // expose state and methods on the returned object
    count,

    async onOpen() {
      count.value = await fetchCount()
    }
  }
}

// Infer the controller type for use in the component
export type MyController = ReturnType<typeof createMyController>
```

The component can then inject and cast:

```ts
import { inject } from 'vue'
import { APP_CTX_KEY } from '@/phone/system/types'
import type { MyController } from './controller'

const ctx = inject(APP_CTX_KEY)!
const ctrl = ctx.controller as MyController

// ctrl.count is fully typed
```

See [Context & Injection](./context) for the full injection API.
