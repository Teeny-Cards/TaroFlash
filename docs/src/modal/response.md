---
lastUpdated: 2026-04-12T12:16:07-07:00
---

# Response & Close

Every `open()` call returns `{ response, close }`. `response` is a `Promise<T>` that resolves when the modal closes. This lets you treat a modal like an async function call — open it, wait for a result, act on it.

## Reading the Response

```ts
const { response } = modal.open<boolean>(ConfirmModal, {
  backdrop: true,
  props: { message: 'Are you sure?' }
})

response.then((confirmed) => {
  if (confirmed) deleteItem()
})
```

With `await`:

```ts
const confirmed = await modal.open<boolean>(ConfirmModal, {
  backdrop: true
}).response

if (confirmed) deleteItem()
```

The type parameter `<T>` types both `response` and the `close` function injected into the component. If no response value is needed, omit it — the promise resolves with `undefined`.

---

## The `close` Prop

Every component opened via `useModal()` automatically receives a `close` prop. It is a `ModalCloseFn<T>`:

```ts
type ModalCloseFn<T> = (responseValue?: T) => void
```

Calling it closes the modal and resolves the response Promise with whatever value you pass. Declare it in your modal component's props type:

```vue
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

::: info
`close` is injected by the runtime — you don't need to pass it in the `props` option when calling `open()`. Just declare it in your component's props type.
:::

---

## Wrapping `useModal`

For modals opened from multiple places, wrap the `open()` call in a dedicated composable. This centralises options, typing, and any surrounding logic (sound effects, etc.):

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

Composable wrappers also make it easy to chain modals. For example, the study session opens a `StudySession` modal, awaits its result, then immediately opens a `SessionComplete` modal based on that result — all orchestrated in `use-study-modal.ts` without any of that logic leaking into the view layer.
