import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { PENDING_INVITE_COOKIE } from "@/lib/yumami/households";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const cookieStore = await cookies();
  cookieStore.set(PENDING_INVITE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.redirect(new URL("/households?invite=1", request.url));
}
