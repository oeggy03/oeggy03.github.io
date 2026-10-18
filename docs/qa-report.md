# QA report

## Result

The browser and SEO checks pass against the production build served locally on port 4173. The production build and lint passed after the browser-fragment settling fix in commit `31f8768`; lint also passed after the QA script updates. No deployment was performed.

## Commands and results

- `npm run build` — passed on the reviewed source; the captured `dist/` was generated from commit `31f8768`.
- `npm run lint` — passed.
- `npm run check:seo` — passed. The check covers prerendered portfolio content, canonical metadata, structured data, local links and assets, sitemap, `CNAME`, and `.nojekyll`.
- `npm run check:ui` — passed. The final run reported no browser console errors, uncaught page errors, or failed local asset requests. No external request failures were observed.
- `node scripts/capture-screenshots.mjs --screenshots-only` — passed against that same build. Captures are real viewport screenshots after fonts/images settle and the pointer moves away from controls; they are not full-page screenshots.
- `git diff --check` — passed.

The social preview is 1200×630. `public/social-preview.png` and `dist/social-preview.png` have matching SHA-256 `49374eefc1333df57514d8622619d2790a10ffe1a7ee6cdb0db478d3c6bf9089`.

## Navigation and history evidence

- The six section views, refresh, canonical hashes, legacy hashes, modifier-click links, and project fragments passed. The same-document sequence includes `#aboutSection`, `#experiencesSec`, `#projectsSec`, and `#contactSec`; each settles on the correct view and canonical hash. Direct `#project-teleai` opens TeleAI.
- On the browser timing probe, a native fragment step briefly placed `#experiencesSec` at Y=100 and `#projectsSec`/`#project-teleai` at Y=98 before the app's deferred navigation policy. After one animation frame, and again at 2/4/8 frames and 120ms, each was at Y=0 with the expected selection. The test keeps the settled Y=0 assertion strict.
- From a natural wheel position of Y=237 in Projects at 1024×600 (document max Y=457), clicking Skills reached Y=0. Back restored `#projects`, Projects, and Y=237 after the corresponding `popstate` and `hashchange`; Forward returned to Skills at Y=0.
- Clicking section tabs from the document bottom, using arrows, Home, End, and Enter on the active tab all starts the selected view at Y=0 and keeps keyboard focus on the selected tab. At 390×600, Contact's heading, email address, and complete Email me action fit in the viewport after keyboard navigation.
- A category change shortened the Projects document from 1048px (max Y=148) to 998px (max Y=98). The filter retained the prior Y=148 as far as the shorter document allowed and clamped to Y=98. The filter controls remained keyboard-focused; the measured control top moved from 94.5px to 144.5px as the selected project changed. When the filtered document has enough room, the check requires the exact saved Y.

## Content, accessibility, and responsive coverage

- All six original projects, five experience entries and dates, 22 skills, all 16 project destinations, and all five employer links remain in the JavaScript-disabled prerendered page. The date check normalizes casing, whitespace, and dash variants in rendered text.
- All six projects can be selected. Backend, AI & bots, and Frontend filters return their expected sets; project facts and repository links remain available. Skills links open the intended Eggbot and TeleAI projects. Filters preserve focus and reading position subject to document-bound clamping.
- Contact email, clipboard success and simulated failure feedback, the resume PDF (HTTP 200, `application/pdf`), LinkedIn, and GitHub links passed.
- axe passed WCAG 2.1 A/AA and WCAG 2.2 AA tagged rules on all six views at desktop and mobile widths.
- Every view was checked for horizontal overflow at 1440×900, 1366×768, 1024×600, 1440×600, 390×844, 390×600, 320×568, 720×450, 768×1024, 844×390, and 1920×1080. The check also covers the sticky desktop toolbar, short-screen rail reachability, full-height dark backdrop, mobile navigation and target clearance, 44px section/filter/project controls, and reduced-motion behavior.
- The browser suite uses installed Chrome with responsive viewport emulation. It does not replace a device-farm run or manual screen-reader testing; external destination pages were not opened or verified.

## Layout measurements and review artifacts

Document heights from the original baseline probe were 1251px for Projects and 1161px for Skills at 1440×900, and 1882px/2484px at 390×844. On the redesigned build, the viewport captures measured Projects at 998px and Skills at 900px on desktop; the mobile captures measured selected TeleAI Projects at 1648px and Skills at 1791px. These totals include the shell and active view; the project measurements also reflect the selected project state.

The original baseline captures remain at `docs/screenshots/baseline-desktop.png` and `docs/screenshots/baseline-mobile.png`. Before/after Contact keyboard captures are `before-contact-keyboard-mobile.png`, `after-contact-keyboard-mobile.png`, `before-contact-keyboard-desktop.png`, and `after-contact-keyboard-desktop.png`. The final viewport set includes Overview, Projects, Experience, Skills, About, and Contact at desktop size, Overview on mobile, a selected TeleAI mobile detail, and a naturally scrolled Projects view.

## Publishing boundary

The live GitHub Pages configuration was verified as legacy branch publishing from `gh-pages` at `/`, with `https://www.tranhathu.com/` as the site URL. This work was not deployed; the build was checked locally and no publication action was run.
