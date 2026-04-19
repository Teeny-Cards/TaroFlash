# LexoRank Follow-up

## Context

Cards in a deck use a `numeric` `rank` column for ordering. Insertion between two
cards computes `new_rank = (left.rank + right.rank) / 2.0` via `card_rank_between`.
This is **fractional ranking** — no LexoRank yet.

## The problem

Repeated insertion at the same position halves the gap each time. Postgres `numeric`
has effectively unbounded precision, so it won't run out of digits, but storage and
compute cost grow with each insert. After ~50 sequential inserts at the same gap,
ranks become long-decimal strings that are slow to compare and bloat row size.

The current mitigation is `reindex_deck_ranks(p_deck_id)` (called from `insert_card`
when `card_rank_between` raises `P0001`), which renumbers every card in the deck
with `step = 1000`. That works but locks the whole deck briefly and rewrites every
row in the table. For a 10k-card deck that's ~10k UPDATEs in one transaction.

## When LexoRank starts mattering more

- Server-side pagination + reorder (planned). Reorder will hit the same gap-halving
  pattern as insert, more often. Rebalances will become more frequent.
- Large decks (1k+ cards). Reindex cost scales linearly with deck size; gets noticeable
  over a few thousand rows.
- Power users who do many drag-reorders in a session.

## What LexoRank gives us

A string-based rank scheme (e.g. `"0|hzzzzz:"`) where:
- Inserting between two ranks produces a new rank with at most one extra character.
- Length growth is bounded and amortizable — no need for periodic full rebalances.
- Comparison is plain lexicographic — works as a `text` column with a btree index.

Reference: <https://www.npmjs.com/package/lexorank> (Atlassian's public algorithm).

## Migration shape (when we get to it)

1. Add `rank_lex text` column alongside `rank numeric`. Backfill from current rank
   order via `row_number()` mapped to LexoRank values.
2. Switch `card_rank_between` (or its successor) to operate on `rank_lex`. Drop the
   reindex fallback.
3. Update `cards_with_images` to expose `rank_lex` (snapshot view; recreate).
4. Update FE `Card` type and any sort comparators.
5. Once stable, drop `rank` and rename `rank_lex` → `rank`.

## Trigger to revisit

Check rank-precision metrics after server-pagination + reorder ship. If reindex calls
are firing frequently (e.g. > 1/day per deck on real usage), schedule the LexoRank
migration. Until then, the existing reindex-on-collision path is fine.
