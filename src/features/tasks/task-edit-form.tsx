"use client";

import { useActionState } from "react";

import {
  updateTaskAction,
  type TaskFormState,
} from "@/features/tasks/actions";
import type { HouseholdParticipant, Task } from "@/types/domain";

const initialTaskFormState: TaskFormState = {
  status: "idle",
  message: "",
};

interface TaskEditFormProps {
  task: Task;
  members: HouseholdParticipant[];
  canMutate: boolean;
}

function toLocalDateTime(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function TaskEditForm({ task, members, canMutate }: TaskEditFormProps) {
  const [state, formAction, pending] = useActionState(
    updateTaskAction,
    initialTaskFormState,
  );

  return (
    <details className="rounded-[1.25rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-slate-700">
        Edit details
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Assign to</label>
            <select
              name="assignedToUserId"
              defaultValue={task.assigned_to_user_id ?? ""}
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
              defaultValue={task.priority}
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
            defaultValue={toLocalDateTime(task.due_at)}
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
            This to-do already has a completion timestamp saved.
          </p>
        ) : null}
        <button
          type="submit"
          disabled={!canMutate || pending}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving changes..." : canMutate ? "Save changes" : "Live to-dos locked"}
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
