import { phaseTwoChecklist } from "@/lib/yumami/roadmap";
import type { DashboardSummary } from "@/types/domain";

interface PhaseTwoPanelProps {
  isConfigured: boolean;
  summary: DashboardSummary;
  userEmail?: string;
}

export function PhaseTwoPanel({
  isConfigured,
  summary,
  userEmail,
}: PhaseTwoPanelProps) {
  return (
    <div className="space-y-5">
      <aside className="rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,247,252,0.96))] p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
          Environment status
        </p>
        <div className="mt-4 flex items-center justify-between rounded-[1.5rem] bg-white/80 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Supabase configuration
            </p>
            <p className="text-sm text-slate-500">
              {isConfigured
                ? "Environment variables detected."
                : "Add .env.local from .env.example to activate auth."}
            </p>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              isConfigured
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isConfigured ? "Ready" : "Needs setup"}
          </div>
        </div>
        <div className="mt-4 rounded-[1.5rem] bg-[var(--accent-soft)] p-4 text-sm leading-6 text-[var(--accent-deep)]">
          {userEmail
            ? `Signed in as ${userEmail}. The next step is attaching that user to a household.`
            : "No signed-in user yet. We will wire email auth first, then attach that user to a household."}
        </div>
      </aside>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-5 py-5 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <p className="text-sm text-slate-500">Open tasks</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {summary.openTasks}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Shared task flow comes immediately after household setup.
          </p>
        </article>

        <article className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-5 py-5 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <p className="text-sm text-slate-500">Household</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {summary.householdName}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            One household, two members, clear ownership boundaries.
          </p>
        </article>
      </div>

      <aside className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
          Phase 2 checklist
        </p>
        <ol className="mt-5 space-y-4 text-sm text-slate-600">
          {phaseTwoChecklist.map((item, index) => (
            <li key={item}>
              <span className="font-semibold text-slate-900">{index + 1}.</span>{" "}
              {item}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
