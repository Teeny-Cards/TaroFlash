# Grid Paging Follow-up

## Context

The deck card-grid (md+) is a paged carousel. Page state lives in
`useCardListController`:

- `page`, `page_size = capacity`, `total_pages = ceil(card_count / page_size)`
- `prevPage` / `nextPage` wrap modulo `total_pages`
- A watch on `[page, page_size, all_cards.length]` calls `cards_query.loadNextPage()`
  whenever `(page + 1) * page_size > all_cards.length` and more pages exist
- `is_page_loading` is true when the page's start index lies beyond loaded cards

The watch is sequential — each `loadNextPage()` fetches one server page, the
length grows, the watch re-fires, fetches the next, and so on until the target
window is loaded.

## What works

Fresh load → click `prev` → wraps to last page (total_pages - 1) → skeleton
shows while the loader walks pages 0 → 1 → 2 → ... → last. Eventually the
target page renders.

## What's left to fix

1. **Sequential walk is slow on long decks.** A 20-page deck means 19 sequential
   fetches before the last page becomes visible. Each fetch is a round-trip.
   For decks with thousands of cards this is unacceptable.

2. **Page boundary != server-page boundary.** `loadNextPage` is the infinite-
   query's "next page" notion — it advances the offset by however many rows the
   query was configured to return, which may not align with the carousel's
   `page_size = capacity`. So the loader might overshoot or undershoot relative
   to the carousel page.

3. **Wrap-to-last on cold start is the worst case.** Most pageful interactions
   are local (next, prev one step), but the wrap behaviour on `prev` from page 0
   walks the whole deck.

## Options for "jump to page N" without sequential walks

**A. Add an offset-based fetch to the query layer.** Expose
`cards_query.fetchPagesUpTo(end_index)` that issues either parallel page fetches
or one bigger query. Caller awaits once. Skeleton shows for the duration.

**B. Server RPC that fetches a card window directly.** Replace pagination at the
boundary with `get_cards_in_deck(deck_id, offset, limit)`. The carousel hits
that RPC with `(page * page_size, page_size)`. No more concept of "infinite
query pages" for the grid use case. The card-list edit-mode (uses
`observeSentinel`) keeps its current infinite query.

**C. Precompute card-id windows.** Server returns the card-id list for a deck
upfront (cheap — just numeric ids), then the grid fetches the specific cards
for the current page. Great for jump-to-page; adds an extra round-trip per
deck open.

## Recommendation when picking this back up

Option B is the cleanest split. The carousel and the edit-mode list have
different access patterns — server-paged windows for the grid, infinite scroll
for the list — and a windowed RPC matches that. Cache key by `(deck_id, offset,
limit)`; invalidate the windows when card mutations land.

Don't bother optimising the sequential walk inside the existing query — it
papers over a deeper mismatch.
