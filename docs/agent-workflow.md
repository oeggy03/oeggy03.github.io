# Agent workflow

This handbook defines the handoffs, checks, and delivery boundaries for work in this repository. [`AGENTS.md`](../AGENTS.md) is the concise always-loaded policy. Read the [project guide](project-guide.md) for architecture and the [design and content guide](design-content-guide.md) for user-facing work.

## Roles and model targets

| Role | Required target | Responsibility |
| --- | --- | --- |
| Coordinator | `gpt-6.1-sol`, High | Resolve intent from context, inspect and plan, settle files/acceptance/TODOs, assign implementation, review, and coordinate verification or authorized delivery. May inspect, run authorized QA, and handle authorized Git delivery; does not implement app, docs, fixes, or configuration edits. |
| Developer | `gpt-6-luna`, XHigh | Implement only the settled assigned scope, report exact changes and checks, and do not delegate again unless the owner explicitly asks. Do not commit, push, or open a PR without explicit authorization. |
| Verifier | `gpt-6-luna`, XHigh | Independently check the scoped result against acceptance criteria and report evidence and gaps. May write specifically assigned QA artifacts; never weaken or skip app checks. Route implementation fixes through the developer. |
| Reviewer | `gpt-6.1-sol`, High | Read-only review of the diff and artifacts; report actionable findings and do not edit files. |

These are required targets, not proof of client enforcement. The owner/client must select and confirm the appropriate model and reasoning variant. If a required target cannot be selected and no fallback was authorized, stop edits and report the client limitation. Do not substitute another model and claim the required role ran.

## Task handoff

1. The coordinator reads `AGENTS.md`, this handbook, relevant source, and existing checks; records the requested outcome, scope, acceptance criteria, constraints, and settled decisions.
2. The coordinator assigns actual application, documentation, fix, or configuration edits to the configured developer only after scope is settled. The developer implements directly and does not delegate again unless the owner explicitly asks.
3. The developer reports exact files, decisions, commands run, outcomes, and limits. The coordinator checks the result against acceptance criteria.
4. The verifier independently checks assigned criteria. Route implementation gaps back through the developer and repeat relevant verification. The reviewer remains read-only.
5. Do not commit, push, open a PR, merge, or deploy except within the authorization boundaries below. Current owner instructions take precedence over this handbook.

For new work, start from a fresh `main` feature branch unless the owner requests continuing an existing branch or the developer is working on the coordinator-owned feature branch. Follow-ups for the same feature stay on that branch; after merge, start fresh. Make focused commits for real logical steps when delivery is authorized; do not split one step artificially, create empty commits, or rewrite/squash history.

### Handoff template

```text
Task:
Scope / out of scope:
Files to edit:
Acceptance criteria:
Constraints and applicable guidance:
Settled decisions / TODOs:
Authorized verification:
Expected result report:
```

Do not hand off unresolved product decisions as implementation details. Keep parallel write scopes disjoint and name a single owner for shared integration.

## GitHub CI completion after authorized delivery

This loop is mandatory after an authorized push or PR creation/update. Apply it to harness work as well as site work.

1. Record the exact full commit SHA at the pushed branch or PR head. Inspect the GitHub Actions runs and all other applicable checks attached to that exact SHA.
2. Wait until those checks finish and inspect their final status. On a PR, the `verify` job is expected; the `deploy` job is expected to be skipped because the workflow deploys only on `main` pushes and manual runs.
3. If an applicable check fails, inspect its logs, identify the cause, make the appropriate fix, run relevant local checks, and push only if that fix is authorized. Restart the loop using the new exact SHA.
4. Repeat until every applicable check for the latest SHA succeeds or a genuine external blocker prevents completion. For missing permission, secret, third-party outage, inaccessible logs, or other external failure, state the blocker and exact next step. Do not change checks to hide a failure or report success while checks are pending, unexpectedly skipped, inaccessible, or failing.
5. Report the latest exact SHA and final check results. A passing older SHA does not establish the status of a newer push.

The repository workflow `.github/workflows/deploy-pages.yml` runs `verify` for PRs to `main`. It runs `deploy` after successful verification only for a push to `main` or a manual `main` run. The repository does not expose branch-protection configuration, so whether GitHub requires a check before merge is unknown. Never merge or deploy without explicit owner authorization; merge to `main` triggers deployment.

## Skills and repository map

Maintain one shared copy of project skills in `.agents/skills/`. Codex and Cursor discover this repository directory, so do not create a duplicate `.cursor/skills/` tree.

| Skill | Use for |
| --- | --- |
| `.agents/skills/portfolio-feature/SKILL.md` | Scope, implement, review, and route fixes for a feature |
| `.agents/skills/portfolio-verify/SKILL.md` | Independent website, route, accessibility, and docs verification |
| `.agents/skills/portfolio-pr/SKILL.md` | User-authorized commit, push, and PR delivery |
| `.agents/skills/portfolio-ci/SKILL.md` | Diagnose and complete checks for an exact GitHub commit SHA |
| `.agents/skills/portfolio-harness/SKILL.md` | Maintain shared instructions, skills, and portable setup |

Other useful files: `.codex/config.toml` and `.codex/agents/*.toml` provide Codex defaults/role agents; `.cursor/rules/repository.mdc` and `.cursor/agents/*.md` are Cursor adapters. Use `docs/agent-start.md` for a new clone, client reload, and the unverified generic adapter template. The optional Apple design-review skill is not required for repository setup.

## Website verification

The site is React 18, Vite 4, Tailwind CSS 3, JavaScript/JSX, Node.js, and npm. Use Node.js 22 to match CI. The existing project commands are:

| Command | What it checks |
| --- | --- |
| `npm run lint` | ESLint on JavaScript/JSX; zero warnings allowed |
| `npm run build` | Vite browser build, build-time React rendering, eleven canonical route files, `/experience/` compatibility page, and generated sitemap |
| `npm run check:seo` | Route metadata, canonical/social URLs, JSON-LD, supplied route/content expectations, sitemap, domain markers, local links and assets |
| `npm run check:ui` | Playwright browser, route, interaction, layout, and axe checks against a built preview |

There is no separate `npm test` or type-check script. Use only the existing commands appropriate to the change. For docs/config-only work, validate changed Markdown, frontmatter, links, TOML/YAML as applicable, and harness checks when in scope; do not run app checks unless asked. Never weaken or skip frontend checks to make a change pass.

`scripts/check-ui.mjs` is the source of truth for browser coverage. It checks eleven canonical routes and the `/experience/` compatibility route, legacy hash migration, history and in-page anchor behavior, project filtering and links, keyboard focus, no-JavaScript content, an 11-viewport layout matrix, 200% text cases, touch targets, reduced motion, local asset requests, and axe scans on the three views plus FoROOM, OpenClaw, and Chinese Learning at desktop/mobile sizes. It also scans expanded Experience in light and dark desktop/mobile states and checks runtime errors. Read the script before making any stronger claim. External request failures are reported as unavailable; the check does not verify the destination sites.

Typical local verification from the repository root:

```sh
npm ci
npm run lint
npm run build
npm run check:seo
```

On a fresh clone, install the browser before UI checks or screenshot capture with `npx playwright install chromium`. On Linux, if required system libraries are missing, use `npx playwright install --with-deps chromium`. Alternatively, set `BROWSER_EXECUTABLE_PATH` to an installed Chrome, Edge, or Chromium executable.

For UI checks, run `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` in a second terminal after the build, then run `npm run check:ui` in another. The browser scripts read `PORTFOLIO_BASE_URL` as their target origin (default `http://127.0.0.1:4173/`); it does not configure Vite preview. Set preview host/port with Vite's CLI flags, and set `PORTFOLIO_BASE_URL` separately if the scripts should target another origin. Use a static server returning 404 for missing files when verifying actual GitHub Pages direct paths; do not assume SPA fallback behavior from Vite preview. On Windows PowerShell, use `npm.cmd` where required by execution policy.

Screenshots are real browser captures, not generated mockups. `node scripts/capture-screenshots.mjs --screenshots-only` refreshes site captures without updating the social card; the default also updates `public/social-preview.png`. `--review-only` writes temporary review captures under ignored `node_modules/.cache/`, and `--social-only` changes only the social card. Current captures represent the Experience landing, Projects, Skills, TeleAI, and two long-form case studies plus selected disclosure, dark, and scrolled states; they do not cover every project detail route. Read `scripts/capture-screenshots.mjs` before describing coverage.

For any website behavior or visual change in a PR, embed relevant real desktop and mobile screenshots of affected routes/states, commit the captures with that PR, and identify them by immutable full SHA. A screenshot is evidence only for the state it shows. Do not claim physical-device or manual screen-reader checks unless performed. For docs/config-only PRs, state that screenshots are not applicable because no website behavior changed.

### Resume and social-card generation

`docs/resume.html` is the resume source. When resume synchronization is requested, run `node scripts/generate-resume.mjs`; it writes the PDF and preview and validates two pages plus source link destinations. `node scripts/capture-screenshots.mjs` updates site screenshots and the social card; use `--screenshots-only` when the card should remain unchanged. Finalize the resume and social-card assets before the production build.

## Fresh setup and official client documentation

On a new clone, run `npm ci`, `npm run setup:agents`, `npm run check:harness`, and `npm run test:harness`; then start `npm run dev`. See [Fresh agent session](agent-start.md) for client reload behavior and the generic adapter command.

- [Codex project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Cursor rules](https://cursor.com/docs/rules)
- [Cursor skills](https://cursor.com/docs/skills)
- [Cursor subagents](https://cursor.com/docs/subagents)

Check the official client docs and actual client discovery if conventions change. Repository files cannot enforce model selection, reasoning level, sandbox, approval, or global settings.
