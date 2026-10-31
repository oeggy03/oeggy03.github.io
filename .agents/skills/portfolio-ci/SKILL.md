---
name: portfolio-ci
description: Inspect and complete applicable GitHub checks for an authorized push or pull request using the exact commit SHA.
---

# Portfolio GitHub CI workflow

Use after an authorized push or PR creation/update, or when diagnosing a CI failure. Follow the mandatory completion loop in [`docs/agent-workflow.md`](../../../docs/agent-workflow.md#github-ci-completion-after-authorized-delivery) and delivery limits in [`AGENTS.md`](../../../AGENTS.md).

1. Identify the exact full SHA at the current branch or PR head. Inspect each applicable GitHub Actions run and other PR check attached to that SHA; do not use a passing result from an older commit.
2. Wait for all applicable checks to finish and inspect final results. For PRs, `verify` is expected and `deploy` is expected to be skipped because deployment is limited to `main` pushes and manual `main` runs.
3. If a check fails, open its logs and determine whether the cause is a code/config regression, a pre-existing issue, or an external blocker. Do not change or disable checks to hide a failure.
4. For an actionable issue, implement or route the fix through the assigned developer, run relevant authorized local checks, and push only when authorized. Restart verification at the new exact full SHA.
5. Repeat until every applicable check for the latest SHA passes or a genuine external blocker remains. If GitHub, permissions, secrets, a provider, or logs are inaccessible, state the exact blocker and the next required action.
6. Report the latest SHA and each final check result. Never report success while a check is pending, unexpectedly skipped, inaccessible, or failing. Do not merge or deploy without explicit owner authorization.
