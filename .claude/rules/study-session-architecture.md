---
title: Study Session Architecture
paths:
  - 'src/composables/study-session/**'
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

`src/components/modals/study-session/index.vue` — wrapper. Accepts `deck`, `config_override?`, and `close`. Exports `StudySessionResponse { score, total, remaining_due, study_all_used }`. Renders a `mobile-sheet` with the deck title in the `header-content` slot and the mode component (`<session-flashcard>` for now; swap to `<component :is>` when additional modes are added) in the `body` slot. The mobile-sheet's built-in close button emits `@close`, which calls `requestClose()` on the active mode component via template ref — falling back to `close()` if the mode hasn't exposed one. Wires the mode's events to the `close` prop: `'closed'` → `close()`, `'finished'(score, total, remaining_due, study_all_used)` → `close({ score, total, remaining_due, study_all_used })`.

`src/components/modals/study-session/session-flashcard.vue` — flashcard mode body. Fetches cards via `fetchAllCardsByDeckId`, merges `deck.config + config_override` at construction (single `_processCards` pass). Exposes `requestClose()` via `defineExpose` and registers it with `useModalRequestClose` so backdrop/Esc also routes through it. `requestClose` decides whether to emit `'closed'` or `'finished'` based on session state. Emits:

- `'closed'` — user closed before studying any card (cover not dismissed, or 0 reviewed)
- `'finished'(score, total, remaining_due, study_all_used)` — session completed naturally (via `finish-animation @done`) OR user closed early after ≥1 reviewed card. Early-close passes `reviewed_count` as `total`.

`src/components/modals/study-session/session-complete.vue` — score summary. Accepts `score`, `total`, `secondary_action: SecondaryAction`, and `close(action?: SecondaryAction)`. Renders inside a `mobile-sheet` with the dynamic heading ("Perfect!" / "Great job!" / "Nice work!" / "Keep it up!") in the `header-content` slot, the score display in `body`, and two buttons in `footer`: Close (`close()`) and secondary (`close(secondary_action)`).

## Composable layer

The study-session composables live in `src/composables/study-session/` and are split into two layers:

### Core (`study-session-core.ts`) — mode-agnostic

`useStudySessionCore(config?)` owns everything that is the same regardless of how the user interacts with cards:

- Queue management: `_raw_cards`, `_cards_in_deck`, `_retry_cards`
- Session lifecycle: `mode: 'studying' | 'completed'`, `active_card`
- FSRS scheduling: `_FSRS_INSTANCE`, `_setupCard`, per-card `preview` (all four rating outcomes)
- Stats: `num_correct`, `reviewed_count`, `remaining_due_count`, `current_index`
- Persistence: `reviewCard` → `updateReviewByCardId` API
- Config: `setCards`, `updateConfig`

`_processCards()` — called by `setCards` and `updateConfig`. Applies due filter → shuffle → `card_limit`, maps to `StudyCard` (adds FSRS `preview`), resets retry queue, resets `mode` to `'studying'`, picks first card.

`reviewCard(item?)` — updates card state (passed/failed), optionally retries, advances `active_card`, sets `mode = 'completed'` when none remain, fires `updateReviewByCardId`.

### Flashcard mode (`flashcard-session.ts`)

`useFlashcardSession(config?)` builds on top of the core by adding the concept of card sides:

- `current_card_side: 'front' | 'back' | 'cover'` — drives what face the active card shows
- `is_starting_side` — true when on the configured starting face
- `next_card` — the next unreviewed card (used by the preview animation)
- `is_cover` — true when still on the cover screen
- `startSession()` — sets `current_card_side` to `starting_side` (cover → front/back)
- `flipCurrentCard()` — toggles front ↔ back
- `reviewCard(item?)` — wraps core's `reviewCard`, then resets `current_card_side` to `starting_side` for the incoming card

**Adding a new mode:** create `<mode>-session.ts` that calls `useStudySessionCore` and adds its own interaction state (e.g. `matched_ids` for matching-pairs). Create `session-<mode>.vue` as the body component with `defineExpose({ requestClose })` and `useModalRequestClose(requestClose)`. Wire it into `index.vue`'s body slot (swap the hard-coded `<session-flashcard>` for a `<component :is>` driven by `deck.study_config?.study_mode`).

## DeckConfig

```ts
type DeckStudyMode = 'flashcard' // extend as new modes are added

type DeckConfig = {
  study_mode?: DeckStudyMode // which interaction model to use
  study_all_cards: boolean // bypass due filter
  retry_failed_cards: boolean // re-queue Again-rated due cards
  shuffle?: boolean
  card_limit?: number | null // slice after filter; null = no limit
  flip_cards?: boolean // swap front/back starting side (flashcard mode)
}
```

`config_override` is merged into the initial config object passed to `useFlashcardSession` at construction — no second `_processCards` pass.

## Card flow in session-flashcard.vue

Cover card shown on mount → user clicks Start → `startSession()` → `current_card_side` flips to `starting_side` → user reveals back → `onRated(grade)` triggers the fling animation on the `study-card` ref → `onCardReviewed(item)` pre-flips the preview card (awaits `flip-complete`), then calls `reviewCard(item)` → composable advances `active_card` or sets `mode = 'completed'` → `finish-animation` plays → `@done` fires `emit('finished', ...)`.

The preview-card animation uses a `resolveFlip` one-shot promise resolver. `onUnmounted` resolves it as a safety fallback so the promise never leaks if the component tears down mid-animation.

## FSRS

`ts-fsrs` used for scheduling. Parameters: `enable_fuzz: true`, no learning/relearning steps. Each card gets a `preview: RecordLog` (all four rating outcomes pre-computed via `FSRS.repeat`). `reviewCard` writes the chosen `RecordLogItem` back to the card and persists via `updateReviewByCardId`. Due date check: `review.due <= now` (ISO string from Supabase or `Date` from `createEmptyCard`).
