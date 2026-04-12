# API Reference

All types and values exported from `@/phone/system/types` unless otherwise noted.

---

## App Definitions

### `ViewApp`

A full-UI app that renders a component inside the phone frame or as a modal.

```ts
type ViewApp = {
  id: string // assigned by runtime — do not set in manifest
  title: string // display name and manifest lookup key
  type: 'view'
  display: 'panel' | 'full' // panel: renders in phone frame; full: opens as modal
  component: Component // the Vue component to render
  launcher: LauncherConfig // icon and theme for the launcher grid
  mount_policy?: MountPolicy // default: 'lazy'
  clear_notifications_on_open?: boolean // default: false
  controller?: (ctx: AppContext) => AppController
}
```

### `WidgetApp`

An inline interactive widget rendered directly in the launcher grid.

```ts
type WidgetApp = {
  id: string
  title: string
  type: 'widget'
  component?: Component // the widget component; renders in-grid
  mount_policy?: MountPolicy
  clear_notifications_on_open?: boolean
  controller?: (ctx: AppContext) => AppController
}
```

### `TriggerApp`

An action-only app with a launcher icon but no rendered component.

```ts
type TriggerApp = {
  id: string
  title: string
  type: 'trigger'
  launcher: LauncherConfig
  mount_policy?: MountPolicy
  clear_notifications_on_open?: boolean
  controller?: (ctx: AppContext) => AppController // onTrigger() called on tap
}
```

### `PhoneApp`

Union of all app types.

```ts
type PhoneApp = ViewApp | WidgetApp | TriggerApp
```

### `LauncherConfig`

Visual configuration for the launcher grid icon.

```ts
type LauncherConfig = {
  icon_src: string // icon name (resolved via ui-image)
  hover_icon_src?: string // optional alternate icon shown on hover/focus
  theme: MemberTheme // theme token applied to the launcher tile
}
```

---

## Controller

### `AppController`

The object returned by a controller factory. All fields are optional.

```ts
type AppController = {
  onOpen?: () => void | Promise<void>
  onTrigger?: () => void | Promise<void>
}
```

| Hook          | When called                     | Used by           |
| ------------- | ------------------------------- | ----------------- |
| `onOpen()`    | Each time a `ViewApp` is opened | `ViewApp`         |
| `onTrigger()` | Immediately on icon tap         | `TriggerApp` only |

You can extend this interface with your own reactive state and methods — the runtime only calls `onOpen()` and `onTrigger()`. Everything else is for your component's use via injection.

---

## Context

### `AppContext`

Passed to every controller factory. Scoped per-app: `notify` and `clearNotification` are pre-bound to the app's own ID.

```ts
type AppContext = {
  // Navigation
  open(id: string, transition?: TransitionPreset): Promise<void>
  close(): void
  clear(): void

  // Notifications
  notify(payload: NotifyPayload): void
  clearNotification(): void

  // i18n
  t: ReturnType<typeof useI18n>['t']
}
```

### `AppContextInjection`

The type of the `'app-context'` injection. Available to all phone descendants via `inject(APP_CTX_KEY)`.

```ts
type AppContextInjection = {
  open(id: string, transition?: TransitionPreset): Promise<void>
  close(): void
  clear(): void
  t: ReturnType<typeof useI18n>['t']
  controller: AppController | undefined
}
```

Note: `notify` and `clearNotification` are intentionally absent — they are app-scoped and only available inside controller factories via `AppContext`.

---

## Notifications

### `NotifyPayload`

What you pass to `ctx.notify()`.

```ts
type NotifyPayload = {
  count?: number // omit to count as 1
}
```

### `PhoneNotification`

What the runtime stores internally. You don't construct this directly.

```ts
type PhoneNotification = NotifyPayload & {
  app_id: string
}
```

---

## Component Contracts

### `AppProps`

Props interface for `ViewApp` components. Provides the `close` function.

```ts
type AppProps = {
  close: () => void
}
```

### `AppEmits`

Emits interface for `ViewApp` components.

```ts
type AppEmits = {
  (e: 'close'): void
}
```

::: tip Usage
Declare both in every ViewApp component so it can be closed by both the phone frame (which listens to the `close` event) and the modal system (which passes `close` as a prop):

```ts
defineProps<AppProps>()
const emit = defineEmits<AppEmits>()
```

:::

---

## Enumerations

### `MountPolicy`

Controls when the controller factory is instantiated.

```ts
type MountPolicy = 'immediate' | 'lazy'
```

| Value         | Behaviour                                                                 |
| ------------- | ------------------------------------------------------------------------- |
| `'lazy'`      | _(default)_ Factory is called the first time the user opens the app       |
| `'immediate'` | Factory is called when the phone initialises, before any user interaction |

Use `'immediate'` for background apps that need to subscribe to stores or push notifications before the user has opened them. Any initialisation work goes in the factory body — not in a hook.

### `PhoneAppDisplay`

The two display modes for `ViewApp`.

```ts
type PhoneAppDisplay = 'full' | 'panel'
```

### `TransitionPreset`

Named transitions used when navigating between apps.

```ts
type TransitionPreset = 'slide-left' | 'slide-right' | 'pop-up' | 'pop-down' | 'none'
```

---

## Injection Key

### `APP_CTX_KEY`

```ts
import { APP_CTX_KEY } from '@/phone/system/types'

const APP_CTX_KEY = 'app-context' // plain string constant
```

Provided by `phone.vue` for all phone descendants, and re-provided by the modal slot for `display: 'full'` apps. Inject with an explicit type:

```ts
import { inject } from 'vue'
import { APP_CTX_KEY, type AppContextInjection } from '@/phone/system/types'

const ctx = inject<AppContextInjection>(APP_CTX_KEY)!
```

---

## Manifest Helper

### `installApps()` _(from `@/phone/system/install-apps`)_

Reads `src/phone/apps/installed.ts`, dynamically imports each enabled app's `_manifest.ts`, validates uniqueness, assigns runtime IDs, and marks components as `markRaw`. Called once during phone mount.

```ts
function installApps(): Promise<PhoneApp[]>
```

You do not call this directly — `phone.vue` handles it.

---

## Modal Context _(from `@/composables/modal`)_

### `ModalContext`

Passed to `useModal().open()` to inject arbitrary context into the rendered component's Vue subtree.

```ts
type ModalContext = {
  key: InjectionKey<unknown> | string
  value: unknown
}
```

**Usage:**

```ts
const { open } = useModal()

open(MyComponent, {
  backdrop: true,
  context: {
    key: APP_CTX_KEY,
    value: { controller: myController, ...phoneOS, t }
  }
})
```

Any component rendered inside `MyComponent` can then `inject(APP_CTX_KEY)` and receive the full `AppContextInjection`.
