import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { FinanceImportsPage } from "@/features/finance/finance-imports-page";
import { FinanceSectionNav } from "@/features/finance/finance-section-nav";
import { getAuthState } from "@/lib/supabase/session";
import { getFinanceWorkspace } from "@/lib/yumami/finance";

export default async function FinanceImportsRoute() {
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
      title="Statement imports"
      description="Keep PDF intake and parser state separate from the monthly overview."
      actions={
        <Link href="/finance" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back to overview
        </Link>
      }
    >
      <div className="space-y-5">
        <FinanceSectionNav />
        <FinanceImportsPage workspace={financeWorkspace} />
      </div>
    </AppShell>
  );
}

