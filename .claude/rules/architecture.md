---
lastUpdated: 2026-04-17T01:31:17Z
paths:
  - 'src/**/*.{ts,vue}'
---

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

All Supabase client calls must live in the appropriate `src/api/` module. Never call `supabase` directly from composables, views, or components. Components consume the domain barrel via hooks (`useXxxQuery` / `useXxxMutation`); the raw Supabase calls live in `src/api/<domain>/db/` and are internal.

```ts
// Bad — supabase call inline in a composable
const { data } = await supabase.from('decks').select('*')

// Good — call the query hook exported by the domain
import { useMemberDecksQuery } from '@/api/decks'
const { data: decks } = useMemberDecksQuery()
```

If no suitable domain exists, create one as `src/api/<domain>/` with `db/`, `queries/`, `mutations/`, and `index.ts`. See [`server-state`](./server-state.md) for the full topology.

## Pure helpers live in directory-scoped utils, not `src/api/`

`src/api/` is for functions that hit the network. Pure helpers — payload builders, diff checks, formatters, validators — belong in `src/utils/<domain>/`, alongside the domain they describe. This keeps the api layer a thin persistence surface and keeps helpers co-located with their domain instead of sprinkled across flat `src/utils/*.ts` files.

```ts
// Bad — pure helpers in the api layer
// src/api/cards/db/update.ts
export function buildCardPayload(card) { ... }
export function hasCardChanges(card, values) { ... }
export async function saveCard(card, values) { ... }

// Good — pure helpers extracted to a domain-scoped util
// src/utils/card/payload.ts
export function buildCardPayload(card) { ... }
export function hasCardChanges(card, values) { ... }

// src/api/cards/db/update.ts — the api function keeps orchestration + the network call
import { buildCardPayload, hasCardChanges } from '@/utils/card/payload'
export async function saveCard(card, values) { ... }
```

Rules of thumb:

- **No I/O + no reactive state** → `src/utils/<domain>/` (e.g. `src/utils/card/`, `src/utils/animations/`, `src/utils/text-composer/`).
- **Network I/O (Supabase, fetch, storage)** → `src/api/<domain>/`, even if the function also does local orchestration around the call.
- **Reactive state (refs, lifecycle, provide/inject)** → `src/composables/`.

Prefer a directory under `src/utils/` over a flat `src/utils/foo.ts` when more than one file is likely, so helpers stay co-located with their domain.

## `src/api/` functions must not mutate their arguments

API-layer functions are thin network adapters. They must not mutate their input parameters — callers can't tell from the signature which fields are now stale, and optimistic-UI rollback becomes impossible because the "before" state is already gone by the time the network fails. Optimistic apply belongs in the composable that calls the mutation, not in the network adapter.

```ts
// Bad — mutates `card` before the network call
export async function saveCard(card: Card, values: Partial<Card>) {
  Object.assign(card, values)
  await upsertCard(buildCardPayload(card))
}

// Good — builds an immutable payload, leaves `card` untouched
export async function saveCard(card: Card, values: Partial<Card>) {
  await upsertCard(buildCardPayload({ ...card, ...values }))
}
```
