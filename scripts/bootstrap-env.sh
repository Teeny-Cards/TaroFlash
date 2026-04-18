#!/usr/bin/env bash
# Ensures local dev env vars exist before the stack boots.
# Idempotent — safe to run on every `pnpm dev:full`.
# Currently: caches the Stripe CLI webhook signing secret so the
# stripe-webhook Edge Function can verify incoming events.
set -euo pipefail

ENV_FILE="supabase/functions/.env.local"
mkdir -p "$(dirname "$ENV_FILE")"
touch "$ENV_FILE"

# Signing secret is stable per Stripe CLI login, so fetch once and reuse.
if ! grep -q '^STRIPE_WEBHOOK_SECRET=' "$ENV_FILE"; then
  echo "Fetching Stripe webhook secret..."
  secret=$(stripe listen --print-secret)
  echo "STRIPE_WEBHOOK_SECRET=$secret" >> "$ENV_FILE"
  echo "Cached STRIPE_WEBHOOK_SECRET → $ENV_FILE"
fi
