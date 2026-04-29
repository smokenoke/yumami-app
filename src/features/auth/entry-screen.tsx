import { continueWithDemoAction } from "@/features/auth/actions";
import { AuthEntryCard } from "@/features/auth/auth-entry-card";

interface EntryScreenProps {
  isConfigured: boolean;
}

export function EntryScreen({ isConfigured }: EntryScreenProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--page-shell)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2.4rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(252,247,242,0.94),rgba(238,243,249,0.92))] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent-deep)]">
              Yumami
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-[3.4rem] sm:leading-[0.96]">
              A calmer home for your shared life.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-ink)]">
              Sign in to your account, create a household, and invite the other person into the same shared space.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "To-dos",
                  detail: "See what needs attention without hunting through multiple apps.",
                },
                {
                  title: "Calendar",
                  detail: "Keep shared events visible in one calm place.",
                },
                {
                  title: "Finance",
                  detail: "Track statement intake and review spending together.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/80 bg-white/80 px-4 py-4"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.4rem] border border-white/80 bg-[var(--surface-strong)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-9">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
                Get started
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                Sign in or create your account
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
                Use email and password for real households. Demo mode stays available while you test the flow.
              </p>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
              <p className="text-sm font-medium text-slate-900">
                {isConfigured
                  ? "Supabase is connected, so you can use real accounts now."
                  : "Supabase is not configured yet, so demo access stays useful while you keep building."}
              </p>
              {isConfigured ? <AuthEntryCard compact /> : null}
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-[var(--border-strong)] bg-white px-4 py-4">
              <p className="text-sm font-medium text-slate-900">Or keep moving in demo mode</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                This still lets you explore the product before the live household setup is finished.
              </p>
              <form action={continueWithDemoAction} className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)]"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full border border-[var(--border-soft)] bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  Continue in demo mode
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
