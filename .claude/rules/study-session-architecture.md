---
title: Study Session Architecture
paths:
  - 'src/composables/study-session.ts'
  - 'src/composables/modals/use-study-modal.ts'
  - 'src/components/modals/study-session/**'
---

# Study Session Architecture

## Entry point & modal orchestration

`src/composables/modals/use-study-modal.ts` — `useStudyModal().start(deck, config_override?)` is the only public entry point. It:

1. Opens `StudySession` modal (mobile-sheet). Awaits `StudySessionResponse`.
2. If a response was returned, computes the `SecondaryAction` and opens `SessionComplete` modal. Awaits `SecondaryAction | undefined`.
3. On secondary action response, recursively calls `start()` with the correct `config_override` (`{ study_all_cards: true }` for study-all/study-again, nothing for study-more).

`SecondaryAction` logic:

- `study_all_used === true` → `'study-again'`
- `remaining_due > 0` → `'study-more'`
- else → `'study-all'`

## Modal components

`src/components/modals/study-session/index.vue` — thin wrapper. Accepts `deck`, `config_override?`, and `close`. Exports `StudySessionResponse { score, total, remaining_due, study_all_used }`. Passes `config_override` to `session.vue`.

`src/components/modals/study-session/session.vue` — the active study UI. Fetches cards via `fetchAllCardsByDeckId`, calls `setCards`, then applies `config_override` via `updateConfig`. Emits:

- `'closed'` — user closed before studying any card (cover not dismissed, or 0 reviewed)
- `'finished'(score, total, remaining_due, study_all_used)` — session completed naturally (via `finish-animation` `@done`) OR user closed early after ≥1 reviewed card. Early-close passes `reviewed_count` as `total` and `remaining_due_count` as `remaining_due`.

`src/components/modals/study-session/session-complete.vue` — score summary. Accepts `score`, `total`, `secondary_action: SecondaryAction`, and `close(action?: SecondaryAction)`. Always shows two buttons: outline Close (calls `close()`) and solid secondary (calls `close(secondary_action)`).

## Core composable

`src/composables/study-session.ts` — `useStudySession(config?)`. Config is internalized as a `reactive<Required<DeckConfig>>`.

Key state:

- `_raw_cards` — all cards as fetched (never mutated after `setCards`)
- `_cards_in_deck` — filtered/shuffled/limited slice used in this session
- `_retry_cards` — cards re-queued after `Rating.Again` (only when `retry_failed_cards`)
- `cards` — computed union of `_cards_in_deck + _retry_cards`
- `mode: 'studying' | 'completed'`
- `active_card` — current unreviewed card; set to `undefined` → triggers `mode = 'completed'`

Key computed:

- `num_correct` — cards with `state === 'passed'`
- `reviewed_cards` / `reviewed_count` — cards with `state !== 'unreviewed'`
- `remaining_due_count` — `max(0, total_due_in_raw - reviewed_count)`, always 0 when `study_all_cards`. Uses `_isCardDue` against `_raw_cards`. Recalculates as cards are reviewed.
- `current_index` — index of `active_card` in `cards`, or `cards.length` when done

`_processCards()` — called by `setCards` and `updateConfig`. Applies due filter → shuffle → card_limit, then maps to `StudyCard` (adds FSRS `preview`). Resets deck and picks first card.

`startSession()` — if `_cards_in_deck` is empty, force-sets `study_all_cards: true` and reprocesses. Sets `current_card_side` to `starting_side` (cover → front/back).

`reviewCard(item?)` — updates card state (passed/failed), optionally retries, picks next card, calls `updateReviewByCardId` API.

## DeckConfig

```ts
type DeckConfig = {
  study_all_cards?: boolean // bypass due filter
  retry_failed_cards?: boolean // re-queue Again-rated due cards
  shuffle?: boolean
  card_limit?: number | null // slice after filter; null = no limit; default hardcoded to 1 in session.vue
  flip_cards?: boolean // swap front/back starting side
}
```

`config_override` passed from `use-study-modal` is merged at `session.vue` init time via `updateConfig`, overriding `deck.config` values.

## Card flow in session.vue

Cover card shown on mount → user clicks Start → `startSession()` → `current_card_side` flips to `starting_side` → user reveals back → `onRated(grade)` triggers card flip animation on `study-card` ref → `onCardReviewed(item)` waits for next-card pre-flip animation, then calls `reviewCard(item)` → composable picks next card or sets `mode = 'completed'` → `finish-animation` plays → `@done` fires `emit('finished', ...)`.

## FSRS

`ts-fsrs` used for scheduling. Parameters: `enable_fuzz: true`, no learning/relearning steps. Each card gets a `preview` (all four rating outcomes pre-computed via `FSRS.repeat`). `reviewCard` writes the chosen `RecordLogItem` back to the card and persists via `updateReviewByCardId`. Due date check: `review.due <= now` (ISO string from Supabase or `Date` from `createEmptyCard`).
