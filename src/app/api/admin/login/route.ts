import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminPassword,
  generateSessionToken,
  COOKIE_OPTIONS,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body as { password?: string };

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect administrative password" },
        { status: 401 }
      );
    }

    const token = generateSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_OPTIONS.name, token, {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
      path: COOKIE_OPTIONS.path,
      maxAge: COOKIE_OPTIONS.maxAge,
    });

    return NextResponse.json(
      { success: true, message: "Administrative session established" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication system error" },
      { status: 500 }
    );
  }
}
