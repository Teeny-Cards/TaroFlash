---
lastUpdated: 2026-04-25T00:00:00Z
paths:
  - 'src/**/*.{ts,vue}'
  - 'tests/**/*.{ts,js}'
  - 'supabase/**/*.{ts,sql}'
---

# Code Style

## Blank lines between logical blocks inside functions

Group statements that work together, then separate distinct phases with a single blank line. A function body that runs setup → core work → cleanup should read as three visual chunks, not one wall of text.

```ts
// Bad — every step blends into the next
function addCard(left_card_id?: number, right_card_id?: number) {
  let anchor_id: number | null = null
  let side: 'before' | 'after' | null = null
  if (left_card_id !== undefined) {
    anchor_id = left_card_id
    side = 'after'
  } else if (right_card_id !== undefined) {
    anchor_id = right_card_id
    side = 'before'
  }
  const new_card: Card = {
    id: tempPlaceholderId(),
    rank: 0,
    deck_id: deck_id.value,
    front_text: '',
    back_text: ''
  }
  temp_entries.value.push({
    client_id: uid(),
    card: new_card,
    anchor_id,
    side,
    real_id: null
  })
}

// Good — three phases, visually separated
function addCard(left_card_id?: number, right_card_id?: number) {
  let anchor_id: number | null = null
  let side: 'before' | 'after' | null = null

  if (left_card_id !== undefined) {
    anchor_id = left_card_id
    side = 'after'
  } else if (right_card_id !== undefined) {
    anchor_id = right_card_id
    side = 'before'
  }

  const new_card: Card = {
    id: tempPlaceholderId(),
    rank: 0,
    deck_id: deck_id.value,
    front_text: '',
    back_text: ''
  }

  temp_entries.value.push({
    client_id: uid(),
    card: new_card,
    anchor_id,
    side,
    real_id: null
  })
}
```

## Where blank lines belong

- Between **declaration block** and **first use** of those declarations.
- Around an **early return / guard clause** when the rest of the function is doing different work.
- Between **distinct phases**: validation → resolution → mutation → emit.
- Before a **new conceptual unit** even if it's only one line (e.g. an emit or a side-effect that wraps up the function).

## Where they don't

- Inside a tight cluster of variable declarations that name parts of the same thing.
- Between consecutive assignments on a single object being built up.
- Inside an `if` / `for` body that only has 2–3 lines.
- Between every line — that's noise, not grouping.

## Rule of thumb

If you can summarise a chunk of lines with a single phrase ("resolve the anchor", "build the temp card", "stage it"), it's a group. Put a blank line before the next phrase. If you can't summarise it, the chunk is too small or the function is doing too much — fix that, not the whitespace.

## Keep nesting at most one level deep

Function bodies should not nest more than one level of `if` / `for` / `try`. When the path forks, **invert the condition and return early** instead of pushing the main path inside an `if`. Every extra indent makes the happy path harder to see.

```ts
// Bad — happy path is buried two levels deep
async function save(id: number, values: Partial<Card>) {
  const entry = list.findEntryByCardId(id)
  if (entry && entry.real_id === null) {
    saving.value = true
    try {
      const inserted = await insertCard({ ... })
      list.promoteTemp(id, inserted.id, inserted.rank, values)
    } finally {
      saving.value = false
    }
    return
  }
  const card = entry?.card ?? list.findCard(id)
  if (!card) return
  saving.value = true
  try {
    await saveCard(card, values)
  } finally {
    saving.value = false
  }
}

// Good — orchestrator routes; each branch is its own one-job function
async function save(id: number, values: Partial<Card>) {
  const entry = list.findEntryByCardId(id)

  if (entry && entry.real_id === null) return insertTemp(id, entry, values)

  const card = entry?.card ?? list.findCard(id)
  if (!card) return

  return saveExisting(card, values)
}
```

## One responsibility per function

Each function either **orchestrates other functions** or **performs one concrete piece of work** — not both. Mixing the two is what produces the deep-nested wall above.

- Orchestrator: routes, sequences, handles errors. Body is mostly other function calls.
- Worker: does the thing (network call, DOM mutation, payload build). Body has the actual logic.

Signal you've crossed the line: a function that calls a helper _and_ contains a `try/finally` _and_ builds an object literal inline. Pull each chunk into its own function and let the parent orchestrate.
