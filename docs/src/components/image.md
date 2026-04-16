---
lastUpdated: 2026-04-13T21:03:32-07:00
---

# Image

`ui-image` resolves and renders an image from `src/assets/images/` by filename. It supports both raster (PNG, JPEG) and SVG formats, and uses an eager/lazy loading strategy to balance bundle size with perceived performance.

## Basic Usage

Pass the filename without its extension:

```vue
<ui-image src="settings" />
<ui-image src="inventory" size="lg" />
```

## Sizes

The `size` prop applies a fixed dimension class:

```vue
<ui-image src="settings" size="full" />
<ui-image src="settings" size="xl" />
<ui-image src="settings" size="lg" />
<ui-image src="settings" size="base" />
<ui-image src="settings" size="sm" />
<ui-image src="settings" size="xs" />
```

| Size    | Dimensions              |
| ------- | ----------------------- |
| `full`  | 100% x 100%             |
| `xl`    | 128px                   |
| `lg`    | 96px                    |
| `base`  | 64px                    |
| `sm`    | 48px                    |
| `xs`    | 32px                    |
| `unset` | No fixed size (default) |

## Loading Strategy

Images are resolved through two tiers:

1. **Eager** — a hand-picked list of images bundled into the main chunk. These are available synchronously with no network request. The list is defined as an explicit glob array inside the component.
2. **Lazy** — all remaining images in `src/assets/images/` are code-split and fetched on first use.

Eager images are resolved first. If no match is found, the component falls through to the lazy pool and dynamically imports the module on mount.

To make an image eager, add its path to the explicit glob list in the component's `eagerImages` declaration.

## Props

| Prop   | Type   | Default | Description                                            |
| ------ | ------ | ------- | ------------------------------------------------------ |
| `src`  | String | —       | Filename (without extension) from `src/assets/images/` |
| `size` | String | `unset` | `full`, `xl`, `lg`, `base`, `sm`, `xs`, or `unset`     |
