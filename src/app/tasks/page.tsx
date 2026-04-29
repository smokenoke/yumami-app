import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { HouseholdGateway } from "@/features/households/household-gateway";
import { SharedTaskBoard } from "@/features/tasks/shared-task-board";
import { getAuthState } from "@/lib/supabase/session";
import { getViewerHouseholdState } from "@/lib/yumami/households";
import { getTaskWorkspace } from "@/lib/yumami/tasks";

export default async function TasksPage() {
  const authState = await getAuthState();

  if (!authState.hasEntryAccess) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  if (authState.user) {
    const viewerState = await getViewerHouseholdState();
    if (viewerState.needsOnboarding || viewerState.needsHouseholdSelection) {
      return <HouseholdGateway viewerState={viewerState} userEmail={authState.user.email ?? undefined} />;
    }
  }

  const taskWorkspace = await getTaskWorkspace();

  return (
    <AppShell
      eyebrow="To-dos"
      title="Shared tasks, organized clearly."
      description="See what still needs attention, what is already in motion, and what is finished without everything collapsing into one long list."
      userEmail={authState.user?.email ?? authState.demoEmail ?? undefined}
      isDemo={!authState.user && Boolean(authState.demoEmail)}
      actions={
        <Link href="/" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back home
        </Link>
      }
    >
      <SharedTaskBoard workspace={taskWorkspace} />
    </AppShell>
  );
}
