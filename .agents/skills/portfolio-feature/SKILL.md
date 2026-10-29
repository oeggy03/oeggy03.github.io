---
name: portfolio-feature
description: Plan and implement a scoped website, documentation, or configuration task in this portfolio repository through the coordinator, developer, and verifier workflow.
---

# Portfolio feature workflow

Use for a scoped feature or repository task, including website behavior, documentation, or configuration. Follow [`AGENTS.md`](../../../AGENTS.md) and [`docs/agent-workflow.md`](../../../docs/agent-workflow.md) for product constraints, roles, branches, commits, and client limits.

1. Inspect relevant source and existing checks. The coordinator writes down the user outcome, acceptance criteria, in-scope files, constraints, and settled TODOs before implementation.
2. The coordinator assigns all actual edits to the configured developer after scope is settled. The developer implements the assigned scope directly and does not delegate again unless the owner explicitly asks. Do not have the coordinator implement app code, docs, fixes, or config.
3. The developer follows existing React/Tailwind patterns and preserves the current routed view structure, all current project details, route behavior, accessible controls, and supplied facts. These counts are current content, not a cap on user-authorized additions or user-requested structure changes.
4. Review the implementation against the agreed acceptance criteria. Route gaps and fixes through the developer; the verifier independently checks relevant behavior and reports only checks actually performed.
5. For website changes, run existing frontend checks when authorized or requested. For docs/config-only changes, validate the changed files without running application tests unless requested. Never weaken or skip frontend tests to make a feature pass.
6. Follow the branch and focused-commit policy in `AGENTS.md`. Commit or push only when the user authorized delivery; never merge or deploy without authorization.

Report files changed, important decisions, actual commands and results, and remaining limitations.
