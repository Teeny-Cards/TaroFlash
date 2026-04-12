# Modal

The modal system is a composable-first, stack-based overlay layer. Any component in the app can open a modal, receive a typed response when it closes, and stack multiple modals on top of each other — all without managing visibility state manually.

## How It Works

```
useModal().open(MyComponent, { backdrop: true })
        │
        ▼
Runtime pushes to modal_stack
        │
        ▼
modal.vue renders the stack — one <component> per entry
        │
        ▼
Component calls close(responseValue)
        │
        ▼
Promise resolves with responseValue
        │
        ▼
Runtime removes entry from modal_stack
```

The modal stack is module-level — it's shared across every call to `useModal()`. Any component, anywhere in the app, can push to or read from the same stack.

---

## Opening a Modal

```ts
import { useModal } from '@/composables/modal'
import MyModal from './my-modal.vue'

const modal = useModal()

modal.open(MyModal, {
  backdrop: true,
  mode: 'dialog',
  props: { title: 'Hello' }
})
```

`open()` returns immediately. The modal renders asynchronously as part of the reactive stack.

---

## Reading the Response

Every modal open returns `{ response, close }`. `response` is a `Promise<T>` that resolves when the modal closes. This lets you treat a modal like an async function call:

```ts
const { response } = modal.open<boolean>(ConfirmModal, {
  backdrop: true,
  props: { message: 'Are you sure?' }
})

response.then((confirmed) => {
  if (confirmed) deleteItem()
})
```

Or with `await`:

```ts
const confirmed = await modal.open<boolean>(ConfirmModal, {
  backdrop: true
}).response

if (confirmed) deleteItem()
```

The type parameter `<T>` types both `response` and the `close` function. If you don't need a response value, omit it — the promise resolves with `undefined`.

---

## The `close` Prop

Every component opened via `useModal()` automatically receives a `close` prop. Calling it closes the modal and resolves the response Promise with whatever value you pass:

```ts
type ModalCloseFn<T> = (responseValue?: T) => void
```

Declare it in your modal component using the `close` prop directly:

```vue
<!-- confirm-modal.vue -->
<script setup lang="ts">
type ConfirmModalProps = {
  message: string
  close: (result?: boolean) => void
}

const { message, close } = defineProps<ConfirmModalProps>()
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <button @click="close(false)">Cancel</button>
    <button @click="close(true)">Confirm</button>
  </div>
</template>
```

::: tip
`close` is injected automatically — you don't need to pass it in `props`. Just declare it in your component's props type and destructure it.
:::

---

## Modes

The `mode` option controls both the animation and the layout of the modal container.

```ts
modal.open(MyModal, { mode: 'dialog' }) // default
modal.open(MyModal, { mode: 'mobile-sheet' })
modal.open(MyModal, { mode: 'popup' })
```

### `dialog`

Centered on screen. Animates with a slide-up fade-in on enter and slide-down fade-out on leave. Use for standard forms, settings, and confirmations.

### `mobile-sheet`

On **mobile** (pointer: coarse), slides up from the bottom edge of the screen. On **desktop**, behaves identically to `dialog`. Use this for any modal that should feel native on mobile but works as a centered dialog on larger screens.

```ts
modal.open(DeckSettings, {
  backdrop: true,
  mode: 'mobile-sheet',
  props: { deck }
})
```

### `popup`

Centered on screen. Animates with a spring scale-in on enter and scale-out on leave. Use for small contextual overlays that should feel lightweight and quick — tooltips, popovers, mini-confirmations.

---

## Backdrop

Set `backdrop: true` to render a semi-transparent blur overlay behind the modal. Clicking the backdrop triggers a close request (see [Intercepting Close](#intercepting-close)).

```ts
modal.open(MyModal, { backdrop: true })
```

Without a backdrop, the content behind the modal remains fully interactive. Useful for non-blocking overlays that don't need to capture focus.

---

## Stacking Modals

Multiple modals can be open at the same time. Each `open()` call pushes a new entry onto the stack. They render in order, with the latest on top.

```ts
// Open first modal
const { response } = modal.open<SecondaryAction>(SessionComplete, {
  backdrop: true,
  mode: 'mobile-sheet'
})

// Open second modal on top (e.g. a confirmation)
modal.open(ConfirmModal, { backdrop: true })
```

Use `pop()` to close the topmost modal:

```ts
const { pop } = useModal()
pop()
```

Or close a specific modal using the `close` function returned by `open()`:

```ts
const { close } = modal.open(MyModal)
// later:
close()
```

---

## Intercepting Close

By default, clicking the backdrop or pressing `Esc` immediately closes the topmost modal. Use `useModalRequestClose` inside your modal component to intercept that request and decide what to do instead:

```ts
import { useModalRequestClose } from '@/composables/modal'

useModalRequestClose(() => {
  // This handler runs instead of the default close
  if (form.isDirty) {
    // Show a confirmation before closing
    confirmDiscard().then((confirmed) => {
      if (confirmed) props.close()
    })
  } else {
    props.close()
  }
})
```

The handler is automatically removed when the component unmounts — no cleanup needed.

If no handler is registered, the runtime falls back to `pop()` (close the topmost modal).

::: info
`useModalRequestClose` only intercepts backdrop clicks and `Esc`. Calling `close()` or `pop()` directly always closes immediately, bypassing the handler.
:::

---

## Context Injection

Pass arbitrary data into the modal's Vue subtree using `context`. Any component rendered inside the modal — at any depth — can inject it.

```ts
const MY_KEY = 'my-context'

modal.open(MyModal, {
  context: {
    key: MY_KEY,
    value: { user, settings }
  }
})
```

Inside `MyModal` or any of its descendants:

```ts
import { inject } from 'vue'

const ctx = inject<{ user: User; settings: Settings }>('my-context')!
```

The key can be a plain string or a typed Vue `InjectionKey`. Use `InjectionKey` when you want TypeScript to infer the type from `inject()` automatically.

This is how the phone system injects the app controller into full-display app components — see [Context & Injection](../phone/context) for a real example.

---

## Wrapping `useModal`

For modals you open from multiple places, wrap the `open()` call in a dedicated composable. This centralises the options, typed response, and any surrounding logic (sound effects, analytics, etc.):

```ts
// src/composables/modals/use-confirm-modal.ts
import { useModal } from '@/composables/modal'
import ConfirmModal from '@/components/modals/confirm-modal.vue'

export function useConfirmModal() {
  const modal = useModal()

  function open(message: string) {
    return modal.open<boolean>(ConfirmModal, {
      backdrop: true,
      props: { message }
    })
  }

  return { open }
}
```

```ts
// Usage anywhere in the app
import { useConfirmModal } from '@/composables/modals/use-confirm-modal'

const confirm = useConfirmModal()

const confirmed = await confirm.open('Delete this deck?').response
if (confirmed) await deleteDeck(id)
```

---

## Checking if Any Modal is Open

`modal_stack` is a reactive ref exposed by `useModal()`. Read it to know whether any modals are currently open — useful for suppressing background interactions:

```ts
const { modal_stack } = useModal()

// In a template or watchEffect:
if (modal_stack.value.length === 0) {
  // no modals are open
}
```

---

## API Reference

### `useModal()`

```ts
function useModal(): {
  open<T>(component: Component, args?: OpenArgs): OpenModalResult<T>
  pop(): void
  modal_stack: Ref<ModalEntry[]>
}
```

### `open(component, args?)`

| Option     | Type           | Default     | Description                                                    |
| ---------- | -------------- | ----------- | -------------------------------------------------------------- |
| `props`    | `object`       | `{}`        | Props passed to the component. `close` is always injected too. |
| `backdrop` | `boolean`      | `false`     | Show a blurred backdrop. Clicking it triggers a close request. |
| `mode`     | `ModalMode`    | `'dialog'`  | Controls layout and animation. See [Modes](#modes).            |
| `context`  | `ModalContext` | `undefined` | Vue injection to provide into the modal subtree.               |

Returns `{ response: Promise<T>, close: ModalCloseFn<T> }`.

### `pop()`

Closes the topmost modal in the stack.

### `ModalMode`

```ts
type ModalMode = 'dialog' | 'mobile-sheet' | 'popup'
```

### `ModalContext`

```ts
type ModalContext = {
  key: InjectionKey<unknown> | string
  value: unknown
}
```

### `useModalRequestClose(handler)`

```ts
function useModalRequestClose(handler: () => void): void
```

Registers a handler that runs when the backdrop is clicked or `Esc` is pressed, instead of the default `pop()`. Call this inside a component that lives inside a modal. The handler is automatically removed on unmount.

### `OpenModalResult<T>`

```ts
type OpenModalResult<T> = {
  response: Promise<T>
  close: ModalCloseFn<T>
}

type ModalCloseFn<T> = (responseValue?: T) => void
```
