# Design and content guide

## Audience and purpose

This is a public portfolio for recruiters reviewing backend and software engineering experience, projects, and skills. Help a reader quickly understand who Ha Thu is, what she has worked on, and how to follow up. Prefer concise, friendly, practical copy with a future-looking interest in useful software and new technologies.

## Confirmed preferences

The following are owner-confirmed directions available in the conversation history supplied for this task. They are the current default and yield to a later explicit request:

- Use the three-view structure with Experience as the landing page, then Projects and Skills. Keep contact actions in the shared shell rather than adding an About or Contact view.
- The hero copy is “I build useful and scalable software.” It introduces Ha Thu as a TikTok backend engineer and NUS computer science graduate. Copy should sound friendly, practical, forward-looking, and interested in trying new technologies.
- In Experience, keep the current job visible first and put seven earlier roles in a latest-first native disclosure. Show company marks with roles where already supplied, and keep the disclosure's prompt at the end of its row.
- Keep grouped in-page prompts to Experience, Education, and Projects after the full introduction. Navigation motion should be smooth where enabled and respect reduced-motion preferences.
- Keep education prominent, with the date range easy to scan. Feature only My OpenClaw Lab and Chinese Learning Toolkit in Experience, with their detailed case studies available on their project routes. Keep the other six project records in Projects.
- Do not add an active red status dot, country taglines, or an expertise strip to Experience. Avoid awkward availability caveats or process notes in public copy.
- Preserve the facts and links the owner supplied. Ask only when a required fact cannot be found in the repository or request.

These notes do not claim access to other private conversations. The prior design discussions available here are summarized above; do not infer additional preferences from unavailable chat history.

## Evidence-backed visual direction

These are observations from the current implementation rather than permanent constraints. Use them as a starting point, and let newer owner direction take priority.

- **Quiet, content-first interface.** `src/views/ExperienceView.jsx` uses a large, direct headline, portrait, open whitespace, and thin separators. The header and body avoid a decorative frame around every section. Project cards still use panels where they help compare distinct work.
- **Appearance-aware palette.** `tailwind.config.js` defines canvas, paper, surface, ink, muted, line, blue accent, and action tokens in light and dark color schemes. Prefer these tokens over arbitrary one-off colors. The browser check includes light/dark and increased-contrast text cases.
- **Readable system typography.** The Tailwind sans family is the platform UI sans stack; headings use restrained tight tracking, while body content uses comfortable leading and responsive sizes. The `mono` utility is available for short technical labels. The UI does not currently use a custom font import as its primary type system.
- **Responsive, editorial layout.** The shell constrains the content to a readable maximum width and adjusts columns with Tailwind breakpoints. The Experience portrait moves alongside the headline on wider screens and remains beside the opening on narrow screens. Check the real composition instead of reducing mobile to a desktop page scaled down.
- **Evidence over decoration.** The project index and case studies pair concise summaries with supplied images, implementation information, architecture, and links. Keep useful detail and avoid invented metrics, claims, or decorative data.

## Interaction and accessibility

- Use clean real `<a>` routes for sections and projects so they load directly and remain available without JavaScript. Use fragment links only for genuine in-page anchors and preserve migration of existing legacy hashes.
- Keep native semantic elements when they already fit the job, including the work-history `<details>` disclosure. Preserve keyboard behavior, accessible names, current-page states, focus outlines, and visible skip navigation.
- Maintain minimum 44px pointer targets. Support long text, 200% text scaling, narrow layouts, and high-contrast/forced-color users. Keep meaningful image alternatives and intrinsic dimensions to avoid layout shifts.
- Preserve the current purposeful anchor/route motion only where it helps orientation, and ensure `prefers-reduced-motion` makes movement immediate. Do not add animation just to make a page feel active.
- A browser screenshot is evidence of its visible state only. For visual changes, inspect affected routes at desktop and mobile sizes; capture real screenshots when useful. The automated checks cover an 11-viewport layout matrix and additional keyboard, route, motion, text-scaling, and axe cases. They do not establish physical-device or manual screen-reader results.

## Review checklist

Before finishing a visual or content change, ask:

1. Can a recruiter scan the opening, current role, key dates, and contact routes without hunting?
2. Is the supplied content complete, accurately ordered, and limited to claims the owner has confirmed?
3. Does the change use existing Tailwind tokens and component/data boundaries?
4. Do the page and its controls remain clear at desktop, mobile, 320px width, and 200% text where relevant?
5. Can keyboard users find and activate the same navigation and disclosure, with visible focus and reduced motion respected?
6. Are direct route load, refresh, no-JavaScript content, metadata, and screenshots still appropriate for the changed page?

For current state examples, see `src/components/layout/PortfolioShell.jsx`, `src/components/content/ExperienceTimeline.jsx`, `src/components/content/ProjectIndex.jsx`, and `src/components/content/ProjectCaseStudy.jsx`. Use the production routes and current code as evidence; the older [design review](design-review.md) and [redesign plan](redesign-plan.md) are historical and superseded.
