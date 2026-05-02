---
name: increase-coverage
description: Increase test coverage of existing files by adding new tests
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
lastUpdated: 2026-04-13T12:01:02-07:00
---

Steps:

# Read `vite.config.ts`

- note the `test.projects` include globs (new files must match) and `coverage.exclude` (skip these — they don't count toward metrics).
- three projects exist: **Unit** (jsdom), **Integration** (Chromium), **Contract** (Node, real local Supabase). Pick the project that matches the source: pure logic → Unit, components → Integration, `src/api/*/db/*` → Contract. See `.claude/rules/testing.md` for the type table.
- Contract tests need `supabase start` running locally. Edge functions (`supabase/functions/`) use Deno + colocated `index.test.ts`, not Vitest — they don't count toward Vitest coverage.

# Identify coverage gaps

- Run `vp test --coverage`
- Rank file coverage based on the generated JSON report.
- If all files are at 100%, stop.

# Write tests

- Write up to a maximum of **200 lines**. If you hit the limit mid-test, finish or drop the current test then stop.
- Integration tests run in **Chromium browser mode** — test stubs must use render functions (`h()`), not `template` strings. See `testing.md` "Browser mode constraints" for details.
- Run tests to validate all tests pass and coverage is increased.
- If any tests fail, fix them.
- If the failure reveals a real source bug, surface it explicitly and ask for confirmation before touching any source files.
- Re-run until green.

# Review

- Review new tests against the flakiness audit in `.claude/rules/testing.md` (auto-loaded when working on test files).
- Fix critical issues (flakiness, masked regressions)
- Note non-critical issues in the report — don't auto-fix them.

# Open a PR

- Record the current branch before doing anything — this is the base branch for the PR: `BASE=$(git rev-parse --abbrev-ref HEAD)`
- Create a new branch off it, commit, and open the PR targeting that base:

```bash
git checkout -b <branch>
git add tests/
git commit -m "chore(tests): increase coverage"
git push -u origin <branch>
gh pr create --title "chore(tests): increase coverage" --base "$BASE" --body "..."
```

- Include a **Quality notes** section for non-critical issues in the PR description.

| File | Test file | Type             | New tests | Coverage |
| ---- | --------- | ---------------- | --------- | -------- |
| ...  | ...       | unit/integration | N         | ~X%      |

# PR Review Loop

- Tell the user the PR is ready for review and **wait for them to say so** before continuing.
- When the user signals they've finished reviewing, fetch all review comments (excluding bots):

```bash
# Get PR number and owner/repo
gh pr view --json number,headRepository

# PR-level comments (exclude bots)
gh api /repos/{owner}/{repo}/issues/{number}/comments \
  | jq '[.[] | select(.user.type != "Bot")]'

# Code review comments — these include diff_hunk, path, line
gh api /repos/{owner}/{repo}/pulls/{number}/comments \
  | jq '[.[] | {id, in_reply_to_id, author: .user.login, body, path, line, diff_hunk}]'
```

> **Note:** Review comments can be large. Always pipe through `jq` to extract only the fields you need — fetching raw JSON will overflow the context.

## For each comment thread:

- **If the feedback is valid** — fix the code, run `vp test --no-coverage` to confirm green, push, then reply to the comment via `gh api /repos/{owner}/{repo}/pulls/{number}/comments/{comment_id}/replies -X POST -f body="..."` explaining what changed.
- **If the feedback doesn't make sense** — reply to the comment explaining why, without making changes.
- Always prefix replies with `🤖 Claude:` so the author can distinguish automated replies from their own.
- After addressing all comments, push any changes and tell the user you're done. **Wait again** for their next review signal. Repeat until the user confirms everything looks good.
