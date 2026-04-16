---
lastUpdated: 2026-04-12T12:40:50-07:00
---

# Modal

Open any component as a modal and get a typed response back — no visibility state needed.

## Basic usage

```ts
import { useModal } from '@/composables/modal'
import MyModal from './my-modal.vue'

const modal = useModal()

const confirmed = await modal.open<boolean>(MyModal, {
  backdrop: true,
  props: { message: 'Are you sure?' }
}).response

if (confirmed) deleteItem()
```

Inside your modal component, declare a `close` prop — it's injected automatically:

```vue
<script setup lang="ts">
type MyModalProps = {
  message: string
  close: (result?: boolean) => void
}

const { message, close } = defineProps<MyModalProps>()
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <button @click="close(false)">Cancel</button>
    <button @click="close(true)">Confirm</button>
  </div>
</template>
```

## Learn more

- [Modes & Backdrop](../modal/modes) — `dialog`, `mobile-sheet`, `popup`
- [Response & Close](../modal/response) — typed responses, awaiting, wrapping in composables
- [Stacking](../modal/stacking) — opening multiple modals
- [Intercepting Close](../modal/request-close) — guard against backdrop/Esc dismissal
- [Context Injection](../modal/context) — pass data deep into the modal subtree
- [API Reference](../modal/reference) — full type signatures
