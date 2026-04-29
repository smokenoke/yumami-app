import { ActionPanel } from "@/components/action-panel";
import {
  archiveAllFinanceCategoriesAction,
  archiveFinanceCategoryAction,
} from "@/features/finance/actions";
import { FinanceCategoryComposer } from "@/features/finance/finance-category-composer";
import type { FinanceWorkspace } from "@/types/domain";

interface FinanceCategoriesPageProps {
  workspace: FinanceWorkspace;
}

export function FinanceCategoriesPage({ workspace }: FinanceCategoriesPageProps) {
  const incomeCategories = workspace.categories.filter((category) => category.kind === "income");
  const expenseCategories = workspace.categories.filter((category) => category.kind === "expense");

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">Categories</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Your own reporting buckets</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Yumami no longer seeds personal or default household categories in live mode. Start clean and let suggestions plus review shape the structure you actually want.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionPanel
              buttonLabel="Add category"
              title="Add category"
              description="Create a new category when your real household flow needs one."
              variant="primary"
              disabled={!workspace.canMutate}
            >
              <FinanceCategoryComposer canMutate={workspace.canMutate} />
            </ActionPanel>
            <form action={archiveAllFinanceCategoriesAction}>
              <button
                type="submit"
                disabled={!workspace.canMutate || workspace.categories.length === 0}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Wipe categories
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {[
          { title: "Income", items: incomeCategories, chip: "bg-emerald-100 text-emerald-700" },
          { title: "Expenses", items: expenseCategories, chip: "bg-amber-100 text-amber-700" },
        ].map((group) => (
          <section key={group.title} className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xl font-semibold text-slate-900">{group.title}</p>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">{group.items.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {group.items.length > 0 ? group.items.map((category) => (
                <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${group.chip}`}>
                      {category.kind}
                    </span>
                    <p className="text-sm font-medium text-slate-900">{category.name}</p>
                  </div>
                  <form action={archiveFinanceCategoryAction}>
                    <input type="hidden" name="categoryId" value={category.id} />
                    <button
                      type="submit"
                      disabled={!workspace.canMutate}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Archive
                    </button>
                  </form>
                </div>
              )) : (
                <div className="rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-slate-600">
                  No categories yet. Import a statement first or add your own structure here.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
