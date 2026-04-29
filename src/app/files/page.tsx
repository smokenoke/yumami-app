import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { SharedFilesHub } from "@/features/files/shared-files-hub";
import { HouseholdGateway } from "@/features/households/household-gateway";
import { getAuthState } from "@/lib/supabase/session";
import { getViewerHouseholdState } from "@/lib/yumami/households";
import { getFileWorkspace } from "@/lib/yumami/files";

export default async function FilesPage() {
  const authState = await getAuthState();

  if (!authState.hasEntryAccess) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  if (authState.user) {
    const viewerState = await getViewerHouseholdState();
    if (viewerState.needsOnboarding || viewerState.needsHouseholdSelection) {
      return <HouseholdGateway viewerState={viewerState} userEmail={authState.user.email ?? undefined} />;
    }
  }

  const fileWorkspace = await getFileWorkspace();

  return (
    <AppShell
      eyebrow="Files"
      title="Your shared references, easier to reach."
      description="Keep the important links close, group them gently, and open what you need without turning this into a file manager."
      userEmail={authState.user?.email ?? authState.demoEmail ?? undefined}
      isDemo={!authState.user && Boolean(authState.demoEmail)}
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
