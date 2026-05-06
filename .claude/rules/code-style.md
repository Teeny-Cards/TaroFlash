---
lastUpdated: 2026-05-06T00:00:00Z
---

# Code Style

## Group function bodies into visual phases

A function should read as setup → core work → wrap-up, not a wall of text. Put a single blank line between phases; keep tight clusters tight.

**Insert a blank line:**

- Between declarations and their first use.
- Around early returns / guard clauses.
- Between distinct phases (validate → resolve → mutate → emit).
- Before a new conceptual unit, even a one-liner (emit, side-effect).

**Don't insert one:**

- Inside a tight cluster of related declarations.
- Between consecutive assignments on the same object.
- Inside a 2–3 line `if` / `for` body.
- Between every line.

Rule of thumb: if you can name a chunk in one phrase, it's a group — separate the next phrase. If you can't name it, the chunk is too small or the function is doing too much.

```ts
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

  temp_entries.value.push({ client_id: uid(), card: new_card, anchor_id, side, real_id: null })
}
```

## At most one level of nesting

Don't nest more than one `if` / `for` / `try`. When a path forks, invert the condition and return early instead of pushing the main path inside an `if`.

```ts
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

A function either orchestrates other functions or performs one concrete piece of work — never both.

- **Orchestrator**: routes, sequences, handles errors. Body is mostly calls.
- **Worker**: does the thing (network, DOM, payload). Body has the logic.

Signal you've crossed the line: a function that calls a helper _and_ wraps a `try/finally` _and_ builds an object literal inline. Split it.
