import Link from "next/link";

import { archiveTransactionAction, updateTransactionReviewAction } from "@/features/finance/actions";
import type { FinanceWorkspace } from "@/types/domain";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function reviewBadge(status: FinanceWorkspace["transactions"][number]["review_status"], hasCategory: boolean) {
  if (hasCategory && status === "categorized") {
    return "bg-emerald-100 text-emerald-700";
  }
  return "bg-amber-100 text-amber-700";
}

function reviewLabel(status: FinanceWorkspace["transactions"][number]["review_status"], hasCategory: boolean) {
  if (hasCategory && status === "categorized") {
    return "Categorized";
  }
  return status === "pending" ? "Pending" : "Needs review";
}

interface FinanceImportTransactionsPageProps {
  workspace: FinanceWorkspace;
  importId: string;
}

export function FinanceImportTransactionsPage({ workspace, importId }: FinanceImportTransactionsPageProps) {
  const importItem = workspace.imports.find((item) => item.id === importId) ?? null;
  const categoryMap = new Map(workspace.categories.map((category) => [category.id, category]));
  const transactions = workspace.transactions.filter((transaction) => transaction.statement_import_id === importId);
  const categorizedTransactions = transactions.filter(
    (transaction) => transaction.review_status === "categorized" && transaction.finance_category_id != null,
  );
  const pendingTransactions = transactions.filter(
    (transaction) => transaction.review_status !== "categorized" || transaction.finance_category_id == null,
  );

  if (!importItem) {
    return (
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-white px-6 py-6 text-sm leading-6 text-slate-600">
          This import could not be found.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">Import details</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{importItem.institution_label}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {importItem.source_file_name} · {importItem.statement_month.slice(0, 7)}
            </p>
            {importItem.notes ? <p className="mt-2 text-sm leading-6 text-slate-500">{importItem.notes}</p> : null}
          </div>
          <Link href="/finance/imports" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Back to imports
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Transactions:</span> {transactions.length}
          </div>
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Categorized:</span> {categorizedTransactions.length}
          </div>
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Still in review:</span> {pendingTransactions.length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">Still needs attention</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Only the lines that are still pending or uncategorized stay here.</p>
            </div>
            <div className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
              {pendingTransactions.length}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {pendingTransactions.length > 0 ? pendingTransactions.map((transaction) => {
              const category = transaction.finance_category_id ? categoryMap.get(transaction.finance_category_id) : null;
              return (
                <article key={transaction.id} className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-900">{transaction.description}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${reviewBadge(transaction.review_status, Boolean(category))}`}>
                          {reviewLabel(transaction.review_status, Boolean(category))}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {transaction.transaction_date}
                        {transaction.counterparty ? ` · ${transaction.counterparty}` : ""}
                        {category ? ` · ${category.name}` : " · Unmapped"}
                      </p>
                    </div>
                    <p className={`text-lg font-semibold ${transaction.direction === "credit" ? "text-emerald-700" : "text-rose-700"}`}>
                      {transaction.direction === "credit" ? "+" : "-"}{formatMoney(transaction.amount)}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={updateTransactionReviewAction} className="flex flex-wrap items-center gap-3">
                      <input type="hidden" name="transactionId" value={transaction.id} />
                      <input type="hidden" name="statementImportId" value={transaction.statement_import_id} />
                      <select
                        name="financeCategoryId"
                        defaultValue={transaction.finance_category_id ?? ""}
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value="">Leave unmapped</option>
                        {workspace.categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.kind} - {item.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Apply category
                      </button>
                    </form>
                    <form action={archiveTransactionAction}>
                      <input type="hidden" name="transactionId" value={transaction.id} />
                      <input type="hidden" name="statementImportId" value={transaction.statement_import_id} />
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Archive
                      </button>
                    </form>
                  </div>
                </article>
              );
            }) : (
              <div className="rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-6 text-sm leading-6 text-slate-600">
                Nothing left to review for this import.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">Categorized transactions</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">This is the clean history of what Yumami already understood for this statement.</p>
            </div>
            <div className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
              {categorizedTransactions.length}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {categorizedTransactions.length > 0 ? categorizedTransactions.map((transaction) => {
              const category = transaction.finance_category_id ? categoryMap.get(transaction.finance_category_id) : null;
              return (
                <article key={transaction.id} className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{transaction.description}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {transaction.transaction_date}
                        {transaction.counterparty ? ` · ${transaction.counterparty}` : ""}
                        {category ? ` · ${category.name}` : ""}
                      </p>
                    </div>
                    <p className={`text-lg font-semibold ${transaction.direction === "credit" ? "text-emerald-700" : "text-rose-700"}`}>
                      {transaction.direction === "credit" ? "+" : "-"}{formatMoney(transaction.amount)}
                    </p>
                  </div>
                </article>
              );
            }) : (
              <div className="rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-6 text-sm leading-6 text-slate-600">
                No categorized transactions yet for this import.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
