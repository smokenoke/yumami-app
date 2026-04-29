"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ACTIVE_HOUSEHOLD_COOKIE,
  PENDING_INVITE_COOKIE,
} from "@/lib/yumami/households";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthActionState {
  status: "idle" | "success" | "error";
  message: string;
}

function readCredentials(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  return {
    email:
      typeof emailValue === "string" && emailValue.trim().length > 0
        ? emailValue.trim()
        : null,
    password:
      typeof passwordValue === "string" && passwordValue.length > 0
        ? passwordValue
        : null,
  };
}

export async function signInWithPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
    const credentials = readCredentials(formData);

    if (!credentials.email || !credentials.password) {
      return {
        status: "error",
        message: "Enter both your email and password.",
      };
    }

    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          status: "error",
          message: error.message,
        };
      }

      redirect("/");
    } catch {
      return {
        status: "error",
        message:
          "Supabase is not configured yet. Add .env.local and your project credentials first.",
      };
    }
}

export async function signUpWithPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const credentials = readCredentials(formData);
  const confirmPasswordValue = formData.get("confirmPassword");
  const confirmPassword =
    typeof confirmPasswordValue === "string" && confirmPasswordValue.length > 0
      ? confirmPasswordValue
      : null;

  if (!credentials.email || !credentials.password || !confirmPassword) {
    return {
      status: "error",
      message: "Complete all fields to create your account.",
    };
  }

  if (credentials.password.length < 8) {
    return {
      status: "error",
      message: "Choose a password with at least 8 characters.",
    };
  }

  if (credentials.password !== confirmPassword) {
    return {
      status: "error",
      message: "Your passwords do not match yet.",
    };
  }

  try {
    const requestHeaders = await headers();
    const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
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

    if (data.session) {
      redirect("/");
    }

    return {
      status: "success",
      message:
        "Account created. If email confirmation is enabled, check your inbox before signing in.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Add .env.local and your project credentials first.",
    };
  }
}

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const emailValue = formData.get("email");

  if (typeof emailValue !== "string" || emailValue.trim().length === 0) {
    return {
      status: "error",
      message: "Enter your email first so Yumami knows where to send the reset link.",
    };
  }

  try {
    const requestHeaders = await headers();
    const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(emailValue.trim(), {
      redirectTo: `${origin}/`,
    });

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "success",
      message: "Password reset email sent. Check your inbox.",
    };
  } catch {
    return {
      status: "error",
      message: "Password reset is not available until Supabase is fully configured.",
    };
  }
}

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const passwordValue = formData.get("password");
  const confirmPasswordValue = formData.get("confirmPassword");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const confirmPassword = typeof confirmPasswordValue === "string" ? confirmPasswordValue : "";

  if (password.length < 8) {
    return {
      status: "error",
      message: "Choose a new password with at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return {
      status: "error",
      message: "The new passwords do not match yet.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "success",
      message: "Your password has been updated.",
    };
  } catch {
    return {
      status: "error",
      message: "Yumami could not update the password yet.",
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
  cookieStore.delete(ACTIVE_HOUSEHOLD_COOKIE);
  cookieStore.delete(PENDING_INVITE_COOKIE);

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    redirect("/");
  }

  redirect("/");
}
