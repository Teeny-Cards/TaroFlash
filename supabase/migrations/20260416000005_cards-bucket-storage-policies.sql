-- =============================================================================
-- storage.objects RLS policies for the `cards` bucket
-- =============================================================================
--
-- Path shape: `<member_id>/<card_id>/<side>/<uid>.<ext>` — set in
-- src/api/media.ts:setCardImage. The first path segment is the uploader's
-- member_id; `storage.foldername(name)[1]` extracts it.
--
-- Four policies (SELECT/INSERT/UPDATE/DELETE) all gated on
-- `auth.uid()::text = foldername[1]`, enforcing per-member isolation end
-- to end.
--
-- The SELECT policy is load-bearing even for non-SELECT operations:
-- supabase-js's upload-with-upsert emits `INSERT ... ON CONFLICT DO UPDATE`,
-- which requires SELECT permission for the conflict check. Without it,
-- every upload fails with a generic "new row violates RLS" error.
--
-- DROP IF EXISTS is at the top so this migration re-applies cleanly after
-- a `migration repair --status reverted` (only while the branch is still
-- in development — see the "editing migrations" rule).
-- =============================================================================

BEGIN;

DROP POLICY IF EXISTS "cards_bucket_authenticated_select" ON storage.objects;
DROP POLICY IF EXISTS "cards_bucket_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "cards_bucket_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "cards_bucket_authenticated_delete" ON storage.objects;

CREATE POLICY "cards_bucket_authenticated_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cards'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "cards_bucket_authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cards'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "cards_bucket_authenticated_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cards'
  AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'cards'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "cards_bucket_authenticated_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cards'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

COMMIT;
