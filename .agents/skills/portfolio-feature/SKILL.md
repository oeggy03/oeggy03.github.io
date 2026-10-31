---
name: portfolio-feature
description: Plan and implement a scoped website, documentation, or configuration task in this portfolio repository through the coordinator, developer, and verifier workflow.
---

# Portfolio feature workflow

Use for a scoped website, documentation, or configuration change. Follow [`AGENTS.md`](../../../AGENTS.md), the [project guide](../../../docs/project-guide.md), and the [agent workflow](../../../docs/agent-workflow.md). For visual work, read the [design and content guide](../../../docs/design-content-guide.md).

1. Inspect relevant source, documentation, and existing checks. The coordinator settles the user outcome, acceptance criteria, file scope, constraints, and decisions before edits.
2. The coordinator assigns all actual edits to the configured developer after scope is settled. The developer implements only the assigned files and does not delegate again unless the owner explicitly asks.
3. Follow the three-view default (Experience, Projects, Skills), preserve supplied project, role, skill, route, accessibility, and content facts, and honor explicit user-requested structure changes. Counts describe current content, not a cap on user-authorized additions.
4. Review against the settled criteria. Route implementation gaps through the developer; the verifier independently checks assigned behavior and reports only checks actually performed.
5. For website work, run existing checks when authorized or requested. For docs/config-only work, validate changed files and harness checks in scope without running application checks unless requested. Never weaken or skip frontend checks to make a change pass.
6. Follow the branch and delivery boundaries in `AGENTS.md`. Commit, push, or open a PR only with explicit authorization; never merge or deploy without authorization. After an authorized push/PR update, follow the exact-SHA loop in the workflow handbook.

Report files changed, important decisions, actual commands and results, and remaining limitations.
