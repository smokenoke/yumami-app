import { AppShell } from "@/components/app-shell";
import { AuthEntryCard } from "@/features/auth/auth-entry-card";
import { PhaseTwoPanel } from "@/features/home/phase-two-panel";
import { getAuthState } from "@/lib/supabase/session";
import { dashboardSeedSummary } from "@/lib/yumami/roadmap";

export default async function Home() {
  const authState = await getAuthState();

  return (
    <AppShell
      eyebrow="Yumami"
      title="The household and auth foundation is ready to wire."
      description="Phase 2 sets up the shared identity model for Yumami: one household, two members, and the first task-aware data flow. The app now knows how to detect whether Supabase is configured and can evolve into the real dashboard instead of a static landing page."
    >
      <div className="space-y-5">
        <PhaseTwoPanel
          isConfigured={authState.isConfigured}
          summary={dashboardSeedSummary}
          userEmail={authState.user?.email}
        />
        <AuthEntryCard userEmail={authState.user?.email} />
      </div>
    </AppShell>
  );
}
