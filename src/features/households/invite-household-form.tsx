"use client";

import { useActionState } from "react";

import {
  createInviteAction,
  type InviteActionState,
} from "@/features/households/actions";

const initialState: InviteActionState = {
  status: "idle",
  message: "",
};

export function InviteHouseholdForm() {
  const [state, formAction, pending] = useActionState(createInviteAction, initialState);

  return (
    <div className="rounded-[1.8rem] border border-[var(--border-strong)] bg-white px-5 py-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-slate-900">Invite someone else</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
          Create a link for the other person. Once they sign in, Yumami can add them to this household.
        </p>
      </div>

      <form action={formAction} className="mt-4 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="partner@example.com"
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
          <select
            name="role"
            defaultValue="member"
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
          >
            <option value="member">Member</option>
            <option value="owner">Owner</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating invite..." : "Create invite link"}
        </button>
      </form>

      {state.status !== "idle" ? (
        <div className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${
          state.status === "success" ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"
        }`}>
          <p>{state.message}</p>
          {state.inviteLink ? (
            <p className="mt-2 break-all font-medium">{state.inviteLink}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
