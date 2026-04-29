"use client";

import { useActionState } from "react";

import { type AuthActionState, updatePasswordAction } from "@/features/auth/actions";

const initialState: AuthActionState = {
  status: "idle",
  message: "",
};

export function AccountSettingsForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initialState);

  return (
    <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-6 py-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Change password</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
        Choose a new password for your Yumami account.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">New password</span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Confirm password</span>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Update password"}
        </button>
      </form>

      {state.status !== "idle" ? (
        <p className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${state.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
