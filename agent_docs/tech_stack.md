# Tech Stack & Tools

## Core Stack
- **Frontend:** Next.js (App Router) + React + TypeScript
- **Backend:** Next.js server actions and route handlers for the main app; Python module/worker for PDF parsing
- **Database:** PostgreSQL via Supabase
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage for app-owned uploads; lightweight Google Drive links/integration for MVP
- **Realtime:** Supabase Realtime for shared task/dashboard freshness where useful
- **Validation:** Zod for runtime validation of user input and upload metadata
- **Testing:** Vitest, Playwright, and Pytest for Python parsing code
- **Deployment:** Vercel for the web app, Supabase for data services

## Setup Commands
```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Planned Project Structure
```text
src/
  app/
  components/
  features/
    auth/
    dashboard/
    tasks/
    calendar/
    finances/
    files/
  lib/
    db/
    auth/
    realtime/
    integrations/
    utils/
  types/
python/
  pdf_parser/
  tests/
supabase/
  migrations/
  policies/
```

## Implementation Notes by Area
- **Tasks:** relational tables scoped by household, realtime updates for collaborative feel
- **Dashboard:** server-side summary queries feeding tile components
- **Calendar:** visibility first, deeper sync later
- **Finance:** upload PDF, parse asynchronously, review low-confidence categorizations before approval
- **Files:** start with curated links or lightweight file access hub before deep external sync

## Error Handling Pattern
```ts
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1).max(120),
  dueDate: z.string().datetime().optional(),
});

export async function createTask(input: unknown) {
  const parsed = createTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid task input.",
      details: parsed.error.flatten(),
    };
  }

  try {
    // Persist through a dedicated data-access layer.
    return { ok: true };
  } catch (error) {
    console.error("createTask failed", error);
    return {
      ok: false,
      error: "Unable to create task right now.",
    };
  }
}
```

## Styling & Component Example
```tsx
export function DashboardTile({ title, value, hint }: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-600">{hint}</p> : null}
    </section>
  );
}
```

## Naming Conventions
- Feature directories should be singular and descriptive, for example `tasks`, `finances`, `calendar`.
- Database tables should use explicit names such as `households`, `tasks`, `transactions`, `documents`.
- Avoid generic file names like `helpers.ts`; prefer `taskQueries.ts`, `transactionCategorizer.ts`, or `calendarSyncService.ts`.
- Keep shared types in `src/types/` or close to their feature if not reused broadly.

## Technical Guardrails
- Keep the main app as a modular monolith.
- Use Python only where it adds real value, mainly document parsing.
- Do not introduce a separate backend service unless the app complexity genuinely demands it.
- Keep AI as an isolated future layer, not embedded in MVP transaction flows.
