import Link from "next/link";

import { ActionPanel } from "@/components/action-panel";
import { StatementImportComposer } from "@/features/finance/statement-import-composer";
import type { FinanceWorkspace } from "@/types/domain";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

interface FinanceOverviewProps {
  workspace: FinanceWorkspace;
}

export function FinanceOverview({ workspace }: FinanceOverviewProps) {
  const latestRollup = workspace.rollups[0];
  const pendingReview = workspace.transactions.filter(
    (transaction) =>
      transaction.review_status !== "categorized" || transaction.finance_category_id == null,
  );
  const latestImports = workspace.imports.slice(0, 2);
  const topCategories = latestRollup?.topCategories ?? [];

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
              Finance
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{workspace.householdName}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{workspace.statusMessage}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${workspace.mode === "live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {workspace.mode === "live" ? "Live" : "Demo"}
            </div>
            <ActionPanel
              buttonLabel="Import PDF"
              title="Add a statement PDF"
              description="Bring the next statement into Yumami without leaving the overview busy all the time."
              variant="primary"
              disabled={!workspace.canMutate}
            >
              <StatementImportComposer canMutate={workspace.canMutate} />
            </ActionPanel>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Net</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{latestRollup ? formatMoney(latestRollup.net) : "No data yet"}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Needs review</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{pendingReview.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Imports</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{workspace.imports.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Categories</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{workspace.categories.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">This month</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Your household snapshot should start here, not in the raw transactions.</p>
            </div>
            <Link href="/finance/review" className="rounded-full bg-[var(--accent-quiet)] px-4 py-2 text-sm font-medium text-[var(--accent-deep)] transition hover:bg-[var(--accent-soft)]">
              Open review
            </Link>
          </div>
          {latestRollup ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Income</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-700">{formatMoney(latestRollup.totalIncome)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Expenses</p>
                  <p className="mt-2 text-lg font-semibold text-rose-700">{formatMoney(latestRollup.totalExpenses)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Review queue</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{latestRollup.reviewCount}</p>
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Top categories</p>
                <div className="mt-3 space-y-2">
                  {topCategories.length > 0 ? topCategories.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                      <span>{item.name}</span>
                      <span className="font-medium text-slate-900">{formatMoney(item.total)}</span>
                    </div>
                  )) : <p className="text-sm leading-6 text-slate-600">No category totals yet.</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-5 text-sm leading-6 text-slate-600">
              Import a first statement to start building the monthly picture.
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">Latest imports</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">See whether a statement has been fully reviewed yet.</p>
              </div>
              <Link href="/finance/imports" className="rounded-full bg-[var(--accent-quiet)] px-4 py-2 text-sm font-medium text-[var(--accent-deep)] transition hover:bg-[var(--accent-soft)]">
                Open imports
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {latestImports.length > 0 ? latestImports.map((item) => (
                <div key={item.id} className="rounded-[1.3rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                  <p className="text-base font-semibold text-slate-900">{item.institution_label}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.statement_month.slice(0, 7)} · {item.transaction_count} transactions</p>
                  <p className="mt-1 text-sm text-slate-600">{item.review_needed_count} need review</p>
                </div>
              )) : <p className="text-sm leading-6 text-slate-600">No imports yet.</p>}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">Review queue</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Keep the cleanup work separate from the overview.</p>
              </div>
              <Link href="/finance/review" className="rounded-full bg-[var(--accent-quiet)] px-4 py-2 text-sm font-medium text-[var(--accent-deep)] transition hover:bg-[var(--accent-soft)]">
                Open review
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {pendingReview.slice(0, 3).length > 0 ? pendingReview.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="rounded-[1.3rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                  <p className="text-base font-semibold text-slate-900">{transaction.description}</p>
                  <p className="mt-1 text-sm text-slate-600">{transaction.transaction_date} · {formatMoney(transaction.amount)}</p>
                </div>
              )) : <p className="text-sm leading-6 text-slate-600">Nothing is waiting for review.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

