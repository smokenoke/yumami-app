import { ActionPanel } from "@/components/action-panel";
import { archiveFileLinkAction } from "@/features/files/actions";
import { FileLinkComposer } from "@/features/files/file-link-composer";
import type { FileLink, FileWorkspace } from "@/types/domain";

function categoryLabel(value: string | null) {
  return value?.trim() || "General";
}

function groupFiles(files: FileLink[]) {
  const groups = new Map<string, FileLink[]>();

  for (const file of files) {
    const key = categoryLabel(file.category);
    const existing = groups.get(key) ?? [];
    existing.push(file);
    groups.set(key, existing);
  }

  return [...groups.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((left, right) => left.category.localeCompare(right.category));
}

interface SharedFilesHubProps {
  workspace: FileWorkspace;
}

export function SharedFilesHub({ workspace }: SharedFilesHubProps) {
  const groupedFiles = groupFiles(workspace.files);
  const spotlightFiles = workspace.files.slice(0, 3);

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-deep)]">
              Files
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
              buttonLabel="Add link"
              title="Add shared link"
              description="Save a new reference without keeping the form open on the page."
              variant="primary"
              disabled={!workspace.canMutate}
            >
              <FileLinkComposer canMutate={workspace.canMutate} />
            </ActionPanel>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Saved links</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{workspace.files.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Categories</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{groupedFiles.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Spotlight</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {spotlightFiles[0]?.label ?? "Nothing saved yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">Quick access</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">The first few references you are most likely to open fast.</p>
              </div>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
                {spotlightFiles.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {spotlightFiles.length > 0 ? (
                spotlightFiles.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4 transition hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{file.label}</p>
                        <p className="mt-1 text-sm text-slate-600">{categoryLabel(file.category)}</p>
                        {file.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{file.description}</p> : null}
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Open</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-5 text-sm leading-6 text-slate-600">
                  No saved links yet.
                </div>
              )}
            </div>
          </div>

          <details className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">By category</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Open a group when you want more than the quick-access slice.</p>
              </div>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
                {groupedFiles.length}
              </span>
            </summary>
            <div className="mt-4 space-y-4">
              {groupedFiles.map((group) => (
                <div key={group.category} className="rounded-[1.4rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-slate-900">{group.category}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">{group.items.length}</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {group.items.map((file) => (
                      <div key={file.id} className="flex items-center justify-between gap-3 rounded-[1rem] bg-white px-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{file.label}</p>
                          {file.description ? <p className="mt-1 text-sm text-slate-600">{file.description}</p> : null}
                        </div>
                        <a href={file.url} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                          Open
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white px-6 py-6 shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">All links</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Everything still stays visible here when you want the full shared reference space.</p>
            </div>
            <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-slate-700">
              {workspace.files.length}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {workspace.files.length > 0 ? (
              workspace.files.map((file) => (
                <article
                  key={file.id}
                  className="rounded-[1.6rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-slate-900">{file.label}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
                          {categoryLabel(file.category)}
                        </span>
                      </div>
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
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <form action={archiveFileLinkAction}>
                      <input type="hidden" name="linkId" value={file.id} />
                      <button
                        type="submit"
                        disabled={!workspace.canMutate}
                        className="rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Archive
                      </button>
                    </form>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-600">
                No saved links yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
