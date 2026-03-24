# Yumami

A shared life-management app for two people, built as a web-first MVP. Yumami is designed to centralize shared tasks, calendar visibility, financial admin, and important shared files in one calm dashboard.

**Current Phase:** End of Phase 6 - dashboard, tasks, files, and the full manual finance workflow are complete. Calendar visibility is next.

## Project Status
- Phase 1 complete: web app scaffold and Yumami project setup
- Phase 2 complete: Supabase foundation, initial schema, and first auth flow scaffold
- Phase 3 complete: shared task workflow
- Phase 4 complete: dashboard shell
- Phase 5 complete: shared files hub
- Phase 6 complete: finance intake, categories, transaction review, and monthly rollups
- Next up: Phase 7 calendar visibility

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
- Finance migrations now extend through `supabase/migrations/0006_finance_categories_and_transactions.sql`.
- In this environment, `next build` may require elevated execution because of a Windows sandbox `spawn EPERM` issue.
