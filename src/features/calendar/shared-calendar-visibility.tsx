import {
  archiveCalendarEventAction,
  archiveCalendarSourceAction,
} from "@/features/calendar/actions";
import { CalendarEventComposer } from "@/features/calendar/calendar-event-composer";
import { CalendarSourceComposer } from "@/features/calendar/calendar-source-composer";
import type { CalendarWorkspace } from "@/types/domain";

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("en-BE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function providerLabel(provider: CalendarWorkspace["calendars"][number]["provider"]) {
  if (provider === "icloud") return "iCloud";
  if (provider === "google") return "Google";
  if (provider === "outlook") return "Outlook";
  return "Other";
}

function providerClasses(provider: CalendarWorkspace["calendars"][number]["provider"]) {
  if (provider === "icloud") return "bg-sky-100 text-sky-700";
  if (provider === "google") return "bg-emerald-100 text-emerald-700";
  if (provider === "outlook") return "bg-indigo-100 text-indigo-700";
  return "bg-slate-100 text-slate-700";
}

interface SharedCalendarVisibilityProps {
  workspace: CalendarWorkspace;
}

export function SharedCalendarVisibility({ workspace }: SharedCalendarVisibilityProps) {
  const calendarMap = new Map(workspace.calendars.map((calendar) => [calendar.id, calendar]));

  return (
    <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
            Calendar visibility
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">{workspace.householdName}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{workspace.statusMessage}</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${workspace.mode === "live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {workspace.mode === "live" ? "Live mode" : "Demo mode"}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {workspace.events.length > 0 ? (
            workspace.events.map((event) => {
              const calendar = event.household_calendar_id
                ? calendarMap.get(event.household_calendar_id)
                : null;

              return (
                <article key={event.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-slate-900">{event.title}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                          {event.source_kind}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{formatEventTime(event.starts_at)}</p>
                      {event.ends_at ? <p className="text-sm leading-6 text-slate-600">Until {formatEventTime(event.ends_at)}</p> : null}
                      {event.location ? <p className="mt-1 text-sm leading-6 text-slate-600">{event.location}</p> : null}
                      {calendar ? <p className="mt-1 text-sm leading-6 text-slate-600">From {calendar.label}</p> : null}
                      {event.notes ? <p className="mt-2 text-sm leading-6 text-slate-600">{event.notes}</p> : null}
                    </div>
                    <form action={archiveCalendarEventAction}>
                      <input type="hidden" name="eventId" value={event.id} />
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Archive
                      </button>
                    </form>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-600">
              No upcoming events yet. Add a shared calendar source or a manual household event to make the dashboard schedule-aware.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">Calendar sources</p>
              <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">
                {workspace.calendars.length} active
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {workspace.calendars.map((calendar) => (
                <div key={calendar.id} className="rounded-[1.25rem] bg-white px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-900">{calendar.label}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${providerClasses(calendar.provider)}`}>
                          {providerLabel(calendar.provider)}
                        </span>
                      </div>
                      {calendar.url ? (
                        <a href={calendar.url} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-[var(--accent-deep)] underline-offset-4 hover:underline">
                          Open shared calendar link
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-slate-600">No link stored yet, but this source can still anchor manual events.</p>
                      )}
                    </div>
                    <form action={archiveCalendarSourceAction}>
                      <input type="hidden" name="calendarId" value={calendar.id} />
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Archive
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CalendarSourceComposer canMutate={workspace.canMutate} />
          <CalendarEventComposer canMutate={workspace.canMutate} calendars={workspace.calendars} />
        </div>
      </div>
    </section>
  );
}
