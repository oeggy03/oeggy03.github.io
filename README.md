# Tran Ha Thu | Portfolio

Personal portfolio for backend and software engineering, projects, experience, skills, education, and contact details.

**Website:** <https://www.tranhathu.com/>

**Source:** <https://github.com/oeggy03/oeggy03.github.io>

## Stack

- React 18 and Vite 4, with Tailwind CSS 3 utilities.
- Static HTML prerendering for GitHub Pages, including direct files for each section and project route.
- Manrope and IBM Plex Mono fonts served from local package assets.
- Node.js and npm. Use `package-lock.json` with `npm ci` for a reproducible install.

## Local development

```sh
npm ci
npm run dev
```

## Build and checks

```sh
npm run build
npm run check:seo
npm run lint
```

`npm run build` creates browser assets in `dist/`, then renders the React views into ten static pages: the homepage, Projects, Experience, Skills, and all six project details. Content remains available before JavaScript runs. Hydration adds clean-route navigation, history restoration, and project filters and selection. The browser build and server render use the same view components.

In-site navigation is coordinated by `src/navigation/`. Section links use `/`, `/projects/`, `/experience/`, and `/skills/`; each project has a direct `/projects/<id>/` route. Recognized legacy hashes canonicalize to those routes. Back/Forward restores the saved route and reading position while keeping the document as the main scroll surface. Desktop navigation and the toolbar stay available while reading; the desktop identity rail scrolls internally only when a short viewport cannot fit its contents.

The CSS entry at `src/tailwind.css` contains Tailwind's three build directives. The production stylesheet is generated from class utilities and the theme in `tailwind.config.js`; the site does not maintain a separate bespoke stylesheet system.

### Browser QA and screenshots

The UI check uses Playwright and axe. After building, serve `dist/` on port 4173, then run the check:

```sh
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
npm run check:ui
```

The browser executable defaults to an installed Chrome or Edge on Windows. Set `BROWSER_EXECUTABLE_PATH` to use another installed browser, and `PORTFOLIO_BASE_URL` if the preview runs at another address. The checks cover direct loading and refreshing all ten routes, legacy-hash hydration, Back/Forward reading-position restoration, project filters and links, keyboard focus, the 11 viewport matrix, mobile social and navigation targets, no-JavaScript content, local asset requests, and WCAG 2.1 A/AA and WCAG 2.2 AA rules across eight desktop and mobile view scans.

Capture the review screenshots with:

```sh
node scripts/capture-screenshots.mjs
```

The full command refreshes desktop captures for all four views, mobile Overview and Experience captures, selected and naturally scrolled Projects captures, and `public/social-preview.png`. Use `node scripts/capture-screenshots.mjs --review-only` to stage Overview and Experience desktop/mobile captures under the ignored review cache before updating the social image. Use `node scripts/capture-screenshots.mjs --screenshots-only` to refresh final review screenshots without rewriting the social image, or `node scripts/capture-screenshots.mjs --social-only` to update only the social image. Captures wait for fonts and images and preserve the natural scroll position. The mobile set records that the contact/social actions remain visible while reading a long project. Current screenshots are under `docs/screenshots/`.

The temporary React server-render bundle is kept under ignored `node_modules/.cache/portfolio-prerender/`. Publish only the generated `dist/` directory.

## Content and structure

| Content | Location |
| --- | --- |
| Shared shell and four route-based views | `src/App.jsx`, `src/components/layout/PortfolioShell.jsx`, `src/views/` |
| Clean route, project, and browser-history navigation | `src/navigation/` |
| Portfolio data (profile, projects, roles, skills) | `src/data/portfolio.js` |
| Reusable interface elements | `src/components/ui/` |
| Project explorer, project implementation details, and profile actions | `src/components/content/`, `src/components/layout/PortfolioShell.jsx` |
| Static SEO and social metadata | `index.html`, `public/robots.txt`, `public/social-preview.png` |
| Generated sitemap | `scripts/build.mjs` creates `dist/sitemap.xml` from all portfolio routes |
| GitHub Pages domain files | `public/CNAME`, `public/.nojekyll` |
| Resume | `src/assets/Resume_TranHaThu.pdf` |
| QA scripts and review notes | `scripts/`, `docs/` |

Keep all six projects, the eight user-supplied employment entries, 22 skills, profile interests and aspiration, confirmed NUS education facts, resume, and existing links in `src/data/portfolio.js`. The four views are Overview, Projects, Experience, and Skills. Overview contains profile, education, and the current TikTok employer, with no project names, images, implementation details, or architecture. Email, GitHub, LinkedIn, and Resume remain available from the shared shell. Clean paths are generated for every view and project. Recognized legacy hashes resolve to those paths; prerendered alias anchors remain for JavaScript-disabled visitors. When a domain changes, update canonical and social URLs, JSON-LD identifiers, robots policy, sitemap, `public/CNAME`, package homepage, SEO check, and this README together.

## Resume generation

Edit `docs/resume.html` as the resume source and keep its confirmed profile, education, dates, roles, skills, and contact details synchronized with `src/data/portfolio.js`. Run `node scripts/generate-resume.mjs` to generate `src/assets/Resume_TranHaThu.pdf` with Chrome or Edge. The generator checks that the PDF is no more than two pages and has at least eight clickable links, and writes page previews to `docs/resume-preview-1.png` and `docs/resume-preview-2.png`. The reviewed resume has two pages and eight clickable source URLs; the shared portfolio links to the generated PDF asset.

## Hosting

GitHub Pages is published at `https://www.tranhathu.com/`. The `Verify and deploy portfolio` workflow runs lint, production build, SEO, browser, and accessibility checks on pull requests to `main`. After a change reaches `main`, it runs those checks again and deploys the verified artifact with GitHub Pages Actions. Feature branch pushes do not deploy the site. The one-time Pages source setting must be **GitHub Actions** for this workflow to publish.

The workflow transfers the exact `dist/` artifact that passed the checks, including `.nojekyll`. To manually publish the latest `main` build, run **Verify and deploy portfolio** from the Actions tab with the `main` branch selected. Keep `public/CNAME` and `public/.nojekyll` so builds preserve the custom domain and static files. Namecheap DNS records currently route `www` to `oeggy03.github.io` and the bare domain to GitHub Pages. Do not remove unrelated email or domain verification records when editing DNS.

See the [deployment and DNS guide](docs/deployment.md) for GitHub Pages settings, DNS records, Search Console steps, and troubleshooting.

## Search visibility

Every generated route has a route-specific title, description, canonical URL, ProfilePage/Person JSON-LD, Open Graph and Twitter metadata. The checked-in `public/robots.txt` provides the crawl policy. The build generates `dist/sitemap.xml` from the ten canonical routes. Metadata supports crawler understanding but does not guarantee indexing or rankings.
