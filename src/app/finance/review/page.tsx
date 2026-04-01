import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { FinanceReviewPage } from "@/features/finance/finance-review-page";
import { FinanceSectionNav } from "@/features/finance/finance-section-nav";
import { getAuthState } from "@/lib/supabase/session";
import { getFinanceWorkspace } from "@/lib/yumami/finance";

export default async function FinanceReviewRoute() {
  const [authState, financeWorkspace] = await Promise.all([
    getAuthState(),
    getFinanceWorkspace(),
  ]);

  if (!authState.hasEntryAccess) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  return (
    <AppShell
      eyebrow="Finance"
      title="Review transactions"
      description="Handle transaction-level cleanup here so the overview stays focused on the bigger picture."
      actions={
        <Link href="/finance" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back to overview
        </Link>
      }
    >
      <div className="space-y-5">
        <FinanceSectionNav />
        <FinanceReviewPage workspace={financeWorkspace} />
      </div>
    </AppShell>
  );
}

