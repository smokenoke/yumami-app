"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
      message: "Sign-in link sent. Check your email to continue.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Add .env.local and your project credentials first.",
    };
  }
}

export async function continueWithDemoAction(formData: FormData) {
  const emailValue = formData.get("email");

  if (typeof emailValue !== "string" || emailValue.trim().length === 0) {
    redirect("/");
  }

  const cookieStore = await cookies();
  cookieStore.set("yumami-demo-email", emailValue.trim(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("yumami-demo-email");

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    return;
  }
}

