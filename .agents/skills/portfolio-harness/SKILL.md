---
name: portfolio-harness
description: Maintain this repository's portable Codex/Cursor instructions, project guides, shared skills, and safe agent setup.
---

# Portfolio agent harness workflow

Use when editing repository instructions, setup tooling, skills, adapters, or documentation intended to help future agents. Follow [`AGENTS.md`](../../../AGENTS.md), the [agent workflow](../../../docs/agent-workflow.md), the [project guide](../../../docs/project-guide.md), and the [fresh-session guide](../../../docs/agent-start.md).

1. Inspect the current package scripts, setup/check tooling, `.codex/` and `.cursor/` adapters, documentation, and shared `.agents/skills/` before editing. Read official Codex and Cursor documentation again when changing client discovery assumptions.
2. Keep root instructions concise and maintain one canonical copy of project workflow skills in `.agents/skills/`, discovered by both Codex and Cursor. Link from client adapters to canonical project guidance rather than duplicating it.
3. Keep setup repository-local, portable, and safe to rerun. Show what setup will change; preserve existing or user-specific configuration and refuse silent overwrites. Do not write global settings, machine-specific paths, secrets, or sandbox/approval changes.
4. Treat the generic agent adapter as a manual template unless it has been tested in that agent. Preview must be the default. A write requires explicit `--write` and must not replace an existing target. State any client-specific manual steps.
5. When setup commands, files, skills, route counts, app scripts, or CI behavior change, update the README, project guide, session guide, role workflow, and skill index only where affected. Mark historical plans/reviews as superseded instead of presenting old route or screenshot counts as current.
6. Validate changed Markdown links and YAML frontmatter, and parse TOML/YAML with an available parser. Run `npm run check:harness` and `npm run test:harness` when present and in scope. For docs-only work, do not run website builds/browser checks unless requested.
7. Simulate a fresh-agent handoff: follow the README and session guide without relying on the current conversation, check that referenced files/commands exist, and distinguish tested Codex/Cursor discovery from structure-based confidence. Do not claim that an arbitrary agent or a full client session was verified unless it was.
