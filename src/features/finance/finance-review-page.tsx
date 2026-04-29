import {
  archiveTransactionAction,
  createCategoryFromCustomAction,
  createCategoryFromSuggestionAction,
  updateTransactionReviewAction,
} from "@/features/finance/actions";
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
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Teach Yumami your categories</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">The parser reads the statements automatically. This page now only shows the lines that still need your attention, and every choice becomes merchant memory for the next import.</p>
          </div>
          <div className="rounded-full bg-[var(--surface-muted)] px-4 py-2 text-sm text-slate-700">
            Learned merchants: {workspace.merchantRules.length}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Need review:</span> {pendingReview.length}
          </div>
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Known merchants:</span> {workspace.merchantRules.length}
          </div>
          <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Categories:</span> {workspace.categories.length}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {pendingReview.length > 0 ? (
          pendingReview.map((transaction) => {
            const category = transaction.finance_category_id
              ? categoryMap.get(transaction.finance_category_id)
              : null;
            const defaultKind = transaction.suggested_category_kind ?? (transaction.direction === "credit" ? "income" : "expense");

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
                    {transaction.suggested_category_name ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Suggested: <span className="font-medium text-slate-900">{transaction.suggested_category_name}</span>
                      </p>
                    ) : null}
                    {transaction.notes ? (
                      <p className="mt-2 text-sm leading-6 text-slate-500">{transaction.notes}</p>
                    ) : null}
                  </div>
                  <p className={`text-lg font-semibold ${transaction.direction === "credit" ? "text-emerald-700" : "text-rose-700"}`}>
                    {transaction.direction === "credit" ? "+" : "-"}{formatMoney(transaction.amount)}
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  {!category ? (
                    <div className="space-y-3 rounded-[1.25rem] bg-[var(--surface-muted)] px-4 py-3">
                      {transaction.suggested_category_name ? (
                        <form action={createCategoryFromSuggestionAction} className="flex flex-wrap items-center gap-3">
                          <input type="hidden" name="transactionId" value={transaction.id} />
                          <input type="hidden" name="statementImportId" value={transaction.statement_import_id} />
                          <input type="hidden" name="suggestedCategoryName" value={transaction.suggested_category_name} />
                          <input type="hidden" name="suggestedCategoryKind" value={defaultKind} />
                          <p className="text-sm text-slate-700">Create and apply suggested category:</p>
                          <button
                            type="submit"
                            disabled={!workspace.canMutate}
                            className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Use &quot;{transaction.suggested_category_name}&quot;
                          </button>
                        </form>
                      ) : null}
                      <form action={createCategoryFromCustomAction} className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-3">
                        <input type="hidden" name="transactionId" value={transaction.id} />
                        <input type="hidden" name="statementImportId" value={transaction.statement_import_id} />
                        <input type="hidden" name="categoryKind" value={defaultKind} />
                        <label className="text-sm text-slate-700" htmlFor={`custom-category-${transaction.id}`}>
                          Create other category:
                        </label>
                        <input
                          id={`custom-category-${transaction.id}`}
                          type="text"
                          name="categoryName"
                          placeholder="Type a new category"
                          disabled={!workspace.canMutate}
                          className="min-w-[14rem] flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                        <button
                          type="submit"
                          disabled={!workspace.canMutate}
                          className="rounded-full border border-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-[var(--accent-deep)] transition hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Create other category
                        </button>
                      </form>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
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
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-white px-6 py-6 text-sm leading-6 text-slate-600">
            Everything is categorized right now. Open any import to inspect its categorized transactions.
          </div>
        )}
      </div>
    </section>
  );
}
