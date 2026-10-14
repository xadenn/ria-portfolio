import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-store";
import { isServerAdminAuthenticated } from "@/lib/auth";
import { PortfolioData } from "@/types/portfolio";

export async function GET() {
  try {
    const result = await getPortfolioData();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuth = await isServerAdminAuthenticated(req);
    if (!isAuth) {
      return NextResponse.json(
        { error: "Administrative authentication required to update portfolio data" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as PortfolioData;

    if (!body || !body.profile || !body.projects) {
      return NextResponse.json(
        { error: "Invalid payload: profile and projects are required" },
        { status: 400 }
      );
    }

    const result = await savePortfolioData(body);
    return NextResponse.json(
      {
        success: true,
        data: result.data,
        savedToMongo: result.savedToMongo,
        savedToFile: result.savedToFile,
        message: result.savedToMongo
          ? "Saved successfully to MongoDB and local backup"
          : "Saved successfully to local storage (ready for MongoDB)",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/portfolio error:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio data" },
      { status: 500 }
    );
  }
}
