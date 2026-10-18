---
name: portfolio-verify
description: Verify portfolio routes, interactions, accessibility checks, screenshots, and documentation/configuration changes with evidence from existing project tools.
---

# Portfolio verification

Use with [`AGENTS.md`](../../../AGENTS.md) and [`docs/agent-workflow.md`](../../../docs/agent-workflow.md). Check the agreed acceptance criteria independently; write QA artifacts only when specifically assigned. Send implementation gaps or fixes through the configured developer, and never weaken or skip app checks.

## Website behavior

- Read `scripts/check-ui.mjs` before summarizing browser-test coverage. When authorized or requested, use the existing lint, build, SEO, and UI commands without weakening or skipping checks.
- Inspect generated direct route files and verify direct paths/refreshes, history navigation, keyboard operation, no-JavaScript real anchors, mobile overflow and touch targets, and route metadata when relevant to the change.
- Use the static generated route paths; do not rely on an SPA fallback. Where useful, serve the built static files with Python to check the real direct paths.
- Capture real production-route screenshots for relevant UI states. The normal screenshot command also changes the social card; use `--screenshots-only` for final screenshots when the card must stay fixed. If the card is changing, finalize it before the final build.
- Existing browser UI coverage is 11 viewport sizes and eight axe scans; confirm details from the script. Do not claim a manual screen-reader audit or physical-device coverage without performing it.

## Docs and configuration

For docs/config-only changes, check Markdown links and skill frontmatter and parse TOML/YAML if a local static parser is available. Do not run app tests or builds unless requested. Report parser availability and any checks not run.

## Evidence

Record the exact commands, result, routes/viewports covered, and limits. A passing automated check does not prove visual correctness or behavior beyond the cases it exercised.
