---
lastUpdated: 2026-04-13T21:03:32-07:00
---

# Icon

`ui-icon` is an SVG wrapper. It accepts a filename from `src/assets/icons` and renders the corresponding icon as an inline Vue component.

## Basic Usage

```vue
<ui-icon src="close" />
```

## Sizes

```vue
<ui-icon src="delete" size="large" />
<ui-icon src="delete" size="base" />
<ui-icon src="delete" size="small" />
<ui-icon src="delete" size="xs" />
```

## Styling

Apply color by adding a text color class — the SVG inherits `currentColor`:

```vue
<ui-icon src="delete" class="text-red" />
```

## Loading Strategy

Icons are resolved through two Vite globs in order of priority:

1. **Eager** — bundled into the main chunk and available synchronously. Currently all icons in `src/assets/icons/` are eager.
2. **Lazy** — code-split and fetched on first use. Icons not matched by the eager glob fall through here.

To move an icon from eager to lazy, narrow the eager glob to an explicit file list and let the rest resolve through the lazy glob. The component handles both paths transparently via a `watchEffect` that reacts to `src` changes.

## Props

| Prop  | Type   | Required | Description                                          |
| ----- | ------ | -------- | ---------------------------------------------------- |
| `src` | String | Yes      | Filename (without extension) from `src/assets/icons` |
