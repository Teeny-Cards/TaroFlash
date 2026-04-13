# Theming Convention

Colors are applied via the `data-theme` attribute, which scopes a set of semantic CSS variables defined in `src/styles/palettes.css`. Never use raw hex values or hardcoded color utilities — always go through the theme token layer.

## How it works

1. A `theme` prop accepts a `MemberTheme` value (e.g. `'blue-500'`, `'green-400'`).
2. That value is bound to `data-theme` on the root element of the component.
3. `palettes.css` maps each theme value to a set of `--theme-*` variables using a comma selector that covers two activation conditions:
   - `[data-theme='X']` — `(0,1,0)` always active (light or dark mode)
   - `[data-theme='dark'] [data-theme-dark='X']` — `(0,2,0)` active when the root is dark
   Because each selector in a comma list carries its own specificity (unlike `:is()`, which elevates all arms to the highest), the descendant form genuinely beats the plain form in dark mode.
4. Available tokens: `--theme-primary` / `--theme-on-primary`, `--theme-secondary` / `--theme-on-secondary`, `--theme-accent` / `--theme-on-accent`, `--theme-neutral` / `--theme-on-neutral`.
5. Child elements reference those variables via Tailwind's arbitrary-property syntax or plain CSS.

> **Dark mode root**: `use-theme` always writes an explicit `'light'` or `'dark'` to `data-theme` on `document.documentElement` — even when the user's preference is `'system'`. CSS never needs a `prefers-color-scheme` media-query fallback.

## In a component

```vue
<script setup lang="ts">
type MyComponentProps = {
  theme?: MemberTheme
  themeDark?: MemberTheme
}

const { theme = 'blue-500', themeDark } = defineProps<MyComponentProps>()
</script>

<template>
  <div :data-theme="theme" :data-theme-dark="themeDark ?? theme">
    <!-- consume the scoped tokens anywhere inside -->
    <div class="bg-(--theme-primary) text-(--theme-on-primary)">...</div>
  </div>
</template>
```

When `themeDark` is omitted it falls back to `theme`, so the element remains correctly styled in dark mode even without an explicit override. Only bind `data-theme-dark` on elements that already bind `data-theme`.

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

| Utility | What it does |
|---|---|
| `bgx-<name>` | Sets the mask image (e.g. `bgx-diagonal-stripes`) |
| `bgx-color-[<value>]` | Sets the fill color of the mask layer |
| `bgx-opacity-<n>` | Sets opacity as a percentage (e.g. `bgx-opacity-20` → 20%) |
| `bgx-size-<n>` | Sets mask-size via spacing scale or length |
| `bgx-slide` | Animates the mask position (infinite loop) |

To make the texture color follow the active theme token, pass the token through the arbitrary-value bracket:

```html
<!-- fill inherits the current theme's neutral color -->
<div class="bgx-diagonal-stripes bgx-color-[var(--theme-neutral)]" />

<!-- fill follows the on-neutral token -->
<div class="bgx-diagonal-stripes bgx-color-[var(--theme-on-neutral)]" />
```

Never hardcode a raw color (hex or palette class) in `bgx-color-*` when the element lives inside a themed scope — always use `var(--theme-*)`.

## Rules

- **Always** type theme props as `MemberTheme` (defined in `types/member.d.ts`), not `string`.
- Bind `data-theme` on the outermost element that needs theming so descendents inherit it.
- Use `--theme-*` tokens for any color that should vary with the theme; use `--color-*` tokens only for colors that are fixed regardless of theme.
- Never use `@apply` — write plain CSS with `var(--theme-*)` directly (see `no-apply` rule).
- Do not use raw hex values or hardcoded Tailwind color classes (e.g. `bg-blue-500`) for themeable colors.
- When using `bgx-color-*` inside a themed element, always pass a `var(--theme-*)` token, not a raw color.
- Add a `themeDark?: MemberTheme` prop alongside `theme` and bind `:data-theme-dark="themeDark ?? theme"` on the same root element. The fallback keeps the element correctly styled when no dark override is needed.
