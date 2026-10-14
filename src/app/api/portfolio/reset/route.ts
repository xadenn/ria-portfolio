import { NextRequest, NextResponse } from "next/server";
import { resetPortfolioData } from "@/lib/portfolio-store";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isServerAdminAuthenticated(req);
    if (!isAuth) {
      return NextResponse.json(
        { error: "Administrative authentication required to reset portfolio data" },
        { status: 401 }
      );
    }

    const data = await resetPortfolioData();
    return NextResponse.json(
      {
        success: true,
        message: "Portfolio data reset to default successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/portfolio/reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset portfolio data" },
      { status: 500 }
    );
  }
}
