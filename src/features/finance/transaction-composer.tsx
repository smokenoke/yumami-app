"use client";

import { useActionState } from "react";

import {
  createTransactionAction,
  type TransactionFormState,
} from "@/features/finance/actions";
import type { FinanceCategory, StatementImport } from "@/types/domain";

const initialTransactionFormState: TransactionFormState = {
  status: "idle",
  message: "",
};

interface TransactionComposerProps {
  canMutate: boolean;
  imports: StatementImport[];
  categories: FinanceCategory[];
}

export function TransactionComposer({ canMutate, imports, categories }: TransactionComposerProps) {
  const [state, formAction, pending] = useActionState(
    createTransactionAction,
    initialTransactionFormState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Statement import</label>
        <select
          name="statementImportId"
          disabled={!canMutate || pending || imports.length === 0}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          defaultValue={imports[0]?.id ?? ""}
        >
          {imports.length === 0 ? <option value="">No import available yet</option> : null}
          {imports.map((item) => (
            <option key={item.id} value={item.id}>
              {item.institution_label} - {item.statement_month.slice(0, 7)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Transaction date</label>
          <input
            type="date"
            name="transactionDate"
            disabled={!canMutate || pending || imports.length === 0}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Booking date</label>
          <input
            type="date"
            name="bookingDate"
            disabled={!canMutate || pending || imports.length === 0}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
        <input
          type="text"
          name="description"
          placeholder="Albert Heijn groceries"
          disabled={!canMutate || pending || imports.length === 0}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Counterparty</label>
        <input
          type="text"
          name="counterparty"
          placeholder="Merchant or person"
          disabled={!canMutate || pending || imports.length === 0}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            name="amount"
            disabled={!canMutate || pending || imports.length === 0}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Direction</label>
          <select
            name="direction"
            defaultValue="debit"
            disabled={!canMutate || pending || imports.length === 0}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="debit">Expense / debit</option>
            <option value="credit">Income / credit</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
        <select
          name="financeCategoryId"
          defaultValue=""
          disabled={!canMutate || pending || imports.length === 0}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">Leave for review</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.kind} - {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Optional parsing or context notes."
          disabled={!canMutate || pending || imports.length === 0}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={!canMutate || pending || imports.length === 0}
        className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving transaction..." : canMutate ? "Add transaction" : "Live transactions locked"}
      </button>
      {state.status !== "idle" ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
