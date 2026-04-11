-- Remove elapsed_days and last_elapsed_days from review_logs.
-- These mirror ts-fsrs ReviewLog fields that are deprecated and will be
-- removed in ts-fsrs v6. The values are derivable from the review timestamps
-- in the log history, so storing them is unnecessary.
ALTER TABLE public.review_logs DROP COLUMN IF EXISTS elapsed_days;
ALTER TABLE public.review_logs DROP COLUMN IF EXISTS last_elapsed_days;
