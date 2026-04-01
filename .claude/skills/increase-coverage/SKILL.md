---
name: increase-coverage
description: Increase test coverage of existing files by adding new tests
---

## Workflow

### Step 0 — Pre-flight checks

Before doing anything else:

1. **Find the expected test file location.** Read `vite.config.ts` (or equivalent) and check the `test.projects` include globs (e.g. `tests/unit/**/*.test.js`). All new test files must match these globs or they will never be picked up.

2. **Find the coverage exclusion list.** In the same config, check `coverage.exclude`. Do not write tests for excluded files — they contribute nothing to coverage metrics.

### Step 1 — Run tests and identify coverage gaps

Run the following command to run tests and generate a coverage report:

```bash
vp test --coverage
```

Once complete, print a ranked list of low-coverage files directly from the JSON report — this is faster than opening the HTML report:

```bash
node -e "
const s = JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json', 'utf8'))
Object.entries(s)
  .filter(([k]) => k !== 'total')
  .sort((a, b) => a[1].lines.pct - b[1].lines.pct)
  .forEach(([f, d]) => console.log(d.lines.pct.toFixed(1).padStart(6) + '%  ' + f))
"
```

Identify all files with low coverage. If all files have 100% coverage, stop.

**If `vp test --coverage` crashes** (e.g. a coverage provider version mismatch), fall back to `vp test --no-coverage` to confirm the test suite runs, and use source file line counts as a rough proxy for ranking in Step 2. Note the crash in the final report.

### Step 2 — Determine the highest priority file among the low coverage files

Rank the files based on the following criteria:

1. How many lines until the file reaches 100% coverage (lower is better) (this is the primary metric)
2. The criticality of the component/utility/composable/store/etc. (Is it a core part of the application? Is it used in many places?) (this is the secondary metric)

Pick the file with the highest rank.

**If there are no existing tests** (0% across the board), ranking by uncovered lines collapses to "shortest file first." In this case, weight criticality more heavily — prefer covering a small but central module over a tiny but peripheral one.

### Step 3 — Write tests for the highest priority file

Before writing, read the source file to understand:

- **Module-level state:** Vue composables often hold `ref`/`reactive` values at module scope. These persist across `useXxx()` calls and across tests — they need an explicit reset in `beforeEach` via the composable's own setters. Flag these in a comment so future readers know why the reset is there.
- **What the function/composable actually returns** vs. what it stores internally.
- **Dependencies that need mocking:** prefer `vi.mock('@/composables/...')` over mocking browser APIs like `window.matchMedia`. Module mocks are more isolated. Use `vi.mocked(...).mockReturnValue(...)` in `beforeEach` to reset to a safe default, then override per-test as needed.

Write a test suite for the high priority file up to a maximum of 200 lines of code changed. If you reach 200 lines and there are still uncovered lines:

- Finish any unfinished tests; if finishing would greatly exceed the 200 line limit, drop the test.
- Stop and continue to the next step.

### Step 4 — Validate all tests pass

After writing the tests, run the relevant test suite and verify that all tests pass.

```bash
vp test --no-coverage
```

If any test fails:

1. Read the failure output carefully.
2. Fix the test (or the source if the test revealed a real bug — call this out explicitly).

- If the source needs to be fixed, suggest the change to the user.
- Ask for confirmation before making any changes to source files.

3. Re-run until green.

### Step 5 — Review and quality check

Once all tests are written and passing, review the full set of new tests for quality using `test-quality-checklist.md` in the `skills` directory.

**Fix any critical issues** — specifically anything that would cause intermittent CI failures or mask real regressions. Call out non-critical issues (low severity style/practice notes) in the report but do not auto-fix them.

### Step 6 — Open a PR

- Create a new branch based off the current branch
- Commit the changes
- Open a PR against the current branch with the title: "chore(tests): increase coverage"

```bash
gh pr create --title "chore(tests): increase coverage" --body "..."
```

**If `gh` is not installed:** push the branch and output the GitHub compare URL in the format `https://github.com/<owner>/<repo>/compare/<branch>` so the user can open the PR manually.

### Step 7 — Report

After writing all tests, output a short summary table:

| File changed | Test file | Type             | New tests | Lines covered (approx) |
| ------------ | --------- | ---------------- | --------- | ---------------------- |
| ...          | ...       | unit/integration | N         | ~X%                    |

Include a **Quality notes** section listing any non-critical issues spotted during the review (step 6) that were not auto-fixed, so the author is aware of them.

If coverage was broken, note it here and describe the fallback used.

Include a link to the newly opened PR in github.
