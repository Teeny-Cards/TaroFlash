# Guidelines

- If locally checked out branch is 'master', checkout new branch before starting work.
- Always use translation strings (e.g., `t('deck.settings-modal.title')`) instead of hardcoded text. If string not in `locales/en-us.json`, add it.
- IMPORTANT: When writing code (migrations, functions, etc.) in `supabase/`, explain like teacher to student. Concise, simple, necessary context. Stop, let user ask questions.
- After backend teaching session, ask user to rate understanding of main concepts 1-10. Record in `.claude/rules/learning-log.md`.
- Confirm this file loaded by printing message to console on startup.
- NEVER call `supabase db reset` always use `supabase migrations up` to apply migrations.

## Toolchain: Vite+

Project uses **Vite+** (`vp`), unified toolchain wrapping Vite, Rolldown, Vitest, Oxlint, Oxfmt. Always use `vp` — never `pnpm`, `npm`, `vitest`, `oxlint`, `oxfmt` directly.

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
- Don't install `vitest`, `oxlint`, `oxfmt`, `tsdown` — bundled in Vite+

## Architecture

**TaroFlash** = spaced repetition flashcard app (FSRS algorithm via `ts-fsrs`). Vue 3 SPA, Supabase backend.

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

**Routing**: Public routes (welcome, auth callback, legal) vs authenticated routes protected by `authenticated.vue`. Main authenticated views: dashboard (deck list), deck study view.

**State**: Session + member profile = global Pinia stores. Most other state local or composable-scoped.

**Rich text**: Cards use Lexical-based editor (`src/components/text-editor/`) with markdown support.

**Sound effects**: Custom `v-sfx` directive plays audio via Howler.js.

### Backend (`supabase/`)

| Directory              | Purpose                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `supabase/migrations/` | SQL migrations run via Supabase CLI (`supabase db reset` applies all + `seed.sql`) |
| `supabase/functions/`  | Deno edge functions: `create-subscription` (Stripe), `cleanup-media`               |

Database uses RLS for multi-tenant data isolation. Complex queries via PostgreSQL RPC functions (e.g., `get_member_decks_with_due_count`). Trigger auto-creates `members` row on user signup.

### Testing (`tests/`)

Tests use Vitest with jsdom. `tests/fixtures/` contains MSW handlers, Faker-based fixtures. Coverage enforced in CI (GitHub Actions runs on all PRs).

## Local development

- Local Supabase runs on port 54321 (API), 54322 (PostgreSQL). Start with `supabase start`.