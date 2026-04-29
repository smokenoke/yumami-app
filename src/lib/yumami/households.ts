import { cookies } from "next/headers";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  HouseholdMembershipOption,
  HouseholdSettingsInvite,
  HouseholdSettingsMember,
  PendingHouseholdInvite,
  ViewerHouseholdState,
} from "@/types/domain";

export const ACTIVE_HOUSEHOLD_COOKIE = "yumami-active-household";
export const PENDING_INVITE_COOKIE = "yumami-invite-token";

export interface ActiveHouseholdContext {
  householdId: string;
  householdName: string;
  userId: string;
}

type MembershipQueryRow = {
  household_id: string;
  role: "owner" | "member";
  display_name: string | null;
  households: { name: string } | Array<{ name: string }> | null;
};

type InviteQueryRow = {
  id: string;
  household_id: string;
  invited_email: string;
  role: "owner" | "member";
  token: string;
  status: "pending" | "accepted" | "revoked" | "expired";
  expires_at: string;
  accepted_at?: string | null;
  households: { name: string } | Array<{ name: string }> | null;
};

function getHouseholdName(value: MembershipQueryRow["households"] | InviteQueryRow["households"]) {
  if (!value) {
    return "Household";
  }

  if (Array.isArray(value)) {
    return value[0]?.name ?? "Household";
  }

  return value.name;
}

function buildPendingInvite(
  invite: InviteQueryRow,
  currentEmail?: string,
): PendingHouseholdInvite {
  const now = Date.now();
  const isExpired = new Date(invite.expires_at).getTime() <= now;
  const normalizedCurrentEmail = currentEmail?.trim().toLowerCase();
  const normalizedInviteEmail = invite.invited_email.trim().toLowerCase();

  return {
    inviteId: invite.id,
    householdId: invite.household_id,
    householdName: getHouseholdName(invite.households),
    invitedEmail: invite.invited_email,
    role: invite.role,
    token: invite.token,
    status: invite.status,
    expiresAt: invite.expires_at,
    isEligible:
      invite.status === "pending" && !isExpired && normalizedCurrentEmail === normalizedInviteEmail,
    isExpired,
  };
}

export async function getViewerHouseholdState(): Promise<ViewerHouseholdState> {
  const cookieStore = await cookies();
  const activeHouseholdId = cookieStore.get(ACTIVE_HOUSEHOLD_COOKIE)?.value ?? null;
  const pendingInviteToken = cookieStore.get(PENDING_INVITE_COOKIE)?.value ?? null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        memberships: [],
        activeHousehold: null,
        pendingInvite: null,
        needsOnboarding: false,
        needsHouseholdSelection: false,
      };
    }

    const membershipResult = await supabase
      .from("household_members")
      .select("household_id, role, display_name, households(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const memberships = ((membershipResult.data ?? []) as MembershipQueryRow[]).map((membership) => ({
      householdId: membership.household_id,
      householdName: getHouseholdName(membership.households),
      role: membership.role,
      displayName: membership.display_name,
    } satisfies HouseholdMembershipOption));

    let activeHousehold = memberships.find((membership) => membership.householdId === activeHouseholdId) ?? null;
    if (!activeHousehold && memberships.length === 1) {
      activeHousehold = memberships[0];
    }

    let pendingInvite: PendingHouseholdInvite | null = null;
    if (pendingInviteToken) {
      const inviteResult = await supabase
        .from("household_invites")
        .select("id, household_id, invited_email, role, token, status, expires_at, households(name)")
        .eq("token", pendingInviteToken)
        .maybeSingle();

      if (inviteResult.data) {
        pendingInvite = buildPendingInvite(inviteResult.data as InviteQueryRow, user.email ?? undefined);
      }
    }

    return {
      memberships,
      activeHousehold,
      pendingInvite,
      needsOnboarding: memberships.length === 0,
      needsHouseholdSelection: memberships.length > 1 && !activeHousehold,
    };
  } catch {
    return {
      memberships: [],
      activeHousehold: null,
      pendingInvite: null,
      needsOnboarding: false,
      needsHouseholdSelection: false,
    };
  }
}

export async function getActiveHouseholdContextForActions(): Promise<ActiveHouseholdContext | null> {
  const viewerState = await getViewerHouseholdState();

  if (!viewerState.activeHousehold) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    householdId: viewerState.activeHousehold.householdId,
    householdName: viewerState.activeHousehold.householdName,
    userId: user.id,
  };
}

export async function getHouseholdSettingsData() {
  const context = await getActiveHouseholdContextForActions();

  if (!context) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const [membersResult, invitesResult] = await Promise.all([
    supabase
      .from("household_members")
      .select("user_id, display_name, role, created_at")
      .eq("household_id", context.householdId)
      .order("created_at", { ascending: true }),
    supabase
      .from("household_invites")
      .select("id, invited_email, role, status, expires_at, accepted_at")
      .eq("household_id", context.householdId)
      .order("created_at", { ascending: false }),
  ]);

  const members: HouseholdSettingsMember[] = (membersResult.data ?? []).map((member, index) => ({
    userId: member.user_id,
    displayName: member.display_name?.trim() || `Member ${index + 1}`,
    role: member.role,
    createdAt: member.created_at,
  }));

  const invites: HouseholdSettingsInvite[] = (invitesResult.data ?? []).map((invite) => ({
    inviteId: invite.id,
    invitedEmail: invite.invited_email,
    role: invite.role,
    status: invite.status,
    expiresAt: invite.expires_at,
    acceptedAt: invite.accepted_at ?? null,
  }));

  return {
    ...context,
    members,
    invites,
  };
}
