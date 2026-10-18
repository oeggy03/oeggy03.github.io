# Four-view portfolio plan

## Product direction

Present Tran Ha Thu as a backend/software engineer through a focused four-view portfolio: Overview, Projects, Experience, and Skills. The charcoal identity rail, warm canvas, restrained accent color, Manrope reading type, and IBM Plex Mono labels support a compact, direct presentation.

## View content

- **Overview:** combine the biography, interests, aspiration, NUS Computer Science degree and Quantitative Finance/Management minors, and the existing HDB role and dates. Keep all project names, project images, implementation details, and architecture out of this view.
- **Projects:** retain FoROOM, Buddy4Good, Eggbot, TeleAI, FoodHero, and Portfolio Website, with their current images, implementation facts, architecture where available, skills, filters, and all existing links.
- **Experience:** retain all five roles, dates, descriptions, company identities, and links.
- **Skills:** retain all 22 skills and their existing project links.

Keep the email, GitHub, LinkedIn, and resume actions available in the shared shell on desktop and mobile. The mobile section bar contains four tabs; the three contact/social actions remain reachable in the sticky mobile header while reading long content. Keep the selected tab's background highlight and remove its separate active dot.

## Navigation and compatibility

Support pointer and keyboard navigation, arrow movement, Home/End, hash refresh, direct project fragments, and browser Back/Forward with reading-position restoration. Keyboard End on the four-view tablist selects Skills. Direct fragments use `#overview`, `#projects`, `#experience`, and `#skills`.

Map the retired `#about`, `#aboutSection`, `#contact`, and `#contactSec` fragments to Overview. Continue mapping `#experiencesSec` to Experience and `#projectsSec` to Projects. Keep prerendered alias anchors so these targets still exist before JavaScript loads.

## Acceptance criteria

- Exactly four portfolio views appear in navigation and prerendered HTML; About and Contact are not separate views.
- Overview presents the stated profile, interests, aspiration, NUS education/minors, and existing HDB role/date without project names, images, details, chooser, or architecture.
- All six projects, five roles, 22 skills, all 16 project destinations, five employer destinations, and the resume remain available.
- Email, GitHub, LinkedIn, and Resume controls are visible on desktop and at 320px mobile width. Mobile social controls stay visible while reading a long project and provide at least 44px targets.
- The selected tab has a visible background highlight and no active dot. Mobile navigation has four reachable tabs.
- No-JavaScript output retains all four views, meaningful content, internal hash targets, and retired-hash anchors.
- Hash navigation, keyboard controls, filters, project selection/deep links, and browser-history scroll restoration continue to work.
- No horizontal overflow occurs at 1440×900, 1366×768, 1024×600, 1440×600, 390×844, 390×600, 320×568, 720×450, 768×1024, 844×390, or 1920×1080. The 720px viewport covers the 200% desktop-width equivalent.
- Reduced motion is respected. Axe reports no WCAG 2.1 A/AA or WCAG 2.2 AA violations on four views at desktop and mobile widths (eight scans).
- Canonical/social metadata, JSON-LD, robots, sitemap, CNAME, `.nojekyll`, resume, and local asset links remain valid.

## Verification and review

Run `npm run build`, `npm run check:seo`, `npm run check:ui`, and `npm run lint` against a local production preview on port 4173. Browser checks cover section and project history, retired hashes, no-JavaScript links/content, the four-view keyboard model, project filters and direct links, desktop rail access, social/resume actions, 320px mobile social visibility, all viewport widths above, reduced motion, runtime requests, and axe scans.

Capture honest viewport screenshots for all four desktop views, Overview and selected Projects on mobile, a naturally scrolled Projects page, and the mobile social row while reading a project. Capture Overview at 390×844 plus a full-page/document-height review to confirm that education and the HDB role remain easy to find. Regenerate `public/social-preview.png` only after the Overview visual review, then rebuild so `dist/social-preview.png` contains the approved image.

## Publishing boundary

No deployment is part of this redesign. A feature-branch push does not publish the site; the repository pipeline runs checks and deploys only after the change reaches `main`. Preserve the custom domain and static files. Publish only the verified `dist/` artifact through the existing GitHub Pages workflow.
