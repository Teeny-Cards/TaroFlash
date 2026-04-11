# Guidelines

- If the locally checked out branch is 'master', checkout a new branch before starting any work.
- Always use translation strings (e.g., `t('deck.settings-modal.title')`) instead of hardcoded text. If the string is not already in `locales/en-us.json`, add it.
- IMPORTANT: When writing code (migrations, functions, etc.) in `supabase/`, always explain what your doing like a teacher teaching a student. Stop and let me ask questions along the way.
- Confirm this file has been loaded by printing a message to the console on startup.
- NEVER call `supabase db reset` always use `supabase migrations up` to apply migrations.

## Toolchain: Vite+

This project uses **Vite+** (`vp`), a unified toolchain wrapping Vite, Rolldown, Vitest, Oxlint, and Oxfmt. Always use `vp` — never invoke `pnpm`, `npm`, `vitest`, `oxlint`, or `oxfmt` directly.

### Common commands

```sh
vp install          # Install dependencies (after pulling changes)
vp dev              # Start dev server
vp build            # Production build
vp check            # Run format + lint + type-check together
vp lint             # Lint only
vp fmt              # Format only
vp test             # Run tests with coverage
vp test --watch     # Watch mode
vp add <pkg>        # Add a dependency
vp dlx <bin>        # Run a one-off binary (instead of npx/pnpm dlx)
```

### Critical import rules

- Import build/config utilities from `vite-plus`, not `vite`: `import { defineConfig } from 'vite-plus'`
- Import test utilities from `vite-plus/test`, not `vitest`: `import { expect, test, vi } from 'vite-plus/test'`
- Do not install `vitest`, `oxlint`, `oxfmt`, or `tsdown` — they are bundled in Vite+

## Architecture

**TaroFlash** is a spaced repetition flashcard app (FSRS algorithm via `ts-fsrs`). It's a Vue 3 SPA with a Supabase backend.

### Frontend (`src/`)

| Directory          | Purpose                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/api/`         | Supabase client calls — RPC functions and table operations, organized by entity (cards, decks, members, reviews, media, shop) |
| `src/components/`  | Vue components; `ui-kit/` contains base primitives                                                                            |
| `src/composables/` | Reusable composition functions (modal, toast, alert, study-session, shortcuts, theme, media-query)                            |
| `src/stores/`      | Pinia stores: `session.ts` (auth state), `member.ts` (current user profile), `shortcut-store.ts`                              |
| `src/views/`       | Routed page components; `authenticated.vue` is the layout wrapper for protected routes                                        |
| `src/styles/`      | Global CSS and TailwindCSS 4 config; `palettes.css` defines color tokens                                                      |
| `types/`           | Shared TypeScript type definitions (not inside `src/`)                                                                        |

**Routing**: Public routes (welcome, auth callback, legal) vs. authenticated routes protected by `authenticated.vue`. Main authenticated views: dashboard (deck list) and deck study view.

**State**: Session + member profile are global Pinia stores. Most other state is local or composable-scoped.

**Rich text**: Cards use a Lexical-based editor (`src/components/text-editor/`) with markdown support.

**Sound effects**: A custom `v-sfx` directive plays audio via Howler.js.

### Backend (`supabase/`)

| Directory              | Purpose                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `supabase/migrations/` | SQL migrations run via Supabase CLI (`supabase db reset` applies all + `seed.sql`) |
| `supabase/functions/`  | Deno edge functions: `create-subscription` (Stripe), `cleanup-media`               |

The database uses RLS for multi-tenant data isolation. Complex queries go through PostgreSQL RPC functions (e.g., `get_member_decks_with_due_count`). A trigger auto-creates a `members` row on user signup.

### Testing (`tests/`)

Tests use Vitest with jsdom. `tests/fixtures/` contains MSW handlers and Faker-based fixtures. Coverage is enforced in CI (GitHub Actions runs on all PRs).

## Local development

- Local Supabase runs on port 54321 (API) and 54322 (PostgreSQL). Start it with `supabase start`.
