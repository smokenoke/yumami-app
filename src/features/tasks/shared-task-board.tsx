import { ActionPanel } from "@/components/action-panel";
import { archiveTaskAction, toggleTaskStatusAction } from "@/features/tasks/actions";
import { TaskComposer } from "@/features/tasks/task-composer";
import { TaskEditForm } from "@/features/tasks/task-edit-form";
import type { HouseholdParticipant, Task, TaskWorkspace } from "@/types/domain";

function nextStatus(currentStatus: TaskWorkspace["tasks"][number]["status"]) {
  if (currentStatus === "todo") return "in_progress";
  if (currentStatus === "in_progress") return "done";
  return "todo";
}

function statusLabel(status: TaskWorkspace["tasks"][number]["status"]) {
  if (status === "todo") return "To do";
  if (status === "in_progress") return "In progress";
  return "Done";
}

function statusClasses(status: TaskWorkspace["tasks"][number]["status"]) {
  if (status === "done") return "bg-emerald-100 text-emerald-700";
  if (status === "in_progress") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function priorityLabel(priority: Task["priority"]) {
  if (priority === "high") return "High priority";
  if (priority === "low") return "Low priority";
  return "Medium priority";
}

function priorityClasses(priority: Task["priority"]) {
  if (priority === "high") return "bg-rose-100 text-rose-700";
  if (priority === "low") return "bg-sky-100 text-sky-700";
  return "bg-amber-100 text-amber-700";
}

function statusColumnClasses(status: TaskWorkspace["tasks"][number]["status"]) {
  if (status === "done") return "border-emerald-200 bg-emerald-50/70";
  if (status === "in_progress") return "border-amber-200 bg-amber-50/70";
  return "border-slate-200 bg-slate-50/80";
}

function formatDueDate(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-BE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function isOverdue(task: Task) {
  if (!task.due_at || task.status === "done") {
    return false;
  }

  return new Date(task.due_at).getTime() < Date.now();
}

function dueTone(task: Task) {
  if (!task.due_at) return "bg-[var(--surface-muted)] text-slate-600";
  if (isOverdue(task)) return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function getMember(members: HouseholdParticipant[], userId: string | null) {
  if (!userId) return null;
  return members.find((member) => member.userId === userId) ?? null;
}

function getMemberLabel(members: HouseholdParticipant[], userId: string | null) {
  return getMember(members, userId)?.displayName ?? "Unassigned";
}

function initials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface SharedTaskBoardProps {
  workspace: TaskWorkspace;
}

export function SharedTaskBoard({ workspace }: SharedTaskBoardProps) {
  const todoTasks = workspace.tasks.filter((task) => task.status === "todo");
  const inProgressTasks = workspace.tasks.filter((task) => task.status === "in_progress");
  const doneTasks = workspace.tasks.filter((task) => task.status === "done");
  const overdueTasks = workspace.tasks.filter(isOverdue);
  const unassignedTasks = workspace.tasks.filter((task) => !task.assigned_to_user_id && task.status !== "done");

  const sections: Array<{
    key: TaskWorkspace["tasks"][number]["status"];
    title: string;
    subtitle: string;
    tasks: TaskWorkspace["tasks"];
  }> = [
    { key: "todo", title: "To do", subtitle: "The things still waiting to be picked up.", tasks: todoTasks },
    { key: "in_progress", title: "In progress", subtitle: "Already in motion, so both of you can see it.", tasks: inProgressTasks },
    { key: "done", title: "Done", subtitle: "Finished, recorded, and ready to archive when it makes sense.", tasks: doneTasks },
  ];

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">To-dos</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{workspace.householdName}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{workspace.statusMessage}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${workspace.mode === "live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {workspace.mode === "live" ? "Live" : "Demo"}
            </div>
            <ActionPanel
              buttonLabel="New to-do"
              title="Add a new to-do"
              description="Now with assignment, priority, and due date built into the flow."
              variant="primary"
              disabled={!workspace.canMutate}
            >
              <TaskComposer canMutate={workspace.canMutate} members={workspace.members} />
            </ActionPanel>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">To do</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{todoTasks.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">In progress</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{inProgressTasks.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-rose-600">Overdue</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{overdueTasks.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Unassigned</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{unassignedTasks.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {sections.map((section) => (
          <div key={section.key} className={`rounded-[2rem] border px-5 py-5 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.22)] ${statusColumnClasses(section.key)}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">{section.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.subtitle}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">{section.tasks.length}</span>
            </div>

            <div className="mt-4 space-y-3">
              {section.tasks.length > 0 ? section.tasks.map((task) => {
                const archiveReason = task.status === "done" ? "completed" : "dismissed";
                const archiveLabel = task.status === "done" ? "Archive done" : "Archive";
                const dueDateLabel = formatDueDate(task.due_at);
                const member = getMember(workspace.members, task.assigned_to_user_id);

                return (
                  <article key={task.id} className="rounded-[1.5rem] border border-white/90 bg-white px-4 py-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{task.title}</p>
                        {task.notes ? <p className="mt-2 text-sm leading-6 text-slate-600">{task.notes}</p> : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 justify-end">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${priorityClasses(task.priority)}`}>
                          {priorityLabel(task.priority)}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClasses(task.status)}`}>
                          {statusLabel(task.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-700 shadow-sm">
                          {initials(member?.displayName ?? "Unassigned")}
                        </span>
                        <span>{member?.displayName ?? "Unassigned"}</span>
                      </span>
                      {dueDateLabel ? <span className={`rounded-full px-3 py-1 ${dueTone(task)}`}>{isOverdue(task) ? `Overdue · ${dueDateLabel}` : `Due · ${dueDateLabel}`}</span> : null}
                    </div>

                    {task.completed_at ? <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Completion recorded</p> : null}

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <form action={toggleTaskStatusAction}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="nextStatus" value={nextStatus(task.status)} />
                        <button type="submit" disabled={!workspace.canMutate} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                          {workspace.canMutate ? "Change status" : "Demo only"}
                        </button>
                      </form>
                      <form action={archiveTaskAction}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="archiveReason" value={archiveReason} />
                        <button type="submit" disabled={!workspace.canMutate} className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60">
                          {archiveLabel}
                        </button>
                      </form>
                    </div>

                    <div className="mt-4">
                      <TaskEditForm task={task} members={workspace.members} canMutate={workspace.canMutate} />
                    </div>
                  </article>
                );
              }) : (
                <div className="rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-white/70 px-4 py-5 text-sm leading-6 text-slate-600">Nothing here right now.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <details className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">History</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Archived to-dos stay available for context and later analysis.</p>
          </div>
          <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">{workspace.archivedTasks.length}</span>
        </summary>
        <div className="mt-4 space-y-3">
          {workspace.archivedTasks.length > 0 ? workspace.archivedTasks.map((task) => (
            <div key={task.id} className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{getMemberLabel(workspace.members, task.assigned_to_user_id)} · {priorityLabel(task.priority)}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                  {task.archived_reason ?? "archived"}
                </span>
              </div>
            </div>
          )) : <div className="rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-5 text-sm leading-6 text-slate-600">No archived to-dos yet.</div>}
        </div>
      </details>
    </section>
  );
}
