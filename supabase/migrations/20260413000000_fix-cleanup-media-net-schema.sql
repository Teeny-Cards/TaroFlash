-- =============================================================================
-- Fix invoke_cleanup_media() to use net.http_post instead of extensions.net.http_post
-- =============================================================================
--
-- On hosted Supabase, pg_net is pre-installed in the `net` schema.
-- The original function referenced `extensions.net.http_post()` which works
-- locally but fails on hosted projects with:
--   "cross-database references are not implemented: extensions.net.http_post"
--
-- The fix: use `net.http_post()` directly — the `net` schema is in the
-- search path on both local and hosted environments.
-- =============================================================================

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

  PERFORM net.http_post(
    url     := v_url || '/functions/v1/cleanup-media',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || v_service_key,
      'Content-Type',  'application/json'
    ),
    body    := '{}'::jsonb
  );
END;
$$;
