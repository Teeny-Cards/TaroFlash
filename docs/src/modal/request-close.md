---
lastUpdated: 2026-04-12T12:16:07-07:00
---

# Intercepting Close

By default, clicking the backdrop or pressing `Esc` calls `pop()` and immediately removes the topmost modal. Use `useModalRequestClose` inside a modal component to intercept that request and decide what to do instead.

## Usage

```ts
import { useModalRequestClose } from '@/composables/modal'

useModalRequestClose(() => {
  // This runs instead of the default pop() when backdrop or Esc is triggered.
  // You decide whether and how to actually close.
  props.close()
})
```

The handler is automatically removed when the component unmounts — no cleanup needed.

---

## Guarding a Dirty Form

The primary use case is preventing accidental dismissal when unsaved changes exist:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useModalRequestClose } from '@/composables/modal'
import { useAlert } from '@/composables/alert'

type Props = {
  close: (saved?: boolean) => void
}

const { close } = defineProps<Props>()

const alert = useAlert()
const is_dirty = ref(false)

useModalRequestClose(async () => {
  if (!is_dirty.value) {
    close()
    return
  }

  const { response } = alert.warn({
    title: 'Discard changes?',
    message: 'Your unsaved changes will be lost.',
    confirmLabel: 'Discard'
  })

  if (await response) close()
})
</script>
```

---

## How It Works

`useModalRequestClose` injects `MODAL_ID_KEY` to identify which modal the component belongs to, then registers the handler in a module-level map keyed by modal ID.

When the backdrop is clicked or `Esc` is pressed, `modal.vue` checks if a handler is registered for the topmost modal:

- **Handler found** — calls the handler. Closing is the handler's responsibility.
- **No handler** — calls `pop()` directly.

::: warning
`useModalRequestClose` only intercepts backdrop clicks and `Esc`. Calling `close()` or `pop()` directly always closes immediately, bypassing the handler.
:::
