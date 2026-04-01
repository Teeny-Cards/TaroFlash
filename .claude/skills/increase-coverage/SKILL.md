---
name: increase-coverage
description: Increase test coverage of existing files by adding new tests
---

## Workflow

### Step 0 — Pre-flight

Read `vite.config.ts`: note the `test.projects` include globs (new files must match) and `coverage.exclude` (skip these — they don't count toward metrics).

### Step 1 — Identify coverage gaps

```bash
vp test --coverage
```

Then rank files from the JSON report:

```bash
node -e "
const s = JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json', 'utf8'))
Object.entries(s)
  .filter(([k]) => k !== 'total')
  .sort((a, b) => a[1].lines.pct - b[1].lines.pct)
  .forEach(([f, d]) => console.log(d.lines.pct.toFixed(1).padStart(6) + '%  ' + f))
"
```

If all files are at 100%, stop. **If coverage crashes**, fall back to `vp test --no-coverage` and use source file line counts as a rough proxy. Note the crash in the final report.

### Step 2 — Pick the highest priority file

Rank by **(1) fewest uncovered lines** (primary) then **(2) criticality** — is it core to the app, used in many places? When all files are at 0%, weight criticality more heavily over raw line count.

### Step 3 — Write tests

Before writing, read the source file and note:

- **Module-level state** (`ref`/`reactive` outside the function body) — reset in `beforeEach` via the composable's own setter; add a comment explaining why
- **What the composable returns** vs. what it stores internally
- **Dependencies** — prefer `vi.mock('@/composables/...')` over mocking browser APIs; reset with `vi.mocked(...).mockReturnValue(...)` in `beforeEach`, override per-test as needed

Write up to **200 lines**. If you hit the limit mid-test, finish or drop the current test then stop.

### Step 4 — Validate

```bash
vp test --no-coverage
```

On failure: fix the test. If the failure reveals a real source bug, surface it explicitly and ask for confirmation before touching any source files. Re-run until green.

### Step 5 — Quality check

Review new tests against `test-quality-checklist.md`. Fix critical issues (flakiness, masked regressions). Note non-critical issues in the report — don't auto-fix them.

### Step 6 — Open a PR

```bash
git checkout -b <branch>
git add tests/
git commit -m "chore(tests): increase coverage"
git push -u origin <branch>
gh pr create --title "chore(tests): increase coverage" --body "..."
```

If `gh` is unavailable, output: `https://github.com/<owner>/<repo>/compare/<branch>`

### Step 7 — Report

| File | Test file | Type | New tests | Coverage |
| ---- | --------- | ---- | --------- | -------- |
| ...  | ...       | unit/integration | N | ~X% |

Include a **Quality notes** section for non-critical issues from Step 5, a link to the PR, and note any coverage crashes with the fallback used.
