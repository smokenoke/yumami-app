import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";
import type { FileLink, FileWorkspace } from "@/types/domain";

const demoFiles: FileLink[] = [
  {
    id: "demo-file-1",
    household_id: "demo-household",
    created_by_user_id: "demo-user",
    label: "Shared Google Drive",
    url: "https://drive.google.com/",
    description: "Main shared folder for admin docs and monthly sheets.",
    category: "Drive",
    archived_at: null,
    created_at: "2026-03-22T08:00:00.000Z",
    updated_at: "2026-03-22T08:00:00.000Z",
  },
  {
    id: "demo-file-2",
    household_id: "demo-household",
    created_by_user_id: "demo-user",
    label: "Budget workbook",
    url: "https://docs.google.com/spreadsheets/",
    description: "The monthly financial tracker you already maintain today.",
    category: "Finance",
    archived_at: null,
    created_at: "2026-03-22T08:30:00.000Z",
    updated_at: "2026-03-22T08:30:00.000Z",
  },
];

export async function getFileWorkspace(): Promise<FileWorkspace> {
  try {
    const householdContext = await getHouseholdContextForActions();

    if (!householdContext) {
      return {
        mode: "demo",
        householdName: "Demo household",
        files: demoFiles,
        canMutate: false,
        statusMessage:
          "Attach a signed-in user to a household to manage live shared file links.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const fileResult = await supabase
      .from("file_links")
      .select("*")
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null)
      .order("created_at", { ascending: false });

    if (fileResult.error) {
      return {
        mode: "demo",
        householdName: householdContext.householdName,
        files: demoFiles,
        canMutate: false,
        statusMessage:
          "The household was found, but live file links could not be loaded yet. Demo links are shown instead.",
      };
    }

    return {
      mode: "live",
      householdName: householdContext.householdName,
      files: (fileResult.data ?? []) as FileLink[],
      canMutate: true,
      statusMessage:
        "Live shared file links are active. This starts as a link-first hub before deeper file integrations.",
    };
  } catch {
    return {
      mode: "demo",
      householdName: "Demo household",
      files: demoFiles,
      canMutate: false,
      statusMessage:
        "Supabase is not configured yet, so Yumami is showing a safe demo files hub.",
    };
  }
}
