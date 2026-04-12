-- =============================================================================
-- Schedule cleanup-media to run automatically via pg_cron + pg_net
-- =============================================================================
--
-- BEFORE RUNNING THIS MIGRATION, store your secrets in Supabase Vault.
-- Run these once in the SQL editor (per environment):
--
--   SELECT vault.create_secret(
--     'http://127.0.0.1:54321',   -- local; use your prod URL in production
--     'supabase_url'
--   );
--
--   SELECT vault.create_secret(
--     '<your service_role key>',  -- find with: supabase status (local)
--     'service_role_key'          --   or: Project Settings → API (production)
--   );
--
-- The Vault encrypts these values using pgsodium. Only SECURITY DEFINER
-- functions (running as the postgres user) can read vault.decrypted_secrets.
-- Regular users and RLS policies cannot access them.
--
-- To update a secret later:
--   UPDATE vault.secrets SET secret = '<new value>' WHERE name = 'supabase_url';
--
-- WHY service_role_key and not anon_key?
--   cleanup-media has verify_jwt = true in config.toml. Invoking it requires a
--   valid JWT. The service_role key is a long-lived signed JWT appropriate for
--   background maintenance jobs. Never expose it to browser clients.


-- -----------------------------------------------------------------------------
-- 1. Enable required extensions
--
--    pg_cron  — defines cron.schedule() for recurring SQL jobs.
--               Jobs run as the postgres user inside the database.
--
--    pg_net   — provides net.http_post() to make async HTTP requests from SQL.
--               Requests are queued in a background worker and do not block the
--               calling transaction.
--
--    supabase_vault — Supabase's encryption layer (wraps pgsodium). Exposes
--               vault.create_secret() and vault.decrypted_secrets.
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_cron         WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net          WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault  WITH SCHEMA vault;


-- -----------------------------------------------------------------------------
-- 2. Helper function that fires the edge function
--
--    SECURITY DEFINER: runs with postgres-superuser privileges so it can
--    read vault.decrypted_secrets, which is not accessible to regular roles.
--
--    We validate that both secrets exist before making the HTTP request, and
--    raise descriptive errors so problems are easy to diagnose in cron logs.
--
--    net.http_post is fire-and-forget — it returns a request ID immediately and
--    the response is stored asynchronously in net._http_response. To inspect
--    recent results:
--      SELECT * FROM net._http_response ORDER BY created DESC LIMIT 10;
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.invoke_cleanup_media()
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
DECLARE
  v_url         text;
  v_service_key text;
BEGIN
  SELECT decrypted_secret INTO v_url
  FROM vault.decrypted_secrets
  WHERE name = 'supabase_url'
  LIMIT 1;

  IF v_url IS NULL THEN
    RAISE EXCEPTION
      'Vault secret "supabase_url" not found. '
      'Run: SELECT vault.create_secret(''<url>'', ''supabase_url'');';
  END IF;

  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key'
  LIMIT 1;

  IF v_service_key IS NULL THEN
    RAISE EXCEPTION
      'Vault secret "service_role_key" not found. '
      'Run: SELECT vault.create_secret(''<key>'', ''service_role_key'');';
  END IF;

  PERFORM extensions.net.http_post(
    url     := v_url || '/functions/v1/cleanup-media',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || v_service_key,
      'Content-Type',  'application/json'
    ),
    body    := '{}'::jsonb
  );
END;
$$;


-- -----------------------------------------------------------------------------
-- 3. Register the cron job
--
--    '0 * * * *' = top of every hour. One invocation processes up to
--    BATCH_SIZE (500) rows. Increase frequency or batch size for high volume.
--
--    Useful commands:
--      View all jobs:       SELECT * FROM cron.job;
--      Remove this job:     SELECT cron.unschedule('cleanup-media-hourly');
--      Run immediately:     SELECT public.invoke_cleanup_media();
--      Inspect responses:   SELECT * FROM net._http_response ORDER BY created DESC LIMIT 5;
-- -----------------------------------------------------------------------------

-- Unschedule first so the migration is idempotent (safe to re-run)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-media-hourly') THEN
    PERFORM cron.unschedule('cleanup-media-hourly');
  END IF;
END;
$$;

SELECT cron.schedule(
  'cleanup-media-hourly',
  '0 * * * *',
  'SELECT public.invoke_cleanup_media()'
);
