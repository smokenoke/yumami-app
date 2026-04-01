import Link from "next/link";

import type {
  CalendarWorkspace,
  DashboardSummary,
  FileWorkspace,
  FinanceWorkspace,
  TaskWorkspace,
} from "@/types/domain";

interface HomeDashboardProps {
  isConfigured: boolean;
  viewerEmail?: string;
  summary: DashboardSummary;
  taskWorkspace: TaskWorkspace;
  calendarWorkspace: CalendarWorkspace;
  financeWorkspace: FinanceWorkspace;
  fileWorkspace: FileWorkspace;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("en-BE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function sectionHeader(label: string, subtitle: string, href?: string, cta?: string) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent-deep)]">
          {label}
        </p>
        <p className="mt-2 text-sm text-[var(--muted-ink)]">{subtitle}</p>
      </div>
      {href && cta ? (
        <Link href={href} className="rounded-full bg-[var(--accent-quiet)] px-4 py-2 text-sm font-medium text-[var(--accent-deep)] transition hover:bg-[var(--accent-soft)]">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export function HomeDashboard({
  isConfigured,
  viewerEmail,
  summary,
  taskWorkspace,
  calendarWorkspace,
  financeWorkspace,
  fileWorkspace,
}: HomeDashboardProps) {
  const nextEvent = calendarWorkspace.events[0];
  const openTasks = taskWorkspace.tasks.filter((task) => task.status !== "done").slice(0, 3);
  const financeAlerts = financeWorkspace.transactions
    .filter((item) => item.review_status !== "categorized" || item.finance_category_id == null)
    .slice(0, 2);
  const filePreview = fileWorkspace.files.slice(0, 3);
  const latestRollup = financeWorkspace.rollups[0];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2.2rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(252,247,242,0.96),rgba(238,243,249,0.94))] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent-deep)]">
                Home
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">
                {summary.householdName}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted-ink)]">
                {summary.nextCalendarEventLabel}
              </p>
            </div>
            <div className="rounded-full border border-white/70 bg-white/76 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              {taskWorkspace.mode === "live" ? "Live" : "Demo"}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.45rem] border border-white/80 bg-white/82 px-4 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">To-dos</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.openTasks}</p>
            </div>
            <div className="rounded-[1.45rem] border border-white/80 bg-white/82 px-4 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Next event</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                {nextEvent ? formatEventTime(nextEvent.starts_at) : "Nothing planned yet"}
              </p>
            </div>
            <div className="rounded-[1.45rem] border border-white/80 bg-white/82 px-4 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Finance</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{summary.financeReviewLabel}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent-deep)]">
                Needs attention
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                The few things most worth noticing right now.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {openTasks[0] ? (
              <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">To-do</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{openTasks[0].title}</p>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">{openTasks[0].status.replace("_", " ")}</p>
              </div>
            ) : null}
            {nextEvent ? (
              <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Event</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{nextEvent.title}</p>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">{formatEventTime(nextEvent.starts_at)}</p>
              </div>
            ) : null}
            {financeAlerts[0] ? (
              <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Finance</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{financeAlerts[0].description}</p>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">Needs a category or review.</p>
              </div>
            ) : null}
            {!openTasks[0] && !nextEvent && !financeAlerts[0] ? (
              <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--muted-ink)]">
                Nothing urgent right now.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
          {sectionHeader("Quick actions", "Jump straight into the pages you use most.")}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/tasks" className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-white">
              To-dos
            </Link>
            <Link href="/calendar" className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-white">
              Calendar
            </Link>
            <Link href="/finance" className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-white">
              Finance
            </Link>
            <Link href="/files" className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-white">
              Files
            </Link>
          </div>
        </article>

        <article className="rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
          {sectionHeader("You", "Your current access and setup state.")}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Access:</span> {viewerEmail ?? "Guest"}
            </div>
            <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Supabase:</span> {isConfigured ? "Ready" : "Not set up"}
            </div>
            <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Mode:</span> {taskWorkspace.mode}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
          {sectionHeader("To-dos", "The next few things waiting for you.", "/tasks", "Open")}
          <div className="mt-4 space-y-3">
            {openTasks.length > 0 ? (
              openTasks.map((task) => (
                <div key={task.id} className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                  <p className="text-base font-semibold text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted-ink)]">{task.status.replace("_", " ")}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--muted-ink)]">
                No open to-dos right now.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
          {sectionHeader("Finance", "A quick sense of this month.", "/finance", "Open")}
          <div className="mt-4 rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Latest monthly net</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {latestRollup ? formatMoney(latestRollup.net) : "No data yet"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">{summary.financeReviewLabel}</p>
          </div>
        </article>

        <article className="rounded-[2.2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6">
          {sectionHeader("Files", "The references you reach for most.", "/files", "Open")}
          <div className="mt-4 space-y-3">
            {filePreview.length > 0 ? (
              filePreview.map((file) => (
                <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="block rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 transition hover:bg-white">
                  <p className="text-base font-semibold text-slate-900">{file.label}</p>
                  {file.description ? <p className="mt-1 text-sm text-[var(--muted-ink)]">{file.description}</p> : null}
                </a>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--muted-ink)]">
                No saved links yet.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

