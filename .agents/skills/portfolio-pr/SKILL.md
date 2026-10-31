---
name: portfolio-pr
description: Prepare and deliver a portfolio pull request only after the user authorizes commit, push, or PR creation.
---

# Portfolio pull request delivery

Use only for delivery the user explicitly authorized. Follow the branch and authorization boundaries in [`AGENTS.md`](../../../AGENTS.md) and [`docs/agent-workflow.md`](../../../docs/agent-workflow.md). After an authorized push or PR update, follow the [`portfolio-ci`](../portfolio-ci/SKILL.md) exact-SHA workflow.

1. Review the full diff, changed files, generated artifacts, and status. Remove unrelated changes only when they are clearly task-generated; never rewrite or squash user history.
2. Use the feature branch for follow-up work. Make focused commits for real logical steps, not one commit per file or artificial splits.
3. Verify with checks authorized for this task. The PR description must list commands actually run, outcomes, and meaningful limits. Do not imply an application check or visual review was performed when it was not.
4. For any UI or website behavior change, include relevant real screenshots in the PR as embedded images. Show desktop and mobile states; include before/after or interaction states when they help explain the change. Use current captures for the actual changed routes/states, commit the screenshot artifacts, and identify them with the immutable commit SHA. Never use stale, irrelevant, or fabricated images. For docs/config-only work, state `Screenshots: N/A — documentation/configuration-only change; no UI or website behavior changed.`
5. Use `.github/pull_request_template.md` and accurately describe the implemented steps, verification, screenshots, and limitations.
6. Commit, push, and open a PR only to the extent explicitly authorized. Do not merge or deploy; the workflow verifies PRs, and merging to `main` publishes the site. Do not claim CI success until all applicable checks for the latest full SHA have completed successfully or a genuine external blocker is reported.
