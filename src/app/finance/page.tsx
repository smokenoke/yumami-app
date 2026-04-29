import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { FinanceSectionNav } from "@/features/finance/finance-section-nav";
import { FinanceOverview } from "@/features/finance/finance-overview";
import { HouseholdGateway } from "@/features/households/household-gateway";
import { getAuthState } from "@/lib/supabase/session";
import { getViewerHouseholdState } from "@/lib/yumami/households";
import { getFinanceWorkspace } from "@/lib/yumami/finance";

export default async function FinancePage() {
  const authState = await getAuthState();

  if (!authState.hasEntryAccess) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  if (authState.user) {
    const viewerState = await getViewerHouseholdState();
    if (viewerState.needsOnboarding || viewerState.needsHouseholdSelection) {
      return <HouseholdGateway viewerState={viewerState} userEmail={authState.user.email ?? undefined} />;
    }
  }

  const financeWorkspace = await getFinanceWorkspace();

  return (
    <AppShell
      eyebrow="Finance"
      title="A clearer view of your shared money."
      description="Start with the monthly picture, then go deeper only when you need imports, categories, or review."
      userEmail={authState.user?.email ?? authState.demoEmail ?? undefined}
      isDemo={!authState.user && Boolean(authState.demoEmail)}
      actions={
        <Link href="/" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back home
        </Link>
      }
    >
      <div className="space-y-5">
        <FinanceSectionNav />
        <FinanceOverview workspace={financeWorkspace} />
      </div>
    </AppShell>
  );
}
