import { NextRequest, NextResponse } from "next/server";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authenticated = await isServerAdminAuthenticated(req);
    return NextResponse.json({ authenticated }, { status: 200 });
  } catch (error) {
    console.error("Admin session check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
