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

## Provision storage buckets

Storage buckets are declared in `supabase/config.toml` under
`[storage.buckets.<name>]` blocks — for example:

```toml
[storage.buckets.cards]
public = true
file_size_limit = "10MiB"
allowed_mime_types = ["image/png", "image/jpeg", "image/webp", "image/gif"]
```

**Local**

`supabase start` does **not** auto-provision declarative buckets. After the
initial `supabase start`, and any time you wipe the local stack (e.g.
`supabase stop` + fresh volume), run:

```bash
supabase seed buckets --local
```

This reads `config.toml` and creates any missing buckets. Requires Supabase
CLI ≥ 2.90. If you hit `Bucket not found` during an upload in local dev,
this is the first thing to try.

Bucket-scoped RLS policies on `storage.objects` are tracked as normal SQL
migrations (e.g. `20260416000005_cards-bucket-storage-policies.sql`) and
apply via `supabase migrations up`.

**Staging / Production**

Buckets in linked projects are managed in the Supabase dashboard (Storage
tab) and don't require the `seed` command. Keep `config.toml` as the source
of truth and mirror the settings manually in the dashboard.
