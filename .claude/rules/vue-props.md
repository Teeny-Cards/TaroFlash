---
lastUpdated: 2026-04-17T01:31:17Z
paths:
  - 'src/**/*.vue'
---

# Vue Props Convention

Define props with a named type alias and destructure defaults inline — never use `withDefaults`.

```ts
// Correct
type MyComponentProps = {
  theme?: string
  count?: number
  label: string
}

const { theme = 'green-400', count = 0, label } = defineProps<MyComponentProps>()

// Incorrect — do not use withDefaults
const props = withDefaults(defineProps<MyComponentProps>(), {
  theme: 'green-400',
  count: 0
})
```

- The type must be a standalone named alias (`type XxxProps = { ... }`), not an inline generic.
- Defaults live in the destructure assignment, not in a separate helper call.
- Required props (no `?`) are destructured without a default value.
