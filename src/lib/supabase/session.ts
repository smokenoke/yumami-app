import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthState {
  user: User | null;
  isConfigured: boolean;
}

export async function getAuthState(): Promise<AuthState> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return {
      user,
      isConfigured: true,
    };
  } catch {
    return {
      user: null,
      isConfigured: false,
    };
  }
}
