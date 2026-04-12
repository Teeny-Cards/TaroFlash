# TaroFlash

A spaced repetition flashcard app built with Vue 3 and Supabase.

---

## Development

```sh
vp install       # install dependencies
vp dev           # start dev server
vp build         # production build
vp test          # run tests with coverage
vp check         # format + lint + type-check
```

---

## Deploying to staging

Add the `deploy:staging` label to any PR. The workflow will:
1. Run pending DB migrations against the staging Supabase project
2. Build the frontend and deploy it to the staging Netlify alias
3. Post a comment on the PR with the result

The label is removed automatically so you can re-trigger by adding it again.

---

## GitHub environment secrets

The staging deploy workflow requires secrets stored under the **staging** GitHub Environment
(**Settings → Environments → staging → Add secret**).

When you set up a production deploy, create a **production** environment with the same secret
names pointing at production values.

### Supabase

| Secret | What it's for | Where to find it |
|--------|---------------|------------------|
| `SUPABASE_ACCESS_TOKEN` | Authenticates the Supabase CLI to link and run migrations | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → Generate new token |
| `SUPABASE_PROJECT_REF` | Identifies which Supabase project to migrate | Project URL: `supabase.com/dashboard/project/`**`<this part>`** |
| `SUPABASE_DB_PASSWORD` | Required by `supabase link` to connect to the database | Supabase dashboard → **Settings → Database → Database password** |

### Netlify

| Secret | What it's for | Where to find it |
|--------|---------------|------------------|
| `NETLIFY_AUTH_TOKEN` | Authenticates the Netlify CLI to deploy | Netlify → User settings → OAuth → Personal access tokens |
| `NETLIFY_SITE_ID` | Identifies which Netlify site to deploy to | Netlify → TaroFlash site → **Site configuration → Site ID** |

### Frontend build vars

Baked into the frontend bundle at build time by Vite. Not available at runtime.

| Secret | What it's for | Where to find it |
|--------|---------------|------------------|
| `VITE_SUPABASE_URL` | Supabase project URL used by the browser client | Supabase dashboard → **Settings → API → Project URL** |
| `VITE_SUPABASE_API_KEY` | Supabase anon key for client-side queries (subject to RLS) | Supabase dashboard → **Settings → API → anon public** |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key used by the payment UI | Stripe dashboard → test/live publishable key |
| `VITE_MEMBERSHIP_PRICE_ID` | Stripe price ID for the membership product | Stripe dashboard → product → price ID |

---

## Further setup

For Supabase-specific setup (Vault secrets, edge function secrets, applying migrations manually)
see [`supabase/SETUP.md`](supabase/SETUP.md).
