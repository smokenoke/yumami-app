import type { ReactNode } from "react";

interface AppShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AppShell({
  eyebrow,
  title,
  description,
  children,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-[var(--page-shell)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between rounded-full border border-white/65 bg-white/75 px-4 py-3 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent-deep)]">
              {eyebrow}
            </p>
            <p className="text-sm text-slate-500">Phase 2 foundation</p>
          </div>
          <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[var(--accent-deep)]">
            Household auth next
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-[var(--border-soft)] bg-white/70 px-3 py-1 text-sm text-slate-600 shadow-sm">
              {eyebrow}
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-balance text-slate-900 sm:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              {description}
            </p>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
