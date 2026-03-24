import type { DashboardSummary } from "@/types/domain";

interface DashboardSummaryGridProps {
  summary: DashboardSummary;
}

export function DashboardSummaryGrid({ summary }: DashboardSummaryGridProps) {
  const cards = [
    {
      label: "Active household",
      value: summary.householdName,
      hint: "The shared context that binds tasks, files, calendars, and finances together.",
    },
    {
      label: "Open tasks",
      value: `${summary.openTasks}`,
      hint: summary.nextCalendarEventLabel,
    },
    {
      label: "Task backlog",
      value: `${summary.totalTasks}`,
      hint: summary.filesHubLabel,
    },
    {
      label: "Next module signal",
      value: `${summary.upcomingTasks}`,
      hint: summary.financeReviewLabel,
    },
  ] as const;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[1.75rem] border border-[var(--border-soft)] bg-white px-5 py-5 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{card.hint}</p>
        </article>
      ))}
    </section>
  );
}
