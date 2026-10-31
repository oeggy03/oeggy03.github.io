# Featured project source notes

These notes record the sources used for the two featured case studies. The copy describes the project snapshots reviewed for this portfolio update.

## My OpenClaw Lab

Reviewed user-provided local documentation:

- `OPENCLAW-HARNESS.md` — local WSL gateway, Telegram integration, memory setup and checks, authenticated Playwright browser, and hosting status.
- `memory-capture-fix-report.md` — capture-threshold diagnosis, fresh-session recall check, and temporary test-data cleanup.
- `Playwright-MCP-setup.md` — official Playwright MCP setup and the owner's private sign-in flow.

The harness records that a Shopee cart interaction had not yet been verified at the time it was written. Later user-provided images show the conversation and resulting cart with one Tecware EX2 item. The case study treats those images as later evidence and says the interaction stopped before checkout.

Official tool references:

- OpenAI API documentation: <https://developers.openai.com/api/docs/>
- Microsoft Playwright MCP: <https://github.com/microsoft/playwright-mcp>
- memory-lancedb-pro: <https://github.com/CortexReach/memory-lancedb-pro>
- OpenAI Decisions guide (future exploration only): <https://developers.openai.com/api/docs/guides/decisions>

The featured thumbnail is the official OpenClaw light banner, shown on its own light background so the dark wordmark remains legible in either site appearance. The downloaded 1280×358 PNG (SHA-256 `7f8c835df2dce54814324fa879133baa8a1ded01b9fa6bb6f9f335ad45cb8a6e`) is pinned to commit [`60ba2bc1c1074deeee38d6fb79de7864afd7cc7a`](https://github.com/openclaw/openclaw/tree/60ba2bc1c1074deeee38d6fb79de7864afd7cc7a): [`docs/assets/openclaw-banner-light.png`](https://github.com/openclaw/openclaw/blob/60ba2bc1c1074deeee38d6fb79de7864afd7cc7a/docs/assets/openclaw-banner-light.png). The repository declares the MIT license; the exact upstream notice is included at [`src/assets/featured/openclaw-LICENSE.txt`](../src/assets/featured/openclaw-LICENSE.txt) and matches the pinned [license file](https://github.com/openclaw/openclaw/blob/60ba2bc1c1074deeee38d6fb79de7864afd7cc7a/LICENSE).

See [Experience refinements](experience-refinements.md) for the settled profile, typography, and content choices.

## Chinese Learning Toolkit

The three related repositories were reviewed as one project. Their cached snapshot commits are recorded for traceability:

- `oeggy03/call_analyzer` at `a146acacd169859967f3621a37975313bd9b83be`
  - App and vocabulary flow: `README.md`, `AGENTS.md`, `internal/service/capture_pipeline.go`, `internal/service/vocabulary.go`, `internal/service/manual_vocabulary.go`, `internal/service/photo_vocabulary.go`.
  - Local storage and sync: `internal/storage/outbox.go`, `internal/storage/vocabulary_cloud.go`, `internal/sync/runner.go`, `internal/sync/sync.go`.
  - Platform capture and lookup: `platform_source_darwin.go`, `platform_source_stub.go`, `native/macos-capture/Sources/call-analyzer-capture/Audio.swift`, `native/macos-capture/Sources/call-analyzer-capture/CaptureEngine.swift`, `native/macos-capture/Sources/call-analyzer-capture/OCR.swift`, `native/macos-lookup/Sources/call-analyzer-lookup/LookupAgent.swift`.
- `oeggy03/call_analyzer_lesson_db` at `b6a12ac24f158a19b17e751a3a5144cc5eb7a43`
  - Shared schema and ownership: `README.md`, `AGENTS.md`, `docs/ownership.md`, `supabase/migrations/20261025103511_initial_schema.sql`.
- `oeggy03/call_analyzer_active_recall` at `cf86907fba2ce46713ce4e0102df084f091f9a5d`
  - Delivery and deployment: `README.md`, `AGENTS.md`, `docs/operations.md`, `daily.go`, `telegram.go`, `supabase.go`, `Dockerfile`, `.github/workflows/deploy.yml`.

The daily recall image is a user-provided sample showing only part of a message. It is described as a sample, not a complete ten-word delivery. Deployment details come from the service documentation and workflow at the recorded snapshot commits.

Project repositories:

- Desktop app: <https://github.com/oeggy03/call_analyzer>
- Shared database: <https://github.com/oeggy03/call_analyzer_lesson_db>
- Daily recall service: <https://github.com/oeggy03/call_analyzer_active_recall>
