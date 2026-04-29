import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { FinanceImportTransactionsPage } from "@/features/finance/finance-import-transactions-page";
import { FinanceSectionNav } from "@/features/finance/finance-section-nav";
import { HouseholdGateway } from "@/features/households/household-gateway";
import { getAuthState } from "@/lib/supabase/session";
import { getFinanceWorkspace } from "@/lib/yumami/finance";
import { getViewerHouseholdState } from "@/lib/yumami/households";

interface FinanceImportDetailRouteProps {
  params: Promise<{
    importId: string;
  }>;
}

export default async function FinanceImportDetailRoute({ params }: FinanceImportDetailRouteProps) {
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
  const { importId } = await params;

  return (
    <AppShell
      eyebrow="Finance"
      title="Import transactions"
      description="Look at one statement in detail without mixing it with every other month."
      userEmail={authState.user?.email ?? authState.demoEmail ?? undefined}
      isDemo={!authState.user && Boolean(authState.demoEmail)}
      actions={
        <Link href="/finance/imports" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back to imports
        </Link>
      }
    >
      <div className="space-y-5">
        <FinanceSectionNav />
        <FinanceImportTransactionsPage workspace={financeWorkspace} importId={importId} />
      </div>
    </AppShell>
  );
}
