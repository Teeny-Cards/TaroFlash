# Modal System

The modal system is a composable-first, stack-based overlay layer. Any component in the app can open a modal, receive a typed response when it closes, and stack multiple modals on top of each other — all without managing visibility state manually.

## Architecture

```
useModal().open(MyModal, options)
        │
        ▼
Pushes entry onto modal_stack
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

The modal stack is **module-level** — shared across every call to `useModal()` anywhere in the app. Any component can push to or read from the same stack.

## Key Concepts

| Page                                  | What it covers                                               |
| ------------------------------------- | ------------------------------------------------------------ |
| [Modes & Backdrop](./modes)           | The three layout modes and the backdrop option               |
| [Response & Close](./response)        | Typed responses, the `close` prop, wrapping `useModal`       |
| [Stacking](./stacking)                | Multiple modals open at once, `pop()`, reading `modal_stack` |
| [Intercepting Close](./request-close) | Guarding close with `useModalRequestClose`                   |
| [Context Injection](./context)        | Passing data into the modal's Vue subtree                    |
| [API Reference](./reference)          | All types, options, and exported values                      |

## Quickstart

Open a confirmation modal and react to its response:

**1. Write the modal component**

```vue
<!-- src/components/modals/confirm-modal.vue -->
<script setup lang="ts">
type ConfirmModalProps = {
  message: string
  close: (result?: boolean) => void
}

const { message, close } = defineProps<ConfirmModalProps>()
</script>

<template>
  <div class="bg-white rounded-xl p-6 flex flex-col gap-4">
    <p>{{ message }}</p>
    <div class="flex gap-2 justify-end">
      <ui-button variant="muted" @click="close(false)">Cancel</ui-button>
      <ui-button @click="close(true)">Confirm</ui-button>
    </div>
  </div>
</template>
```

**2. Open it from anywhere**

```ts
import { useModal } from '@/composables/modal'
import ConfirmModal from '@/components/modals/confirm-modal.vue'

const modal = useModal()

const confirmed = await modal.open<boolean>(ConfirmModal, {
  backdrop: true,
  props: { message: 'Delete this deck?' }
}).response

if (confirmed) await deleteDeck(id)
```

That's all — no visibility flags, no event buses, no store mutations. The modal renders, the user interacts, and your code gets a typed result back as a resolved Promise.
