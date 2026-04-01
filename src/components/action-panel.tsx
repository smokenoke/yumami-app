"use client";

import type { ReactNode } from "react";
import { useState } from "react";

interface ActionPanelProps {
  buttonLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function ActionPanel({
  buttonLabel,
  title,
  description,
  children,
  variant = "secondary",
  disabled = false,
}: ActionPanelProps) {
  const [open, setOpen] = useState(false);

  const buttonClass =
    variant === "primary"
      ? "rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      : "rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50";

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/28 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_32px_70px_-40px_rgba(15,23,42,0.45)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-900">
                  {title}
                </h3>
                {description ? (
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}

