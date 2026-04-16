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
