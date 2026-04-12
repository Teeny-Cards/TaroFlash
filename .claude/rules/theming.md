# Theming Convention

Colors are applied via the `data-theme` attribute, which scopes a set of semantic CSS variables defined in `src/styles/palettes.css`. Never use raw hex values or hardcoded color utilities — always go through the theme token layer.

## How it works

1. A `theme` prop accepts a `MemberTheme` value (e.g. `'blue-500'`, `'green-400'`).
2. That value is bound to `data-theme` on the root element of the component.
3. `palettes.css` maps each `[data-theme='...']` selector to a set of `--theme-*` variables:
   - `--theme-primary` / `--theme-on-primary`
   - `--theme-secondary` / `--theme-on-secondary`
   - `--theme-accent` / `--theme-on-accent`
   - `--theme-neutral` / `--theme-on-neutral`
4. Child elements reference those variables via Tailwind's arbitrary-property syntax or plain CSS.

## In a component

```vue
<script setup lang="ts">
type MyComponentProps = {
  theme?: MemberTheme
}

const { theme = 'blue-500' } = defineProps<MyComponentProps>()
</script>

<template>
  <div :data-theme="theme">
    <!-- consume the scoped tokens anywhere inside -->
    <div class="bg-(--theme-primary) text-(--theme-on-primary)">...</div>
  </div>
</template>
```

## In CSS / `<style>`

```css
.my-component {
  background-color: var(--theme-primary);
  color: var(--theme-on-primary);
}
```

## Rules

- **Always** type theme props as `MemberTheme` (defined in `types/member.d.ts`), not `string`.
- Bind `data-theme` on the outermost element that needs theming so descendents inherit it.
- Use `--theme-*` tokens for any color that should vary with the theme; use `--color-*` tokens only for colors that are fixed regardless of theme.
- Never use `@apply` — write plain CSS with `var(--theme-*)` directly (see `no-apply` rule).
- Do not use raw hex values or hardcoded Tailwind color classes (e.g. `bg-blue-500`) for themeable colors.
