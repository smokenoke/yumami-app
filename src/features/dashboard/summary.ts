import type { DashboardSummary, FileWorkspace, FinanceWorkspace, TaskWorkspace } from "@/types/domain";

function countCompletedTasks(workspace: TaskWorkspace) {
  return workspace.tasks.filter((task) => task.status === "done").length;
}

function countInProgressTasks(workspace: TaskWorkspace) {
  return workspace.tasks.filter((task) => task.status === "in_progress").length;
}

export function buildDashboardSummary(
  taskWorkspace: TaskWorkspace,
  fileWorkspace: FileWorkspace,
  financeWorkspace: FinanceWorkspace,
): DashboardSummary {
  const totalTasks = taskWorkspace.tasks.length;
  const openTasks = taskWorkspace.tasks.filter((task) => task.status !== "done").length;
  const upcomingTasks = taskWorkspace.tasks.filter((task) => task.status === "todo").length;
  const completedTasks = countCompletedTasks(taskWorkspace);
  const inProgressTasks = countInProgressTasks(taskWorkspace);
  const fileCount = fileWorkspace.files.length;
  const reviewCount = financeWorkspace.transactions.filter(
    (item) => item.review_status !== "categorized" || item.finance_category_id == null,
  ).length;
  const latestRollup = financeWorkspace.rollups[0];

  return {
    householdName: taskWorkspace.householdName,
    totalTasks,
    openTasks,
    upcomingTasks,
    nextCalendarEventLabel:
      totalTasks > 0
        ? `${upcomingTasks} task${upcomingTasks === 1 ? "" : "s"} still waiting to be picked up.`
        : "Calendar visibility will land after tasks and finance are stable.",
    financeReviewLabel:
      latestRollup
        ? `${reviewCount} finance item${reviewCount === 1 ? "" : "s"} need review. Latest net: ${new Intl.NumberFormat("en-BE", {
            style: "currency",
            currency: "EUR",
          }).format(latestRollup.net)}.`
        : completedTasks > 0
          ? `${completedTasks} task${completedTasks === 1 ? "" : "s"} completed and ready to inform later routines.`
          : "Finance import is ready for its first statement intake.",
    filesHubLabel:
      fileCount > 0
        ? `${fileCount} shared link${fileCount === 1 ? "" : "s"} already live in the files hub.`
        : inProgressTasks > 0
          ? `${inProgressTasks} task${inProgressTasks === 1 ? " is" : "s are"} currently in motion while the files hub is still empty.`
          : "Files hub is ready for its first curated shared links.",
  };
}

export function buildDashboardHighlights(
  taskWorkspace: TaskWorkspace,
  fileWorkspace: FileWorkspace,
  financeWorkspace: FinanceWorkspace,
) {
  const completedTasks = countCompletedTasks(taskWorkspace);
  const openTasks = taskWorkspace.tasks.filter((task) => task.status !== "done").length;
  const fileCount = fileWorkspace.files.length;
  const importCount = financeWorkspace.imports.length;
  const transactionCount = financeWorkspace.transactions.length;
  const latestRollup = financeWorkspace.rollups[0];

  return [
    {
      title: "Household rhythm",
      value: taskWorkspace.mode === "live" ? "Live sync" : "Demo flow",
      description:
        taskWorkspace.mode === "live"
          ? "Your active household data is powering the current dashboard."
          : "The dashboard is safe to explore before Supabase and household membership are fully wired.",
    },
    {
      title: "Open commitments",
      value: `${openTasks}`,
      description:
        openTasks > 0
          ? "These are the tasks still asking for attention across your shared life."
          : "No open tasks right now. That leaves room for planning rather than catching up.",
    },
    {
      title: "Shared references",
      value: `${fileCount}`,
      description:
        fileCount > 0
          ? "Your household now has a central place for important file and drive links."
          : "The files hub is ready to become the shared doorway into your docs and folders.",
    },
    {
      title: "Finance intake",
      value: `${transactionCount}`,
      description:
        latestRollup
          ? `The latest month is sitting at ${new Intl.NumberFormat("en-BE", {
              style: "currency",
              currency: "EUR",
            }).format(latestRollup.net)} net across ${importCount} tracked import${importCount === 1 ? "" : "s"}.`
          : importCount > 0
            ? "Statement imports are now tracked and ready for transaction review and monthly rollups."
            : "The finance module is ready for its first PDF statement intake.",
    },
    {
      title: "Completed signals",
      value: `${completedTasks}`,
      description:
        completedTasks > 0
          ? "Finished tasks now carry explicit lifecycle data for future insights and AI learning."
          : "Once tasks are completed, Yumami can start learning from real household follow-through.",
    },
  ] as const;
}
