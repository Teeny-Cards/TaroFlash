# Context & Injection

TaroPhone exposes a single Vue injection key — `'app-context'` — that gives any component inside the phone access to navigation, translation, and the current app's controller, without threading props through the component tree.

## Overview

| Key             | Provided by              | Available to          | What it gives you                                          |
| --------------- | ------------------------ | --------------------- | ---------------------------------------------------------- |
| `'app-context'` | `phone.vue` + modal slot | All phone descendants | Navigation (`open`, `close`, `clear`) + `t` + `controller` |

---

## `'app-context'`

Injected by `phone.vue` and available to every component rendered inside the phone — including the launcher and every app component.

```ts
import { inject } from 'vue'
import { APP_CTX_KEY, type AppContextInjection } from '@/phone/system/types'

const ctx = inject<AppContextInjection>(APP_CTX_KEY)!
```

`APP_CTX_KEY` is a plain string constant (`'app-context'`). Because it's not a typed `InjectionKey`, you need to supply the type parameter to `inject` yourself.

### API

```ts
type AppContextInjection = {
  open(id: string, transition?: TransitionPreset): Promise<void>
  close(): void
  clear(): void
  t: ReturnType<typeof useI18n>['t']
  controller: AppController | undefined
}
```

| Member       | Description                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `open(id)`   | Open the app with the given runtime ID. App IDs are assigned dynamically by `installApps()` — avoid hard-coding them. |
| `close()`    | Navigate back to the launcher. For apps opened as modals (`display: 'full'`), this closes the modal.                  |
| `clear()`    | Jump straight back to the launcher, clearing any intermediate state.                                                  |
| `t`          | The vue-i18n `t()` function for the current locale.                                                                   |
| `controller` | The current app's controller instance, or `undefined` if no controller was configured.                                |

---

## Accessing the Controller

`controller` is typed as `AppController | undefined`. Cast it to your specific controller type after injecting:

```ts
import { inject } from 'vue'
import { APP_CTX_KEY } from '@/phone/system/types'
import type { MyController } from './controller'

const ctx = inject(APP_CTX_KEY)!
const ctrl = ctx.controller as MyController
```

### Exporting the Controller Type

Export the inferred return type of your factory function so components can import it without repeating the definition:

```ts
// controller.ts
export function createMyController(ctx: AppContext): AppController & {
  items: Ref<Item[]>
  refresh(): Promise<void>
} {
  const items = ref<Item[]>([])

  return {
    items,
    async onOpen() {
      await refresh()
    },
    async refresh() {
      items.value = await fetchItems()
    }
  }
}

export type MyController = ReturnType<typeof createMyController>
```

Then in the component:

```vue
<script setup lang="ts">
import { inject } from 'vue'
import { APP_CTX_KEY } from '@/phone/system/types'
import type { MyController } from './controller'

const ctx = inject(APP_CTX_KEY)!
const ctrl = ctx.controller as MyController

// ctrl.items and ctrl.refresh() are fully typed
</script>

<template>
  <ul>
    <li v-for="item in ctrl.items" :key="item.id">{{ item.name }}</li>
  </ul>
  <button @click="ctrl.refresh()">Refresh</button>
</template>
```

---

## Works in Panel and Modal Apps

A key design goal is that the injection API is **identical regardless of how an app is displayed**.

Panel apps (`display: 'panel'`) render inside `phone-base.vue`, a descendant of `phone.vue`. The injection propagates through the normal Vue component tree.

Full-display apps (`display: 'full'`) render via the modal system — outside the phone's component tree — but `phone.vue` passes the full `AppContextInjection` (including the specific app's controller) when it opens the modal. The modal slot calls `provide(APP_CTX_KEY, context)` before rendering the component, so `inject(APP_CTX_KEY)` resolves identically from inside a modal.

Your app component doesn't need to know or care which mode it was opened in:

```ts
// Works in panel mode AND full-display modal mode — same code
const ctx = inject(APP_CTX_KEY)!
```

---

## Deep Component Trees

The injection key works at any depth. A grandchild component three levels below the app root gets the same value with no prop drilling required:

```
AppRoot.vue            ← inject(APP_CTX_KEY) → works
  └─ SettingsBody.vue      ← inject(APP_CTX_KEY) → works
       └─ SectionPanel.vue      ← inject(APP_CTX_KEY) → works
```

---

## When Controller is `undefined`

If an app has no `controller` in its manifest, `ctx.controller` will be `undefined`. Guard against it if your component supports both cases:

```ts
const ctx = inject(APP_CTX_KEY)!

if (ctx.controller) {
  const ctrl = ctx.controller as MyController
  // ...
}
```

For apps that always have a controller, the cast is safe to use directly.
