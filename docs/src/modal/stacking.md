# Stacking

Multiple modals can be open at the same time. Each `open()` call pushes a new entry onto the stack and renders it on top of everything below it.

## Opening Multiple Modals

```ts
// First modal opens
const session = modal.open<SessionResult>(StudySession, {
  backdrop: true,
  mode: 'mobile-sheet'
})

const result = await session.response

// Second modal opens on top once the first resolves
const action = await modal.open<string>(SessionComplete, {
  backdrop: true,
  mode: 'mobile-sheet',
  props: { result }
}).response
```

Each entry in the stack is independent — its own component, its own response promise, its own mode.

---

## Closing Modals

### `pop()`

Closes the topmost modal in the stack:

```ts
const { pop } = useModal()
pop()
```

### The returned `close` function

`open()` also returns a `close` function scoped to that specific modal. Use it when you need to close a non-topmost entry, or when you want to pass a response value at the call site rather than inside the component:

```ts
const { close } = modal.open(MyModal)

// close it from outside the component, optionally with a value
close('done')
```

---

## Reading `modal_stack`

`modal_stack` is a reactive `Ref<ModalEntry[]>` exposed by `useModal()`. Read it to know whether any modals are currently open — useful for suppressing background keyboard shortcuts or pointer events:

```ts
const { modal_stack } = useModal()

// In a watcher, computed, or template:
if (modal_stack.value.length === 0) {
  // no modals open — safe to handle keyboard events
}
```

Because `modal_stack` is module-level, any call to `useModal()` returns a reference to the same stack.
