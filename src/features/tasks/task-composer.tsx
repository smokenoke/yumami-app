"use client";

import { useActionState } from "react";

import {
  createTaskAction,
  type TaskFormState,
} from "@/features/tasks/actions";
import type { HouseholdParticipant } from "@/types/domain";

const initialTaskFormState: TaskFormState = {
  status: "idle",
  message: "",
};

interface TaskComposerProps {
  canMutate: boolean;
  members: HouseholdParticipant[];
}

export function TaskComposer({ canMutate, members }: TaskComposerProps) {
  const [state, formAction, pending] = useActionState(
    createTaskAction,
    initialTaskFormState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Pay the rent, book the dentist, plan groceries..."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Optional context for the other person."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Assign to</label>
          <select
            name="assignedToUserId"
            defaultValue=""
            disabled={!canMutate || pending}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">No one yet</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.displayName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
          <select
            name="priority"
            defaultValue="medium"
            disabled={!canMutate || pending}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Due date</label>
        <input
          type="datetime-local"
          name="dueAt"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={!canMutate || pending}
        className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : canMutate ? "Add to-do" : "Live to-dos locked"}
      </button>
      {state.status !== "idle" ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
