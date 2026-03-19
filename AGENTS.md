# AGENTS.md - Master Plan for Yumami

## Project Overview & Stack
**App:** Yumami
**Overview:** Yumami is a shared life-management app for two people. It gives a calm, mobile-first dashboard for shared tasks, calendar visibility, financial admin, and quick access to important shared files. The MVP is web-first, with mobile to follow after the core workflows are stable.
**Stack:** Next.js + React + TypeScript, Supabase (Postgres/Auth/Storage/Realtime), Tailwind CSS, shadcn/ui, Python worker for PDF parsing
**Critical Constraints:** Mobile-first UX, strict TypeScript (no `any`), low-cost/free-first services, privacy-conscious architecture, AI features delayed until v1.5, keep MVP realistic for a 1-2 month timeline

## Framework Warning
This project uses a modern Next.js version. Before changing framework-specific APIs or patterns, check the relevant guidance in `node_modules/next/dist/docs/` and prefer current framework conventions over stale memory.

## Setup & Commands
- **Setup:** `npm install`
- **Development:** `npm run dev`
- **Linting:** `npm run lint`
- **Build:** `npm run build`
- **Type Check:** `npx tsc --noEmit`

## Protected Areas
Do NOT modify these areas without explicit human approval:
- **Infrastructure:** deployment configuration, Dockerfiles, and CI workflows under `.github/workflows/`
- **Database Migrations:** applied migrations once `supabase/migrations/` exists
- **Third-Party Integrations:** auth provider setup, calendar integration credentials, storage credentials, and any future AI provider configuration

## Coding Conventions
- Use feature-based organization.
- Keep business logic outside route handlers and UI components.
- Prefer server-side data orchestration for dashboard summaries.
- Use strict TypeScript and Zod validation for untrusted input.

## How I Should Think
1. Understand intent first.
2. Ask if critical context is missing.
3. Plan before coding.
4. Verify after changes.
5. Explain trade-offs.

## Agent Behaviors
1. Always propose a brief plan before changing more than one file.
2. Build one feature slice at a time.
3. Update `MEMORY.md` after meaningful architectural changes.
4. Explain what was built and ask short checkpoint questions when work is substantial.

## What NOT To Do
- Do NOT delete files without explicit confirmation.
- Do NOT modify database schemas without a migration plan.
- Do NOT add features outside the current phase.
- Do NOT skip verification for simple changes.
- Do NOT use deprecated patterns or `any`.
