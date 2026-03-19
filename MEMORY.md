# System Memory & Context
<!--
AGENTS: Update this file after every major milestone, structural change, or resolved bug.
Keep concise but do not remove still-relevant decisions.
-->

## Active Phase & Goal
**Current Task:** Phase 3 - shared task flow on top of the household/auth foundation
**Next Steps:**
1. Connect a real Supabase project through `.env.local`.
2. Apply the initial household/task migration in Supabase.
3. Build the first shared task CRUD flow.
4. Attach signed-in users to a Yumami household and surface household-scoped task data.

## Architectural Decisions
- [2026-03-19] Yumami is web-first for MVP, with mobile added later after the data model and core flows are stable.
- [2026-03-19] The primary stack is Next.js + TypeScript + Supabase, with Python reserved for bank PDF parsing.
- [2026-03-19] AI recommendations, reminders, and summarization are intentionally deferred to v1.5.
- [2026-03-19] Calendar and file systems should start with lightweight visibility/link integrations before deeper sync.
- [2026-03-19] The build repo uses local/system fonts instead of remote Google fonts so production builds remain offline-safe.
- [2026-03-19] Phase 2 uses Supabase magic-link auth as the first authentication flow because it is simple, secure, and appropriate for a two-user MVP.
- [2026-03-19] The initial relational schema centers on `households`, `household_members`, and `tasks` so all later shared-life features can anchor to a single household scope.

## Known Issues & Quirks
- A real Supabase project is not connected yet, so auth remains scaffolded but not live.
- Calendar integration path is still intentionally lightweight for MVP.
- PDF parsing should initially support one known bank statement format only.
- `next build` needed elevated execution in this environment because the sandbox blocked a Windows spawn step.

## Completed Phases
- [x] Phase 1: Web app scaffold and Yumami project setup
- [x] Phase 2: Supabase/auth foundation and initial household schema
- [ ] Phase 3: Shared tasks
- [ ] Phase 4: Dashboard shell
- [ ] Phase 5: Files hub
- [ ] Phase 6: Financial PDF import
- [ ] Phase 7: Calendar visibility
- [ ] Phase 8: AI layer (v1.5)
