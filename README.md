# Tran Ha Thu | Portfolio

Personal portfolio for software engineering, full stack development, AI projects, experience, skills, and contact details.

**Website:** <https://www.tranhathu.com/>

**Source:** <https://github.com/oeggy03/oeggy03.github.io>

## Stack

- React 18 and Vite 4, with Tailwind CSS 3 utilities.
- Static HTML prerendering for GitHub Pages; the site does not require server routes.
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

`npm run build` creates browser assets in `dist/`, then renders the React views into `dist/index.html`. Content remains available before JavaScript runs; hydration adds the six view navigation, hash/history support, project filters and selection, and contact copy feedback. The browser build and server render use the same view components.

The CSS entry at `src/tailwind.css` contains Tailwind's three build directives. The production stylesheet is generated from class utilities and the theme in `tailwind.config.js`; the site does not maintain a separate bespoke stylesheet system.

### Browser QA and screenshots

The UI check uses Playwright and axe. After building, serve `dist/` on port 4173, then run the check:

```sh
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
npm run check:ui
```

The browser executable defaults to Chrome or Edge on Windows. Set `BROWSER_EXECUTABLE_PATH` to use another installed browser, and `PORTFOLIO_BASE_URL` if the preview runs at another address. The checks cover navigation and history, legacy hashes, project filters and deep links, keyboard controls, clipboard success and failure, no-JavaScript content, responsive widths, reduced motion, local asset requests, and WCAG 2.1 A/AA and WCAG 2.2 AA rules on desktop and mobile.

Capture the review screenshots with:

```sh
node scripts/capture-screenshots.mjs
```

The temporary React server-render bundle is kept under ignored `node_modules/.cache/portfolio-prerender/`. Publish only the generated `dist/` directory.

## Content and structure

| Content | Location |
| --- | --- |
| Shared shell and six hash-linked views | `src/App.jsx`, `src/components/layout/PortfolioShell.jsx`, `src/views/` |
| Portfolio data (profile, projects, roles, skills) | `src/data/portfolio.js` |
| Reusable interface elements | `src/components/ui/` |
| Project explorer, architecture, and contact actions | `src/components/content/` |
| Static SEO and social metadata | `index.html`, `public/robots.txt`, `public/sitemap.xml` |
| GitHub Pages domain files | `public/CNAME`, `public/.nojekyll` |
| Resume | `src/assets/Resume_TranHaThu.pdf` |
| QA scripts and review notes | `scripts/`, `docs/` |

Keep the six original projects, five experiences, core skills, full biography, resume, and their existing links in `src/data/portfolio.js`. When a domain changes, update the canonical and social URLs, JSON-LD identifiers, robots policy, sitemap, `public/CNAME`, package homepage, SEO check, and this README together.

## Hosting

GitHub Pages is configured for legacy branch publishing from `gh-pages` at the repository root, with `https://www.tranhathu.com/` as the site URL. The `gh-pages` branch is the publishing source; pushing a feature branch does not publish it. The redesign work does not deploy the site.

When a production publish is authorized, `npm run deploy` builds the site and publishes `dist/` to `gh-pages`, including dotfiles. Keep the domain and `.nojekyll` files in `public/` so every build preserves them. Namecheap DNS records currently route `www` to `oeggy03.github.io` and the bare domain to GitHub Pages. Do not remove unrelated email or domain verification records when editing DNS.

See the [deployment and DNS guide](docs/deployment.md) for GitHub Pages settings, DNS records, Search Console steps, and troubleshooting.

## Search visibility

The generated homepage preserves the descriptive title and description, canonical URL, ProfilePage/Person JSON-LD, Open Graph and Twitter metadata, `robots.txt`, and a sitemap containing the homepage. Section hashes are parts of the same page. Metadata supports crawler understanding but does not guarantee indexing or rankings.
