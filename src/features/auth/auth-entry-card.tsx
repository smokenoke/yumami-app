"use client";

import { useActionState } from "react";

import {
  requestMagicLinkAction,
  signOutAction,
  type AuthActionState,
} from "@/features/auth/actions";

interface AuthEntryCardProps {
  userEmail?: string;
  compact?: boolean;
}

const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: "",
};

export function AuthEntryCard({ userEmail, compact = false }: AuthEntryCardProps) {
  const [state, formAction, pending] = useActionState(
    requestMagicLinkAction,
    initialAuthActionState,
  );

  const wrapperClass = compact
    ? "mt-4"
    : "rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]";

  return (
    <aside className={wrapperClass}>
      {!compact ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
          Sign in
        </p>
      ) : null}
      {userEmail ? (
        <div className={compact ? "space-y-3" : "mt-5 space-y-4"}>
          <div className="rounded-[1.5rem] bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
            Signed in as <span className="font-semibold">{userEmail}</span>.
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <>
          <p className={compact ? "text-sm leading-6 text-slate-600" : "mt-4 text-sm leading-6 text-slate-600"}>
            Send yourself a sign-in link when you want to use Supabase auth for real.
          </p>
          <form action={formAction} className={compact ? "mt-4 space-y-4" : "mt-5 space-y-4"}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Sending link..." : "Send sign-in link"}
            </button>
          </form>
          {state.status !== "idle" ? (
            <p
              className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${
                state.status === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </>
      )}
    </aside>
  );
}

