import Link from "next/link";

import { ActionPanel } from "@/components/action-panel";
import { deleteStatementImportAction } from "@/features/finance/actions";
import { StatementImportComposer } from "@/features/finance/statement-import-composer";
import type { FinanceWorkspace } from "@/types/domain";

function parserStatusLabel(status: FinanceWorkspace["imports"][number]["parser_status"]) {
  if (status === "manual_review") return "Needs review";
  if (status === "parsed") return "Ready";
  if (status === "failed") return "Failed";
  return "Reading";
}

function parserStatusClasses(status: FinanceWorkspace["imports"][number]["parser_status"]) {
  if (status === "parsed") return "bg-emerald-100 text-emerald-700";
  if (status === "manual_review") return "bg-amber-100 text-amber-700";
  if (status === "failed") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-700";
}

function formatStatementMonth(statementMonth: string) {
  const [year, month] = statementMonth.split("-");
  return `${year}-${month}`;
}

interface FinanceImportsPageProps {
  workspace: FinanceWorkspace;
}

export function FinanceImportsPage({ workspace }: FinanceImportsPageProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">Imports</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Statement intake</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Bring PDFs in here and Yumami will detect the statement period, read the transactions,
              and only send uncertain lines to review.
            </p>
          </div>
          <ActionPanel
            buttonLabel="Import PDF"
            title="Add a statement PDF"
            description="Import another statement and let the parser create the transaction rows for you."
            variant="primary"
            disabled={!workspace.canMutate}
          >
            <StatementImportComposer canMutate={workspace.canMutate} />
          </ActionPanel>
        </div>
      </div>

      <div className="space-y-4">
        {workspace.imports.length > 0 ? workspace.imports.map((item) => (
          <article key={item.id} className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">{item.institution_label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.source_file_name} · {formatStatementMonth(item.statement_month)}</p>
                {item.notes ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.notes}</p> : null}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${parserStatusClasses(item.parser_status)}`}>
                {parserStatusLabel(item.parser_status)}
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Transactions:</span> {item.transaction_count}
              </div>
              <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Need review:</span> {item.review_needed_count}
              </div>
              <div className="rounded-[1.3rem] bg-[var(--surface-muted)] px-4 py-4 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Type:</span> {item.mime_type ?? "Unknown"}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/finance/imports/${item.id}`}
                  className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  View transactions
                </Link>
                <p className="text-sm leading-6 text-slate-500">
                  Need to re-run it? Delete this import and upload the PDF again.
                </p>
              </div>
              <form action={deleteStatementImportAction}>
                <input type="hidden" name="importId" value={item.id} />
                <button
                  type="submit"
                  disabled={!workspace.canMutate}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete import and transactions
                </button>
              </form>
            </div>
          </article>
        )) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-white px-6 py-6 text-sm leading-6 text-slate-600">
            No imports yet.
          </div>
        )}
      </div>
    </section>
  );
}
