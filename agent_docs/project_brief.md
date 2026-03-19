# Project Brief

- **Product vision:** Yumami is a calm shared life hub for two people that centralizes tasks, scheduling visibility, financial admin, and important shared files in one mobile-first experience.
- **Target Audience:** A young couple with careers who share schedules, finances, household responsibilities, and admin tasks.

## Conventions
- **Naming:** `camelCase` for variables/functions, `PascalCase` for React components, `kebab-case` for route segments, and descriptive table names in `snake_case` for database schema.
- **File Structure:** Organize by feature under `src/features/` with shared primitives in `src/components/` and backend/data logic in `src/lib/` or `src/server/`.
- **Separation of concerns:** UI components render and capture input; server actions/routes orchestrate; service modules contain business rules; database access stays in dedicated query/data-access files.
- **Validation:** Validate all external input with Zod or equivalent before writing to the database.

## Key Principles
- Ship the simplest version that solves the core user story for two users.
- Prefer visibility and lightweight integrations over deep ownership when a third-party system is complex.
- Keep the MVP web-first and mobile-first in design, not native-first in implementation.
- Delay AI features until the underlying structured data flows are stable and useful without AI.
- Use SQL-friendly relational modeling from the start so future automation and recommendations have clean data.

## Quality Gates
- Every feature starts with a short plan and ends with verification.
- New utility logic requires unit tests.
- Shared user flows should receive integration or E2E coverage.
- Update `MEMORY.md` whenever an architectural decision changes.
- Do not expand MVP scope without explicit approval.

## Key Commands
- `npm install` - install project dependencies
- `npm run dev` - run local development server
- `npm test` - run tests
- `npm run lint` - run linting
- `npm run build` - verify production build

## Update Cadence
- Refresh this brief after each major milestone.
- Update whenever stack decisions, architecture boundaries, or scope assumptions materially change.
