-- =============================================================================
-- Test helpers
--
-- These utility functions simplify test setup. Role switching (SET LOCAL role)
-- must be done inline in test files because PostgreSQL doesn't allow SET role
-- inside PL/pgSQL functions from a non-superuser.
--
-- Usage pattern in test files:
--
--   -- Switch to act as Alice:
--   SELECT tests.set_claims('alice-uuid');
--   SET LOCAL role = 'authenticated';
--
--   -- ... run assertions ...
--
--   -- Switch back to superuser:
--   SET LOCAL role = 'postgres';
--   SELECT tests.set_claims(NULL);
-- =============================================================================

BEGIN;

SELECT plan(1);

CREATE SCHEMA IF NOT EXISTS tests;

-- Grant the authenticated role access to call test helper functions.
GRANT USAGE ON SCHEMA tests TO authenticated;
GRANT USAGE ON SCHEMA tests TO anon;


-- Create a fake authenticated user + member row in one call.
CREATE OR REPLACE FUNCTION tests.create_user(
  p_uid          uuid,
  p_display_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  VALUES (
    p_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    p_display_name || '@test.com',
    crypt('password123', gen_salt('bf')),
    now(),
    jsonb_build_object('display_name', p_display_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Ensure member row exists (trigger may have already created it).
  INSERT INTO public.members (id, display_name)
  VALUES (p_uid, p_display_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN p_uid;
END;
$$;


-- Set (or clear) JWT claims so auth.uid() returns the given UUID.
-- Pass NULL to clear claims. This does NOT change the role — do that
-- with SET LOCAL role inline in the test file.
CREATE OR REPLACE FUNCTION tests.set_claims(p_uid uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_uid IS NULL THEN
    PERFORM set_config('request.jwt.claims', '', true);
  ELSE
    PERFORM set_config(
      'request.jwt.claims',
      json_build_object('sub', p_uid, 'role', 'authenticated')::text,
      true
    );
  END IF;
END;
$$;

SELECT pass('Test helpers installed');
SELECT * FROM finish();

COMMIT;
