# Edge Function Secrets

Edge functions read secrets from environment variables at runtime.

---

## Local

Set secrets in `supabase/functions/.env` (gitignored — copy from a teammate or 1Password).

---

## Staging / Production

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
