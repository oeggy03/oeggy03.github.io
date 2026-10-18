# QA report

## Result

Final local verification passed on branch `redesign/focused-four-section-portfolio` with source through commit `e8370b1`. The production build contains ten static portfolio routes and the reviewed social card. No deployment was run.

## Commands and results

- `npm.cmd run build` — passed; prerendered the homepage, three section routes, and six project routes.
- `npm.cmd run lint` — passed with no warnings.
- `npm.cmd run check:seo` — passed for all ten routes, exact experience dates and machine-readable month bounds, profile facts, metadata, structured data, local links and assets, sitemap, CNAME, and `.nojekyll`.
- `PORTFOLIO_BASE_URL=http://127.0.0.1:4180/ npm.cmd run check:ui` — passed all 13 browser check groups against the production `dist/` folder served by Python's static HTTP server. This covered route refreshes, terminal `index.html` aliases, legacy hashes, history, project filters and focus, the no-JavaScript output, the 11-viewport matrix, and eight axe scans. The run reported no console errors, uncaught page errors, failed local requests, or external request failures.
- Python static HTTP check — all ten canonical paths returned HTTP 200 with route-specific canonical metadata; an unknown path returned HTTP 404 rather than an SPA fallback.
- `node scripts/generate-resume.mjs` — generated a two-page PDF with eight clickable source URLs.
- `node scripts/capture-screenshots.mjs --social-only` — produced the reviewed 1200×630 PNG. The subsequent production build copied it into `dist/`.
- `node scripts/capture-screenshots.mjs --screenshots-only` — refreshed the review captures from the final production build without changing the social image.
- `git diff --check` — passed.

`public/social-preview.png` and `dist/social-preview.png` have matching SHA-256 `af4bfe2e6befd18870a219b0415097e10712849b67fcd5b358b5116e1484b32e`.

## Coverage and review artifacts

- Navigation exposes exactly Overview, Projects, Experience, and Skills. The four clean section routes and six project routes load and refresh directly. All ten terminal `index.html` aliases hydrate to their canonical routes; JavaScript-disabled visitors see the matching prerendered view and canonical metadata.
- Retired `#about`, `#aboutSection`, `#contact`, and `#contactSec` hashes resolve to Overview. `#experiencesSec` and `#projectsSec` still resolve to Experience and Projects. Back/Forward restores the saved route, reading position, and selected project.
- All eight supplied experience entries appear in order with the exact dates and corresponding `<time datetime>` month values. The current TikTok Backend Engineer role leads; completed roles are ordered by end date descending. Overview retains the confirmed biography, interests, aspiration, NUS education, and current employer without project names or imagery.
- All six projects, 22 skills, four employer destinations, and 16 project destination links remain available. The resume returns HTTP 200 as a PDF. Email, GitHub, LinkedIn, and Resume controls have the expected destinations and visible 44px touch targets.
- Responsive checks cover 1440×900, 1366×768, 1024×600, 1440×600, 390×844, 390×600, 320×568, 720×450, 768×1024, 844×390, and 1920×1080. axe passed WCAG 2.1 A/AA and WCAG 2.2 AA tagged rules on all four views at desktop and mobile sizes (eight scans).
- Current captures in `docs/screenshots/` include all four desktop views at 1440×900; Overview and Experience at 390×844; full-page Overview (1487px) and Experience (2889px); selected TeleAI at 390×844; a naturally scrolled Projects view at desktop Y=98; and the visible mobile social row at 320×568 while reading a project (Y=1152). `resume-preview.png` shows the reviewed PDF.
- The date-wrap review image for Experience shows the current and completed date ranges cleanly across two lines on desktop and on one line on mobile. Historical About and Contact captures retain `historical-` filenames.

## Limits

Playwright used installed Chrome with viewport emulation. Physical-device testing and manual screen-reader testing were not performed. External destination pages were not opened; their stored URLs and visible controls were checked. No publishing or deployment action was performed.
