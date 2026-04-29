"use server";

import { randomUUID } from "crypto";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ACTIVE_HOUSEHOLD_COOKIE,
  PENDING_INVITE_COOKIE,
  getViewerHouseholdState,
} from "@/lib/yumami/households";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthActionState {
  status: "idle" | "success" | "error";
  message: string;
}

export interface InviteActionState {
  status: "idle" | "success" | "error";
  message: string;
  inviteLink?: string;
}

function buildErrorRedirect(pathname: string, code: string, message?: string) {
  const params = new URLSearchParams({ error: code });
  if (message) {
    params.set("message", message);
  }
  return `${pathname}?${params.toString()}`;
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

export async function createHouseholdAction(formData: FormData) {
  const nameValue = formData.get("householdName");
  const displayNameValue = formData.get("displayName");

  if (typeof nameValue !== "string" || nameValue.trim().length === 0) {
    redirect(buildErrorRedirect("/households", "household-name", "Enter a household name first."));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const householdInsert = await supabase
    .from("households")
    .insert({ name: nameValue.trim() })
    .select("id")
    .single();

  if (householdInsert.error || !householdInsert.data) {
    redirect(
      buildErrorRedirect(
        "/households",
        "create-household",
        householdInsert.error?.message ?? "Yumami could not create the household yet.",
      ),
    );
  }

  const membershipInsert = await supabase.from("household_members").insert({
    household_id: householdInsert.data.id,
    user_id: user.id,
    role: "owner",
    display_name:
      typeof displayNameValue === "string" && displayNameValue.trim().length > 0
        ? displayNameValue.trim()
        : null,
  });

  if (membershipInsert.error) {
    redirect(
      buildErrorRedirect(
        "/households",
        "create-membership",
        membershipInsert.error.message,
      ),
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_HOUSEHOLD_COOKIE, householdInsert.data.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}

export async function switchHouseholdAction(formData: FormData) {
  const householdIdValue = formData.get("householdId");

  if (typeof householdIdValue !== "string" || householdIdValue.trim().length === 0) {
    redirect("/households");
  }

  const viewerState = await getViewerHouseholdState();
  const canAccess = viewerState.memberships.some(
    (membership) => membership.householdId === householdIdValue,
  );

  if (!canAccess) {
    redirect(buildErrorRedirect("/households", "household-access", "You do not have access to that household."));
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_HOUSEHOLD_COOKIE, householdIdValue, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}

export async function stashInviteTokenAction(formData: FormData) {
  const tokenValue = formData.get("token");

  if (typeof tokenValue !== "string" || tokenValue.trim().length === 0) {
    redirect(buildErrorRedirect("/households", "invite-token", "Paste an invite link or token first."));
  }

  const token = tokenValue.trim().split("/").filter(Boolean).at(-1) ?? tokenValue.trim();
  const cookieStore = await cookies();
  cookieStore.set(PENDING_INVITE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/households?invite=1");
}

export async function acceptInviteAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PENDING_INVITE_COOKIE)?.value;

  if (!token) {
    redirect(buildErrorRedirect("/households", "no-invite", "No invite is saved in this browser yet."));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/");
  }

  const inviteResult = await supabase
    .from("household_invites")
    .select("id, household_id, invited_email, role, status, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (inviteResult.error || !inviteResult.data) {
    redirect(buildErrorRedirect("/households", "invite-missing", inviteResult.error?.message ?? "Invite not found."));
  }

  const invite = inviteResult.data;
  const sameEmail = invite.invited_email.trim().toLowerCase() === user.email.trim().toLowerCase();
  const isExpired = new Date(invite.expires_at).getTime() <= Date.now();

  if (!sameEmail || invite.status !== "pending" || isExpired) {
    redirect(buildErrorRedirect("/households", "invite-invalid", "This invite is invalid for the current account."));
  }

  const membershipInsert = await supabase.from("household_members").insert({
    household_id: invite.household_id,
    user_id: user.id,
    role: invite.role,
    display_name: user.email.split("@")[0],
  });

  if (membershipInsert.error) {
    redirect(buildErrorRedirect("/households", "invite-membership", membershipInsert.error.message));
  }

  await supabase
    .from("household_invites")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  cookieStore.delete(PENDING_INVITE_COOKIE);
  cookieStore.set(ACTIVE_HOUSEHOLD_COOKIE, invite.household_id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}

export async function createInviteAction(
  _previousState: InviteActionState,
  formData: FormData,
): Promise<InviteActionState> {
  const emailValue = formData.get("email");
  const roleValue = formData.get("role");

  if (typeof emailValue !== "string" || emailValue.trim().length === 0) {
    return {
      status: "error",
      message: "Enter the email you want to invite.",
    };
  }

  const viewerState = await getViewerHouseholdState();
  if (!viewerState.activeHousehold) {
    return {
      status: "error",
      message: "Choose a household before sending an invite.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Sign in again before sending an invite.",
    };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const token = randomUUID();

  const inviteInsert = await supabase.from("household_invites").insert({
    household_id: viewerState.activeHousehold.householdId,
    invited_by_user_id: user.id,
    invited_email: emailValue.trim().toLowerCase(),
    role: roleValue === "owner" ? "owner" : "member",
    token,
    status: "pending",
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  });

  if (inviteInsert.error) {
    return {
      status: "error",
      message: inviteInsert.error.message,
    };
  }

  return {
    status: "success",
    message: "Invite link ready. Send it to the other person.",
    inviteLink: `${origin}/join/${token}`,
  };
}
