"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { signOutAction } from "@/features/auth/actions";

interface SessionMenuProps {
  userEmail?: string;
  isDemo?: boolean;
}

export function SessionMenu({ userEmail, isDemo = false }: SessionMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  if (!userEmail) {
    return null;
  }

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white text-lg text-slate-700 transition hover:bg-slate-50"
        aria-label="Open settings"
        aria-expanded={open}
      >
        ⚙
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-40 w-72 rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-3 shadow-[0_22px_55px_-32px_rgba(15,23,42,0.4)]">
          <div className="rounded-[1.2rem] bg-[var(--surface-muted)] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-deep)]">Account</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{userEmail}</p>
            <p className="mt-1 text-xs text-slate-500">{isDemo ? "Demo session" : "Signed in"}</p>
          </div>

          <div className="mt-3 space-y-2">
            {!isDemo ? (
              <>
                <Link href="/households" className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50" onClick={() => setOpen(false)}>
                  Homes
                </Link>
                <Link href="/household-settings" className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50" onClick={() => setOpen(false)}>
                  Household settings
                </Link>
                <Link href="/account-settings" className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50" onClick={() => setOpen(false)}>
                  Account settings
                </Link>
              </>
            ) : null}
            <form action={signOutAction}>
              <button
                type="submit"
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
