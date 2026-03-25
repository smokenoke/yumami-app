"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";

export interface CalendarFormState {
  status: "idle" | "success" | "error";
  message: string;
}

const createCalendarSchema = z.object({
  label: z.string().trim().min(1).max(80),
  provider: z.enum(["icloud", "google", "outlook", "other"]),
  url: z.string().trim().url().optional().or(z.literal("")),
  colorToken: z.string().trim().max(20).optional().or(z.literal("")),
});

const createCalendarEventSchema = z.object({
  title: z.string().trim().min(1).max(120),
  householdCalendarId: z.string().uuid().optional().or(z.literal("")),
  startsAt: z.string().min(1),
  endsAt: z.string().optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(280).optional().or(z.literal("")),
  sourceKind: z.enum(["manual", "linked"]),
});

export async function createCalendarSourceAction(
  _previousState: CalendarFormState,
  formData: FormData,
): Promise<CalendarFormState> {
  const parsed = createCalendarSchema.safeParse({
    label: formData.get("label"),
    provider: formData.get("provider"),
    url: formData.get("url") || "",
    colorToken: formData.get("colorToken") || "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add a calendar label and provider before saving the shared calendar source.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return {
        status: "error",
        message: "A signed-in household member is required before saving live calendar sources.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("household_calendars").insert({
      household_id: householdContext.householdId,
      created_by_user_id: householdContext.userId,
      label: parsed.data.label,
      provider: parsed.data.provider,
      url: parsed.data.url || null,
      color_token: parsed.data.colorToken || null,
      archived_at: null,
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Shared calendar source added. You can now use it as a visibility anchor on the dashboard.",
    };
  } catch {
    return {
      status: "error",
      message: "Supabase is not configured yet. Connect the project to save live calendar sources.",
    };
  }
}

export async function createCalendarEventAction(
  _previousState: CalendarFormState,
  formData: FormData,
): Promise<CalendarFormState> {
  const parsed = createCalendarEventSchema.safeParse({
    title: formData.get("title"),
    householdCalendarId: formData.get("householdCalendarId") || "",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || "",
    location: formData.get("location") || "",
    notes: formData.get("notes") || "",
    sourceKind: formData.get("sourceKind") || "manual",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add an event title and start time before saving an upcoming household event.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return {
        status: "error",
        message: "A signed-in household member is required before saving live calendar events.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("calendar_events").insert({
      household_id: householdContext.householdId,
      household_calendar_id: parsed.data.householdCalendarId || null,
      created_by_user_id: householdContext.userId,
      title: parsed.data.title,
      starts_at: new Date(parsed.data.startsAt).toISOString(),
      ends_at: parsed.data.endsAt ? new Date(parsed.data.endsAt).toISOString() : null,
      location: parsed.data.location || null,
      notes: parsed.data.notes || null,
      source_kind: parsed.data.sourceKind,
      archived_at: null,
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Calendar event added. It will now appear in the upcoming schedule view.",
    };
  } catch {
    return {
      status: "error",
      message: "Supabase is not configured yet. Connect the project to save live calendar events.",
    };
  }
}

export async function archiveCalendarSourceAction(formData: FormData) {
  try {
    const calendarId = formData.get("calendarId");
    const householdContext = await getHouseholdContextForActions();
    if (typeof calendarId !== "string" || !householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("household_calendars")
      .update({
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", calendarId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    revalidatePath("/");
  } catch {
    return;
  }
}

export async function archiveCalendarEventAction(formData: FormData) {
  try {
    const eventId = formData.get("eventId");
    const householdContext = await getHouseholdContextForActions();
    if (typeof eventId !== "string" || !householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("calendar_events")
      .update({
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    revalidatePath("/");
  } catch {
    return;
  }
}
