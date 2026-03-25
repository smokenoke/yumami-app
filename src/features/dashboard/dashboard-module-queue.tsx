interface DashboardModuleQueueProps {
  mode: "demo" | "live";
}

const queuedModules = [
  {
    title: "Shared files hub",
    stage: "Phase 5",
    summary: "Curated access to important shared files and folders.",
  },
  {
    title: "Finance import",
    stage: "Phase 6",
    summary: "Bank PDF parsing and categorized transaction review.",
  },
  {
    title: "Calendar visibility",
    stage: "Phase 7",
    summary: "Shared calendar sources and upcoming household commitments are now live from the dashboard.",
  },
] as const;

export function DashboardModuleQueue({ mode }: DashboardModuleQueueProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
            Module queue
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            What plugs into this dashboard next
          </h2>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {mode === "live" ? "Grounded in live household data" : "Safe dashboard prototype mode"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {queuedModules.map((module) => (
          <article
            key={module.title}
            className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-5"
          >
            <p className="text-sm font-medium text-[var(--accent-deep)]">{module.stage}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{module.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{module.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
