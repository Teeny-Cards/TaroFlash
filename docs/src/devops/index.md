# DevOps

## Staging deploy

Add the `deploy:staging` label to any open PR. The workflow will:

1. Run pending DB migrations against the staging Supabase project
2. Build the frontend and deploy it to the staging Netlify alias
3. Post a comment on the PR with the result

The label is removed automatically — add it again to re-trigger.

---

## GitHub Environment Setup

Secrets and variables are stored under GitHub Environments (**Settings → Environments**). Create a `staging` environment for staging and a `production` environment for production, using the same names with environment-appropriate values.

### Secrets

Encrypted and masked in logs. Set under **Environments → \<env\> → Secrets**.

| Secret                  | What it's for                                              | Where to find it                                                                                            |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | Authenticates the Supabase CLI to link and run migrations  | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → Generate new token |
| `SUPABASE_DB_PASSWORD`  | Required by `supabase link` to connect to the database     | Supabase dashboard → **Settings → Database → Database password**                                            |
| `NETLIFY_AUTH_TOKEN`    | Authenticates the Netlify CLI to deploy                    | Netlify → User settings → OAuth → Personal access tokens                                                    |
| `VITE_SUPABASE_API_KEY` | Supabase anon key for client-side queries (subject to RLS) | Supabase dashboard → **Settings → API → anon public**                                                       |

### Variables

Plaintext, visible in logs. Set under **Environments → \<env\> → Variables**.

| Variable                   | What it's for                                                     | Where to find it                                                |
| -------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| `SUPABASE_PROJECT_REF`     | Identifies which Supabase project to migrate                      | Project URL: `supabase.com/dashboard/project/`**`<this part>`** |
| `NETLIFY_SITE_ID`          | Identifies which Netlify site to deploy to                        | Netlify → TaroFlash site → **Site configuration → Site ID**     |
| `VITE_SUPABASE_URL`        | Supabase project URL used by the browser client                   | Supabase dashboard → **Settings → API → Project URL**           |
| `VITE_STRIPE_PUBLIC_KEY`   | Stripe publishable key used by the payment UI (safe to be public) | Stripe dashboard → test/live publishable key                    |
| `VITE_MEMBERSHIP_PRICE_ID` | Stripe price ID for the membership product                        | Stripe dashboard → product → price ID                           |
