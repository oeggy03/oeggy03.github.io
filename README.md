# Tran Ha Thu | Portfolio

Personal portfolio for backend and software engineering, with experience, projects, skills, and contact links.

- **Website:** <https://www.tranhathu.com/>
- **Source:** <https://github.com/oeggy03/oeggy03.github.io>

## Start here

- [Repository instructions](AGENTS.md)
- [Project guide and code map](docs/project-guide.md)
- [Design and content guide](docs/design-content-guide.md)
- [Fresh agent session and setup](docs/agent-start.md)
- [Agent workflow and GitHub CI](docs/agent-workflow.md)
- [Deployment and DNS](docs/deployment.md)

## Stack and site structure

The site uses React 18, Vite 4, Tailwind CSS 3, JavaScript/JSX ES modules, Node.js, and npm. The build prerenders real HTML route files for GitHub Pages; there is no application backend or runtime API.

The default views are Experience (`/`), Projects (`/projects/`), and Skills (`/skills/`). Projects includes eight project routes and the Experience route retains `/experience/` as a compatibility path. See the [project guide](docs/project-guide.md) for architecture, route behavior, and change recipes.

## New clone

Use Node.js 22 to match CI. Install dependencies, run the safe repository-local agent setup and its checks, then start the site:

```sh
npm ci
npm run setup:agents
npm run check:harness
npm run test:harness
npm run dev
```

`npm run setup:agents` is a read-only doctor by default; add `-- --write` only to create missing first-party Codex/Cursor adapter files. It never overwrites existing files. On Windows PowerShell, use `npm.cmd` if the npm shim is blocked by script policy. Codex and Cursor discover skills from the same `.agents/skills/` directory. Other-agent adaptation is a preview-first manual template; it is not a verified integration. See [agent setup](docs/agent-start.md).

## Site checks

The existing application checks are lint, static build, SEO assertions, and Playwright browser/accessibility checks. There is no separate `npm test` or type-check command.

```sh
npm run lint
npm run build
npm run check:seo
```

Run the production preview in one terminal and the UI check in another:

```sh
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
npm run check:ui
```

Fresh clones need a Playwright browser for UI checks and screenshot capture: run `npx playwright install chromium` after `npm ci` (on Linux, add `--with-deps` if system libraries are missing). You can use an installed browser by setting `BROWSER_EXECUTABLE_PATH`. The UI and screenshot scripts read `PORTFOLIO_BASE_URL` to choose their target origin; configure Vite preview itself with its `--host` and `--port` flags. Review details in [website verification](docs/agent-workflow.md#website-verification).

## Content and resume

Portfolio facts and project records live in `src/data/portfolio.js`; the two featured case studies are in `src/data/featured-projects.js`. `docs/resume.html` is the resume source. When resume synchronization is requested, run `node scripts/generate-resume.mjs` to update the PDF and single preview image.

## Deployment

GitHub Actions verifies PRs targeting `main`. A verified push to `main` or manual workflow dispatch from `main` deploys the same `dist/` artifact to GitHub Pages. PR deployment is expected to be skipped. Do not merge or deploy without explicit owner authorization; see the [workflow](docs/agent-workflow.md#github-ci-completion-after-authorized-delivery) and [deployment guide](docs/deployment.md).
