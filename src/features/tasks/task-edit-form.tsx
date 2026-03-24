"use client";

import { useActionState } from "react";

import {
  updateTaskAction,
  type TaskFormState,
} from "@/features/tasks/actions";
import type { Task } from "@/types/domain";

const initialTaskFormState: TaskFormState = {
  status: "idle",
  message: "",
};

interface TaskEditFormProps {
  task: Task;
  canMutate: boolean;
}

export function TaskEditForm({ task, canMutate }: TaskEditFormProps) {
  const [state, formAction, pending] = useActionState(
    updateTaskAction,
    initialTaskFormState,
  );

  return (
    <details className="rounded-[1.25rem] bg-white/70 px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-slate-700">
        Edit task
      </summary>
      <form action={formAction} className="mt-4 space-y-3">
        <input type="hidden" name="taskId" value={task.id} />
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={task.title}
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
            defaultValue={task.notes ?? ""}
            disabled={!canMutate || pending}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            name="status"
            defaultValue={task.status}
            disabled={!canMutate || pending}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        {task.completed_at ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
            This task currently has a recorded completion timestamp.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={!canMutate || pending}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving changes..." : canMutate ? "Save changes" : "Live tasks locked"}
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
    </details>
  );
}
