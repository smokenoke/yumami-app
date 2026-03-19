"use server";

import { headers } from "next/headers";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthActionState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function requestMagicLinkAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const emailValue = formData.get("email");

  if (typeof emailValue !== "string" || emailValue.trim().length === 0) {
    return {
      status: "error",
      message: "Enter an email address to continue.",
    };
  }

  try {
    const requestHeaders = await headers();
    const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: emailValue.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "success",
      message: "Magic link sent. Check your email to continue.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Add .env.local and your project credentials first.",
    };
  }
}

export async function signOutAction() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    return;
  }
}
