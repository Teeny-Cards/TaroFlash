---
lastUpdated: 2026-04-13T21:03:32-07:00
---

# Theming

TaroFlash uses a two-layer theming model: a **root-level dark/light mode** controlled by `use-theme`, and **component-level color themes** controlled by `data-theme` / `data-theme-dark` attributes.

## Root dark mode — `use-theme`

`use-theme` manages the user's dark/light preference and writes it to `document.documentElement` as `data-theme="light"` or `data-theme="dark"`. This always results in an explicit attribute on the root — CSS never needs a `prefers-color-scheme` media-query fallback.

```ts
import { useTheme } from '@/composables/use-theme'

const { mode, is_dark, setMode, cycle, load } = useTheme()

// Load persisted preference on app startup
load()

// Set a specific mode
setMode('dark') // 'light' | 'dark' | 'system'

// Cycle through modes in order
cycle()
```

### API

| Return value | Type                        | Description                                                                       |
| ------------ | --------------------------- | --------------------------------------------------------------------------------- |
| `mode`       | `Ref<ThemeMode>`            | Current mode: `'light'`, `'dark'`, or `'system'`                                  |
| `is_dark`    | `ComputedRef<boolean>`      | `true` when the effective theme is dark                                           |
| `setMode`    | `(next: ThemeMode) => void` | Set mode and persist to storage                                                   |
| `cycle`      | `() => void`                | Step through `light → system → dark` (or `light → dark → system` when OS is dark) |
| `load`       | `() => void`                | Load and apply the persisted preference (call once on app init)                   |

When `mode` is `'system'`, the composable resolves the OS preference at runtime and writes `'light'` or `'dark'` to the DOM. A `MediaQueryList` listener keeps the attribute in sync if the OS preference changes while the app is running.

## Component theming — `data-theme`

Component-level color themes are applied with the `data-theme` attribute, which scopes a set of semantic CSS variables. Child elements reference these via `var(--theme-*)` tokens.

```vue
<script setup lang="ts">
type CardProps = {
  theme?: MemberTheme
  themeDark?: MemberTheme
}

const { theme = 'blue-500', themeDark } = defineProps<CardProps>()
</script>

<template>
  <div :data-theme="theme" :data-theme-dark="themeDark ?? theme">
    <div class="bg-(--theme-primary) text-(--theme-on-primary)">...</div>
  </div>
</template>
```

### Dark mode override — `data-theme-dark`

When the root has `data-theme="dark"`, `palettes.css` selectors activate the `data-theme-dark` value on any descendant instead of `data-theme`:

```
:is([data-theme='blue-500'], [data-theme='dark'] [data-theme-dark='blue-500']) { … }
```

The descendant selector `(0,2,0)` has higher specificity than the plain attribute form `(0,1,0)`, so `data-theme-dark` always wins in dark mode.

**Always bind both attributes together**, with `themeDark` falling back to `theme`:

```html
<div :data-theme="theme" :data-theme-dark="themeDark ?? theme"></div>
```

This ensures the element stays correctly themed even when no explicit dark override is provided.

## Available tokens

Each theme value in `palettes.css` defines a subset of these CSS variables:

| Token                  | Typical use                         |
| ---------------------- | ----------------------------------- |
| `--theme-primary`      | Main background, buttons, headers   |
| `--theme-on-primary`   | Text / icons on `--theme-primary`   |
| `--theme-secondary`    | Supplementary backgrounds           |
| `--theme-on-secondary` | Text / icons on `--theme-secondary` |
| `--theme-accent`       | Highlights, badges                  |
| `--theme-on-accent`    | Text / icons on `--theme-accent`    |
| `--theme-neutral`      | Neutral surfaces (cards, panels)    |
| `--theme-on-neutral`   | Text / icons on `--theme-neutral`   |

Not every theme defines all tokens — check `src/styles/palettes.css` for what each theme provides.

## Rules

- Always type theme props as `MemberTheme`, not `string`.
- Bind `data-theme` on the outermost element that needs theming.
- Use `--theme-*` tokens for colors that vary with the theme. Use `--color-*` tokens only for colors fixed regardless of theme.
- Never use raw hex values or hardcoded Tailwind color classes for themeable colors.
- Add `themeDark?: MemberTheme` alongside `theme` and bind `:data-theme-dark="themeDark ?? theme"` on the same root element.
- Never use `@apply`.
