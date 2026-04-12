# API Reference

All types and values exported from `@/composables/modal`.

---

## `useModal()`

```ts
function useModal(): {
  open<T>(component: Component, args?: OpenArgs): OpenModalResult<T>
  pop(): void
  modal_stack: Ref<ModalEntry[]>
}
```

### `open(component, args?)`

Opens a modal and returns `{ response, close }`.

| Option     | Type           | Default     | Description                                                    |
| ---------- | -------------- | ----------- | -------------------------------------------------------------- |
| `props`    | `object`       | `{}`        | Props passed to the component. `close` is always injected too. |
| `backdrop` | `boolean`      | `false`     | Show a blurred backdrop. Clicking it triggers a close request. |
| `mode`     | `ModalMode`    | `'dialog'`  | Controls layout and animation. See [Modes](./modes).           |
| `context`  | `ModalContext` | `undefined` | Vue injection to provide into the modal subtree.               |

### `pop()`

Closes the topmost modal in the stack.

---

## `useModalRequestClose(handler)`

```ts
function useModalRequestClose(handler: () => void): void
```

Registers a handler that runs when the backdrop is clicked or `Esc` is pressed, instead of the default `pop()`. Must be called inside a component that renders inside a modal. The handler is automatically removed on component unmount.

See [Intercepting Close](./request-close).

---

## Types

### `OpenModalResult<T>`

```ts
type OpenModalResult<T> = {
  response: Promise<T>
  close: ModalCloseFn<T>
}
```

### `ModalCloseFn<T>`

```ts
type ModalCloseFn<T> = (responseValue?: T) => void
```

### `ModalMode`

```ts
type ModalMode = 'dialog' | 'mobile-sheet' | 'popup'
```

| Value            | Layout                                      | Animation                                                                                   |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `'dialog'`       | Centered                                    | Slide-up fade-in / slide-down fade-out                                                      |
| `'mobile-sheet'` | Bottom sheet on mobile, centered on desktop | Slide-up from edge / slide-down to edge (mobile); slide-up fade / slide-down fade (desktop) |
| `'popup'`        | Centered                                    | Spring scale-in / scale-fade-out                                                            |

### `ModalContext`

```ts
type ModalContext = {
  key: InjectionKey<unknown> | string
  value: unknown
}
```

### `MODAL_ID_KEY`

```ts
const MODAL_ID_KEY: InjectionKey<string>
```

Provided by `modal-slot.vue` into every modal's subtree. Identifies which modal a component belongs to. Used internally by `useModalRequestClose`. You rarely need this directly.
