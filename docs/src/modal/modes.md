# Modes & Backdrop

The `mode` option controls both the animation and the layout container for the modal. The `backdrop` option controls whether a blurred overlay renders behind it.

## Modes

```ts
modal.open(MyModal, { mode: 'dialog' }) // default
modal.open(MyModal, { mode: 'mobile-sheet' })
modal.open(MyModal, { mode: 'popup' })
```

### `dialog`

Centered on screen. Animates with a slide-up fade-in on enter and slide-down fade-out on leave.

Use for standard forms, settings screens, and confirmations.

### `mobile-sheet`

**Mobile** (touch/coarse pointer): slides up from the bottom edge of the screen — a native sheet pattern.

**Desktop**: behaves identically to `dialog`, centered on screen.

Use this for any modal that should feel native on mobile but works well as a centered dialog on larger screens. Most app modals use this mode.

```ts
modal.open(DeckSettings, {
  backdrop: true,
  mode: 'mobile-sheet',
  props: { deck }
})
```

### `popup`

Centered on screen. Animates with a spring scale-in on enter and a scale-fade-out on leave — lighter and faster than `dialog`.

Use for small contextual overlays that should feel quick: mini-confirmations, popovers, brief prompts.

---

## Backdrop

```ts
modal.open(MyModal, { backdrop: true })
```

When `backdrop: true`, a semi-transparent blurred overlay renders behind the modal. Clicking it triggers a close request — either calling `pop()` directly or invoking the registered [request-close handler](./request-close) if one exists.

Without a backdrop, the content behind the modal remains fully interactive. Use this for non-blocking overlays that don't need to capture focus.

::: tip
The backdrop is evaluated across the whole stack — if **any** open modal has `backdrop: true`, the overlay is shown.
:::
