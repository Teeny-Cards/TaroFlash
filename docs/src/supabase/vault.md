---
lastUpdated: 2026-04-13T16:02:30-07:00
---

# Vault Secrets

The `cleanup-media` cron job needs two secrets stored in the Supabase Vault so it can call the edge function on a schedule.

---

## Finding the values

Open the Supabase dashboard for the target project and go to **Settings → API**:

| Secret name        | Where to find it                                   |
| ------------------ | -------------------------------------------------- |
| `supabase_url`     | **Project URL** field                              |
| `service_role_key` | **Project API keys → service_role** (click Reveal) |

For local dev, run `supabase status` — both values are printed in the output.

---

## Adding the secrets

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

---

## Updating a secret

If a value changes (e.g. rotating the service role key):

```sql
UPDATE vault.secrets SET secret = '<new-value>' WHERE name = 'service_role_key';
UPDATE vault.secrets SET secret = '<new-value>' WHERE name = 'supabase_url';
```

---

## Verifying

```sql
SELECT name, created_at, updated_at FROM vault.secrets ORDER BY name;
```

You should see both `service_role_key` and `supabase_url` listed. The `secret` column is encrypted — raw values are not visible, which is the point.

---

## Testing the cron job

Once secrets are set, fire the cleanup function immediately to confirm everything works:

```sql
SELECT public.invoke_cleanup_media();
```

Then check the response:

```sql
SELECT status_code, content, error_msg
FROM net._http_response
ORDER BY created DESC
LIMIT 5;
```
