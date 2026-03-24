import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Task, TaskWorkspace } from "@/types/domain";

const demoTasks: Task[] = [
  {
    id: "demo-task-1",
    household_id: "demo-household",
    created_by_user_id: "demo-user",
    assigned_to_user_id: null,
    title: "Confirm the shared task structure",
    notes: "Phase 3 starts by proving the flow before wiring real household data.",
    status: "todo",
    due_at: null,
    completed_at: null,
    archived_at: null,
    archived_reason: null,
    created_at: "2026-03-21T08:30:00.000Z",
    updated_at: "2026-03-21T08:30:00.000Z",
  },
  {
    id: "demo-task-2",
    household_id: "demo-household",
    created_by_user_id: "demo-user",
    assigned_to_user_id: null,
    title: "Connect a real Supabase project",
    notes: "Once connected, these demo tasks will give way to live shared data.",
    status: "in_progress",
    due_at: null,
    completed_at: null,
    archived_at: null,
    archived_reason: null,
    created_at: "2026-03-21T09:15:00.000Z",
    updated_at: "2026-03-21T09:15:00.000Z",
  },
];

interface HouseholdContext {
  householdId: string;
  householdName: string;
  userId: string;
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

export async function getTaskWorkspace(): Promise<TaskWorkspace> {
  try {
    const householdContext = await getCurrentHouseholdContext();

    if (!householdContext) {
      return {
        mode: "demo",
        householdName: "Demo household",
        tasks: demoTasks,
        canMutate: false,
        statusMessage:
          "Sign in and attach your user to a household to switch from demo tasks to live shared tasks.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const taskResult = await supabase
      .from("tasks")
      .select("*")
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null)
      .order("created_at", { ascending: false });

    if (taskResult.error) {
      return {
        mode: "demo",
        householdName: householdContext.householdName,
        tasks: demoTasks,
        canMutate: false,
        statusMessage:
          "The household was found, but live tasks could not be loaded yet. Demo tasks are shown instead.",
      };
    }

    const liveTasks = (taskResult.data ?? []) as Task[];

    return {
      mode: "live",
      householdName: householdContext.householdName,
      tasks: liveTasks,
      canMutate: true,
      statusMessage:
        "Live shared task mode is active. Completion and archive intent are both recorded for future analysis.",
    };
  } catch {
    return {
      mode: "demo",
      householdName: "Demo household",
      tasks: demoTasks,
      canMutate: false,
      statusMessage:
        "Supabase is not configured yet, so Yumami is showing a safe demo task board.",
    };
  }
}

export async function getHouseholdContextForActions() {
  return getCurrentHouseholdContext();
}
