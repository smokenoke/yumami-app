"use client";

import { useActionState } from "react";

import {
  createFileLinkAction,
  type FileLinkFormState,
} from "@/features/files/actions";

const initialFileLinkFormState: FileLinkFormState = {
  status: "idle",
  message: "",
};

interface FileLinkComposerProps {
  canMutate: boolean;
}

export function FileLinkComposer({ canMutate }: FileLinkComposerProps) {
  const [state, formAction, pending] = useActionState(
    createFileLinkAction,
    initialFileLinkFormState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-[1.75rem] bg-slate-50 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Label</label>
        <input
          type="text"
          name="label"
          placeholder="Shared Drive, Insurance folder, Monthly budget sheet..."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">URL</label>
        <input
          type="url"
          name="url"
          placeholder="https://..."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
        <input
          type="text"
          name="category"
          placeholder="Finance, Admin, Travel..."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="A short note so both of you know why this link matters."
          disabled={!canMutate || pending}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={!canMutate || pending}
        className="rounded-full bg-[var(--accent-deep)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving link..." : canMutate ? "Save link" : "Live links locked"}
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
