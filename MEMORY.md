# System Memory & Context
<!--
AGENTS: Update this file after every major milestone, structural change, or resolved bug.
Keep concise but do not remove still-relevant decisions.
-->

## Active Phase & Goal
**Current Task:** Post-Phase 7 UX/UI reorganization
**Next Steps:**
1. Reorganize the long dashboard into a clearer product structure.
2. Introduce proper navigation and module-level surfaces instead of one stacked page.
3. Keep the proven data model and workflows intact while improving the product experience.
4. Prepare the app for the later AI layer on top of structured household data.

## Architectural Decisions
- [2026-03-19] Yumami is web-first for MVP, with mobile added later after the data model and core flows are stable.
- [2026-03-19] The primary stack is Next.js + TypeScript + Supabase, with Python reserved for bank PDF parsing.
- [2026-03-19] AI recommendations, reminders, and summarization are intentionally deferred to v1.5.
- [2026-03-19] Calendar and file systems should start with lightweight visibility/link integrations before deeper sync.
- [2026-03-19] The build repo uses local/system fonts instead of remote Google fonts so production builds remain offline-safe.
- [2026-03-19] Phase 2 uses Supabase magic-link auth as the first authentication flow because it is simple, secure, and appropriate for a two-user MVP.
- [2026-03-19] The initial relational schema centers on `households`, `household_members`, and `tasks` so all later shared-life features can anchor to a single household scope.
- [2026-03-21] Phase 3 uses a dual-mode task workspace: live household-scoped Supabase tasks when configured, and a safe demo fallback when the environment or household membership is not ready yet.
- [2026-03-22] Tasks are archived instead of hard-deleted. The board filters `archived_at is null`, so inactive tasks stay in the database for future history and audit use.
- [2026-03-22] Task lifecycle meaning is now explicit: `completed_at` records completion timing, and `archived_reason` distinguishes completed archivals from dismissed/cancelled/duplicate tasks for future analysis and AI learning.
- [2026-03-22] Phase 4 promotes the homepage into a true dashboard shell, with task-derived summary cards and module queue sections that future files, finance, and calendar features can slot into.
- [2026-03-22] Phase 5 adds a link-first `file_links` model so the shared files hub is useful now without requiring full third-party file synchronization.
- [2026-03-22] Phase 6 adds a link-between-now-and-later finance intake model: `statement_imports` records household-scoped PDF intake metadata now, while leaving room for the later parser and categorization workflow.
- [2026-03-24] Finance categories stay flexible and human-shaped: Yumami seeds household categories from the real Excel reporting buckets, lets you add new ones over time, and archives them instead of using an `active` flag or rigid sort metadata.
- [2026-03-24] The finance module now treats manual transaction review as a first-class workflow: statement imports feed `statement_transactions`, category mapping updates import counters automatically, and monthly rollups are derived from structured household finance data instead of spreadsheets alone.
- [2026-03-24] Phase 7 uses lightweight calendar visibility first: shared calendar sources and upcoming events are stored at the household level now, with room for deeper calendar sync later.
- [2026-03-24] The next priority is UX/UI reorganization, because the single long integration page has served its purpose as a build surface and now needs to become a clearer product experience.

## Known Issues & Quirks
- A real Supabase project is still required for live auth and persistent tasks/files/finance imports/calendar data.
- Deep third-party calendar sync is still intentionally deferred.
- PDF parsing should initially support one known bank statement format only.
- `next build` needed elevated execution in this environment because the sandbox blocked a Windows spawn step.

## Completed Phases
- [x] Phase 1: Web app scaffold and Yumami project setup
- [x] Phase 2: Supabase/auth foundation and initial household schema
- [x] Phase 3: Shared tasks
- [x] Phase 4: Dashboard shell
- [x] Phase 5: Files hub
- [x] Phase 6: Financial PDF import
- [x] Phase 7: Calendar visibility
- [ ] Phase 8: AI layer (v1.5)
- [ ] UX/UI pass: navigation, module surfaces, and dashboard reorganization
