# Four-view portfolio plan

> **Historical and superseded.** This was a plan for a four-view redesign that is no longer the current site structure. The current default has Experience, Projects, and Skills. Follow the [design and content guide](design-content-guide.md) and [project guide](project-guide.md) instead.

## Current redesign scope

- Keep the four focused views: Overview, Projects, Experience, and Skills.
- Use clean, real-link navigation for `/`, `/projects/`, `/experience/`, `/skills/`, and all six `/projects/<id>/` detail routes. Recognized legacy hashes resolve to the matching route while Back/Forward preserves route and reading position.
- Remove the Singapore location text from the sidebar and the “Built with care in Singapore” footer copy. Present the role as Software Engineer and keep Overview free of an expertise strip and project details.
- Put Experience in reverse chronological order using the eight roles and exact dates supplied by the user. TikTok Backend Engineer (Jul 2026–Present) leads; completed roles follow in descending end-date order, with TikTok Intern (Jan–Mar 2026) next.
- Show the confirmed NUS Bachelor of Computing in Computer Science (Aug 2022–May 2026), GPA 4.6/5, First Class Honours, and Distinction in Software Engineering. The education facts are confirmed; no extra grades or dates should be inferred.
- Use the updated contact email `tranhathuwork@gmail.com` throughout the shared shell and metadata.

## Product direction

Present Tran Ha Thu as a backend/software engineer through a focused four-view portfolio: Overview, Projects, Experience, and Skills. The charcoal identity rail, warm canvas, restrained accent color, Manrope reading type, and IBM Plex Mono labels support a compact, direct presentation.

## View content

- **Overview:** show the biography, interests, aspiration, confirmed NUS Computer Science education, and TikTok as the current employer. Keep all project names, project images, implementation details, and architecture out of this view.
- **Projects:** retain FoROOM, Buddy4Good, Eggbot, TeleAI, FoodHero, and Portfolio Website, with their current images, implementation facts, architecture where available, skills, filters, and all existing links.
- **Experience:** show the eight user-supplied employment entries in reverse chronological order, with their verified dates, descriptions, company identities, and links.
- **Skills:** retain all 22 skills and their existing project links.

Keep the updated email, GitHub, LinkedIn, and resume actions available in the shared shell on desktop and mobile. Use clean section and project links with direct routes. The three contact/social actions remain reachable in the sticky mobile header while reading long content.

## Navigation and compatibility

Support pointer and keyboard navigation, arrow movement, Home/End, direct route refresh, project deep links, and browser Back/Forward with reading-position restoration. The section routes are `/`, `/projects/`, `/experience/`, and `/skills/`; project routes are `/projects/<id>/`.

Map recognized legacy hashes, including `#about`, `#aboutSection`, `#contact`, `#contactSec`, `#experiencesSec`, `#projectsSec`, section hashes, and project hashes, to their corresponding clean routes after hydration. Keep prerendered alias anchors for JavaScript-disabled readers.

## Acceptance criteria

- Exactly four portfolio views appear in navigation and prerendered HTML; About and Contact are not separate views.
- Overview presents the stated profile, interests, aspiration, NUS education, and current TikTok employer without project names, images, details, chooser, or architecture.
- All six projects, eight supplied roles, 22 skills, all 16 project destinations, employer destinations, and the resume remain available.
- Email, GitHub, LinkedIn, and Resume controls are visible on desktop and at 320px mobile width. Mobile social controls stay visible while reading a long project and provide at least 44px targets.
- Section and project navigation uses real links with clean destination paths; no authored hash navigation remains.
- No-JavaScript output serves all ten paths directly with their content and metadata, and retains retired-hash anchors on the homepage.
- Legacy hash redirects, keyboard controls, filters, project selection/deep links, and browser-history scroll restoration continue to work.
- No horizontal overflow occurs at 1440×900, 1366×768, 1024×600, 1440×600, 390×844, 390×600, 320×568, 720×450, 768×1024, 844×390, or 1920×1080. The 720px viewport covers the 200% desktop-width equivalent.
- Reduced motion is respected. Axe reports no WCAG 2.1 A/AA or WCAG 2.2 AA violations on four views at desktop and mobile widths (eight scans).
- Canonical/social metadata, JSON-LD, robots, sitemap, CNAME, `.nojekyll`, resume, and local asset links remain valid.

## Verification and review

Run `npm run build`, `npm run check:seo`, `npm run check:ui`, and `npm run lint` against a local production preview on port 4173. Browser checks cover direct route loads and refresh, legacy hash hydration, section and project history, no-JavaScript paths/content, keyboard focus, project filters and direct links, desktop rail access, social/resume actions, 320px mobile social visibility, all viewport widths above, reduced motion, runtime requests, and axe scans.

Capture viewport screenshots for all four desktop views, Overview and Experience on mobile, a selected and naturally scrolled Projects page, and the mobile social row while reading a project. Capture mobile Overview plus its full page and Experience with the timeline visible. Regenerate `public/social-preview.png` only after review, then rebuild so `dist/social-preview.png` contains the approved image.

## Publishing boundary

No deployment is part of this redesign. A feature-branch push does not publish the site; the repository pipeline runs checks and deploys only after the change reaches `main`. Preserve the custom domain and static files. Publish only the verified `dist/` artifact through the existing GitHub Pages workflow.
