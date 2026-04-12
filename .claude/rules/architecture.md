# Architecture Conventions

## Component composition over code merging

When consolidating or moving functionality between components, import and use the child component rather than inlining its template or script code.

```vue
<!-- Bad: copying markup and logic from <rating-buttons> into parent -->

<!-- Good: import and compose -->
<script setup lang="ts">
import RatingButtons from '@/components/rating-buttons.vue'
</script>
<template>
  <rating-buttons @rate="onRate" />
</template>
```

Adjust props/emits to wire components together. Don't copy template markup or script logic across files.

## Supabase calls belong in `src/api/`

All Supabase client calls must live in the appropriate `src/api/` module. Never call `supabase` directly from composables, views, or components.

```ts
// Bad — supabase call inline in a composable
const { data } = await supabase.from('decks').select('*')

// Good — delegate to the API layer
import { getDecks } from '@/api/decks'
const data = await getDecks()
```

If no suitable module exists for the operation, create one (e.g. `src/api/media.ts` for media operations). Composables and components should only call functions exported from `src/api/`.
