# System Memory & Context
<!--
AGENTS: Update this file after every major milestone, structural change, or resolved bug.
Keep concise but do not remove still-relevant decisions.
-->

## Active Phase & Goal
**Current Task:** Live-data refinement, household testing, and finance parser/review tuning
**Next Steps:**
1. Use the real household flow end to end and capture awkward points in the testing workbook.
2. Keep tuning finance review/import UX from real statement usage before polishing Home.
3. Finish the remaining Home refinement only after the live module flows feel trustworthy.
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
- [2026-03-22] Phase 6 established the finance intake model: `statement_imports` holds household-scoped statement imports, while `statement_transactions` and category mapping drive review and monthly rollups.
- [2026-03-24] Finance categories stay flexible and human-shaped: Yumami now starts live households with no pre-seeded personal categories, lets users create new ones as real life demands them, and archives them instead of using an `active` flag.
- [2026-03-24] The finance module treats transaction review as a first-class workflow: statement imports feed `statement_transactions`, category mapping updates import counters automatically, and monthly rollups are derived from structured household finance data instead of spreadsheets alone.
- [2026-03-24] Phase 7 uses lightweight calendar visibility first: shared calendar sources and upcoming events are stored at the household level now, with room for deeper calendar sync later.
- [2026-04-01] The UX strategy uses 5 top-level destinations (`Home`, `Tasks`, `Calendar`, `Finance`, `Files`) with hybrid responsive navigation: desktop-style top navigation and mobile bottom navigation.
- [2026-04-01] The app now uses a login-first entry flow. Even demo access starts from an email step so the product feels intentional before entering the app shell.
- [2026-04-01] Creation flows should stay tucked away until needed. Tasks, files, finance, and calendar use panel-triggered add flows instead of always-open inline forms.
- [2026-04-01] Finance is now a section instead of one crowded page: overview on `/finance`, with dedicated routes for imports, categories, and review.
- [2026-04-01] The task model now includes assignment, priority, due dates, and archived history. A task is treated as a household coordination object, not just a title/status row.
- [2026-04-01] The refined task UX emphasizes urgency and ownership: overdue count, unassigned count, visible assignee chips, due-date tones, and collapsible history.
- [2026-04-01] The refined calendar UX emphasizes `what's next`, keeps source management secondary, and uses month/week/agenda views as the primary schedule surface.
- [2026-04-08] Auth now uses email/password entry as the main real-user path, with demo mode still available as a fallback while testing.
- [2026-04-08] Household onboarding is now a first-class flow: signed-in users who do not yet have an active household land in a setup screen where they can create a household, accept an invite, or choose among multiple households.
- [2026-04-08] Household invitations now use a dedicated `household_invites` table plus invite links. If a user belongs to exactly one household, Yumami can enter it automatically; if they belong to multiple, they should choose via the household flow.
- [2026-04-08] The app shell now surfaces a persistent session control with logout and links to household/account settings for signed-in users.
- [2026-04-10] Finance imports now parse KBC Touch PDFs directly inside the app. Uploading a statement creates `statement_transactions` automatically, maps general categories when confidence is high enough, and sends uncertain lines to the review queue instead of leaving imports stuck at `queued`.
- [2026-04-21] Finance learning now includes `merchant_category_rules` plus suggested-category fields. Reviewing a merchant teaches future imports how to auto-categorize that merchant for the same household.
- [2026-04-29] Statement imports now detect their own statement period from the PDF. Re-doing an import means deleting the import, which also deletes its transactions through `on delete cascade`, then re-uploading the PDF.
- [2026-04-29] The finance review flow is now logic-first: applying a category automatically marks the transaction as categorized, Review only shows unresolved transactions, and categorized transactions are inspected from each import detail page.

## Known Issues & Quirks
- A real Supabase project is still required for fully live auth + household onboarding + persistent tasks/files/finance imports/calendar data.
- Deep third-party calendar sync is still intentionally deferred.
- PDF parsing currently targets one known bank statement format first: KBC Touch PDF exports.
- `next build` may need elevated execution in this environment because the sandbox can block a Windows spawn step.

## Completed Phases
- [x] Phase 1: Web app scaffold and Yumami project setup
- [x] Phase 2: Supabase/auth foundation and initial household schema
- [x] Phase 3: Shared tasks foundation
- [x] Phase 4: Dashboard shell
- [x] Phase 5: Files hub
- [x] Phase 6: Financial PDF import and finance review foundation
- [x] Phase 7: Calendar visibility
- [ ] Phase 8: AI layer (v1.5)
- [x] UX/UI pass: navigation, module surfaces, and dashboard reorganization
- [x] Refinement pass: auth/onboarding, finance IA, task model, task polish, calendar polish, files polish, and live finance review/import refinement
