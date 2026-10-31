---
name: portfolio-verify
description: Verify portfolio routes, interactions, accessibility checks, screenshots, and documentation/configuration changes with evidence from existing project tools.
---

# Portfolio verification

Use with [`AGENTS.md`](../../../AGENTS.md), the [project guide](../../../docs/project-guide.md), and the [agent workflow](../../../docs/agent-workflow.md). Check agreed criteria independently; write QA artifacts only when specifically assigned. Send implementation gaps or fixes through the configured developer, and never weaken or skip app checks.

## Website behavior

- Read `scripts/check-ui.mjs` before summarizing browser-test coverage. When authorized or requested, use the existing lint, build, SEO, and UI commands without weakening or skipping checks.
- Inspect generated direct route files and verify direct paths/refreshes, history navigation, keyboard operation, no-JavaScript real anchors, mobile overflow and touch targets, and route metadata when relevant to the change.
- Use the static generated route paths; do not rely on an SPA fallback. Where useful, serve the built static files with Python to check the real direct paths.
- Capture real production-route screenshots for relevant UI states. The normal screenshot command also changes the social card; use `--screenshots-only` for final screenshots when the card must stay fixed. If the card is changing, finalize it before the final build.
- Current UI coverage includes an 11-viewport layout matrix, 12 axe scans across the three views plus FoROOM, OpenClaw, and Chinese Learning at desktop/mobile sizes, and four additional expanded-Experience scans across light/dark and desktop/mobile. Read the current script before describing coverage; do not claim a manual screen-reader audit or physical-device coverage without performing it.

## Docs and configuration

For docs/config-only changes, check Markdown links and skill frontmatter, run the harness checks in scope, and parse TOML/YAML if a local static parser is available. Do not run app tests or builds unless requested. Report parser availability and any checks not run.

## Evidence

Record the exact commands, result, routes/viewports covered, and limits. A passing automated check does not prove visual correctness or behavior beyond the cases it exercised.
