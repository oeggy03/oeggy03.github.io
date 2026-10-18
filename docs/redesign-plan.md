# Portfolio redesign plan

## Product direction

Rebuild the portfolio as a compact, backend studio style interface. Use a charcoal identity rail, a warm paper canvas, orange accents, Manrope for reading, and IBM Plex Mono for labels and technical details. Keep the layout direct and calm so project work and experience are easy to scan.

## Views and content

- **Overview:** concise introduction, backend/software engineering focus, NUS context, and a visible project preview at 1440×900. Keep clear project and contact actions near the introduction. On mobile, both actions should be reachable without a long scroll.
- **Projects:** all six original projects (FoROOM, Buddy4Good, Eggbot, TeleAI, FoodHero, and Portfolio Website), with Backend, AI & bots, and Frontend filters. Selecting a project should expose its summary, technical description, image, skills, architecture when available, and existing project/repository links.
- **Experience:** all five original roles with dates, descriptions, company names, and existing company links/logos.
- **Skills:** the complete original core skill inventory, grouped for scanning; retain the additional technical skills already represented in the content model.
- **About:** preserve the original biography, education, interests, and aspiration, with existing external links.
- **Contact:** real email, LinkedIn, GitHub, and resume links. Copy email should give visible success and failure feedback.

Six direct views are navigated through a persistent identity rail or its mobile equivalent. Keep pointer, keyboard, browser back/forward, refresh, and hash navigation working. Preserve the legacy section anchors (`#aboutSection`, `#experiencesSec`, `#projectsSec`, and `#contactSec`) so old links continue to work. Do not require a long page scroll to reach core content.

## Visitor journeys

1. **Recruiter:** scan the overview and one project proof point, open Experience to review recent roles, then use Contact or the resume link.
2. **Technical reviewer:** open Projects, filter to backend or AI work, select FoROOM or another project, inspect the implementation summary and architecture, and follow its code or project links.
3. **Direct contact:** follow the visible email, LinkedIn, GitHub, or resume link from Contact; copying the email gives immediate feedback.

## Component and content ownership

Keep shared interface elements and view content reusable. Place portfolio facts in data modules rather than duplicating content in components. The current content module is `src/data/portfolio.js`; shared interface primitives live under `src/components/ui/`, and specialized content components live under `src/components/content/`. Keep each major view in its own component directory. Render useful content into static HTML before JavaScript loads, then enhance navigation and project selection after hydration. Use Tailwind utilities and the minimal generated CSS entry rather than restoring a bespoke stylesheet system.

## Acceptance criteria

- The page has six direct views and no server-side routes. The production output remains a static GitHub Pages site.
- All six projects, five roles, fourteen core skills, full biography and education content, resume, and original outbound links remain available in the generated HTML.
- Project category filters show the expected sets and selection reveals complete project details. Overview actions reach Projects and Contact.
- Navigation supports keyboard arrows plus Home/End, hash refresh, browser back/forward, and the four legacy section hashes.
- With JavaScript disabled, meaningful content and hash navigation remain available.
- No viewport has horizontal overflow at 320, 390, 768, 1024, 1440, or 1920 CSS pixels. Check 200% desktop zoom by also testing a 720 CSS-pixel viewport.
- Reduced motion is respected. Axe reports no WCAG 2.1 A/AA or WCAG 2.2 AA violations on desktop and mobile views.
- Canonical/social metadata, JSON-LD, robots, sitemap, CNAME, `.nojekyll`, and local asset links remain valid.

## Delivery milestones

1. **Foundation and navigation:** establish the visual tokens, shared shell, responsive rail, six-view navigation, history/hash behavior, and static rendering.
2. **Content explorer:** map the existing portfolio facts into data modules and complete the six project, five experience, skills, about, and contact views.
3. **QA, fixes, and screenshots:** run build, SEO, browser, accessibility, and lint checks; fix the findings; capture baseline and final view screenshots and refresh the social preview after visual review.

No deployment is part of these milestones. The live GitHub Pages configuration was checked before the redesign: Pages uses legacy branch publishing from `gh-pages` at `/`, with `https://www.tranhathu.com/` as the site URL. A feature branch push does not publish this work. Preserve `public/CNAME`, `public/.nojekyll`, the canonical URL, robots policy, sitemap, metadata, and structured data; publish only when separately authorized.

## Verification matrix

Run the production build, SEO check, UI browser check, and lint after implementation. Browser checks should cover navigation and history, legacy hashes, filters/details, keyboard operation, contact actions, no-JavaScript content, reduced motion, asset requests, and horizontal overflow at each width above. Run the desktop check at 720 CSS pixels as the 200% zoom equivalent. Scan all six views on desktop and mobile for WCAG 2.1 A/AA and WCAG 2.2 AA. Keep baseline and final screenshots for review.

## Navigation and editorial revision

The initial review found a scroll mismatch between pointer and keyboard navigation. From the bottom of Skills, pressing End selected Contact but left the document at the previous reading offset. At 390×600, this put the email card entirely above the viewport. Project selection on mobile similarly scrolled the chosen detail beneath the sticky shell navigation and left the project chooser out of reach. Back from `#project-teleai` returned to `#projects` but retained TeleAI as the selected project. The desktop rail also occupied only one viewport of a taller document, so full-page captures ended the dark background before the content did.

The revised contract is:

- Use one document scroll surface. Desktop view navigation and the toolbar stay available while the selected view begins at document scroll position zero. Pointer activation, keyboard arrows, Home/End, and Enter on the active tab all reach the same settled position after rendering; keyboard focus remains on the selected navigation control. Browser Back/Forward restores the saved reading position for that history entry.
- Keep the desktop dark rail and its backdrop full height alongside the document. When a short desktop viewport cannot fit all rail controls, the rail itself can scroll so every navigation and social link remains reachable. Keep the desktop toolbar sticky.
- Keep the mobile section navigation in its three-column, two-row layout. Measure its actual height when placing project details and other fragment targets, with at least 16px clearance below it.
- On desktop, changing a project while the explorer controls are visible preserves the explorer reading position. If the reader has scrolled past those controls, return to the explorer controls rather than opening a detail-only position. On mobile, selecting a project reveals its heading beneath the sticky navigation and keeps a “Browse projects” action near the heading so the chooser can be reopened.
- Project filters preserve the reader’s scroll position when the document has room, preserve keyboard focus, and clamp only when the updated content makes the prior Y exceed the new document maximum. `#projects` means All projects with FoROOM selected; a project fragment opens the matching project. Back and Forward restore each history entry’s reading position and selected project. The category remains compatible with that selection and resets to All when needed.
- Centralize in-site navigation so internal fragment links do not combine native anchor scrolling with application scrolling. Preserve ordinary links when opened in a new tab or with modifier keys, legacy fragments, prerendered content, and useful no-JavaScript navigation.
- Edit the public copy for recruiters: lead with role and evidence, keep project descriptions concise and factual, make implementation details easy to scan, and make the email action self-explanatory. Avoid vague process instructions or undersold labels. Preserve the source facts and project, role, education, skill, resume, and outbound-link coverage.

### Regression matrix for this revision

Exercise section switching from the document bottom on desktop and mobile, including clicking the current tab, switching to another tab, using keyboard arrows and Home/End, and pressing Enter on the current tab. Section activation starts at scroll Y=0 after four animation frames and a short settling delay, the view heading is visible below sticky controls, and keyboard focus remains on the selected tab. Browser Back/Forward restores each history entry's saved reading offset instead of applying the section-activation scroll rule. At 390×600, Contact’s heading, email address, and complete primary email action must fit in the viewport after keyboard navigation.

Exercise project selection from the desktop explorer and after scrolling the detail, mobile selection and “Browse projects,” repeated selection, each filter, direct project hashes, and Back/Forward from a nonzero reading offset. Include a deliberate non-anchor reading position such as Projects Y=237px; verify Back restores it after the browser hash events settle, while section activation still opens at Y=0. Check selection and filter coherence as well as the visible scroll result. Verify the desktop rail backdrop continues past the first viewport and its controls remain reachable at short heights.

Run viewport checks at 1440×900, 1366×768, 1024×600, 1440×600, 390×844, 390×600, 320×568, 720×450, 768×1024, 844×390, and 1920×1080. Confirm the desktop toolbar stays sticky, the dark backdrop spans the full document, and all rail links are reachable through internal rail scrolling on short desktop screens. Keep the existing no-JavaScript, SEO, accessibility, reduced-motion, resume, clipboard, local-asset, all 16 project destinations, five employer links, and all 22 skill checks. Do not pin UI tests to editorial sentences; assert preserved facts and meaningful actions instead.
