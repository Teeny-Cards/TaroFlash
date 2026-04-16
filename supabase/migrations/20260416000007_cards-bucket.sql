-- =============================================================================
-- Create the `cards` storage bucket
-- =============================================================================
--
-- Lives in a migration (not config.toml) so a single `supabase migration up`
-- provisions the bucket in any environment — local, staging, or production.
-- `config.toml`'s [storage.buckets.X] syntax requires a separate
-- `supabase seed buckets` command and doesn't apply on deploy, which made
-- stage/prod environments diverge.
--
-- Idempotent via ON CONFLICT DO UPDATE: re-running the migration is a no-op
-- when settings match, and propagates changes when a new migration edits
-- the VALUES clause or adds a follow-up UPDATE.
-- =============================================================================

BEGIN;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cards',
  'cards',
  true,
  10485760, -- 10 MiB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

COMMIT;
