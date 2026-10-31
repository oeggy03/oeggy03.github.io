# Project guide

This is a public recruiter portfolio for backend and software engineering work. The site is a static React application hosted on GitHub Pages. It has no application backend or runtime API; `scripts/build.mjs` uses Vite for the browser bundle and a build-time React render to write real HTML files for each clean route.

For a new clone or conversation, start with [AGENTS.md](../AGENTS.md), then use this guide for the code map and the [design and content guide](design-content-guide.md) for visual and editorial decisions. The [agent workflow](agent-workflow.md) covers role handoffs, checks, GitHub CI, and client setup.

## Routes and user journeys

| Route | Page |
| --- | --- |
| `/` | Experience: profile, current role, work history, education, interests, and two featured projects |
| `/projects/` | All eight projects, category filters, and project details |
| `/skills/` | Supplied skills grouped with links to example projects |
| `/projects/foroom/`, `/projects/buddy4good/`, `/projects/eggbot/`, `/projects/teleai/`, `/projects/foodhero/`, `/projects/portfolio/`, `/projects/openclaw/`, `/projects/chinese-learning/` | Eight direct project routes; OpenClaw and Chinese Learning have long-form case studies |

These are eleven canonical routes. The old `/experience/` path is generated as a compatibility page for the Experience landing. The route resolver also migrates recognized legacy hashes to clean section or project routes. In-page and skip links remain native anchors. Preserve direct load and refresh without relying on a single-page-app server fallback.

The normal path through the site is the Experience profile and timeline, with links to the project index or skills. The shared header keeps section navigation, email, GitHub, LinkedIn, and the resume available. Project filters update the visible cards, and selecting a project uses its own clean route.

## Architecture and code map

| Concern | Location | Notes |
| --- | --- | --- |
| App composition and three views | `src/App.jsx`, `src/views/` | Experience, Projects, Skills; each view is a functional component |
| Shared header, footer, and route shell | `src/components/layout/PortfolioShell.jsx` | Holds section navigation and contact actions |
| Reusable UI primitives | `src/components/ui/` | Buttons, panels, headings, and shared styles via Tailwind classes |
| Content components | `src/components/content/` | Work timeline, project index/details, and featured case-study cards |
| Portfolio source data | `src/data/portfolio.js` | Profile, work history, eight project records, skills, and existing links |
| Featured case-study data | `src/data/featured-projects.js` | The two featured project records, images, and detailed story content |
| Route resolution and history | `src/navigation/` | `routes.js`, fragment aliases, React context/provider, and clean path navigation |
| Browser entry and styles | `src/main.jsx`, `src/tailwind.css`, `tailwind.config.js` | React hydration, Tailwind directives, color tokens, and system font stacks |
| HTML template and static metadata | `index.html`, `public/` | Base metadata, robots policy, social image, custom domain, and Pages marker |
| Static rendering and sitemap | `scripts/build.mjs` | Builds assets, renders canonical and compatibility pages, and writes `dist/sitemap.xml` |
| Quality checks | `scripts/check-ui.mjs`, `scripts/check-seo.mjs`, ESLint config | Browser behavior/accessibility and static metadata/assets; see [verification](agent-workflow.md#website-verification) |
| GitHub Pages CI | `.github/workflows/deploy-pages.yml` | Verify on PRs to `main`; deploy the verified artifact only on `main` pushes or manual main runs |
| Resume source and generated files | `docs/resume.html`, `src/assets/Resume_TranHaThu.pdf`, `docs/screenshots/resume-preview.png` | The HTML is authoritative; `scripts/generate-resume.mjs` writes the PDF and preview |

All website styles are Tailwind utilities in JSX plus the theme in `tailwind.config.js`; `src/tailwind.css` only contains Tailwind directives. Avoid a parallel handwritten site stylesheet. Most imagery is stored in `src/assets/` and imported by the data or view modules. The app itself makes no required remote API calls.

## Common change recipes

### Edit profile, work, projects, or skills

- Update the relevant record in `src/data/portfolio.js`; keep the current profile, eight supplied projects, supplied roles, skills, and links intact unless the owner requests a content change.
- Work history is rendered by `src/components/content/ExperienceTimeline.jsx`. Keep the current position first, completed roles latest by end date, and earlier roles in the native `<details>` disclosure.
- Only the two currently owner-approved featured projects are on Experience. Their longer descriptions and screenshots belong in `src/data/featured-projects.js`; the remaining six project records stay in Projects.
- When adding a project route, update the project ID allow-list and route generation in `src/navigation/routes.js`, the expected route/content lists in `scripts/check-seo.mjs` and `scripts/check-ui.mjs`, and the static screenshot coverage where useful. Confirm a generated `dist/projects/<id>/index.html` and refresh behavior.
- Use supplied facts and approved assets only. Do not derive achievements, impact metrics, dates, credentials, image claims, or destinations from assumptions.

### Change a view, component, or responsive behavior

- Start in `src/views/` for a page-level change and `src/components/` for a shared interface or content pattern.
- Keep data separate where the current app does so. Keep buttons/links semantic and named, focus visible, motion reduced when requested, and pointer targets at least 44px.
- Check route entry, navigation, browser Back/Forward, and affected mobile/desktop layouts. The automated UI check has an 11-viewport matrix and additional 200% text, keyboard, motion, no-JavaScript, and axe cases; inspect the script before claiming its full scope.

### Change routing or metadata

- Update `src/navigation/routes.js` and `src/navigation/fragment-aliases.js` for route behavior. Keep section/project links as real clean paths and preserve legacy hash migration.
- Update the page metadata path (`index.html`, route metadata in the app, and `scripts/build.mjs` as appropriate). Keep canonical/social URLs, ProfilePage JSON-LD, `robots.txt`, generated sitemap, `public/CNAME`, and `public/.nojekyll` aligned when the route set or site identity changes.
- The SEO checker contains expected route and fact assertions. Update its contract together with intended source changes instead of disabling assertions.

### Update the resume or visual assets

- Edit `docs/resume.html`; run `node scripts/generate-resume.mjs` when resume synchronization is requested. The script validates two PDF pages and source link destinations.
- Screenshots are made from the production build and preview. `node scripts/capture-screenshots.mjs --screenshots-only` updates the captured site states without rewriting `public/social-preview.png`; the default also refreshes the social card. `--review-only` writes temporary captures under ignored `node_modules/.cache/`; `--social-only` updates only the social card.
- The capture script covers the Experience landing (some legacy filenames still say `overview`), Projects, Skills, TeleAI, and the two long-form case studies, plus selected disclosure, dark appearance, and scrolled states. It does not make a screenshot of every project detail route. See the script before describing screenshot coverage.

## Setup and environment

Use Node.js 22 to match the GitHub Actions workflow and npm with the checked-in `package-lock.json`.

```sh
npm ci
npm run setup:agents
npm run check:harness
npm run test:harness
npm run dev
```

`npm run setup:agents` is a read-only doctor by default. Add `-- --write` to create missing first-party Codex/Cursor adapter files; existing files are kept unchanged. Codex/Cursor can use the shared `.agents/skills/` directory; configuration changes may require opening a new session or reloading the editor. See the [fresh-session guide](agent-start.md) for the manual, preview-first generic adapter template.

For site verification, the current package scripts are `npm run lint`, `npm run build`, `npm run check:seo`, and `npm run check:ui`. There is no separate `npm test` or type-check script. CI installs dependencies, installs Playwright Chromium, runs lint, build, SEO, and UI checks, then uploads the verified `dist/` artifact. On Windows PowerShell, use `npm.cmd` in place of `npm` if the execution policy blocks npm's shim.

Before running UI checks or capturing screenshots on a fresh clone, install Playwright's Chromium with `npx playwright install chromium`. On Linux, if required system libraries are missing, use `npx playwright install --with-deps chromium`. You can use an already installed Chrome, Edge, or Chromium instead by setting `BROWSER_EXECUTABLE_PATH` to its executable path.

The browser scripts use these optional environment variables:

| Variable | Purpose |
| --- | --- |
| `PORTFOLIO_BASE_URL` | Target origin read by the UI check and screenshot script; defaults to `http://127.0.0.1:4173/`. It does not configure or start Vite preview. |
| `BROWSER_EXECUTABLE_PATH` | Explicit Chrome/Edge/Chromium executable for the UI and capture scripts |
| `CHROME_PATH` | Explicit browser executable for resume PDF generation |

Start a production preview after the build, then run the UI check in a second terminal. Configure the preview server's host and port with Vite's CLI flags; separately set `PORTFOLIO_BASE_URL` if the scripts should target a different origin:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
npm run check:ui
```

Vite preview may apply development fallback behavior. To verify the static host's direct paths, serve the generated `dist/` directory with a static HTTP server that returns 404 for missing files.

## Deployment and repository limits

`.github/workflows/deploy-pages.yml` runs verification for PRs targeting `main`. The deploy job is expected to be skipped on PRs; it runs only after verification on a push to `main` or a manual run on `main`. Merging is a deployment boundary and requires explicit owner authorization. The repository does not contain branch-protection settings, so required-check enforcement cannot be inferred here.

The configured site is `https://www.tranhathu.com/`. See [deployment and DNS](deployment.md) for Pages settings and domain details. Historical redesign and QA notes remain as records, not current specifications: [design review](design-review.md), [redesign plan](redesign-plan.md), and [QA report](qa-report.md) are superseded by the current project/design/verification guides.
