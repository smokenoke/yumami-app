import { AppShell } from "@/components/app-shell";
import { AuthEntryCard } from "@/features/auth/auth-entry-card";
import { SharedCalendarVisibility } from "@/features/calendar/shared-calendar-visibility";
import { DashboardHero } from "@/features/dashboard/dashboard-hero";
import { DashboardModuleQueue } from "@/features/dashboard/dashboard-module-queue";
import { DashboardStatusStrip } from "@/features/dashboard/dashboard-status-strip";
import { DashboardSummaryGrid } from "@/features/dashboard/dashboard-summary-grid";
import { buildDashboardHighlights, buildDashboardSummary } from "@/features/dashboard/summary";
import { SharedFilesHub } from "@/features/files/shared-files-hub";
import { SharedFinanceIntake } from "@/features/finance/shared-finance-intake";
import { SharedTaskBoard } from "@/features/tasks/shared-task-board";
import { getAuthState } from "@/lib/supabase/session";
import { getCalendarWorkspace } from "@/lib/yumami/calendar";
import { getFileWorkspace } from "@/lib/yumami/files";
import { getFinanceWorkspace } from "@/lib/yumami/finance";
import { getTaskWorkspace } from "@/lib/yumami/tasks";

export default async function Home() {
  const [authState, taskWorkspace, fileWorkspace, financeWorkspace, calendarWorkspace] = await Promise.all([
    getAuthState(),
    getTaskWorkspace(),
    getFileWorkspace(),
    getFinanceWorkspace(),
    getCalendarWorkspace(),
  ]);
  const summary = buildDashboardSummary(
    taskWorkspace,
    fileWorkspace,
    financeWorkspace,
    calendarWorkspace,
  );
  const highlights = buildDashboardHighlights(
    taskWorkspace,
    fileWorkspace,
    financeWorkspace,
    calendarWorkspace,
  );

  return (
    <AppShell
      eyebrow="Yumami"
      title="The dashboard shell is now the home of the product."
      description="Yumami now captures shared tasks, file links, finance workflow, and calendar visibility in one place. The next step after this phase is a dedicated UX pass so these proven modules can become a cleaner product experience."
    >
      <div className="space-y-5">
        <DashboardStatusStrip
          isConfigured={authState.isConfigured}
          userEmail={authState.user?.email}
          canMutate={
            taskWorkspace.canMutate ||
            fileWorkspace.canMutate ||
            financeWorkspace.canMutate ||
            calendarWorkspace.canMutate
          }
        />
        <DashboardHero
          householdName={summary.householdName}
          mode={taskWorkspace.mode}
          openTasks={summary.openTasks}
        />
        <DashboardSummaryGrid summary={summary} />
        <section className="grid gap-4 xl:grid-cols-6">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-[var(--border-soft)] bg-white px-5 py-5 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]"
            >
              <p className="text-sm text-slate-500">{item.title}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>
        <SharedTaskBoard workspace={taskWorkspace} />
        <SharedCalendarVisibility workspace={calendarWorkspace} />
        <SharedFilesHub workspace={fileWorkspace} />
        <SharedFinanceIntake workspace={financeWorkspace} />
        <DashboardModuleQueue mode={taskWorkspace.mode} />
        <AuthEntryCard userEmail={authState.user?.email} />
      </div>
    </AppShell>
  );
}
