"use client";

import { useActionState } from "react";

import {
  createCalendarSourceAction,
  type CalendarFormState,
} from "@/features/calendar/actions";

const initialCalendarSourceState: CalendarFormState = {
  status: "idle",
  message: "",
};

interface CalendarSourceComposerProps {
  canMutate: boolean;
}

export function CalendarSourceComposer({ canMutate }: CalendarSourceComposerProps) {
  const [state, formAction, pending] = useActionState(
    createCalendarSourceAction,
    initialCalendarSourceState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Calendar label</label>
        <input
          type="text"
          name="label"
          placeholder="Shared household"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Provider</label>
        <select
          name="provider"
          defaultValue="icloud"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="icloud">iCloud</option>
          <option value="google">Google</option>
          <option value="outlook">Outlook</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Optional calendar link</label>
        <input
          type="url"
          name="url"
          placeholder="https://calendar.example.com/share"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Color token</label>
        <input
          type="text"
          name="colorToken"
          placeholder="sky"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={!canMutate || pending}
        className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Adding source..." : canMutate ? "Add calendar source" : "Live calendars locked"}
      </button>
      {state.status !== "idle" ? (
        <p className={`rounded-2xl px-4 py-3 text-sm leading-6 ${state.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
