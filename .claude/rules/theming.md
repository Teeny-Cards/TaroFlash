---
lastUpdated: 2026-05-06T00:00:00Z
paths:
  - 'src/**/*.{vue,css}'
---

# Theming Convention

Colors are applied via the `data-theme` attribute, which scopes a set of semantic CSS variables defined in `src/styles/palettes.css`. Never use raw hex values or hardcoded color utilities — always go through the theme token layer.

## How it works

1. Parents apply theming by setting `data-theme` (and optionally `data-theme-dark`) directly on the element or component — the value is a `MemberTheme` (e.g. `'blue-500'`, `'green-400'`).
2. On a component, those attributes flow through to its root element via Vue's normal attribute inheritance. Components do **not** declare a `theme` / `themeDark` prop; they just let the attrs forward.
3. `palettes.css` maps each theme value to a set of `--theme-*` variables using a comma selector covering two activation conditions:
   - `[data-theme='X']` — `(0,1,0)` always active (light or dark mode)
   - `[data-theme='dark'] [data-theme-dark='X']` — `(0,2,0)` active when the root is dark
     Each selector in a comma list keeps its own specificity (unlike `:is()`, which elevates all arms to the highest), so the descendant form genuinely beats the plain form in dark mode.
4. Available tokens: `--theme-primary` / `--theme-on-primary`, `--theme-secondary` / `--theme-on-secondary`, `--theme-accent` / `--theme-on-accent`, `--theme-neutral` / `--theme-on-neutral`.
5. Child elements reference those variables via Tailwind's arbitrary-property syntax or plain CSS.

> **Dark mode root**: `use-theme` always writes an explicit `'light'` or `'dark'` to `data-theme` on `document.documentElement` — even when the user's preference is `'system'`. CSS never needs a `prefers-color-scheme` media-query fallback.

## At a call site

Pass `data-theme` (and `data-theme-dark` if needed) directly on the child element or component:

```vue
<template>
  <ui-button data-theme="blue-500" data-theme-dark="blue-300">Save</ui-button>

  <div data-theme="green-400">
    <div class="bg-(--theme-primary) text-(--theme-on-primary)">...</div>
  </div>
</template>
```

If `data-theme-dark` is omitted, the same `data-theme` value applies in dark mode.

## Inside a themed component

Don't declare `theme` / `themeDark` props. With default `inheritAttrs`, `data-theme` and `data-theme-dark` from the call site flow onto the component's root automatically. Consume the scoped tokens anywhere inside:

```vue
<template>
  <div class="bg-(--theme-primary) text-(--theme-on-primary)">...</div>
</template>
```

If the component uses `defineOptions({ inheritAttrs: false })`, forward the attrs explicitly onto the root that should carry the theme.

## In CSS / `<style>`

```css
.my-component {
  background-color: var(--theme-primary);
  color: var(--theme-on-primary);
}
```

## Textured backgrounds: `bgx-*`

`src/styles/bg-utils.css` defines a `bgx-*` utility that composites a masked pattern layer over an element using a `::before` pseudo-element. Use it for decorative texture effects (e.g. diagonal stripes on hover).

Key modifiers:

| Utility               | What it does                                               |
| --------------------- | ---------------------------------------------------------- |
| `bgx-<name>`          | Sets the mask image (e.g. `bgx-diagonal-stripes`)          |
| `bgx-color-[<value>]` | Sets the fill color of the mask layer                      |
| `bgx-opacity-<n>`     | Sets opacity as a percentage (e.g. `bgx-opacity-20` → 20%) |
| `bgx-size-<n>`        | Sets mask-size via spacing scale or length                 |
| `bgx-slide`           | Animates the mask position (infinite loop)                 |

To make the texture color follow the active theme token, pass the token through the arbitrary-value bracket:

```html
<!-- fill inherits the current theme's neutral color -->
<div class="bgx-diagonal-stripes bgx-color-[var(--theme-neutral)]" />

<!-- fill follows the on-neutral token -->
<div class="bgx-diagonal-stripes bgx-color-[var(--theme-on-neutral)]" />
```

## Rules

- **Always** write styles using tailwind classes, only opting for a style block when styling becomes complex or oversized for inline classes.
- Set `data-theme` (and `data-theme-dark` when needed) on the outermost element or component that should carry the theme — descendants inherit the tokens.
- Don't add `theme` / `themeDark` props to components — let `data-theme` / `data-theme-dark` forward via `inheritAttrs`.
- Use `--theme-*` tokens for any color that should vary with the theme; use `--color-*` tokens only for colors that are fixed regardless of theme.
- Never use `@apply` — write plain CSS with `var(--theme-*)` directly (see `no-apply` rule).
- Do not use raw hex values or hardcoded Tailwind color classes (e.g. `bg-blue-500`) for themeable colors.
- When using `bgx-color-*` inside a themed element, always pass a `var(--theme-*)` token, not a raw color.
