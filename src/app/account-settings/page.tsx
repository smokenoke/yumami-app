import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { AccountSettingsForm } from "@/features/auth/account-settings-form";
import { getAuthState } from "@/lib/supabase/session";

export default async function AccountSettingsPage() {
  const authState = await getAuthState();

  if (!authState.user) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  return (
    <AppShell
      eyebrow="Account"
      title="Your account settings."
      description="Check the account you are signed in with and update your password when you need to."
      userEmail={authState.user.email ?? undefined}
      isDemo={false}
    >
      <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-[var(--border-strong)] bg-white px-6 py-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Signed-in account</p>
          <p className="mt-4 text-lg font-semibold text-slate-900">{authState.user.email}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
            This is the account Yumami uses for your households, invitations, and shared data.
          </p>
        </section>
        <AccountSettingsForm />
      </div>
    </AppShell>
  );
}
