---
lastUpdated: 2026-04-13T21:03:32-07:00
---

# Slider

`ui-slider` is a horizontal drag slider that exposes a 0–100 percentage value via `v-model`. It works with both mouse and touch input.

## Basic usage

```html
<ui-slider v-model="opacity" />
```

`v-model` binds a `number` in the range `0`–`100`.

## Theme

Pass a `MemberTheme` value to colour the fill and thumb. Defaults to `'brown-800'`.

```html
<ui-slider v-model="value" theme="blue-500" />
```

The fill track uses `--theme-primary`; the thumb uses `--theme-accent`.

## Behaviour

- Dragging is handled via `useGestures`, so the slider works on both mouse and touch.
- The thumb displays its current percentage value as a tooltip while dragging.
- The component uses a `ResizeObserver` to recalculate fill width if the container size changes after mount.

## Props

| Prop    | Type          | Default       | Description |
| ------- | ------------- | ------------- | ----------- |
| `theme` | `MemberTheme` | `'brown-800'` | Color theme |

## Model

| Model     | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `v-model` | `number` | Current value, clamped to 0–100 |
