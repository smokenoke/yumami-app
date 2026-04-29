import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { HomeDashboard } from "@/features/home/home-dashboard";
import { EntryScreen } from "@/features/auth/entry-screen";
import { HouseholdGateway } from "@/features/households/household-gateway";
import { buildDashboardSummary } from "@/features/dashboard/summary";
import { getAuthState } from "@/lib/supabase/session";
import { getViewerHouseholdState } from "@/lib/yumami/households";
import { getCalendarWorkspace } from "@/lib/yumami/calendar";
import { getFileWorkspace } from "@/lib/yumami/files";
import { getFinanceWorkspace } from "@/lib/yumami/finance";
import { getTaskWorkspace } from "@/lib/yumami/tasks";

export default async function Home() {
  const authState = await getAuthState();

  if (!authState.hasEntryAccess) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  if (authState.user) {
    const viewerState = await getViewerHouseholdState();
    if (viewerState.needsOnboarding || viewerState.needsHouseholdSelection) {
      return (
        <HouseholdGateway
          viewerState={viewerState}
          userEmail={authState.user.email ?? undefined}
        />
      );
    }
  }

  const [taskWorkspace, fileWorkspace, financeWorkspace, calendarWorkspace] = await Promise.all([
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

  return (
    <AppShell
      eyebrow="Yumami"
      title="What matters next, in one calm place."
      description="See the most important parts of your shared home life first, then jump into the full pages when you need more detail."
      userEmail={authState.user?.email ?? authState.demoEmail ?? undefined}
      isDemo={!authState.user && Boolean(authState.demoEmail)}
      actions={
        <>
          <Link href="/tasks" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Open to-dos
          </Link>
          <Link href="/calendar" className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Open calendar
          </Link>
        </>
      }
    >
      <HomeDashboard
        isConfigured={authState.isConfigured}
        viewerEmail={authState.user?.email ?? authState.demoEmail ?? undefined}
        summary={summary}
        taskWorkspace={taskWorkspace}
        calendarWorkspace={calendarWorkspace}
        financeWorkspace={financeWorkspace}
        fileWorkspace={fileWorkspace}
      />
    </AppShell>
  );
}
