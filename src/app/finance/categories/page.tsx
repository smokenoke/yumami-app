import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { FinanceCategoriesPage } from "@/features/finance/finance-categories-page";
import { FinanceSectionNav } from "@/features/finance/finance-section-nav";
import { getAuthState } from "@/lib/supabase/session";
import { getFinanceWorkspace } from "@/lib/yumami/finance";

export default async function FinanceCategoriesRoute() {
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
      title="Categories"
      description="Manage the reporting buckets without crowding the main finance page."
      actions={
        <Link href="/finance" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back to overview
        </Link>
      }
    >
      <div className="space-y-5">
        <FinanceSectionNav />
        <FinanceCategoriesPage workspace={financeWorkspace} />
      </div>
    </AppShell>
  );
}

