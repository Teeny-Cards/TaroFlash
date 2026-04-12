# TaroFlash

A spaced repetition flashcard app built with Vue 3 and Supabase. Uses the FSRS algorithm (`ts-fsrs`) to schedule reviews, Stripe for subscriptions, and Netlify for hosting.

---

## Stack

- **Frontend** — Vue 3, Pinia, TailwindCSS 4, Vite+
- **Backend** — Supabase (Postgres + RLS + Edge Functions)
- **Payments** — Stripe
- **Hosting** — Netlify

---

## Development

```sh
vp install       # install dependencies
vp dev           # start dev server
vp build         # production build
vp test          # run tests with coverage
vp check         # format + lint + type-check
```

Local Supabase runs on port 54321 (API) and 54322 (Postgres). Start it with `supabase start`.

---

## Project structure

<details>
<summary><strong>src/</strong> — Frontend application</summary>

| Path                          | Purpose                                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/api/`                    | Supabase client calls — RPC functions and table operations, organized by entity                                             |
| `src/components/`             | Vue components                                                                                                              |
| `src/components/ui-kit/`      | Base UI primitives — [docs](docs/src/components/button.md)                                                                  |
| `src/components/modals/`      | Modal content components — [docs](docs/src/modal/index.md)                                                                  |
| `src/components/text-editor/` | Lexical-based rich text editor with markdown support                                                                        |
| `src/composables/`            | Reusable composition functions (modal, toast, shortcuts, theme, etc.)                                                       |
| `src/phone/`                  | TaroPhone system — apps, components, and core logic — [docs](docs/src/phone/index.md)                                       |
| `src/stores/`                 | Pinia stores: `session.ts` (auth), `member.ts` (profile), `shortcut-store.ts`                                               |
| `src/views/`                  | Routed page components; `authenticated.vue` is the layout wrapper                                                           |
| `src/styles/`                 | Global CSS and TailwindCSS 4 config; `palettes.css` defines color tokens — [design system](docs/src/design-system/index.md) |
| `src/utils/`                  | Utilities — animations, text composition helpers                                                                            |
| `src/locales/`                | i18n translation strings                                                                                                    |

</details>

<details>
<summary><strong>supabase/</strong> — Backend</summary>

| Path                                      | Purpose                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `supabase/migrations/`                    | SQL migrations applied via `supabase migrations up` — [setup guide](docs/src/supabase/index.md)  |
| `supabase/functions/create-subscription/` | Stripe subscription edge function — [edge function secrets](docs/src/supabase/edge-functions.md) |
| `supabase/functions/cleanup-media/`       | Orphaned media cleanup edge function — [vault secrets](docs/src/supabase/vault.md)               |

</details>

<details>
<summary><strong>docs/</strong> — VitePress documentation site</summary>

| Path                      | Purpose                           |
| ------------------------- | --------------------------------- |
| `docs/src/components/`    | Frontend component docs           |
| `docs/src/modal/`         | Modal system docs                 |
| `docs/src/phone/`         | TaroPhone system docs             |
| `docs/src/supabase/`      | Backend setup docs                |
| `docs/src/devops/`        | Deployment and environment config |
| `docs/src/design-system/` | Design system reference           |

</details>

<details>
<summary><strong>tests/</strong> — Test suite</summary>

| Path                 | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `tests/unit/`        | Unit tests — pure functions, composables, store logic  |
| `tests/integration/` | Component integration tests via `shallowMount`/`mount` |
| `tests/fixtures/`    | MSW handlers and Faker-based test fixtures             |

</details>

---

## Further reading

- **[Frontend docs](docs/src/components/button.md)** — UI kit, modal system, phone system
- **[Backend docs](docs/src/supabase/index.md)** — Supabase setup, vault secrets, edge functions
- **[DevOps](docs/src/devops/index.md)** — deployments, GitHub environment config
