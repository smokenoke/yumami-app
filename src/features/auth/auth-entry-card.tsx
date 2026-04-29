"use client";

import { useActionState, useState } from "react";

import {
  requestPasswordResetAction,
  signInWithPasswordAction,
  signUpWithPasswordAction,
  type AuthActionState,
} from "@/features/auth/actions";

interface AuthEntryCardProps {
  compact?: boolean;
}

const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: "",
};

export function AuthEntryCard({ compact = false }: AuthEntryCardProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(
    mode === "sign-in" ? signInWithPasswordAction : signUpWithPasswordAction,
    initialAuthActionState,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    requestPasswordResetAction,
    initialAuthActionState,
  );

  const wrapperClass = compact
    ? "mt-4"
    : "rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]";

  return (
    <aside className={wrapperClass}>
      {!compact ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
          Account
        </p>
      ) : null}

      <div className={compact ? "space-y-4" : "mt-5 space-y-4"}>
        <div className="inline-flex rounded-full border border-[var(--border-soft)] bg-white p-1 text-sm shadow-sm">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`rounded-full px-4 py-2 transition ${
              mode === "sign-in" ? "bg-[var(--accent-deep)] text-white" : "text-slate-600"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`rounded-full px-4 py-2 transition ${
              mode === "sign-up" ? "bg-[var(--accent-deep)] text-white" : "text-slate-600"
            }`}
          >
            Create account
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              required
              placeholder="At least 8 characters"
              className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
            />
          </label>

          {mode === "sign-up" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Repeat your password"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] focus:bg-white"
              />
            </label>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? mode === "sign-in"
                ? "Signing in..."
                : "Creating account..."
              : mode === "sign-in"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {mode === "sign-in" ? (
          <form action={resetAction} className="rounded-2xl border border-[var(--border-soft)] bg-white/80 px-4 py-3">
            <input type="hidden" name="email" value={email} />
            <p className="text-sm font-medium text-slate-900">Forgot your password?</p>
            <p className="mt-1 text-sm leading-6 text-[var(--muted-ink)]">
              Enter your email above, then send yourself a reset link.
            </p>
            <button
              type="submit"
              disabled={resetPending}
              className="mt-3 rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetPending ? "Sending reset..." : "Send reset link"}
            </button>
          </form>
        ) : null}

        {state.status !== "idle" ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              state.status === "success"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        {resetState.status !== "idle" ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              resetState.status === "success"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {resetState.message}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
