import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";
import type { CalendarEvent, CalendarWorkspace, HouseholdCalendar } from "@/types/domain";

const demoCalendars: HouseholdCalendar[] = [
  {
    id: "demo-calendar-1",
    household_id: "demo-household",
    created_by_user_id: "demo-user",
    label: "Shared household",
    provider: "icloud",
    url: "https://calendar.example.com/shared-household",
    color_token: "sky",
    archived_at: null,
    created_at: "2026-03-24T08:00:00.000Z",
    updated_at: "2026-03-24T08:00:00.000Z",
  },
  {
    id: "demo-calendar-2",
    household_id: "demo-household",
    created_by_user_id: "demo-user",
    label: "Work checkpoints",
    provider: "google",
    url: null,
    color_token: "amber",
    archived_at: null,
    created_at: "2026-03-24T08:00:00.000Z",
    updated_at: "2026-03-24T08:00:00.000Z",
  },
];

const demoEvents: CalendarEvent[] = [
  {
    id: "demo-event-1",
    household_id: "demo-household",
    household_calendar_id: "demo-calendar-1",
    created_by_user_id: "demo-user",
    title: "Apartment insurance renewal",
    starts_at: "2026-03-25T18:30:00.000Z",
    ends_at: "2026-03-25T19:00:00.000Z",
    location: "Online",
    notes: "Review payment and policy documents together.",
    source_kind: "manual",
    archived_at: null,
    created_at: "2026-03-24T08:05:00.000Z",
    updated_at: "2026-03-24T08:05:00.000Z",
  },
  {
    id: "demo-event-2",
    household_id: "demo-household",
    household_calendar_id: "demo-calendar-1",
    created_by_user_id: "demo-user",
    title: "Parents dinner",
    starts_at: "2026-03-27T19:00:00.000Z",
    ends_at: "2026-03-27T22:00:00.000Z",
    location: "Leuven",
    notes: null,
    source_kind: "linked",
    archived_at: null,
    created_at: "2026-03-24T08:06:00.000Z",
    updated_at: "2026-03-24T08:06:00.000Z",
  },
  {
    id: "demo-event-3",
    household_id: "demo-household",
    household_calendar_id: "demo-calendar-2",
    created_by_user_id: "demo-user",
    title: "Quarterly planning block",
    starts_at: "2026-03-30T17:30:00.000Z",
    ends_at: "2026-03-30T19:00:00.000Z",
    location: null,
    notes: "Use this to align on admin, budget, and travel.",
    source_kind: "manual",
    archived_at: null,
    created_at: "2026-03-24T08:07:00.000Z",
    updated_at: "2026-03-24T08:07:00.000Z",
  },
];

export async function getCalendarWorkspace(): Promise<CalendarWorkspace> {
  try {
    const householdContext = await getHouseholdContextForActions();

    if (!householdContext) {
      return {
        mode: "demo",
        householdName: "Demo household",
        calendars: demoCalendars,
        events: demoEvents,
        canMutate: false,
        statusMessage:
          "Attach a signed-in user to a household to track live calendar sources and upcoming events.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const nowIso = new Date().toISOString();
    const [calendarResult, eventResult] = await Promise.all([
      supabase
        .from("household_calendars")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .is("archived_at", null)
        .order("label", { ascending: true }),
      supabase
        .from("calendar_events")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .is("archived_at", null)
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true })
        .limit(8),
    ]);

    if (calendarResult.error || eventResult.error) {
      return {
        mode: "demo",
        householdName: householdContext.householdName,
        calendars: demoCalendars,
        events: demoEvents,
        canMutate: false,
        statusMessage:
          "The household was found, but live calendar data could not be loaded yet. Demo schedule visibility is shown instead.",
      };
    }

    return {
      mode: "live",
      householdName: householdContext.householdName,
      calendars: (calendarResult.data ?? []) as HouseholdCalendar[],
      events: (eventResult.data ?? []) as CalendarEvent[],
      canMutate: true,
      statusMessage:
        "Live calendar visibility is active. Shared calendar sources and upcoming household events are now visible from the dashboard.",
    };
  } catch {
    return {
      mode: "demo",
      householdName: "Demo household",
      calendars: demoCalendars,
      events: demoEvents,
      canMutate: false,
      statusMessage:
        "Supabase is not configured yet, so Yumami is showing a safe demo calendar visibility flow.",
    };
  }
}
