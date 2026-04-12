# App Types

Every TaroPhone app is one of three types. The type you choose determines how the app appears in the launcher, how it's rendered, and what lifecycle hooks are available to it.

| Type         | Launcher icon | Renders a component | Triggered by                                 |
| ------------ | :-----------: | :-----------------: | -------------------------------------------- |
| `ViewApp`    |       ✓       |          ✓          | Tapping icon → navigates into app            |
| `WidgetApp`  |       —       |     ✓ (inline)      | Tapping widget directly                      |
| `TriggerApp` |       ✓       |          —          | Tapping icon → runs `controller.onTrigger()` |

---

## ViewApp

A `ViewApp` renders a full component inside the phone shell when the user taps its launcher icon. It has two display modes that control how it's presented.

### Display Modes

**`panel`** — The component renders inside the phone frame, replacing the launcher grid. The back button returns to the home screen. Use this for contextual panels like shortcuts, card queues, or in-phone navigation.

**`full`** — The component opens as a centered modal dialog above the rest of the UI. The phone shell stays in place in the background. Use this for large settings screens or any experience that needs more screen space than the phone frame provides.

### Example

```ts
// src/phone/apps/shortcuts/_manifest.ts
import type { ViewApp } from '@/phone/system/types'
import component from './component.vue'

export default {
  title: 'Shortcuts',
  type: 'view',
  display: 'panel',
  component,
  launcher: {
    icon_src: 'shortcuts',
    hover_icon_src: 'shortcuts-hover',
    theme: 'orange-500'
  }
} satisfies Omit<ViewApp, 'id'>
```

### Component Contract

A ViewApp component must accept a `close` prop and emit a `close` event. Use the `AppProps` and `AppEmits` types to satisfy this contract:

```vue
<!-- src/phone/apps/my-app/component.vue -->
<script setup lang="ts">
import type { AppProps, AppEmits } from '@/phone/system/types'

defineProps<AppProps>()
const emit = defineEmits<AppEmits>()
</script>

<template>
  <div>
    <button @click="emit('close')">Close</button>
    <!-- app content -->
  </div>
</template>
```

::: tip Accessing the controller
A ViewApp component can access its controller via injection. See [Context & Injection](./context) for details.
:::

---

## WidgetApp

A `WidgetApp` renders its component **inline in the launcher grid** rather than navigating to a new view. It has no launcher icon configuration — the component itself is the icon.

Use a WidgetApp for stateful toggles that the user should be able to interact with directly from the home screen without any navigation: dark mode cycling, language switching, or status indicators.

### Example

```ts
// src/phone/apps/darkmode/_manifest.ts
import type { WidgetApp } from '@/phone/system/types'
import component from './component.vue'

export default {
  title: 'Darkmode',
  type: 'widget',
  component
} satisfies Omit<WidgetApp, 'id'>
```

The component is responsible for its own visual presentation. Use the `<widget>` primitive to get consistent sizing, hover effects, and tooltip behaviour:

```vue
<!-- src/phone/apps/darkmode/component.vue -->
<script setup lang="ts">
import Widget from '@/phone/components/widget.vue'
import { useTheme } from '@/composables/use-theme'

const { cycle, mode } = useTheme()
const theme = computed(() => (mode.value === 'dark' ? 'blue-650' : 'orange-600'))
</script>

<template>
  <widget :theme="theme" title="Dark Mode" @click="cycle">
    <!-- icon -->
  </widget>
</template>
```

::: info
WidgetApps do not participate in navigation — tapping them triggers a click on the component, not `runtime.open()`. They cannot have a controller and do not receive `AppContext`.
:::

---

## TriggerApp

A `TriggerApp` has a launcher icon but no component. When tapped, the runtime calls `controller.onTrigger()` immediately. Nothing is rendered in the phone frame.

Use a TriggerApp for actions that open their own modal (like a logout confirmation), launch an external flow, or perform an immediate side effect.

### Example

```ts
// src/phone/apps/logout/_manifest.ts
import type { TriggerApp } from '@/phone/system/types'
import { createLogoutController } from './controller'

export default {
  title: 'Logout',
  type: 'trigger',
  controller: createLogoutController,
  launcher: {
    icon_src: 'logout',
    hover_icon_src: 'logout-hover',
    theme: 'red-400'
  }
} satisfies Omit<TriggerApp, 'id'>
```

```ts
// src/phone/apps/logout/controller.ts
import type { AppContext, AppController } from '@/phone/system/types'
import { useAlert } from '@/composables/alert'
import { useSessionStore } from '@/stores/session'

export function createLogoutController(ctx: AppContext): AppController {
  const alert = useAlert()
  const session = useSessionStore()

  return {
    onTrigger() {
      const { response } = alert.warn({
        title: ctx.t('phone.apps.logout.title'),
        message: ctx.t('phone.apps.logout.description'),
        confirmLabel: ctx.t('common.logout')
      })
      response.then((confirmed) => {
        if (confirmed) session.logout()
      })
    }
  }
}
```

::: tip Controller required
`controller` is optional on `ViewApp` but **required** on `TriggerApp` — without an `onTrigger()` implementation, tapping the icon does nothing.
:::

---

## File & Manifest Conventions

All apps live under `src/phone/apps/` in their own named directory:

```
src/phone/apps/
  my-app/
    _manifest.ts     ← required: exports the app definition
    component.vue    ← required for ViewApp and WidgetApp
    controller.ts    ← recommended when logic is non-trivial
```

The manifest filename is always `_manifest.ts`. The leading underscore ensures it sorts to the top and signals that it's a system file rather than a component.

### The `satisfies` Pattern

Manifests use TypeScript's `satisfies` operator to get full type-checking without losing the literal types needed by the runtime:

```ts
// Correct — satisfies checks the shape, preserves literal 'view' type
export default {
  type: 'view',
  display: 'panel',
  ...
} satisfies Omit<ViewApp, 'id'>

// Avoid — explicit annotation widens 'view' to string
export default {
  type: 'view',
  ...
} as ViewApp
```

---

## Installing an App

Apps are opt-in. Add the directory name and `true` to `src/phone/apps/installed.ts`:

```ts
// src/phone/apps/installed.ts
export default {
  settings: true,
  darkmode: true,
  shortcuts: true,
  logout: true,
  'my-app': true // ← enable your new app
}
```

Set the value to `false` to disable without deleting the app:

```ts
  'my-app': false,  // disabled — not loaded, doesn't appear in launcher
```

::: warning
The key must exactly match the subdirectory name under `src/phone/apps/`. A mismatch will throw at runtime when the dynamic import fails.
:::
