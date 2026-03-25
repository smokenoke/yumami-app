"use client";

import { useActionState } from "react";

import {
  createCalendarEventAction,
  type CalendarFormState,
} from "@/features/calendar/actions";
import type { HouseholdCalendar } from "@/types/domain";

const initialCalendarEventState: CalendarFormState = {
  status: "idle",
  message: "",
};

interface CalendarEventComposerProps {
  canMutate: boolean;
  calendars: HouseholdCalendar[];
}

export function CalendarEventComposer({ canMutate, calendars }: CalendarEventComposerProps) {
  const [state, formAction, pending] = useActionState(
    createCalendarEventAction,
    initialCalendarEventState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Event title</label>
        <input
          type="text"
          name="title"
          placeholder="Dentist appointment"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Calendar source</label>
        <select
          name="householdCalendarId"
          defaultValue=""
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">No linked source</option>
          {calendars.map((calendar) => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Starts</label>
          <input
            type="datetime-local"
            name="startsAt"
            disabled={!canMutate || pending}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Ends</label>
          <input
            type="datetime-local"
            name="endsAt"
            disabled={!canMutate || pending}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
        <input
          type="text"
          name="location"
          placeholder="Leuven"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Source type</label>
        <select
          name="sourceKind"
          defaultValue="manual"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="manual">Manual</option>
          <option value="linked">Linked</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Optional context for the event."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={!canMutate || pending}
        className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Adding event..." : canMutate ? "Add event" : "Live events locked"}
      </button>
      {state.status !== "idle" ? (
        <p className={`rounded-2xl px-4 py-3 text-sm leading-6 ${state.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
