# Portfolio design review

## Summary

The portfolio’s single job is to help recruiters understand Tran’s engineering background and follow up. The earlier design had a clear record of work, yet its mobile header occupied roughly 270px before the introduction, 10–11px uppercase labels weakened the hierarchy, and repeated bordered cards made the page feel busier than its content. Rating: **Needs work**. The earlier version did not have a memorable visual signature.

The Experience landing introduces Ha Thu with the supplied backend role, headline, and local portrait. A grouped row of native links follows the full introduction, leading to work history, education, and featured projects. The latest-first work history follows, with earlier roles in one native disclosure. Education and interests remain complete, then two user-authorized project features appear; the other six project cards remain on Projects. The visual system uses clear type, open spacing, and quiet separators.

**Current assessment: Good.** The baseline hierarchy, touch-target, and legibility findings below have been addressed. Browser checks cover route behavior, responsive reflow, 44px controls, text contrast, and automated accessibility rules. This assessment reflects browser QA; it does not claim physical-device or screen-reader testing.

This is a responsive web portfolio built with React and Tailwind for software engineering recruiters. Apple’s layout, typography, color, accessibility, craft, and motion guidance informs the design; native iOS and macOS controls do not apply to the website.

## Earlier design findings

- **High — Mobile hierarchy.** At a 390 × 844 viewport, the dark identity rail replacement stacked branding, four navigation links, three social buttons, and a second toolbar before the opening copy. The resulting header used about a third of the available height. Consolidate it into one compact sticky header, and move the reader quickly into the profile. This applies Apple’s “Order content by relative importance” (`layout.md` › Visual hierarchy); the measured layout was inspected from a rendered screenshot.
- **High — Small interface labels.** The earlier shell used 9–11px uppercase utility labels and project controls. Increase controls and secondary text to sizes recruiters can scan comfortably. Apple says, “Use font sizes that most people can read easily” (`typography.md` › Ensuring legibility).
- **Medium — Repeated framing.** The dark sidebar, toolbar, and repeated rounded card borders formed a heavy frame around relatively simple content. Remove the extra identity tile and breadcrumb toolbar; use spacing and occasional rules to group information. Apple advises grouping related items with negative space or separators (`layout.md` › Visual hierarchy). This severity is design judgment.
- **Medium — Experience split from the profile.** A separate route made recruiters leave the profile to see the professional timeline. Put the complete, latest-first timeline inside Experience while retaining the original role facts and direct employer links. This is an information-architecture judgment based on the recruiter task.

## Design plan

The plan is specific to Tran’s portfolio. It pairs a quiet system interface with a clear headline and a clean chronology that exposes the supplied engineering, data, and teaching history. It does not imitate Apple’s product storefront or use decorative code, gradients, metrics, numbers, or a generic project bento grid.

### Color tokens

| Role | Light | Dark | Text contrast and background |
| --- | --- | --- | --- |
| Canvas | `#F5F5F7` | `#161617` | — |
| Raised surface | `#FFFFFF` | `#242426` | — |
| Primary text | `#1D1D1F` | `#F5F5F7` | 15.46:1 light canvas; 16.61:1 dark canvas |
| Secondary text | `#626269` | `#B8B8C0` | 5.56:1 light canvas; 9.18:1 dark canvas |
| Link accent | `#0066CC` | `#79B8FF` | 5.11:1 light canvas; 8.71:1 dark canvas (7.46:1 on dark raised surface) |
| Primary action fill/text | `#0053A6` / `#FFFFFF` | `#0053A6` / `#FFFFFF` | 7.53:1 in both appearances |

Separators use `#D2D2D7` in light mode and `#55555C` in dark mode. The primary action has its own stable foreground token so the blue action never relies on a surface token for its text color.

### Type scale

Use the system sans-serif stack throughout; keep hierarchy in size and weight rather than adding a display typeface. Utility text starts at 12px and is typically 14px, standard body text is 17px with 28px leading, and section headings are 30–40px. The opening headline scales from 36px at 320px to 44px from 360px, 60px on standard screens, and 72px on larger screens. Long role detail uses 16px text with 28px leading. Text uses relative `rem` sizing so the layout can accommodate a 200% text preference. This scale follows Apple’s typography guidance to “Use font sizes that most people can read easily” (`typography.md` › Ensuring legibility); the 320px, 200% wide-font check keeps the headline to eight lines or fewer.

### Layout

The mobile layout places a flexible identity and social row above three section links and Resume. The regular layout brings identity, route links, social links, and Resume together in one header that can wrap when enlarged text needs more room. Both use a maximum content width of 1120px.

```text
Compact (320–767px)                 Regular (768px+)
[Identity + social]                 [Identity | navigation | social | Resume]
[Experience Projects Skills Resume] [---------------------------------------]
[Portrait + eyebrow]                [Eyebrow | portrait]
[Full-width headline]               [Headline | portrait]
[Friendly introduction]             [Introduction | portrait]
[Three in-page links, wrapped]        [Three links | portrait]
[Current role + earlier roles]      [Current role + earlier roles + logos]
[Education + interests]             [Education | Interests]
```

### Signature and motion

The signature is a personal introduction with a real portrait, a responsive headline, and three understated in-page links after the full friendly introduction. Their order follows the page: work history, education, then featured projects. This applies Apple’s guidance to “Order content by relative importance” (`layout.md` › Visual hierarchy) while keeping the complete introduction visible before the prompts. The current TikTok role stays visible while the seven earlier entries and their ordered employer marks sit behind a native summary. The two current experiments have their own full stories and a small featured preview after education and interests. The supplied headline and friendly introduction remain intact; the rest of the presentation avoids decorative code, invented metrics, and generic dashboard art.

The plan’s main risk was that a polished introduction could pull attention away from the work history. Keeping the current role visible while initially collapsing seven earlier entries leaves the current work easy to see and keeps the full history one action away.

## What works

- All eight roles remain in the supplied order: the current TikTok role first, then completed roles by end date. Earlier roles start collapsed in one native disclosure and keep their dates, descriptions, technologies, official company marks, and employer links in static HTML.
- Experience keeps confirmed employer, education, interests, and aspiration details, and features only the two user-authorized personal projects after career and education content.
- The three current views use actual clean-path anchors, and project detail routes stay directly loadable.
- One icon set communicates the three social destinations. Every icon-only social link has an accessible name and a 44px target.
- The header uses an opaque surface, visible focus states, and reduced-motion-aware transitions.
- The header stays sticky only when it fits comfortably within the viewport, becomes static at enlarged text or short heights, and remains static without JavaScript.
- Role dates use 18px medium type, education dates are separate from GPA, and the seven earlier-company marks wrap within narrow and enlarged-text layouts.
- The new OpenClaw and Chinese Learning projects have dedicated long-form routes with motivation, capabilities, architecture, examples, deployment, future plans, local screenshots, and their supplied resource links. The six earlier projects retain their compact detail views.
- The Projects index lists all eight cards. Hydrated filters show All (8), Backend (2), AI & bots (5), and Frontend (1); no-JavaScript output keeps direct project links and omits inactive filter controls.
- The portrait is the original user-supplied image, bundled locally and used once in the visible hero. The three native hero links follow the full introduction, fit within the viewport width at 320px, and remain in the initial normal-size 390px viewport.

## Verification quality floor

The browser matrix covers eleven canonical routes and the compatibility page, eleven viewport sizes, visible interactive targets, and 200% text at 320px, 390px, 768px, and 1440px across the routed views and both case studies. It checks Education and feature-anchor Back/Forward restoration, direct and no-JavaScript loads, project filtering, both project architectures, and supplied-image decoding. Twelve axe scans cover three routed views plus three project details at desktop and mobile widths; four additional scans cover the expanded work history in both appearances. The suite also checks computed body-text and primary-action contrast, increased contrast, forced-colors focus, keyboard operation, a native skip link, and reduced motion. Browser automation does not replace physical-device or manual screen-reader review.

## Platform notes

Apple’s platform component conventions target native apps. This website keeps familiar web behavior instead: semantic navigation, direct anchor destinations, visible keyboard focus, browser-managed zoom, and responsive CSS reflow. Apple’s accessibility guidance says, “Offer sufficiently sized controls” (`accessibility.md` › Mobility); the site uses 44px controls. Its dark palette also follows “Ensure that your app looks good in both appearance modes” (`dark-mode.md` › Best practices), translated to the visitor’s system color preference.
