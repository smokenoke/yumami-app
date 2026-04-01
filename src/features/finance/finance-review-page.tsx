import { ActionPanel } from "@/components/action-panel";
import {
  archiveTransactionAction,
  updateTransactionReviewAction,
} from "@/features/finance/actions";
import { TransactionComposer } from "@/features/finance/transaction-composer";
import type { FinanceWorkspace } from "@/types/domain";

function reviewStatusLabel(status: FinanceWorkspace["transactions"][number]["review_status"]) {
  if (status === "categorized") return "Categorized";
  if (status === "needs_review") return "Needs review";
  return "Pending";
}

function reviewStatusClasses(status: FinanceWorkspace["transactions"][number]["review_status"]) {
  if (status === "categorized") return "bg-emerald-100 text-emerald-700";
  if (status === "needs_review") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

interface FinanceReviewPageProps {
  workspace: FinanceWorkspace;
}

export function FinanceReviewPage({ workspace }: FinanceReviewPageProps) {
  const categoryMap = new Map(workspace.categories.map((category) => [category.id, category]));
  const pendingReview = workspace.transactions.filter(
    (transaction) => transaction.review_status !== "categorized" || transaction.finance_category_id == null,
  );

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">Review</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Clean up the details here</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">The review queue belongs on its own page so the main finance view can stay focused on the bigger picture.</p>
          </div>
          <ActionPanel
            buttonLabel="Add transaction"
            title="Add transaction manually"
            description="Temporary helper while the parser is still on the roadmap."
            variant="primary"
            disabled={!workspace.canMutate}
          >
            <TransactionComposer
              canMutate={workspace.canMutate}
              imports={workspace.imports}
              categories={workspace.categories}
            />
          </ActionPanel>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Need review:</span> {pendingReview.length}
          </div>
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Total active:</span> {workspace.transactions.length}
          </div>
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Categories:</span> {workspace.categories.length}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {workspace.transactions.length > 0 ? (
          workspace.transactions.map((transaction) => {
            const category = transaction.finance_category_id
              ? categoryMap.get(transaction.finance_category_id)
              : null;

            return (
              <article key={transaction.id} className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">{transaction.description}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${reviewStatusClasses(transaction.review_status)}`}>
                        {reviewStatusLabel(transaction.review_status)}
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
                    <select
                      name="reviewStatus"
                      defaultValue={transaction.review_status}
                      disabled={!workspace.canMutate}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="pending">Pending</option>
                      <option value="categorized">Categorized</option>
                      <option value="needs_review">Needs review</option>
                    </select>
                    <button
                      type="submit"
                      disabled={!workspace.canMutate}
                      className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Save
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
          })
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-white px-6 py-6 text-sm leading-6 text-slate-600">
            No transactions yet.
          </div>
        )}
      </div>
    </section>
  );
}

