# Fresh agent session

Use this checklist after cloning the repository or opening a new Codex/Cursor conversation. The repository is the durable source of project context; no private conversation is required to understand the product.

## New clone

1. Install Node.js 22 and npm to match GitHub Actions.
2. From the repository root, install dependencies and configure the local agent harness:

   ```sh
   npm ci
   npm run setup:agents
   npm run check:harness
   npm run test:harness
   ```

   `npm run setup:agents` is a read-only doctor by default. Use `npm run setup:agents -- --write` only when missing first-party Codex or Cursor adapter files should be created; it creates missing files and never overwrites existing configuration. The harness checks inspect the current setup and shared skills. An optional Apple design-review skill may exist in a local working tree, but it is not required by this repository.

3. Open the repository root in Codex or Cursor. Start a fresh session or reload if you just changed the configuration; existing conversations may not pick up updated project defaults.
4. Run the site with `npm run dev`. Use `npm run lint`, `npm run build`, and `npm run check:seo` for the corresponding checks. Before UI checks or screenshot capture on a fresh clone, install Chromium with `npx playwright install chromium`; on Linux, use `npx playwright install --with-deps chromium` if system libraries are missing. Alternatively, set `BROWSER_EXECUTABLE_PATH` to an installed browser. For browser checks, build and serve the production output, then run `npm run check:ui` from another terminal. See [website verification](agent-workflow.md#website-verification).

On Windows PowerShell, use `npm.cmd` if the npm shim is blocked by script policy. Do not install a global agent configuration as part of this setup.

## Start a task

Read, in this order:

1. [`AGENTS.md`](../AGENTS.md) for always-on product and delivery constraints.
2. [`docs/project-guide.md`](project-guide.md) for architecture, routes, data, scripts, and change recipes.
3. [`docs/design-content-guide.md`](design-content-guide.md) for confirmed directions and evidence-based visual patterns when a user-facing change is involved.
4. [`docs/agent-workflow.md`](agent-workflow.md) for role targets, task handoffs, authorized checks, and post-push CI completion.
5. The relevant skill under `.agents/skills/`, if one applies. Skills are shared at repository level and are automatically discovered by current Codex and Cursor clients.

Then inspect the relevant code and existing checks. Do not assume this repository contains an API server, a type checker, or a conventional unit-test suite: the current site is static, and its existing checks are lint, static build, SEO/content assertions, and Playwright browser/accessibility checks.

## Codex and Cursor

This repository keeps concise instructions in root `AGENTS.md`, client configuration in `.codex/` and `.cursor/`, and one maintained copy of each project workflow in `.agents/skills/`. Codex reads project `AGENTS.md` files and discovers skills in repository `.agents/skills/`; Cursor supports root instructions and discovers skills from both `.agents/skills/` and `.cursor/skills/`. There is no duplicate skill tree to synchronize.

The requested role model targets are coordinator/reviewer `gpt-6.1-sol` at High and developer/verifier `gpt-6-luna` at XHigh. Configuration files can name a model target where supported, but they cannot guarantee a model or reasoning variant is available in a particular client. Select and confirm the target in the client before writing. If it is unavailable and no fallback was authorized, stop edits and report that limit.

Codex project settings are read from trusted configuration in a new session or reload. Cursor may surface project rules and skills after reopening/reloading the workspace. Inspect the actual client if a discovery action is unavailable; do not claim client behavior was tested merely from file presence.

## Adapting another agent

The setup tool's generic adapter is a **manual template**, not a verified integration or a claim of support for an arbitrary agent. Supply a repository-relative Markdown adapter, agent name, and official instruction/skill documentation URL. Generic adapter preview is the default; review the output, then opt in to writing:

```sh
npm run setup:agents -- --adapter <relative.md> --agent-name <name> --docs-url <https URL>
npm run setup:agents -- --adapter <relative.md> --agent-name <name> --docs-url <https URL> --write
```

The setup tool must preserve existing files and must not silently overwrite user-specific configuration. Review the generated adapter against the named agent's current official docs and test discovery in that client before describing it as supported. Keep the adapter repository-relative and free of machine-specific paths.

## Official client references

- [Codex project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Cursor rules](https://cursor.com/docs/rules)
- [Cursor skills](https://cursor.com/docs/skills)
- [Cursor subagents](https://cursor.com/docs/subagents)
