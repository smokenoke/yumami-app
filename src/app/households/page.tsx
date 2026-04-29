import { AppShell } from "@/components/app-shell";
import { EntryScreen } from "@/features/auth/entry-screen";
import { HouseholdGateway } from "@/features/households/household-gateway";
import { getAuthState } from "@/lib/supabase/session";
import { getViewerHouseholdState } from "@/lib/yumami/households";

interface HouseholdsPageProps {
  searchParams?: Promise<{
    error?: string;
    message?: string;
    invite?: string;
  }>;
}

export default async function HouseholdsPage({ searchParams }: HouseholdsPageProps) {
  const [authState, viewerState, resolvedSearchParams] = await Promise.all([
    getAuthState(),
    getViewerHouseholdState(),
    (searchParams ?? Promise.resolve({})) as Promise<{ error?: string; message?: string; invite?: string }>,
  ]);

  if (!authState.user) {
    return <EntryScreen isConfigured={authState.isConfigured} />;
  }

  return (
    <AppShell
      eyebrow="Households"
      title="Choose or manage your shared spaces."
      description="Create a household, accept an invite, or switch between the ones you already belong to."
      userEmail={authState.user.email ?? undefined}
      isDemo={false}
      showNav={false}
    >
      <HouseholdGateway
        viewerState={viewerState}
        userEmail={authState.user.email ?? undefined}
        manageMode
        errorMessage={resolvedSearchParams.message}
        inviteFocus={resolvedSearchParams.invite === "1"}
      />
    </AppShell>
  );
}

