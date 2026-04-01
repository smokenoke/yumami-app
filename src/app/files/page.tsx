import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { SharedFilesHub } from "@/features/files/shared-files-hub";
import { getAuthState } from "@/lib/supabase/session";
import { getFileWorkspace } from "@/lib/yumami/files";

export default async function FilesPage() {
  const [authState, fileWorkspace] = await Promise.all([getAuthState(), getFileWorkspace()]);

  if (!authState.hasEntryAccess) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  return (
    <AppShell
      eyebrow="Files"
      title="Your shared references, without the clutter."
      description="Keep the most important links close, and tuck the add flow away until you need it."
      actions={
        <Link href="/" className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back home
        </Link>
      }
    >
      <SharedFilesHub workspace={fileWorkspace} />
    </AppShell>
  );
}

