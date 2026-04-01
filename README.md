# Yumami

A shared life-management app for two people, built as a web-first MVP. Yumami is designed to centralize shared tasks, calendar visibility, financial admin, and important shared files in one calm dashboard.

**Current Stage:** Core MVP modules are implemented, the first major UX/UI redesign is complete, and refinement is underway. The app now has a login-first entry flow, dedicated routes for `Home`, `Tasks`, `Calendar`, `Finance`, and `Files`, a split finance section, an upgraded task model, and polished task/calendar pages.

## Project Status
- Phase 1 complete: web app scaffold and Yumami project setup
- Phase 2 complete: Supabase foundation, initial schema, and first auth flow scaffold
- Phase 3 complete: shared task workflow foundation
- Phase 4 complete: dashboard shell
- Phase 5 complete: shared files hub
- Phase 6 complete: finance intake, categories, transaction review, and monthly rollups
- Phase 7 complete: calendar visibility with shared sources and upcoming events
- UX/UI redesign complete: route split, responsive shell, calmer overview-driven Home, and dedicated module pages
- Refinement complete for:
  - login-first entry experience
  - lighter product copy
  - popup/panel-based creation flows
  - finance information architecture
  - task model and task page polish
  - calendar page polish
- Next up: polish `Files`, then polish `Home`, then connect real Supabase for live day-to-day use

## Tech Stack
- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- Python reserved later for PDF parsing

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
- A real Supabase project still needs to be connected through `.env.local`.
- The latest schema migration is `supabase/migrations/0008_task_model_refinement.sql`.
- In this environment, `next build` may require elevated execution because of a Windows sandbox `spawn EPERM` issue.
