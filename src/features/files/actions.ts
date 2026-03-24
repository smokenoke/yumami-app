"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";

export interface FileLinkFormState {
  status: "idle" | "success" | "error";
  message: string;
}

const createFileLinkSchema = z.object({
  label: z.string().trim().min(1).max(120),
  url: z.url(),
  description: z.string().trim().max(280).optional(),
  category: z.string().trim().max(60).optional(),
});

export async function createFileLinkAction(
  _previousState: FileLinkFormState,
  formData: FormData,
): Promise<FileLinkFormState> {
  const parsed = createFileLinkSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    description: formData.get("description") || undefined,
    category: formData.get("category") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add a valid label and URL before saving a shared file link.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();

    if (!householdContext) {
      return {
        status: "error",
        message:
          "A signed-in household member is required before real shared file links can be created.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("file_links").insert({
      household_id: householdContext.householdId,
      created_by_user_id: householdContext.userId,
      label: parsed.data.label,
      url: parsed.data.url,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      archived_at: null,
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
      message: "Shared file link created.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Connect the project to save live file links.",
    };
  }
}

export async function archiveFileLinkAction(formData: FormData) {
  try {
    const linkId = formData.get("linkId");
    const householdContext = await getHouseholdContextForActions();

    if (typeof linkId !== "string" || !householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("file_links")
      .update({
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", linkId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    revalidatePath("/");
  } catch {
    return;
  }
}
