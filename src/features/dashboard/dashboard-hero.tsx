interface DashboardHeroProps {
  householdName: string;
  mode: "demo" | "live";
  openTasks: number;
}

export function DashboardHero({ householdName, mode, openTasks }: DashboardHeroProps) {
  const badgeText = mode === "live" ? "Live household mode" : "Demo household mode";

  return (
    <section className="rounded-[2.5rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(248,241,235,0.95),rgba(239,244,250,0.95))] px-6 py-7 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent-deep)]">
            Dashboard shell
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">
            Yumami is starting to look like a real shared control center.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            The dashboard is no longer just a placeholder. It now reads from the task
            workspace, surfaces household context, and prepares the shape that future
            finance, files, and calendar modules will plug into.
          </p>
        </div>
        <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent-deep)]">
          {badgeText}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white/80 px-4 py-4">
          <p className="text-sm text-slate-500">Household</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{householdName}</p>
        </div>
        <div className="rounded-[1.75rem] bg-white/80 px-4 py-4">
          <p className="text-sm text-slate-500">Open tasks</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{openTasks}</p>
        </div>
        <div className="rounded-[1.75rem] bg-white/80 px-4 py-4">
          <p className="text-sm text-slate-500">Next priority</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">Dashboard cohesion</p>
        </div>
      </div>
    </section>
  );
}
