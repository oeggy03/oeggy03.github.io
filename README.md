# Tran Ha Thu | Portfolio

Personal portfolio for backend and software engineering, projects, professional experience, education, skills, and contact details.

**Website:** <https://www.tranhathu.com/>

**Source:** <https://github.com/oeggy03/oeggy03.github.io>

## Stack

- React 18 and Vite 4, with Tailwind CSS 3 utilities.
- Static HTML prerendering for GitHub Pages, including direct files for each section and project route.
- System type with a restrained, appearance-aware color palette.
- Node.js and npm. Use `package-lock.json` with `npm ci` for a reproducible install.

## Local development

```sh
npm ci
npm run dev
```

## Agent workflow

Repository guidance for coding agents is in [`AGENTS.md`](AGENTS.md), with role handoffs and verification details in the [agent workflow handbook](docs/agent-workflow.md).

## Build and checks

```sh
npm run build
npm run check:seo
npm run lint
```

`npm run build` creates browser assets in `dist/`, then renders eleven canonical static pages: Experience, Projects, Skills, and all eight project details. It also generates the old `/experience/` address as a compatibility page with the complete Experience landing. Content remains available before JavaScript runs. Hydration adds clean-route navigation, native in-page anchor history, route restoration, client-side metadata, and project filtering. The browser build and server render use the same view components.

In-site navigation is coordinated by `src/navigation/`. Section links use `/`, `/projects/`, and `/skills/`; all eight projects have direct `/projects/<id>/` routes. Experience presents the profile and portrait, then a grouped row of native in-page links to work history, education, and featured projects below the full introduction. The current role and native disclosure for seven earlier roles follow. All role and case-study content remains in static HTML, and the disclosure and project links work without JavaScript. The header sticks only while its measured height fits comfortably in the viewport; at enlarged text sizes and short viewport heights it stays in document flow. Without JavaScript, it remains static. The old `/experience/` URL and legacy overview, about, contact, and experience hashes resolve to the Experience landing. Back/Forward restores route and anchor reading positions while keeping the document as the main scroll surface. A single responsive header keeps section navigation, social destinations, and the resume available while reading.

The CSS entry at `src/tailwind.css` contains Tailwind's three build directives. The production stylesheet is generated from class utilities and the theme in `tailwind.config.js`; the site does not maintain a separate bespoke stylesheet system.

### Browser QA and screenshots

The UI check uses Playwright and axe. After building, serve `dist/` on port 4173, then run the check:

```sh
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
npm run check:ui
```

The browser executable defaults to an installed Chrome or Edge on Windows. Set `BROWSER_EXECUTABLE_PATH` to use another installed browser, and `PORTFOLIO_BASE_URL` if the preview runs at another address. The checks cover direct loading and refreshing all eleven canonical routes, the `/experience/` compatibility page, legacy-hash hydration, native Education and feature anchors with Back/Forward restoration, route metadata, all eight project cards and category filters, both long-form case studies, the native experience disclosure with click/Enter/Space and no-JavaScript behavior, keyboard focus, the eleven-viewport matrix, 44px controls, 200% text across four widths for routed views and new case studies, light/dark contrast, decoded local logos and project images, same-origin asset requests, and twelve desktop/mobile axe scans plus expanded Experience scans in both appearances.

Capture the review screenshots with:

```sh
node scripts/capture-screenshots.mjs
```

The full command refreshes the Experience landing (the legacy `overview-*` filenames now refer to that view), Projects, and Skills at desktop and mobile sizes; full-page Experience captures with the earlier-role disclosure collapsed; desktop and mobile work-history captures with all roles expanded in place; dark-appearance Experience captures; the eight-card Projects index, old compact project details, both new case studies at desktop and mobile sizes with full-page desktop versions, naturally scrolled social-link captures, and `public/social-preview.png`. Use `node scripts/capture-screenshots.mjs --review-only` to stage desktop and mobile captures under the ignored review cache before updating the social image. Use `node scripts/capture-screenshots.mjs --screenshots-only` to refresh final review screenshots without rewriting the social image, or `node scripts/capture-screenshots.mjs --social-only` to update only the social image. Captures wait for images and preserve the natural scroll position. Current screenshots are under `docs/screenshots/`.

The temporary React server-render bundle is kept under ignored `node_modules/.cache/portfolio-prerender/`. Publish only the generated `dist/` directory.

## Content and structure

| Content | Location |
| --- | --- |
| Shared shell and three route-based views | `src/App.jsx`, `src/components/layout/PortfolioShell.jsx`, `src/views/` |
| Clean route, project, and browser-history navigation | `src/navigation/` |
| Portfolio and case-study data (profile, eight projects, roles, skills) | `src/data/portfolio.js`, `src/data/featured-projects.js` |
| Reusable interface elements | `src/components/ui/` |
| Project explorer, project implementation details, and profile actions | `src/components/content/`, `src/components/layout/PortfolioShell.jsx` |
| Static SEO and social metadata | `index.html`, `public/robots.txt`, `public/social-preview.png` |
| Generated sitemap | `scripts/build.mjs` creates `dist/sitemap.xml` from all portfolio routes |
| GitHub Pages domain files | `public/CNAME`, `public/.nojekyll` |
| Resume | `src/assets/Resume_TranHaThu.pdf` |
| QA scripts and review notes | `scripts/`, `docs/` |

Keep all eight projects, the eight user-supplied employment entries, 22 skills, profile interests and aspiration, confirmed NUS education facts, resume, and existing links in `src/data/portfolio.js`; the two new project case-study records live in `src/data/featured-projects.js`. The three views are Experience, Projects, and Skills. Experience contains the profile, current role and earlier-role disclosure, education, and interests, plus only the two authorized featured project cards. The six earlier projects, their cards, implementation details, and architecture stay in Projects. The former `/experience/` URL remains as a compatibility route to the Experience landing, and legacy overview, homepage, about, contact, and experience hashes resolve to Experience. Email, GitHub, LinkedIn, and Resume remain available from the shared shell. Clean paths are generated for each view and all eight project details. When a domain changes, update canonical and social URLs, JSON-LD identifiers, robots policy, sitemap, `public/CNAME`, package homepage, SEO check, and this README together.

## Resume generation

Edit `docs/resume.html` as the resume source and keep its confirmed profile, education, dates, roles, skills, and contact details synchronized with `src/data/portfolio.js`. Run `node scripts/generate-resume.mjs` to generate `src/assets/Resume_TranHaThu.pdf` with Chrome or Edge. The generator checks that the PDF has exactly two pages and that its clickable link count matches every source URL and destination in the HTML. It writes a single preview to `docs/screenshots/resume-preview.png`; the shared portfolio links to the generated PDF asset.

## Hosting

GitHub Pages is published at `https://www.tranhathu.com/`. The `Verify and deploy portfolio` workflow runs lint, production build, SEO, browser, and accessibility checks on pull requests to `main`. After a change reaches `main`, it runs those checks again and deploys the verified artifact with GitHub Pages Actions. Feature branch pushes do not deploy the site. The one-time Pages source setting must be **GitHub Actions** for this workflow to publish.

The workflow transfers the exact `dist/` artifact that passed the checks, including `.nojekyll`. To manually publish the latest `main` build, run **Verify and deploy portfolio** from the Actions tab with the `main` branch selected. Keep `public/CNAME` and `public/.nojekyll` so builds preserve the custom domain and static files. Namecheap DNS records currently route `www` to `oeggy03.github.io` and the bare domain to GitHub Pages. Do not remove unrelated email or domain verification records when editing DNS.

See the [deployment and DNS guide](docs/deployment.md) for GitHub Pages settings, DNS records, Search Console steps, and troubleshooting.

## Search visibility

Every canonical route has route-specific title, description, canonical URL, ProfilePage/Person JSON-LD, Open Graph and Twitter metadata. The compatibility page points its canonical URL to the Experience landing. The checked-in `public/robots.txt` provides the crawl policy. The build generates `dist/sitemap.xml` from the eleven canonical routes. Metadata supports crawler understanding but does not guarantee indexing or rankings.
