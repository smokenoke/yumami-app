import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { InviteHouseholdForm } from "@/features/households/invite-household-form";
import { getAuthState } from "@/lib/supabase/session";
import { getHouseholdSettingsData } from "@/lib/yumami/households";

function formatRole(role: "owner" | "member") {
  return role === "owner" ? "Owner" : "Member";
}

function formatInviteStatus(status: "pending" | "accepted" | "revoked" | "expired") {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "revoked":
      return "Revoked";
    case "expired":
      return "Expired";
    default:
      return "Pending";
  }
}

export default async function HouseholdSettingsPage() {
  const authState = await getAuthState();

  if (!authState.user) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  const settingsData = await getHouseholdSettingsData();
  if (!settingsData) {
    redirect("/households");
  }

  return (
    <AppShell
      eyebrow="Household settings"
      title={`${settingsData.householdName}, managed clearly.`}
      description="View your members, keep track of invite status, and generate new invite links from one place."
      userEmail={authState.user.email ?? undefined}
      isDemo={false}
    >
      <div className="mx-auto space-y-5 max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-6 py-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Current household</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{settingsData.householdName}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
              Use this area to manage the shared people and invitations behind this home.
            </p>
          </section>
          <InviteHouseholdForm />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-6 py-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Members</p>
            <div className="mt-4 space-y-3">
              {settingsData.members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between rounded-[1.4rem] bg-[var(--surface-muted)] px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{member.displayName}</p>
                    <p className="mt-1 text-sm text-[var(--muted-ink)]">Joined {new Date(member.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                    {formatRole(member.role)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-6 py-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Invites</p>
            <div className="mt-4 space-y-3">
              {settingsData.invites.length > 0 ? settingsData.invites.map((invite) => (
                <div key={invite.inviteId} className="rounded-[1.4rem] bg-[var(--surface-muted)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{invite.invitedEmail}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {formatInviteStatus(invite.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted-ink)]">
                    {formatRole(invite.role)} • Expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              )) : (
                <p className="rounded-[1.4rem] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--muted-ink)]">
                  No invites yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
