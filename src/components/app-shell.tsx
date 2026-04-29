import type { ReactNode } from "react";

import { AppNav } from "@/components/bottom-tab-nav";
import { SessionMenu } from "@/features/auth/session-menu";

interface AppShellProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  userEmail?: string;
  isDemo?: boolean;
  showNav?: boolean;
  children: ReactNode;
}

export function AppShell({
  eyebrow,
  title,
  description,
  actions,
  userEmail,
  isDemo = false,
  showNav = true,
  children,
}: AppShellProps) {
  return (
    <main className="relative min-h-screen bg-[var(--page-shell)] text-[var(--ink)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
        <header className="rounded-[2.2rem] border border-white/80 bg-[var(--surface-strong)] px-5 py-5 shadow-[var(--shadow-soft)] backdrop-blur sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center gap-4 border-b border-[var(--border-strong)] pb-4 md:flex-nowrap md:justify-between">
            <div className="flex min-w-[160px] items-center">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.42em] text-[var(--accent-deep)] sm:text-[13px]">
                  Yumami
                </p>
                {eyebrow ? <p className="mt-1 text-xs text-slate-500">{eyebrow}</p> : null}
              </div>
            </div>
            {showNav ? <AppNav variant="desktop" /> : <div className="hidden flex-1 md:block" />}
            <div className="ml-auto flex min-w-[48px] justify-end">
              <SessionMenu userEmail={userEmail} isDemo={isDemo} />
            </div>
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

      {showNav ? <AppNav /> : null}
    </main>
  );
}
