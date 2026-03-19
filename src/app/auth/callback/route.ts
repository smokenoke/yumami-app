import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      return NextResponse.redirect(`${origin}/?auth=callback-error`);
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
