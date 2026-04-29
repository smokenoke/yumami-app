import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { SharedCalendarVisibility } from "@/features/calendar/shared-calendar-visibility";
import { HouseholdGateway } from "@/features/households/household-gateway";
import { getAuthState } from "@/lib/supabase/session";
import { getViewerHouseholdState } from "@/lib/yumami/households";
import { getCalendarWorkspace } from "@/lib/yumami/calendar";

export default async function CalendarPage() {
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

  const calendarWorkspace = await getCalendarWorkspace();

  return (
    <AppShell
      eyebrow="Calendar"
      title="Your shared schedule, made easier to read."
      description="See what is next, move through the month or week, and keep calendar sources tucked away until you need them."
      userEmail={authState.user?.email ?? authState.demoEmail ?? undefined}
      isDemo={!authState.user && Boolean(authState.demoEmail)}
      actions={
        <Link href="/" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back home
        </Link>
      }
    >
      <SharedCalendarVisibility workspace={calendarWorkspace} />
    </AppShell>
  );
}
