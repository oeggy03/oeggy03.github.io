# Repository agent workflow

This handbook defines the role handoffs and operating steps for work in this portfolio repository. [`AGENTS.md`](../AGENTS.md) is the concise always-on policy. Native agent files and shared skills point here rather than maintaining competing copies.

## Roles

| Role | Model target | Responsibility |
| --- | --- | --- |
| Coordinator | `gpt-6.1-sol`, High | Clarify intent from context, inspect and plan, settle scope/files/acceptance/TODOs, assign implementation, review results, and coordinate verification or authorized delivery. May read, run QA, and perform Git delivery; does not implement application, docs, fixes, or configuration changes. |
| Developer | `gpt-6-luna`, XHigh | Implement the settled task directly in the assigned files, report changes and verification, and do not delegate again unless the owner explicitly asks. Do not commit/push/open a PR unless the user authorized delivery. |
| Verifier | `gpt-6-luna`, XHigh | Independently check the scoped implementation against acceptance criteria, run only authorized checks, and report evidence and gaps. May write specifically assigned QA artifacts without weakening or skipping application checks. Route implementation fixes through the developer. |
| Reviewer | `gpt-6.1-sol`, High | Read-only inspection of the diff and artifacts; report actionable findings. Never edit files. |

These are model targets, not proof of client enforcement. If a target or required reasoning variant cannot be selected in the client, follow the explicit client guidance in [`AGENTS.md`](../AGENTS.md) and the adapter files. Do not claim an unavailable model ran.

## Standard task flow

1. Read `AGENTS.md`, this handbook, relevant source, and the existing scripts/tests before making a plan. The required targets are coordinator/reviewer `gpt-6.1-sol` High and developer/verifier `gpt-6-luna` XHigh.
2. The coordinator states the user outcome, in-scope files, acceptance criteria, constraints, and TODOs. Resolve scope questions from repository facts and the user's stated preferences first.
3. Assign actual app, docs, fix, and config edits to the Luna developer only after that scope is settled. The developer implements directly and does not delegate again unless the owner explicitly asks. If parallel writers are explicitly requested, give each a disjoint file set; a single writer owns shared files and overlapping integration work.
4. The developer implements the assigned scope and reports exact files changed, decisions, commands run, results, and unverified items.
5. The coordinator checks the diff and acceptance criteria. The verifier independently checks requested or authorized behavior. Send corrections back to the developer, then repeat the relevant checks.
6. Commit, push, or create a PR only when the user authorized that delivery. Never merge or deploy without authorization.

## Handoff template

```text
Task:
Scope / out of scope:
Files to edit:
Acceptance criteria:
Constraints and applicable guidance:
TODOs / settled decisions:
Authorized verification:
Expected result report:
```

Do not hand off an unresolved product decision as an implementation detail. Keep parallel write assignments disjoint and name the owner for shared integration.

## Branches and commits

- Begin a feature on a branch from fresh `main`, unless the user explicitly requests continuing existing work or the developer is working on the coordinator-owned feature branch. Keep follow-ups for that feature on the same branch. If it has merged, begin a fresh branch.
- Make focused commits for actual logical steps using appropriate `feat`, `fix`, `test`, or `docs` labels. Do not create one commit per file, split a single logical step just to increase commit count, create empty commits, or rewrite/squash user history.
- The coordinator may read and run permitted checks, inspect diffs, and handle authorized Git delivery. The developer does not commit/push/open a PR without authorization.
- A merge to `main` starts the existing deployment workflow. Do not merge or manually deploy without the user's explicit authorization.

## Skills and file map

Use the one shared skill copy under `.agents/skills/`; do not add a duplicate under `.cursor/skills/`.

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Always-on project and role guidance |
| `docs/agent-workflow.md` | Role contracts, handoffs, tools, and verification |
| `.agents/skills/portfolio-feature/SKILL.md` | Scope, delegate, review, and fix a feature |
| `.agents/skills/portfolio-verify/SKILL.md` | Verify website behavior and report evidence |
| `.agents/skills/portfolio-pr/SKILL.md` | User-authorized commit, push, and PR delivery |
| `.codex/config.toml`, `.codex/agents/*.toml` | Codex defaults and role agents |
| `.cursor/rules/repository.mdc`, `.cursor/agents/*.md` | Cursor adapters for repository rules and roles |
| `.github/pull_request_template.md` | PR summary, actual verification, and relevant visual evidence |

Skills are focused workflows, not catch-all policies. Follow `AGENTS.md` and this handbook if a skill is silent; current user instructions take precedence.

## Project structure and tools

The site uses React 18, Vite 4, Tailwind CSS 3, JavaScript/JSX ES modules, Node.js, and npm. CI uses Node 22. Do not start or test a TypeScript migration unless the user asks.

| Area | Location |
| --- | --- |
| Portfolio content data | `src/data/portfolio.js` |
| Four routed views | `src/views/` |
| Shared shell and interface/content components | `src/components/layout/`, `src/components/ui/`, `src/components/content/` |
| Clean route and history behavior | `src/navigation/`, `src/App.jsx` |
| Browser entry and Tailwind source | `src/main.jsx`, `src/tailwind.css`, `tailwind.config.js` |
| Static route generation and server render | `index.html`, `scripts/build.mjs`, `vite.config.js` |
| Public metadata, domain, social image, and GitHub Pages marker | `public/` |
| Resume source and generated outputs | `docs/resume.html`, `src/assets/Resume_TranHaThu.pdf`, `docs/screenshots/resume-preview.png` |
| CI checks and deployment | `.github/workflows/`, `scripts/check-*.mjs` |

## Client setup and skill discovery

- In Codex, trust the project and open a new session or reload for project defaults to apply. Current hosted chats do not acquire changed project settings retroactively.
- In Cursor, select the parent `gpt-6.1-sol` High target in the model picker. Before writing, confirm the selected worker is `gpt-6-luna` with XHigh reasoning. Reasoning controls are account/client-specific; do not invent agent-file parameters to set them.
- Keep one shared skill copy in `.agents/skills/`; Codex and Cursor discover this shared directory automatically. Use `$portfolio-feature`, `$portfolio-verify`, or `$portfolio-pr` in Codex; use the corresponding `/portfolio-feature`, `/portfolio-verify`, or `/portfolio-pr` discovery in Cursor.

## Website verification

For website changes, use existing checks when authorized or requested. The portable commands are `npm run lint`, `npm run build`, `npm run check:seo`, and `npm run check:ui`; use `npm.cmd` in Windows PowerShell. The UI script reads as the source of coverage: it exercises direct loading and refresh for all ten routes, legacy-hash hydration, Back/Forward reading-position restoration, project filters and links, keyboard focus, 11 viewport sizes, mobile social/navigation targets, no-JavaScript content, local asset requests, and eight axe scans across desktop and mobile. Do not claim broader coverage than the script provides or weaken/skip frontend tests.

Use Windows `npm.cmd` commands in PowerShell. A local preview can be served with:

```powershell
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Set `BROWSER_EXECUTABLE_PATH` when Playwright should use a non-default Chrome or Edge executable. Set `PORTFOLIO_BASE_URL` when the preview is at a different address. If the static host has no SPA fallback, use a Python static server to inspect the actual generated direct paths instead of assuming the Vite preview has production fallback behavior.

### Screenshots and social card

- `node scripts/capture-screenshots.mjs` captures screenshots and updates `public/social-preview.png`.
- `node scripts/capture-screenshots.mjs --screenshots-only` updates final screenshots and leaves the social card unchanged.
- `node scripts/capture-screenshots.mjs --social-only` updates only the social card.
- `node scripts/capture-screenshots.mjs --review-only` stores temporary review captures under ignored `node_modules/.cache/`.
- The screenshot-only command is for final evidence and does not update the social card. If the social card is changing, finalize that asset before building the final site artifact so the build contains the finished image.
- Finalize PDF and social-card assets before the production build; do not change them during Vite client or prerender steps, because hashed filenames can diverge.

Capture real application states at the relevant routes and viewport sizes. A screenshot is not proof for behavior it does not show. Do not claim physical-device or manual screen-reader checks unless they were actually done.

### Resume generation

The source is `docs/resume.html`. Run `node scripts/generate-resume.mjs` when resume synchronization is requested. It writes `src/assets/Resume_TranHaThu.pdf` and the single preview `docs/screenshots/resume-preview.png`; it verifies exactly two PDF pages and checks the PDF links against the source URL count and destinations. Keep confirmed facts in the HTML and `src/data/portfolio.js` synchronized.

## Documentation and configuration changes

For docs/config-only tasks, validate changed Markdown links/frontmatter and parse TOML/YAML where a local parser is available. Do not run app tests or builds for documentation-only work unless the user requested them. Never change sandbox, approval, network, or MCP settings as part of model-role configuration.

## Client documentation

Use official references for client behavior: [Codex project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Cursor rules](https://cursor.com/docs/rules), [Cursor skills](https://cursor.com/docs/skills), and [Cursor subagents](https://cursor.com/docs/subagents). Client features can change; verify availability in the configured client rather than treating repository text as enforcement.

## Git ownership errors

Do not add a global `safe.directory` entry. If Git reports the trusted-repository ownership warning, retry only the affected command with a per-command setting such as:

```powershell
git -c safe.directory=C:/path/to/repository status --short --branch
```

Do not check personal absolute host paths into repository configuration.
