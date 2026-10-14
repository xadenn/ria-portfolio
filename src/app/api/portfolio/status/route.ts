import { NextResponse } from "next/server";
import { isMongoConfigured, verifyMongoHealth } from "@/lib/mongodb";
import { getPortfolioData } from "@/lib/portfolio-store";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  const health = await verifyMongoHealth();

  const { data, source } = await getPortfolioData();

  return NextResponse.json({
    mongoConfigured,
    mongoConnected: health.connected,
    mongoHealth: health,
    storageSource: source,
    stats: {
      projectsCount: data.projects?.length || 0,
      toolsCount: data.tools?.length || 0,
      designsCount: data.designs?.length || 0,
      achievementsCount: data.achievements?.length || 0,
      servicesCount: data.services?.length || 0,
      journeyCount: data.journey?.length || 0,
    },
    updatedAt: data.updatedAt,
  });
}
