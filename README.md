# Yumami

A shared life-management app for two people, built as a web-first MVP. Yumami is designed to centralize shared tasks, calendar visibility, financial admin, and important shared files in one calm dashboard.

**Current Phase:** End of Phase 7 - tasks, files, finance workflow, and calendar visibility are complete. A dedicated UX/UI reorganization pass is next.

## Project Status
- Phase 1 complete: web app scaffold and Yumami project setup
- Phase 2 complete: Supabase foundation, initial schema, and first auth flow scaffold
- Phase 3 complete: shared task workflow
- Phase 4 complete: dashboard shell
- Phase 5 complete: shared files hub
- Phase 6 complete: finance intake, categories, transaction review, and monthly rollups
- Phase 7 complete: calendar visibility with shared sources and upcoming events
- Next up: UX/UI reorganization before later AI features

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
- `MEMORY.md` - current phase, decisions, and known quirks
- `PRD-Yumami-MVP.md` - product requirements
- `TechDesign-Yumami-MVP.md` - technical design
- `agent_docs/` - detailed project guidance

## Notes
- A real Supabase project still needs to be connected through `.env.local`.
- Schema migrations now extend through `supabase/migrations/0007_calendar_visibility.sql`.
- In this environment, `next build` may require elevated execution because of a Windows sandbox `spawn EPERM` issue.
