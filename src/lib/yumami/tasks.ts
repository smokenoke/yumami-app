import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { HouseholdParticipant, Task, TaskWorkspace } from "@/types/domain";

const demoMembers: HouseholdParticipant[] = [
  {
    userId: "demo-user-1",
    displayName: "Maxim",
    role: "owner",
  },
  {
    userId: "demo-user-2",
    displayName: "Yuxi",
    role: "member",
  },
];

const demoTasks: Task[] = [
  {
    id: "demo-task-1",
    household_id: "demo-household",
    created_by_user_id: "demo-user-1",
    assigned_to_user_id: "demo-user-1",
    title: "Confirm the shared task structure",
    notes: "Make sure assignment, priority, and due dates are all clear.",
    status: "todo",
    priority: "high",
    due_at: new Date("2026-04-03T17:00:00.000Z").toISOString(),
    completed_at: null,
    archived_at: null,
    archived_reason: null,
    created_at: "2026-03-21T08:30:00.000Z",
    updated_at: "2026-03-21T08:30:00.000Z",
  },
  {
    id: "demo-task-2",
    household_id: "demo-household",
    created_by_user_id: "demo-user-1",
    assigned_to_user_id: "demo-user-2",
    title: "Connect a real Supabase project",
    notes: "Once connected, these demo tasks will give way to live shared data.",
    status: "in_progress",
    priority: "medium",
    due_at: null,
    completed_at: null,
    archived_at: null,
    archived_reason: null,
    created_at: "2026-03-21T09:15:00.000Z",
    updated_at: "2026-03-21T09:15:00.000Z",
  },
];

const demoArchivedTasks: Task[] = [
  {
    id: "demo-task-archived-1",
    household_id: "demo-household",
    created_by_user_id: "demo-user-2",
    assigned_to_user_id: "demo-user-2",
    title: "Book yearly boiler check",
    notes: "Completed and archived for reference.",
    status: "done",
    priority: "medium",
    due_at: new Date("2026-03-14T10:00:00.000Z").toISOString(),
    completed_at: new Date("2026-03-13T16:00:00.000Z").toISOString(),
    archived_at: new Date("2026-03-14T11:00:00.000Z").toISOString(),
    archived_reason: "completed",
    created_at: "2026-03-01T09:00:00.000Z",
    updated_at: "2026-03-14T11:00:00.000Z",
  },
];

interface HouseholdContext {
  householdId: string;
  householdName: string;
  userId: string;
}

function sortTasks(tasks: Task[]) {
  const priorityRank = {
    high: 0,
    medium: 1,
    low: 2,
  } as const;

  return [...tasks].sort((left, right) => {
    const leftPriority = priorityRank[left.priority ?? "medium"];
    const rightPriority = priorityRank[right.priority ?? "medium"];

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    if (left.due_at && right.due_at) {
      return left.due_at.localeCompare(right.due_at);
    }

    if (left.due_at) {
      return -1;
    }

    if (right.due_at) {
      return 1;
    }

    return right.created_at.localeCompare(left.created_at);
  });
}

async function getCurrentHouseholdContext(): Promise<HouseholdContext | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const membershipResult = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipResult.error || !membershipResult.data) {
    return null;
  }

  const householdResult = await supabase
    .from("households")
    .select("name")
    .eq("id", membershipResult.data.household_id)
    .single();

  if (householdResult.error || !householdResult.data) {
    return null;
  }

  return {
    householdId: membershipResult.data.household_id,
    householdName: householdResult.data.name,
    userId: user.id,
  };
}

async function getHouseholdMembers(householdId: string): Promise<HouseholdParticipant[]> {
  const supabase = await createSupabaseServerClient();
  const result = await supabase
    .from("household_members")
    .select("user_id, display_name, role")
    .eq("household_id", householdId)
    .order("created_at", { ascending: true });

  if (result.error || !result.data) {
    return [];
  }

  return result.data.map((member, index) => ({
    userId: member.user_id,
    displayName: member.display_name?.trim() || `Member ${index + 1}`,
    role: member.role,
  }));
}

export async function getTaskWorkspace(): Promise<TaskWorkspace> {
  try {
    const householdContext = await getCurrentHouseholdContext();

    if (!householdContext) {
      return {
        mode: "demo",
        householdName: "Demo household",
        tasks: sortTasks(demoTasks),
        archivedTasks: demoArchivedTasks,
        members: demoMembers,
        canMutate: false,
        statusMessage:
          "Sign in and attach your user to a household to switch from demo tasks to live shared tasks.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const [taskResult, archivedTaskResult, memberResult] = await Promise.all([
      supabase
        .from("tasks")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .is("archived_at", null),
      supabase
        .from("tasks")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .not("archived_at", "is", null)
        .order("archived_at", { ascending: false })
        .limit(12),
      getHouseholdMembers(householdContext.householdId),
    ]);

    if (taskResult.error || archivedTaskResult.error) {
      return {
        mode: "demo",
        householdName: householdContext.householdName,
        tasks: sortTasks(demoTasks),
        archivedTasks: demoArchivedTasks,
        members: demoMembers,
        canMutate: false,
        statusMessage:
          "The household was found, but live tasks could not be loaded yet. Demo tasks are shown instead.",
      };
    }

    const liveTasks = sortTasks((taskResult.data ?? []) as Task[]);
    const archivedTasks = (archivedTaskResult.data ?? []) as Task[];

    return {
      mode: "live",
      householdName: householdContext.householdName,
      tasks: liveTasks,
      archivedTasks,
      members: memberResult,
      canMutate: true,
      statusMessage:
        "Live shared tasks are active. Priority, assignment, due dates, completion, and archive intent are all tracked.",
    };
  } catch {
    return {
      mode: "demo",
      householdName: "Demo household",
      tasks: sortTasks(demoTasks),
      archivedTasks: demoArchivedTasks,
      members: demoMembers,
      canMutate: false,
      statusMessage:
        "Supabase is not configured yet, so Yumami is showing a safe demo task board.",
    };
  }
}

export async function getHouseholdContextForActions() {
  return getCurrentHouseholdContext();
}
