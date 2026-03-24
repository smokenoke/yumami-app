"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";
import type { TaskArchivedReason, TaskStatus } from "@/types/database";

export interface TaskFormState {
  status: "idle" | "success" | "error";
  message: string;
}

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(500).optional(),
});

const updateTaskSchema = z.object({
  taskId: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(500).optional(),
  status: z.enum(["todo", "in_progress", "done"]),
});

const archiveTaskSchema = z.object({
  taskId: z.string().min(1),
  archiveReason: z.enum(["completed", "dismissed", "cancelled", "duplicate", "other"]),
});

function lifecycleFieldsForStatus(
  nextStatus: TaskStatus,
  currentCompletedAt: string | null,
) {
  if (nextStatus === "done") {
    return {
      completed_at: currentCompletedAt ?? new Date().toISOString(),
      archived_reason: null,
    };
  }

  return {
    completed_at: null,
    archived_reason: null,
  };
}

async function getCurrentTask(
  taskId: string,
  householdId: string,
) {
  const supabase = await createSupabaseServerClient();

  const taskResult = await supabase
    .from("tasks")
    .select("id, status, completed_at, archived_at")
    .eq("id", taskId)
    .eq("household_id", householdId)
    .maybeSingle();

  if (taskResult.error || !taskResult.data) {
    return null;
  }

  return taskResult.data;
}

export async function createTaskAction(
  _previousState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add a short task title before creating a shared task.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();

    if (!householdContext) {
      return {
        status: "error",
        message:
          "A signed-in household member is required before real shared tasks can be created.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("tasks").insert({
      household_id: householdContext.householdId,
      created_by_user_id: householdContext.userId,
      title: parsed.data.title,
      notes: parsed.data.notes || null,
      status: "todo",
      completed_at: null,
      archived_at: null,
      archived_reason: null,
    });

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Shared task created.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Connect the project to switch from demo mode to live tasks.",
    };
  }
}

export async function updateTaskAction(
  _previousState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const parsed = updateTaskSchema.safeParse({
    taskId: formData.get("taskId"),
    title: formData.get("title"),
    notes: formData.get("notes") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Provide a valid title and status before saving task changes.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();

    if (!householdContext) {
      return {
        status: "error",
        message:
          "A signed-in household member is required before real shared tasks can be updated.",
      };
    }

    const currentTask = await getCurrentTask(
      parsed.data.taskId,
      householdContext.householdId,
    );

    if (!currentTask || currentTask.archived_at) {
      return {
        status: "error",
        message: "Only active household tasks can be edited.",
      };
    }

    const lifecycleFields = lifecycleFieldsForStatus(
      parsed.data.status,
      currentTask.completed_at,
    );

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("tasks")
      .update({
        title: parsed.data.title,
        notes: parsed.data.notes || null,
        status: parsed.data.status,
        completed_at: lifecycleFields.completed_at,
        archived_reason: lifecycleFields.archived_reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.taskId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Task changes saved.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Connect the project to save live task changes.",
    };
  }
}

export async function toggleTaskStatusAction(formData: FormData) {
  try {
    const taskId = formData.get("taskId");
    const nextStatus = formData.get("nextStatus");
    const householdContext = await getHouseholdContextForActions();

    if (
      typeof taskId !== "string" ||
      (nextStatus !== "todo" && nextStatus !== "in_progress" && nextStatus !== "done") ||
      !householdContext
    ) {
      return;
    }

    const currentTask = await getCurrentTask(taskId, householdContext.householdId);

    if (!currentTask || currentTask.archived_at) {
      return;
    }

    const lifecycleFields = lifecycleFieldsForStatus(
      nextStatus,
      currentTask.completed_at,
    );

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("tasks")
      .update({
        status: nextStatus,
        completed_at: lifecycleFields.completed_at,
        archived_reason: lifecycleFields.archived_reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    revalidatePath("/");
  } catch {
    return;
  }
}

export async function archiveTaskAction(formData: FormData) {
  try {
    const parsed = archiveTaskSchema.safeParse({
      taskId: formData.get("taskId"),
      archiveReason: formData.get("archiveReason"),
    });
    const householdContext = await getHouseholdContextForActions();

    if (!parsed.success || !householdContext) {
      return;
    }

    const currentTask = await getCurrentTask(
      parsed.data.taskId,
      householdContext.householdId,
    );

    if (!currentTask || currentTask.archived_at) {
      return;
    }

    const archiveReason: TaskArchivedReason = parsed.data.archiveReason;
    const completedAt =
      archiveReason === "completed"
        ? currentTask.completed_at ?? new Date().toISOString()
        : currentTask.completed_at;

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("tasks")
      .update({
        archived_at: new Date().toISOString(),
        archived_reason: archiveReason,
        completed_at: completedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.taskId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    revalidatePath("/");
  } catch {
    return;
  }
}
