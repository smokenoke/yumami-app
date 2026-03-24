import { archiveTaskAction, toggleTaskStatusAction } from "@/features/tasks/actions";
import { TaskComposer } from "@/features/tasks/task-composer";
import { TaskEditForm } from "@/features/tasks/task-edit-form";
import type { TaskWorkspace } from "@/types/domain";

function nextStatus(currentStatus: TaskWorkspace["tasks"][number]["status"]) {
  if (currentStatus === "todo") {
    return "in_progress";
  }

  if (currentStatus === "in_progress") {
    return "done";
  }

  return "todo";
}

function statusLabel(status: TaskWorkspace["tasks"][number]["status"]) {
  if (status === "todo") {
    return "To do";
  }

  if (status === "in_progress") {
    return "In progress";
  }

  return "Done";
}

function statusClasses(status: TaskWorkspace["tasks"][number]["status"]) {
  if (status === "done") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "in_progress") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

interface SharedTaskBoardProps {
  workspace: TaskWorkspace;
}

export function SharedTaskBoard({ workspace }: SharedTaskBoardProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
            Shared tasks
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            {workspace.householdName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            {workspace.statusMessage}
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            workspace.mode === "live"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {workspace.mode === "live" ? "Live mode" : "Demo mode"}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          {workspace.tasks.length > 0 ? (
            workspace.tasks.map((task) => {
              const archiveReason = task.status === "done" ? "completed" : "dismissed";
              const archiveLabel =
                task.status === "done" ? "Archive completed task" : "Archive dismissed task";

              return (
                <article
                  key={task.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {task.title}
                      </p>
                      {task.notes ? (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {task.notes}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClasses(
                        task.status,
                      )}`}
                    >
                      {statusLabel(task.status)}
                    </span>
                  </div>
                  {task.completed_at ? (
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">
                      Completion recorded
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={toggleTaskStatusAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <input
                        type="hidden"
                        name="nextStatus"
                        value={nextStatus(task.status)}
                      />
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {workspace.canMutate ? "Advance status" : "Demo only"}
                      </button>
                    </form>
                    <form action={archiveTaskAction}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="archiveReason" value={archiveReason} />
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {archiveLabel}
                      </button>
                    </form>
                  </div>
                  <div className="mt-4">
                    <TaskEditForm task={task} canMutate={workspace.canMutate} />
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-600">
              No active shared tasks yet. Create the first one for your household.
            </div>
          )}
        </div>

        <TaskComposer canMutate={workspace.canMutate} />
      </div>
    </section>
  );
}
