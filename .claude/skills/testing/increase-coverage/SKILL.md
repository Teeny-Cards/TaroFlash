---
name: increase-coverage
description: Increase test coverage of existing files by adding new tests
---

## Workflow

### Step 1 — Run tests and identify coverage gaps

Run the following command to run tests and generate a coverage report:

```bash
vp test --coverage
```

This will generate a coverage report in `coverage/` directory. Open `coverage/index.html` to view the report.

Identify all files with low coverage. If there are no tests, move on to the next step. If all files have 100% coverage, stop.

### Step 2 - Determine the highest priority file among the low coverage files

Rank the files based on the following criteria:

1. How many lines until the file reaches 100% coverage (lower is better) (this is the primary metric)
2. The criticality of the component/utility/composable/store/etc. (Is it a core part of the application? Is it used in many places?) (this is the secondary metric)

Pick the file with the highest rank.

### Step 3 - Write tests for the highest priority file

Write a test suite for the high priority file up to a maximum of 200 lines of code changed. If you reach 200 lines and there are still uncovered lines:

- Finish any unfished tests, if finishing the tests would greatly exceed the 200 line limit, drop the test.
- Stop and continue to the next step.

### Step 4 - Validate all tests pass

After writing the tests, Run the relevant test suite and verify that all tests pass.

If any test fails:

1. Read the failure output carefully.
2. Fix the test (or the source if the test revealed a real bug — call this out explicitly).

- If the source needs to be fixed, suggest the change to the user.
- Ask for confirmation before making any changes to source files.

3. Re-run until green.

### Step 5 — Review and quality check

Once all tests are written and passing, review the full set of new tests for quality using `test-quality-checklist.md` in the `skills/testing` directory.

**Fix any critical issues** — specifically anything that would cause intermittent CI failures or mask real regressions. Call out non-critical issues (low severity style/practice notes) in the report but do not auto-fix them.

### Step 6 - Open a PR

- Create a new branch based off the current branch
- Commit the changes
- Open a PR against the current branch with the title: "chore(tests): increase coverage"

### Step 7 — Report

After writing all tests, output a short summary table:

| File changed | Test file | Type             | New tests | Lines covered (approx) |
| ------------ | --------- | ---------------- | --------- | ---------------------- |
| ...          | ...       | unit/integration | N         | ~X%                    |

Include a **Quality notes** section listing any non-critical issues spotted during the review (step 6) that were not auto-fixed, so the author is aware of them.

Include a link to the newly opened PR in github.
