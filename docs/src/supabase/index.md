---
lastUpdated: 2026-04-16T15:46:10-07:00
---

# Supabase Setup

One-time steps required when provisioning a new environment (local, staging, or production).

---

## Start / connect to the project

**Local**

```bash
supabase start
```

Runs Supabase locally on port 54321 (API) and 54322 (Postgres).

**Staging / Production**

No local command needed — connect via the CLI using your project ref when running migrations or secrets commands.

---

## Apply migrations

**Local**

```bash
supabase migrations up
```

**Staging / Production**

Link the CLI to the project, then push:

```bash
supabase link --project-ref <project-ref>
supabase migration up
```

---

## Storage buckets

Buckets are provisioned via SQL migrations (not `config.toml`), so
`supabase migration up` creates them in every environment — local,
staging, production — with no separate step.

See `supabase/migrations/20260416000007_cards-bucket.sql` as the pattern:
a single `INSERT ... ON CONFLICT (id) DO UPDATE` on `storage.buckets`.
The `ON CONFLICT` clause makes it idempotent and lets follow-up migrations
edit settings (public flag, file-size limit, MIME allowlist) by writing
new INSERTs against the same `id`.

Bucket-scoped RLS policies on `storage.objects` live in adjacent migrations
(e.g. `20260416000005_cards-bucket-storage-policies.sql`) and apply
through the same `migration up` flow.
