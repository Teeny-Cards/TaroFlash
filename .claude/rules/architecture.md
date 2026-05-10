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

**Defaults are helpers.** Per-domain default values (form defaults, runtime fallback values, UI bounds for forms) live in `src/utils/<domain>/defaults.ts`, not scattered across the components and composables that consume them. Both the editor (when staging a fresh record) and the runtime layer (when filling missing fields on a loaded record) read from the same module so behaviour stays consistent end-to-end.

```ts
// src/utils/deck/defaults.ts
export const DECK_CONFIG_DEFAULTS: Required<DeckConfig> = { ... }
export const DAILY_LIMIT_BOUNDS = { step: 5, min: 5, ... } as const
export function withDeckConfigDefaults(partial?: Partial<DeckConfig>): Required<DeckConfig> { ... }
```

## Provide/inject editor-shaped composables across deep modal trees

When a composable owns a session of reactive state (e.g. `useDeckEditor`) and several nested children all need to read and write the same fields, the modal root should call the composable once and `provide()` the result. Children `inject()` and read/write directly, no prop drilling, no `field()` factory wrapping each key in a writable computed.

Passing a reactive object as a prop and letting the child mutate `props.config[key] = v` works because of shared references, but it bypasses Vue's emit/v-model contract: DevTools loses traceability, mutations can come from anywhere, and the prop's type signals "read-only" while the implementation says otherwise. Use provide/inject so the editor-shaped composable stays the single, obvious source of truth.

```ts
// composables/deck-editor.ts
export const deckEditorKey = Symbol('deckEditor') as InjectionKey<DeckEditor>

// modals/deck-settings/index.vue
const editor = useDeckEditor(deck)
provide(deckEditorKey, editor)

// modals/deck-settings/tab-study/index.vue
const { config } = inject(deckEditorKey)!
```

Reserve plain prop drilling for leaf components that take a derived slice (e.g. a single side's `CardAttributes`) and don't need the rest of the editor.

## ui-kit primitives that span multiple files live in a directory

A ui-kit component that needs more than one file (private subcomponents, a colocated composable, a sizes/config table) lives in `src/components/ui-kit/<name>/` with `index.vue` as the public entry. Sibling files use kebab-case (`button.vue`, `use-numeric-input.ts`) and are imported relatively from `index.vue`. Callers import the directory: `import UiSpinbox from '@/components/ui-kit/spinbox/index.vue'`.

```
src/components/ui-kit/spinbox/
├── index.vue            # public component (imports siblings relatively)
├── button.vue           # private subcomponent
└── use-numeric-input.ts # colocated composable used only by this primitive
```

Single-file primitives stay flat (`src/components/ui-kit/icon.vue`).

## ui-kit primitives stay domain-neutral

Prop names, slot names, and emit names on `src/components/ui-kit/*` primitives describe shape, not consumer semantics. A spinbox's secondary toggle is `pill_label` / `pill_active`, not `all_label` / `all_active`. A toggle's selected state is `data-active`, not `data-published`. Domain meaning ("all means unbounded for daily limits", "published means visible to other members") lives at the call site that wires the primitive into a feature.

```ts
// Bad — primitive bakes the daily-limit domain into its prop names
type SpinboxProps = { all_label?: string; all_active?: boolean }

// Good — primitive describes the shape (a trailing pill); caller maps domain meaning
type SpinboxProps = { pill_label?: string; pill_active?: boolean }
```

When you catch a domain-y name slipping into a ui-kit prop, rename before more callers depend on it. The primitive exists to be reused across features that don't share vocabulary.

## Layout-only primitives live in `layout-kit/`, not `ui-kit/`

`src/components/layout-kit/` is for components that arrange other content without injecting visual identity — `section-list.vue`, `labeled-section.vue`, `mobile-sheet.vue`, `tab-sheet.vue`. Anything with its own visual treatment (button, spinbox, toggle, icon) belongs in `ui-kit/`. The split keeps layout primitives composable across surfaces without dragging styling assumptions with them.

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
