-- =============================================================================
-- members.preferences: client-side UI prefs (accessibility, etc.)
-- =============================================================================
--
-- One JSONB column holds every client-rendered preference. Nested namespaces
-- inside ({ accessibility: {...}, sounds: {...} }) keep logical separation
-- without splitting columns. Whole blob is read once on profile load and
-- written whole on save — no server-side filtering needed.
--
-- NOT NULL + default '{}' so reads never need to coalesce. Existing rows
-- backfill to '{}' automatically.
-- =============================================================================

BEGIN;

ALTER TABLE public.members
  ADD COLUMN preferences jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMIT;
