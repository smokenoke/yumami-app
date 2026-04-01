import type { ReactNode } from "react";

import { AppNav } from "@/components/bottom-tab-nav";

interface AppShellProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ eyebrow, title, description, actions, children }: AppShellProps) {
  return (
    <main className="relative min-h-screen bg-[var(--page-shell)] text-[var(--ink)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
        <header className="rounded-[2.2rem] border border-white/80 bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] backdrop-blur sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-strong)] pb-4">
            <div className="flex flex-wrap items-center gap-3">
              {eyebrow ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--accent-deep)]">
                  {eyebrow}
                </p>
              ) : null}
              <span className="rounded-full border border-[var(--border-soft)] bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                Shared home
              </span>
            </div>
            <AppNav variant="desktop" />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-5 pt-5">
            <div className="max-w-3xl">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-slate-900 sm:text-[2.65rem] sm:leading-[1.02]">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-ink)] sm:text-base">
                {description}
              </p>
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        </header>

        <section className="flex-1 py-5 sm:py-6">{children}</section>
      </div>

      <AppNav />
    </main>
  );
}

