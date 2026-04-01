import Link from "next/link";

import { ActionPanel } from "@/components/action-panel";
import {
  archiveFinanceCategoryAction,
  archiveStatementImportAction,
  archiveTransactionAction,
  updateTransactionReviewAction,
} from "@/features/finance/actions";
import { FinanceCategoryComposer } from "@/features/finance/finance-category-composer";
import { StatementImportComposer } from "@/features/finance/statement-import-composer";
import { TransactionComposer } from "@/features/finance/transaction-composer";
import type { FinanceWorkspace } from "@/types/domain";

function parserStatusLabel(status: FinanceWorkspace["imports"][number]["parser_status"]) {
  if (status === "manual_review") {
    return "Manual review";
  }

  if (status === "parsed") {
    return "Parsed";
  }

  if (status === "failed") {
    return "Failed";
  }

  return "Queued";
}

function parserStatusClasses(status: FinanceWorkspace["imports"][number]["parser_status"]) {
  if (status === "parsed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "manual_review") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "failed") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-slate-100 text-slate-700";
}

function reviewStatusLabel(status: FinanceWorkspace["transactions"][number]["review_status"]) {
  if (status === "categorized") {
    return "Categorized";
  }

  if (status === "needs_review") {
    return "Needs review";
  }

  return "Pending";
}

function reviewStatusClasses(status: FinanceWorkspace["transactions"][number]["review_status"]) {
  if (status === "categorized") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "needs_review") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

interface SharedFinanceIntakeProps {
  workspace: FinanceWorkspace;
}

export function SharedFinanceIntake({ workspace }: SharedFinanceIntakeProps) {
  const incomeCategories = workspace.categories.filter((category) => category.kind === "income");
  const expenseCategories = workspace.categories.filter((category) => category.kind === "expense");
  const categoryMap = new Map(workspace.categories.map((category) => [category.id, category]));

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
              Finance
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              {workspace.householdName}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {workspace.statusMessage}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                workspace.mode === "live"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {workspace.mode === "live" ? "Live" : "Demo"}
            </div>
            <ActionPanel
              buttonLabel="Import PDF"
              title="Add a statement PDF"
              description="Imports stay tucked away until you need them."
              variant="primary"
              disabled={!workspace.canMutate}
            >
              <StatementImportComposer canMutate={workspace.canMutate} />
            </ActionPanel>
            <ActionPanel
              buttonLabel="Add category"
              title="Add category"
              description="Create a new finance category when your real life needs it."
              disabled={!workspace.canMutate}
            >
              <FinanceCategoryComposer canMutate={workspace.canMutate} />
            </ActionPanel>
            <ActionPanel
              buttonLabel="Add transaction"
              title="Add transaction manually"
              description="This stays available for now while the parser is still on the roadmap."
              disabled={!workspace.canMutate}
            >
              <TransactionComposer
                canMutate={workspace.canMutate}
                imports={workspace.imports}
                categories={workspace.categories}
              />
            </ActionPanel>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {workspace.rollups.length > 0 ? (
            workspace.rollups.slice(0, 3).map((rollup) => (
              <article
                key={rollup.month}
                className="rounded-[1.6rem] border border-slate-200 bg-slate-50 px-5 py-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
                    {rollup.month}
                  </p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {rollup.reviewCount} review
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.1rem] bg-white px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Income</p>
                    <p className="mt-2 text-lg font-semibold text-emerald-700">{formatMoney(rollup.totalIncome)}</p>
                  </div>
                  <div className="rounded-[1.1rem] bg-white px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Expenses</p>
                    <p className="mt-2 text-lg font-semibold text-rose-700">{formatMoney(rollup.totalExpenses)}</p>
                  </div>
                  <div className="rounded-[1.1rem] bg-white px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Net</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{formatMoney(rollup.net)}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-600 xl:col-span-3">
              No monthly finance data yet.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
                Imports
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep an eye on each statement and whether it still needs review.
              </p>
            </div>
            <Link href="/finance" className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
              This page
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {workspace.imports.length > 0 ? (
              workspace.imports.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{item.institution_label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.source_file_name} - {item.statement_month}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${parserStatusClasses(item.parser_status)}`}>
                      {parserStatusLabel(item.parser_status)}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] bg-white px-4 py-3 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Transactions:</span> {item.transaction_count}
                    </div>
                    <div className="rounded-[1.25rem] bg-white px-4 py-3 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Needs review:</span> {item.review_needed_count}
                    </div>
                  </div>
                  <div className="mt-4">
                    <form action={archiveStatementImportAction}>
                      <input type="hidden" name="importId" value={item.id} />
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Archive import
                      </button>
                    </form>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-6 text-sm leading-6 text-slate-600">
                No imports yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
                Categories
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Built from your spreadsheet buckets and still easy to adjust.
              </p>
            </div>
            <div className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
              {workspace.categories.length}
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Income",
                items: incomeCategories,
                chip: "bg-emerald-100 text-emerald-700",
              },
              {
                title: "Expenses",
                items: expenseCategories,
                chip: "bg-amber-100 text-amber-700",
              },
            ].map((group) => (
              <div key={group.title} className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{group.title}</p>
                <div className="mt-3 space-y-2">
                  {group.items.map((category) => (
                    <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] bg-white px-3 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${group.chip}`}>
                        {category.kind}
                      </span>
                      <p className="flex-1 text-sm font-medium text-slate-800">{category.name}</p>
                      <form action={archiveFinanceCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id} />
                        <button
                          type="submit"
                          disabled={!workspace.canMutate}
                          className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Archive
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
              Transactions
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review each line, map it to a category, and keep the monthly picture clean.
            </p>
          </div>
          <div className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
            {workspace.transactions.length} active
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {workspace.transactions.length > 0 ? (
            workspace.transactions.map((transaction) => {
              const category = transaction.finance_category_id
                ? categoryMap.get(transaction.finance_category_id)
                : null;

              return (
                <article
                  key={transaction.id}
                  className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4"
                >
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
                        {transaction.counterparty ? ` - ${transaction.counterparty}` : ""}
                        {category ? ` - ${category.name}` : " - Unmapped"}
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
            <div className="rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-5 py-6 text-sm leading-6 text-slate-600">
              No transactions yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
