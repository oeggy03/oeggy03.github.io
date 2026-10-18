# QA report

## Result

The four-view portfolio passed the production build, lint, SEO, browser, and accessibility checks on source commit `ed70ab0` (including Overview consolidation `a193a8d`). The approved Overview was captured before the social image was regenerated. The build was then repeated so `dist/social-preview.png` contains the reviewed card. No deployment was run.

## Commands and results

- `npm.cmd run build` — passed on the final source and social preview.
- `npm.cmd run lint` — passed with no warnings.
- `npm.cmd run check:seo` — passed for prerendered content, view IDs, Overview facts, accessible social/resume links, canonical metadata, structured data, local links/assets, sitemap, CNAME, and `.nojekyll`.
- `npm.cmd run check:ui` — passed all navigation, content, history, responsive, project, social/resume, no-JavaScript, runtime, and axe checks. The run reported no console errors, uncaught page errors, failed local requests, or external request failures.
- `node scripts/capture-screenshots.mjs --social-only` — produced the approved 1200×630 social preview.
- `node scripts/capture-screenshots.mjs --screenshots-only` — captured the final review set from the production preview without rewriting the social image.
- `git diff --check` — passed.

`public/social-preview.png` and `dist/social-preview.png` have matching SHA-256 `a3c96e8af08a56fc0baa9c353b953beb2d04f403d4520e902049c18c686f5dac`.

## Navigation, history, and content

- Navigation exposes exactly Overview, Projects, Experience, and Skills. About and Contact are not views. Arrow navigation, Home/End, activation from the document bottom, refresh, modifier-click links, and Back/Forward passed. End selects Skills and keeps keyboard focus on the selected tab. The selected tab retains its background highlight with no separate dot.
- Retired `#about`, `#aboutSection`, `#contact`, and `#contactSec` hashes resolve to Overview. `#experiencesSec` and `#projectsSec` still resolve to Experience and Projects. The corresponding static anchor IDs remain in the prerendered HTML.
- Back/Forward restored the saved nonzero reading position and selected project. Project chooser/filter transitions, all six project selections, direct project hashes, filter coherence, project details, and the existing 16 project destination links passed.
- Overview contains the biography, interests, aspiration, NUS degree/minors, and existing HDB role/date. It contains no project name or project image in the hydrated or JavaScript-disabled document. At 390×844 the HDB role heading, company, and dates fit at native document Y=0; the DOM order is HDB role, NUS education, then interests.
- All five roles and dates, all 22 skills, and five employer links remain in the JavaScript-disabled output. The resume returns HTTP 200 with `application/pdf` content type.
- Email, GitHub, and LinkedIn actions were visible on desktop, at 320px and 390px mobile, and after naturally scrolling the mobile Projects view. Link destinations and 44px minimum touch targets passed.

## Responsive and accessibility coverage

The no-horizontal-overflow matrix covers 1440×900, 1366×768, 1024×600, 1440×600, 390×844, 390×600, 320×568, 720×450, 768×1024, 844×390, and 1920×1080. Checks also cover the sticky desktop toolbar, full-height rail backdrop, short-screen rail reachability, four mobile tabs, 44px section/project/filter/social controls, mobile project target clearance, and reduced motion.

axe passed WCAG 2.1 A/AA and WCAG 2.2 AA tagged rules on all four views at 1440×900 and 390×844 (eight scans).

## Review artifacts

Current screenshots in `docs/screenshots/` include all four views at 1440×900, Overview at 390×844 and full-page document height, selected TeleAI at 390×844, a naturally scrolled desktop Projects view, and the visible contact/social row at 320×568 while reading a long Projects detail. The Overview mobile document is 1400px tall. The 320px social proof is at natural scroll Y=1167; selected TeleAI on 390px mobile is at Y=617.

The historical baseline images remain unchanged. Former About and Contact captures were retained with `historical-` filenames so they cannot be mistaken for current views. The new capture script does not generate Contact keyboard or clipboard screenshots.

## Limits and publishing

Playwright used installed Chrome with responsive viewport emulation. This run did not include physical-device/browser testing or manual screen-reader testing. External destination pages were not opened; only their stored links were checked. No deployment or publishing action was performed.
