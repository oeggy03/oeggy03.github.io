# Experience refinements

This note records the settled choices for the Experience refresh. It documents presentation preferences; the website remains the source for the full supplied profile and project facts.

## Profile and layout

- Keep the Experience headline concise: 32px on narrow mobile, 36px from 360px, 48px from the small breakpoint, and no more than 56px on desktop. Keep section headings around 24–30px. Use 15px for Experience body copy, 16px for dates and company names, 18–20px for role and institution names, and 16px/18px for the introduction on mobile/larger layouts.
- Keep the compact portrait beside the profile eyebrow on mobile at about 112px wide, growing to 128px at the small breakpoint and a maximum of 18rem on desktop. Let both card faces determine their height so text can wrap without clipping.
- At narrow widths, give the hero 16px of top padding, 24px between rows, and 24px between the introduction and its links; use 16px between hero rows from the medium breakpoint while retaining the shared shell gutters.
- Keep the earlier-employer label and logo preview together from 1024px upward. Below that width, show only the existing right-aligned native disclosure action. Stack Interests under Education with a top divider and 32px of padding until 1280px, then use the side-by-side layout with a vertical divider.
- On the mobile card back, show only “Singaporean” and “Eligible for H1B1 Visa.” The desktop profile can show the full supplied details, including name and current Backend Engineer role at TikTok.
- Use a native, keyboard-operable button with visible “Flip card” and “Photo” hints. Once per session, the automatic demo starts about 900ms after the card enters view, shows the reverse for three seconds, then returns to the front. Skip the demo when Experience is hidden or reduced motion is preferred; make manual flips immediate with reduced motion. Cancel the demo for page pointer or keyboard input, card focus or activation, and clean up its timers and listeners.

## Experience content

- Present the education honours as one paragraph, omit minors, and give awards their own line.
- Keep the supplied interests, followed by the supplied skills and languages. Do not add a skills or expertise strip to the hero.
- Keep recruiter-facing copy concise and preserve the supplied facts and links without adding claims.

## Featured project image

The OpenClaw project uses the official light brand banner, with its own light background. This gives the wordmark a legible field in both site appearances without adding theme-specific image switching. Source and license details are recorded in [project source notes](project-source-notes.md).
