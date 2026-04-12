# Memory Index

- [PR comment prefix](feedback_pr_comments.md) — Always prefix GitHub PR replies with `🤖 Claude:` so the user can distinguish them from their own comments
- [PR base branch](feedback_pr_base_branch.md) — PRs from `increase-coverage` must target the user's active branch at invocation time, not master
- [No magic timeouts](feedback_no_magic_timeouts.md) — Prefer event-driven promises over setTimeout for animation sequencing; emit from GSAP onComplete
- [No class assertions in tests](feedback_no_class_assertions.md) — Never assert CSS class names; expose data-\* attributes and assert those instead
- [Use theme system for colors](feedback_theme_system.md) — Always use MemberTheme + data-theme/var(--color-\*) for colors, never raw hex values
- [Extract Supabase calls to API module](feedback_api_module.md) — Direct supabase calls belong in src/api/, not inlined in components or composables
