import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthState {
  user: User | null;
  isConfigured: boolean;
  demoEmail: string | null;
  hasEntryAccess: boolean;
}

export async function getAuthState(): Promise<AuthState> {
  const cookieStore = await cookies();
  const demoEmail = cookieStore.get("yumami-demo-email")?.value ?? null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return {
      user,
      isConfigured: true,
      demoEmail,
      hasEntryAccess: Boolean(user ?? demoEmail),
    };
  } catch {
    return {
      user: null,
      isConfigured: false,
      demoEmail,
      hasEntryAccess: Boolean(demoEmail),
    };
  }
}

