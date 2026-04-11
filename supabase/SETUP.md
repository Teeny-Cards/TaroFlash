# Supabase Environment Setup

One-time steps required when provisioning a new environment (local, staging, production).

---

## 1. Start / connect to the project

**Local**
```bash
supabase start
```

**Staging / Production**

No local command needed — you'll run SQL directly in the Supabase dashboard for that project.

---

## 2. Apply migrations

**Local**
```bash
supabase migrations up
```

**Staging / Production**

Link your CLI to the project, then push:
```bash
supabase link --project-ref <project-ref>
supabase migration up
```

---

## 3. Configure Vault secrets

The `cleanup-media` cron job (added in migration `20260411000011`) needs two secrets
stored in the Supabase Vault so it can call the edge function on a schedule.

### Where to find the values

Open the Supabase dashboard for the target project and go to **Settings → API**:

| Secret name        | Where to find it                              |
|--------------------|-----------------------------------------------|
| `supabase_url`     | **Project URL** field                         |
| `service_role_key` | **Project API keys → service_role** (click Reveal) |

For local dev, run `supabase status` — both values are printed in the output.

### Add the secrets

Open the **SQL Editor** for the target project and run:

```sql
SELECT vault.create_secret('<project-url>', 'supabase_url');
SELECT vault.create_secret('<service-role-key>', 'service_role_key');
```

Example for local dev:
```sql
SELECT vault.create_secret('http://127.0.0.1:54321', 'supabase_url');
SELECT vault.create_secret('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'service_role_key');
```

### Updating an existing secret

If the values change (e.g. you rotate the service role key):
```sql
UPDATE vault.secrets SET secret = '<new-value>' WHERE name = 'service_role_key';
UPDATE vault.secrets SET secret = '<new-value>' WHERE name = 'supabase_url';
```

### Verify

```sql
SELECT name, created_at, updated_at FROM vault.secrets ORDER BY name;
```

You should see both `service_role_key` and `supabase_url` listed. The `secret` column
is encrypted — you won't see the raw values here, which is the point.

### Test the cron job manually

Once secrets are set you can fire the cleanup function immediately to confirm everything works:

```sql
SELECT public.invoke_cleanup_media();
```

Then check the response:
```sql
SELECT status, response_status, error_msg
FROM net._http_response
ORDER BY created DESC
LIMIT 5;
```

---

## 4. GitHub repository secrets (staging deploy workflow)

The `deploy-staging` workflow (`.github/workflows/deploy-staging.yml`) triggers when
you add a `deploy:staging` label to a PR. It needs three secrets in the GitHub repo.

**Settings → Secrets and variables → Actions → New repository secret**

| Secret name                | Where to find it |
|----------------------------|------------------|
| `SUPABASE_ACCESS_TOKEN`    | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → Generate new token |
| `SUPABASE_PROJECT_REF`     | Staging project URL: `https://supabase.com/dashboard/project/`**`<this part>`** |
| `SUPABASE_DB_PASSWORD`     | Staging dashboard → **Settings → Database → Database password** (or reset it there) |
| `NETLIFY_AUTH_TOKEN`       | Netlify → User settings → OAuth applications → Personal access tokens |
| `NETLIFY_SITE_ID`          | Netlify staging site → Site configuration → Site ID |

These secrets live under the **staging** GitHub Environment (Settings → Environments → staging).
The same secret names with different values should be added to a **production** environment when you set that up.

Once secrets are set, add the `deploy:staging` label to any PR to push its migrations
to staging. The label is removed automatically after the run and a comment is posted
with the result.

---

## 5. Edge function secrets

The edge functions read secrets from environment variables at runtime.

**Local** — set in `supabase/functions/.env` (gitignored; copy from a teammate or 1Password).

**Staging / Production** — push via the CLI:
```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_... \
  SERVICE_ROLE_KEY=eyJ... \
  --project-ref <project-ref>
```

View currently set secrets (names only, not values):
```bash
supabase secrets list --project-ref <project-ref>
```