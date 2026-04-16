# Backend Learning Log

After each backend teaching session, list the key concepts covered as touchpoints (e.g., "RLS policies", "transactions", "JWT claims") so the user has prompts to react to rather than recalling from scratch. Let them reflect on what clicked and what didn't, and note any follow-up questions they ask — those are strong signals of understanding depth. Based on their reflection, their questions throughout the session, and your knowledge of the topic's actual depth, estimate their understanding of each concept on a scale of 1-100.

**Scoring rules:**

- Always err on the side of a lower score. If in doubt, pick the lower number.
- Log only concept and score — no rationale column.
- Append new entries chronologically.

## Sessions

<!-- Append new sessions below this line -->

### 2026-04-13 — pgTAP setup & RLS/triggers/RPC testing

| Concept                     | Score |
| --------------------------- | ----- |
| RLS (Row Level Security)    | 8     |
| Transactions                | 6     |
| Triggers                    | 4     |
| SECURITY DEFINER vs INVOKER | 5     |
| JWT claims & auth.uid()     | 3     |
| pgTAP testing               | 2     |

### 2026-04-15 — card.note migration: nullable ADD COLUMN, view snapshots, security_invoker

| Concept                               | Score |
| ------------------------------------- | ----- |
| Nullable ADD COLUMN (zero-downtime)   | 7     |
| View column snapshotting / recreation | 7     |
| security_invoker vs security_definer  | 4     |

### 2026-04-16 — decks_with_stats view, cards_with_images retrofit

| Concept                                    | Score |
| ------------------------------------------ | ----- |
| Views as a unified read shape              | 3     |
| security_invoker on views                  | 9     |
| Correlated subqueries                      | 4     |
| Views replacing trigger-maintained columns | 8     |
| View column snapshotting (second exposure) | 8     |

### 2026-04-16 — insert_card RPC, plpgsql, advisory locks

| Concept                                     | Score |
| ------------------------------------------- | ----- |
| Plpgsql syntax fundamentals                 | 6     |
| Function return types as part of signatures | 7     |
| RETURNING ... INTO                          | 6     |
| Variable/column disambiguation              | 3     |
| Advisory locks                              | 6     |
| Fractional ranks + BE-owned rank            | 3     |

### 2026-04-16 — media slot-dedupe trigger + unique partial index

| Concept                                      | Score |
| -------------------------------------------- | ----- |
| Trigger function vs trigger (two-part split) | 8     |
| NEW / OLD / TG_OP record variables           | 8     |
| BEFORE vs AFTER triggers                     | 8     |
| SECURITY INVOKER on trigger functions        | 9     |
| Partial unique indexes                       | 6     |
| Trigger (behavior) vs index (invariant)      | 7     |

### 2026-04-16 — storage bucket + storage.objects RLS

| Concept                                               | Score |
| ----------------------------------------------------- | ----- |
| storage.buckets declarative config (config.toml)      | 5     |
| storage.objects RLS with owner column                 | 9     |
| UPSERT requires SELECT policy (ON CONFLICT DO UPDATE) | 2     |
| storage.foldername + path-based member isolation      | 8     |
