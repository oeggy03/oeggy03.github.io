# Repository guidance

## Product and content

- This is a public recruiter portfolio for backend and software engineering.
- The current default has three views: Experience, Projects, and Skills. Contact actions live in the shared shell; there is no About or Contact view. The user can explicitly request a different view structure.
- Experience contains the profile, current employer, a latest-first work history with earlier roles in a native disclosure, education, and interests. Only the two user-authorized featured projects appear on Experience; keep all other projects and their details in Projects.
- Projects lists all eight current projects with dedicated routes. Preserve all currently supplied projects, roles, skills, and links; these counts describe today's content, not a cap on user-authorized additions. The work history starts with the current role, then completed roles sorted by end date descending, with the supplied detail. Skills contains the supplied skills.
- Do not add an active red status dot, country taglines, or an expertise strip to Experience.
- Use concise recruiter-facing copy; avoid internal process notes or awkward availability caveats on the website.
- Treat user-provided facts as authoritative. Do not invent achievements, skills, dates, metrics, employers, education, links, or project claims. Ask only when a needed fact cannot be inferred from the repository or request.
- When requested, keep `src/data/portfolio.js`, `docs/resume.html`, and the generated PDF synchronized. The HTML is the resume source; generate the PDF with `node scripts/generate-resume.mjs`.

## Implementation

- Use the existing React and Tailwind setup: Tailwind utility classes, reusable functional React components, and JavaScript/JSX ES modules.
- Do not introduce a bespoke CSS framework, backend, runtime server rendering, or another app framework unless the user asks.
- Do not add a bespoke website stylesheet. Keep any resume print layout within the resume source's existing styles.
- Preserve the existing responsive layout, keyboard access, semantic links, accessible names, focus visibility, reduced-motion support, and minimum 44px touch targets.
- Keep content/data separate from reusable view and UI components where the existing structure does so.

## Routes, rendering, and metadata

- This is a statically generated GitHub Pages site. Keep clean routes as generated index files and keep browser, static, and server-rendered route behavior aligned.
- Section and project navigation use clean paths; do not author hash links for those routes. Native in-page and skip links may use anchors. Preserve legacy hash migration in JavaScript for old inbound links.
- Each route must work by direct load and refresh. Keep real anchor navigation available without JavaScript; do not rely on a server-side SPA fallback.
- Preserve route-specific metadata, canonical and social URLs, JSON-LD, `robots.txt`, generated sitemap, `public/CNAME`, and `public/.nojekyll` when changing routes or site identity.
- Keep the source and build output consistent. Do not check in generated `dist/` output unless explicitly requested.

## Agent roles and task flow

- Required model targets: coordinator and reviewer use `gpt-6.1-sol` at High; developer and verifier use `gpt-6-luna` at XHigh.
- The coordinator plans, assigns, and reviews. The developer implements its assigned task directly and does not delegate again unless the owner explicitly asks. The verifier independently checks the scoped result and may write specifically assigned QA artifacts without weakening or skipping application checks. The reviewer is read-only.
- For actual edits (application code, fixes, docs, or configuration), the coordinator delegates implementation to the configured Luna developer only after scope, acceptance criteria, files, and TODOs are settled. The coordinator can inspect, run authorized QA, and handle delivery.
- Use the role contracts and handoff in [`docs/agent-workflow.md`](docs/agent-workflow.md). Keep parallel write scopes disjoint.
- Start feature work from fresh `main` on a feature branch unless the user explicitly asks to continue an existing branch or the developer is working on the coordinator-owned feature branch. Follow-up work for the same feature stays on that branch; after merge, start a fresh branch.
- Make focused commits for real logical steps (feat, fix, test, or docs). Do not commit once per file, split one step artificially, create empty commits, or squash user history.
- Complete authorized work and give concrete updates. Do not merge, automerge, or deploy without user authorization; merging to `main` triggers deployment.
- Current user scope and explicit higher-level instructions override this repository guidance.

## Model and client limits

- Repository prompts and Markdown describe workflow; they cannot enforce a model, reasoning level, sandbox, or approval setting.
- Codex reads trusted project config on a new session/reload; changing it does not change the current hosted chat. Custom agents inherit the parent sandbox and approval policy; this project config leaves those settings untouched.
- Cursor pins the named model in its agent file, but the user/client must select and verify the requested model-specific High or XHigh reasoning variant in the model picker/catalog before writing. If the requested variant is unavailable and no fallback was authorized, stop editing and report the limitation.
- Do not assume a model is available or claim that a prompt guarantees a role or reasoning setting. If the developer is unavailable or blocked, the coordinator can plan, read, and report the missing capability; do not substitute another model and claim the developer ran. Ask about a fallback only if needed after independent work is complete.

## Verification and delivery

- For docs/config-only changes, validate the edited Markdown, skill frontmatter, TOML, YAML, and links as appropriate; do not run application tests unless requested.
- For website work, use existing `lint`, `build`, `check:seo`, and `check:ui` checks when authorized or requested. Never weaken or skip frontend tests to make a change pass.
- For any UI or website behavior change, PRs require embedded, real screenshots of relevant desktop and mobile states, committed with the PR and identified by immutable commit SHA. Docs/config-only PRs must explain that screenshots are not applicable.
- Read the existing scripts before describing their coverage. Report the commands actually run, outcomes, and meaningful limits.
- Do not set global Git `safe.directory`. If Git reports an ownership error, use a per-command `git -c safe.directory=<repo>` setting only for the affected command.
- Do not check in personal absolute host paths, secrets, sandbox changes, or machine-specific settings.
