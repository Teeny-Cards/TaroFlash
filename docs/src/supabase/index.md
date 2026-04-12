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
