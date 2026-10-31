# Portfolio repository instructions

This repository is a public backend and software engineering portfolio built with React, Vite, Tailwind, and static GitHub Pages output. Start with the [project guide](docs/project-guide.md), [design and content guide](docs/design-content-guide.md), [agent workflow](docs/agent-workflow.md), and [fresh-session guide](docs/agent-start.md) for detailed context.

## Core rules

- The default site has three views: Experience (`/`), Projects (`/projects/`), and Skills (`/skills/`). Contact links live in the shared shell. There is no About or Contact view unless the owner explicitly asks to change the structure.
- Experience contains the profile, current role, latest-first work history with earlier roles in a native disclosure, education, interests, and only the two owner-approved featured projects. Projects retains all other project details; Skills retains the supplied skill set.
- Preserve supplied facts, roles, projects, dates, links, and assets. Do not invent claims or add rejected presentation such as an active red status dot, country taglines, an expertise strip, or awkward availability copy.
- Follow existing React functional components, JavaScript/JSX ES modules, Tailwind utilities, separate data modules, and accessible patterns. Preserve clean direct routes, static prerendered content, no-JavaScript anchors, keyboard/focus behavior, reduced-motion support, and 44px targets. Do not add a bespoke stylesheet, backend, or runtime server rendering.
- Update the relevant guide or skill when a change makes it inaccurate. Keep `src/data/portfolio.js`, `docs/resume.html`, and the generated resume PDF synchronized when resume updates are requested; HTML is the resume source.
- Do not check in generated `dist/` output unless explicitly requested. Do not set global Git `safe.directory`; use a per-command setting only if the repository reports an ownership error.

## Workflow and delivery

- Required targets: coordinator/reviewer `gpt-6.1-sol` at High; developer/verifier `gpt-6-luna` at XHigh. These targets cannot be enforced by Markdown. Follow the client-selection limits in the [agent workflow](docs/agent-workflow.md); do not claim a target ran when it could not be selected.
- The coordinator settles scope and assigns edits. The developer implements only the assigned scope and does not delegate again unless the owner asks. The verifier independently checks assigned criteria; the reviewer is read-only.
- Follow the branch and CI policies in the [agent workflow](docs/agent-workflow.md). Push, create a PR, or commit only with explicit authorization. Never merge or deploy without explicit authorization; merging to `main` triggers deployment.
- For website changes, use existing checks when authorized or requested. For docs/config-only work, validate the edited documents and setup checks without running application checks unless requested.

## Shared agent resources

- Shared skills live in `.agents/skills/` and are discoverable by Codex and Cursor. See the workflow handbook for the current skill index and the [harness maintenance skill](.agents/skills/portfolio-harness/SKILL.md) before changing agent setup.
- On a new clone, use `npm run setup:agents`, then `npm run check:harness` and `npm run test:harness`. Install the site dependencies with `npm ci`; use Node.js 22 to match CI.
- The [README](README.md) is the entry point. Detailed project, design, session, deployment, and workflow references are linked there.
