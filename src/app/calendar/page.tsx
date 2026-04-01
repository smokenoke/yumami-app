import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { SharedCalendarVisibility } from "@/features/calendar/shared-calendar-visibility";
import { getAuthState } from "@/lib/supabase/session";
import { getCalendarWorkspace } from "@/lib/yumami/calendar";

export default async function CalendarPage() {
  const [authState, calendarWorkspace] = await Promise.all([
    getAuthState(),
    getCalendarWorkspace(),
  ]);

  if (!authState.hasEntryAccess) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  return (
    <AppShell
      eyebrow="Calendar"
      title="Your shared schedule, made easier to read."
      description="See what is next, move through the month or week, and keep calendar sources tucked away until you need them."
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
