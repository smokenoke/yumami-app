import { archiveFileLinkAction } from "@/features/files/actions";
import { FileLinkComposer } from "@/features/files/file-link-composer";
import type { FileWorkspace } from "@/types/domain";

interface SharedFilesHubProps {
  workspace: FileWorkspace;
}

export function SharedFilesHub({ workspace }: SharedFilesHubProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
            Shared files hub
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            {workspace.householdName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            {workspace.statusMessage}
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            workspace.mode === "live"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {workspace.mode === "live" ? "Live mode" : "Demo mode"}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          {workspace.files.length > 0 ? (
            workspace.files.map((file) => (
              <article
                key={file.id}
                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{file.label}</p>
                    {file.category ? (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
                        {file.category}
                      </p>
                    ) : null}
                    {file.description ? (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {file.description}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                  >
                    Open
                  </a>
                </div>
                <div className="mt-4">
                  <form action={archiveFileLinkAction}>
                    <input type="hidden" name="linkId" value={file.id} />
                    <button
                      type="submit"
                      disabled={!workspace.canMutate}
                      className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Archive link
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-600">
              No shared file links yet. Add the first folder, sheet, or household reference link.
            </div>
          )}
        </div>

        <FileLinkComposer canMutate={workspace.canMutate} />
      </div>
    </section>
  );
}
