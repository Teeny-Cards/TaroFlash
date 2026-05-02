---
lastUpdated: 2026-05-02T00:00:00-07:00
---

# Edge Functions

Edge functions run on Deno (Supabase Edge Runtime). Secrets are read from environment variables at runtime.

---

## Secrets

### Local

Set secrets in `supabase/functions/.env` (gitignored — copy from a teammate or 1Password).

### Staging / Production

Push secrets via the CLI:

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_... \
  SERVICE_ROLE_KEY=eyJ... \
  --project-ref <project-ref>
```

View currently set secrets (names only, values are never shown):

```bash
supabase secrets list --project-ref <project-ref>
```

---

## Testing

Tests run under Deno (not Vitest). Each function exports a pure `handler({ supabase, ... })` so tests can inject a fake supabase client. The `serve()` wrapper at the bottom of `index.ts` is gated on `import.meta.main` and only runs in production.

### Setup

Install Deno:

```bash
brew install deno
```

Install function dependencies (resolves the import map in `supabase/functions/deno.json`):

```bash
cd supabase/functions
deno install
```

This generates `deno.lock`. Commit it.

### Running tests

From `supabase/functions/`:

```bash
deno test --allow-net --allow-env --allow-read
```

Watch mode:

```bash
deno test --watch --allow-net --allow-env --allow-read
```

Run one file:

```bash
deno test --allow-net --allow-env --allow-read cleanup-media/index.test.ts
```

### Conventions

- **One `index.test.ts` per function**, colocated with `index.ts`.
- **Shared fixtures** live in `supabase/functions/_shared/test-utils.ts` (e.g. `makeFakeSupabase`, `noSleep`).
- **Pure handler pattern**: `export async function handler(deps): Promise<Response>`. Inject `supabase`, clocks, sleep, retry counts. Keep `Deno.serve(...)` wrapped in `if (import.meta.main)` so importing the module in tests doesn't start a server.
- **Bare specifiers only**: declare deps in `supabase/functions/deno.json` `imports`, not inline `https://` / `npm:` / `jsr:` URLs (lint rule `no-import-prefix`).

### CI

`.github/workflows/ci.yml` runs `test-functions` on PRs that touch `supabase/functions/**` (gated via `dorny/paths-filter`). Frontend / DB tests run on their own paths.

### Editor setup

Install the `denoland.vscode-deno` extension. `.vscode/settings.json` scopes the Deno LSP to `supabase/functions/` via `deno.enablePaths`. The TypeScript LSP handles everything else. Reload the window after install — the status bar should show `Deno` when an edge function file is open.
