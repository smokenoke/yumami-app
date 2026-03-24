"use client";

import { useActionState } from "react";

import {
  createStatementImportAction,
  type StatementImportFormState,
} from "@/features/finance/actions";

const initialStatementImportFormState: StatementImportFormState = {
  status: "idle",
  message: "",
};

interface StatementImportComposerProps {
  canMutate: boolean;
}

export function StatementImportComposer({ canMutate }: StatementImportComposerProps) {
  const [state, formAction, pending] = useActionState(
    createStatementImportAction,
    initialStatementImportFormState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Institution</label>
        <input
          type="text"
          name="institutionLabel"
          placeholder="Shared bank"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Statement month</label>
        <input
          type="month"
          name="statementMonth"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">PDF statement</label>
        <input
          type="file"
          name="statementFile"
          accept="application/pdf,.pdf"
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Anything worth remembering about this import."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={!canMutate || pending}
        className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Queueing import..." : canMutate ? "Queue statement import" : "Live imports locked"}
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
