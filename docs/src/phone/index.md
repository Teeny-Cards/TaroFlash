# TaroPhone

TaroPhone is a virtual phone UI embedded in the application that gives users access to settings, tools, and system controls without leaving their current view. Visually it lives as a small phone icon in the corner of the page; tapping it opens a phone shell containing a grid of apps.

From a developer's perspective, TaroPhone is a lightweight **app runtime** — a system for registering components as "apps", managing their lifecycle, routing between them, and surfacing notifications back to the phone badge.

## Architecture

The system has three layers:

```
┌─────────────────────────────────┐
│           phone.vue             │  ← Shell: renders badge, launcher,
│   (runtime + context provider)  │    transitions, modal hand-off
└──────────────┬──────────────────┘
               │ installs & starts apps
┌──────────────▼──────────────────┐
│         Phone Runtime           │  ← Manages active session,
│  (runtime.ts + install-apps.ts) │    transition direction, notification state
└──────────────┬──────────────────┘
               │ open / close / notify
┌──────────────▼──────────────────┐
│             Apps                │  ← Your code: manifests, components,
│   (src/phone/apps/<name>/)      │    controllers, widgets
└─────────────────────────────────┘
```

Each app declares itself via a **manifest** — a typed configuration object that tells the runtime what kind of app it is, what component to render, what theme to use, and optionally how to behave at startup.

## Key Concepts

- **[App types](./app-types)** — `ViewApp`, `WidgetApp`, and `TriggerApp` cover every UI pattern from full settings screens to single-tap actions.
- **[Controllers](./controllers)** — A factory function that separates app logic from its component. Controllers receive the full phone API and can run at startup before a user ever opens the app.
- **[Notifications](./notifications)** — Any app can push a count badge to the phone icon. The runtime auto-clears it when the user opens that app.
- **[Context & Injection](./context)** — Two Vue injection keys give components access to phone navigation and their own controller, including inside modals.

## Quickstart

Here is a complete, minimal app — a trigger that shows a toast — to illustrate every moving part.

**1. Create the directory structure**

```
src/phone/apps/my-app/
  _manifest.ts
  controller.ts
```

**2. Write the controller**

```ts
// src/phone/apps/my-app/controller.ts
import type { AppContext, AppController } from '@/phone/system/types'
import { useToast } from '@/composables/toast'

export function createMyAppController(ctx: AppContext): AppController {
  const toast = useToast()

  return {
    run() {
      toast.success(ctx.t('my-app.hello'))
    }
  }
}
```

**3. Write the manifest**

```ts
// src/phone/apps/my-app/_manifest.ts
import type { TriggerApp } from '@/phone/system/types'
import { createMyAppController } from './controller'

export default {
  title: 'My App',
  type: 'trigger',
  controller: createMyAppController,
  launcher: {
    icon_src: 'my-app-icon',
    theme: 'green-400'
  }
} satisfies Omit<TriggerApp, 'id'>
```

**4. Enable the app**

```ts
// src/phone/apps/installed.ts
export default {
  settings: true,
  darkmode: true,
  'my-app': true // ← add this
}
```

That's it. The runtime discovers the app at startup, registers it, and calls `run()` when the user taps the icon.

## What's in This Guide

| Page                             | What it covers                                   |
| -------------------------------- | ------------------------------------------------ |
| [App Types](./app-types)         | The three app shapes and when to use each        |
| [Controllers](./controllers)     | Logic layer, lifecycle hooks, background startup |
| [Notifications](./notifications) | Pushing and clearing badge notifications         |
| [Context & Injection](./context) | Accessing the phone API from any component       |
| [API Reference](./reference)     | All types, interfaces, and exported values       |
