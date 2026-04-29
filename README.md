# Yumami

A shared life-management app for two people, built as a web-first MVP. Yumami is designed to centralize shared tasks, calendar visibility, financial admin, and important shared files in one calm dashboard.

**Current Stage:** Core MVP modules are implemented, the major UX/UI redesign is complete, and live-data refinement is underway. The app now has email/password entry, household onboarding and invites, dedicated routes for `Home`, `Tasks`, `Calendar`, `Finance`, and `Files`, parser-backed KBC PDF imports, merchant-memory finance learning, and a cleaner finance review/import-detail flow.

## Project Status
- Phase 1 complete: web app scaffold and Yumami project setup
- Phase 2 complete: Supabase foundation, initial schema, and first auth flow scaffold
- Phase 3 complete: shared task workflow foundation
- Phase 4 complete: dashboard shell
- Phase 5 complete: shared files hub
- Phase 6 complete: parser-backed finance imports, category learning, transaction review, and monthly rollups
- Phase 7 complete: calendar visibility with shared sources and upcoming events
- UX/UI redesign complete: route split, responsive shell, calmer overview-driven Home, and dedicated module pages
- Refinement complete for:
  - login-first entry experience
  - household onboarding, invites, and settings surfaces
  - lighter product copy
  - popup/panel-based creation flows
  - finance information architecture
  - task model and task page polish
  - calendar page polish
  - files page polish
  - finance review/import-detail logic
- Next up: validate the live household flow with real usage, keep tuning finance review/import UX from real statements, and then finish the remaining Home polish

## Tech Stack
- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- Python-backed KBC PDF text extraction

## Local Development
Run the app locally with:

```bash
npm.cmd install
npm.cmd run dev
```

Verification commands:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Important Project Docs
- `AGENTS.md` - build rules and implementation workflow
- `MEMORY.md` - current stage, decisions, and known quirks
- `PRD-Yumami-MVP.md` - product requirements
- `TechDesign-Yumami-MVP.md` - technical design
- `agent_docs/ux-strategy.md` - product UX direction
- `agent_docs/ia-and-screen-blueprint.md` - route map and screen structure
- `agent_docs/yumami-testing-matrix-template.xlsx` - testing workbook for real-use refinement

## Notes
- Supabase is wired locally through `.env.local`, but the live household flow still depends on your real project data and migrations being present.
- The latest schema migration is `supabase/migrations/0010_finance_learning.sql`.
- Finance imports now detect the statement period from the PDF automatically.
- The Review tab only shows unresolved transactions; categorized transactions are inspected from each import's detail page.
- In this environment, `next build` may require elevated execution because of a Windows sandbox `spawn EPERM` issue.
