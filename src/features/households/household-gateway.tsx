import { acceptInviteAction, createHouseholdAction, stashInviteTokenAction, switchHouseholdAction } from "@/features/households/actions";
import { InviteHouseholdForm } from "@/features/households/invite-household-form";
import type { ViewerHouseholdState } from "@/types/domain";

interface HouseholdGatewayProps {
  viewerState: ViewerHouseholdState;
  userEmail?: string;
  manageMode?: boolean;
  errorMessage?: string;
  inviteFocus?: boolean;
}

export function HouseholdGateway({
  viewerState,
  userEmail,
  manageMode = false,
  errorMessage,
  inviteFocus = false,
}: HouseholdGatewayProps) {
  const showPicker = manageMode || viewerState.needsHouseholdSelection || viewerState.memberships.length > 0;
  const activeHousehold = viewerState.activeHousehold;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2.2rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(252,247,242,0.94),rgba(238,243,249,0.92))] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent-deep)]">
          Household setup
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-slate-900 sm:text-[2.8rem]">
          Choose the home space you want to open.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-ink)] sm:text-base">
          {userEmail
            ? `Signed in as ${userEmail}. Create a household, accept an invite, or choose the one you want to enter.`
            : "Create a household, accept an invite, or choose the one you want to enter."}
        </p>
      </section>

      {errorMessage ? (
        <section className="rounded-[1.8rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900 shadow-sm">
          <p className="font-semibold">Something needs attention</p>
          <p className="mt-1">{errorMessage}</p>
        </section>
      ) : null}

      {viewerState.pendingInvite ? (
        <section className={`rounded-[2rem] border px-5 py-5 shadow-sm ${inviteFocus ? "border-[var(--accent-deep)] bg-[var(--accent-quiet)]" : "border-[var(--border-strong)] bg-white"}`}>
          <p className="text-sm font-semibold text-slate-900">You&apos;ve been invited</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
            {viewerState.pendingInvite.householdName} invited {viewerState.pendingInvite.invitedEmail} as a {viewerState.pendingInvite.role}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {viewerState.pendingInvite.isEligible ? (
              <form action={acceptInviteAction}>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Join this household
                </button>
              </form>
            ) : (
              <p className="rounded-full bg-amber-50 px-4 py-2 text-sm text-amber-900">
                {viewerState.pendingInvite.isExpired
                  ? "This invite has expired."
                  : "Sign in with the invited email to accept this household invite."}
              </p>
            )}
          </div>
        </section>
      ) : null}

      {activeHousehold ? (
        <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Current household</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{activeHousehold.householdName}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-ink)]">
                Invite the other person here so they can join this shared home directly.
              </p>
            </div>
            <span className="rounded-full bg-[var(--accent-quiet)] px-3 py-1 text-xs font-medium text-[var(--accent-deep)]">
              {activeHousehold.role === "owner" ? "Owner" : "Member"}
            </span>
          </div>
          <div className="mt-5">
            <InviteHouseholdForm />
          </div>
        </section>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-5 py-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Create a household</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
            Start a new shared space, then invite the other person into it.
          </p>
          <form action={createHouseholdAction} className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Household name</span>
              <input
                type="text"
                name="householdName"
                required
                placeholder="Yumami Household"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Your display name</span>
              <input
                type="text"
                name="displayName"
                placeholder="Maxim"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Create household
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-5 py-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Already have an invite?</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
            Open the invite link directly, or paste the token here if someone already sent it to you.
          </p>
          <form action={stashInviteTokenAction} className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Invite link or token</span>
              <input
                type="text"
                name="token"
                required
                placeholder="Paste the full invite link or token"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
              />
            </label>
            <button
              type="submit"
              className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Save invite
            </button>
          </form>
        </section>
      </div>

      {showPicker ? (
        <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Your households</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                Open one automatically when you only have a single household, or choose here when you belong to more than one.
              </p>
            </div>
            {activeHousehold ? (
              <span className="rounded-full bg-[var(--accent-quiet)] px-3 py-1 text-xs font-medium text-[var(--accent-deep)]">
                Current: {activeHousehold.householdName}
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {viewerState.memberships.map((membership) => (
              <form
                key={membership.householdId}
                action={switchHouseholdAction}
                className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4"
              >
                <input type="hidden" name="householdId" value={membership.householdId} />
                <p className="text-base font-semibold text-slate-900">{membership.householdName}</p>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">
                  {membership.role === "owner" ? "Owner" : "Member"}
                  {membership.displayName ? ` • ${membership.displayName}` : ""}
                </p>
                <button
                  type="submit"
                  className="mt-4 rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Open household
                </button>
              </form>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}


