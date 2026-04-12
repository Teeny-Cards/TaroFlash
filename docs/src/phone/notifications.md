# Notifications

TaroPhone has a lightweight badge notification system. Any app can push a count to the phone icon — the small red dot visible when the phone is closed.

## How It Works

```
Controller calls ctx.notify()
        │
        ▼
Runtime stores PhoneNotification { app_id, count }
        │
        ▼
phone-sm.vue reads total count → shows badge
```

Notifications are **per-app** and **upserted** — calling `notify()` a second time replaces the previous entry for that app rather than stacking. Each app has at most one notification in the queue at a time.

---

## Pushing a Notification

Call `ctx.notify()` from inside a controller with an optional count:

```ts
ctx.notify({ count: 5 }) // badge shows "5"
ctx.notify({ count: 10 }) // badge updates to "10" (upsert)
ctx.notify({}) // no count — badge shows the dot, counts as 1
```

The `count` field is optional. When omitted it defaults to `1` in the badge total.

---

## Clearing a Notification

Call `ctx.clearNotification()` when the underlying data no longer warrants an alert:

```ts
ctx.clearNotification()
```

---

## Auto-Clear on Open

By default, the runtime does **not** clear notifications when the user opens an app. If you want the badge to disappear automatically when the user taps the icon, set `clear_notifications_on_open: true` in the manifest:

```ts
export default {
  title: 'Inbox',
  type: 'trigger',
  mount_policy: 'immediate',
  clear_notifications_on_open: true,   // ← badge clears when user opens the app
  controller: createInboxController,
  launcher: { ... }
} satisfies Omit<TriggerApp, 'id'>
```

Without this flag, your controller is responsible for calling `ctx.clearNotification()` at the appropriate time (e.g. after the user has seen the relevant content).

---

## Notifications Require `mount_policy: 'immediate'`

Notifications are only useful if the controller factory is running _before_ the user opens the app — otherwise you'd push a badge and immediately show (or clear) it.

For notifications to work correctly, set `mount_policy: 'immediate'` in the manifest. The factory runs at phone startup and sets up whatever subscription keeps the badge in sync.

---

## Worked Example

Here's a complete notification source that watches a Pinia store and keeps the badge count in sync:

```ts
// src/phone/apps/inbox/controller.ts
import type { AppContext, AppController } from '@/phone/system/types'
import { useInboxStore } from '@/stores/inbox'

export function createInboxController(ctx: AppContext): AppController {
  const inbox = useInboxStore()

  // Factory body runs at startup — sync badge immediately and subscribe
  syncBadge()
  inbox.$subscribe(() => syncBadge())

  function syncBadge() {
    if (inbox.unread_count > 0) {
      ctx.notify({ count: inbox.unread_count })
    } else {
      ctx.clearNotification()
    }
  }

  return {}
}
```

```ts
// src/phone/apps/inbox/_manifest.ts
import type { TriggerApp } from '@/phone/system/types'
import { createInboxController } from './controller'

export default {
  title: 'Inbox',
  type: 'trigger',
  mount_policy: 'immediate',
  clear_notifications_on_open: true,
  controller: createInboxController,
  launcher: {
    icon_src: 'inbox',
    theme: 'blue-500'
  }
} satisfies Omit<TriggerApp, 'id'>
```

When the phone mounts, the factory fires, the store subscription is registered, and the badge immediately reflects `inbox.unread_count`. As the user reads messages, `unread_count` drops; the store fires, `syncBadge()` is called, and the badge updates. When count reaches zero, the badge disappears. When the user opens the app, the badge clears automatically.

---

## Badge Display

The badge renders on `phone-sm` (the closed phone icon) as a small red dot. The total shown is the **sum of all active notification counts** across every app:

```
badge total = sum of n.count for each active notification
             (notifications without a count contribute 1)
```

If the total exceeds 9, the badge displays `9+`.

---

## Notification Lifetime

Notifications are **ephemeral** — they live only in Vue reactive memory. They do not persist across page refreshes. Apps with `mount_policy: 'immediate'` re-instantiate their controller on every phone mount, which re-evaluates current state and re-pushes any badges that are still relevant.
