# Portfolio redesign plan

## Product direction

Rebuild the portfolio as a compact, backend studio style interface. Use a charcoal identity rail, a warm paper canvas, orange accents, Manrope for reading, and IBM Plex Mono for labels and technical details. Keep the layout direct and calm so project work and experience are easy to scan.

## Views and content

- **Overview:** concise introduction, backend/software engineering focus, NUS context, and a visible project preview at 1440×900. Add clear View Projects and Contact actions. On mobile, both actions should be reachable without a long scroll.
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
